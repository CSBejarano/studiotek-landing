import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/voice/prompts';
import { voiceFunctions, toOpenAITools } from '@/lib/voice/functions';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VOICE-CHAT');

// ============================================================================
// Input Validation
// ============================================================================

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  userMessage: z.string().min(1, 'El mensaje no puede estar vacio'),
});

// ============================================================================
// Response Types
// ============================================================================

interface ChatResponse {
  message: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
}

// ============================================================================
// Mock Response (Graceful Degradation)
// ============================================================================

function getMockResponse(userMessage: string): ChatResponse {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('servicio') || lowerMessage.includes('que hacen')) {
    return {
      message: 'En StudioTek ofrecemos consultoria, implementacion y formacion en Inteligencia Artificial para empresas. Quieres que te cuente mas sobre algun servicio en particular?',
    };
  }

  if (lowerMessage.includes('precio') || lowerMessage.includes('cuesta') || lowerMessage.includes('costo')) {
    return {
      message: 'Los precios varian segun el proyecto. Lo mejor es que hablemos de tus necesidades especificas. Quieres dejar tus datos para que te contactemos?',
      functionCall: {
        name: 'navigate_to_section',
        arguments: JSON.stringify({ section_id: 'contact' }),
      },
    };
  }

  if (lowerMessage.includes('contacto') || lowerMessage.includes('contactar')) {
    return {
      message: 'Perfecto! Te llevo al formulario de contacto.',
      functionCall: {
        name: 'navigate_to_section',
        arguments: JSON.stringify({ section_id: 'contact' }),
      },
    };
  }

  return {
    message: 'Gracias por tu pregunta. Estoy aqui para ayudarte a conocer nuestras soluciones de IA. Quieres que te cuente sobre nuestros servicios o beneficios?',
  };
}

// ============================================================================
// OpenAI Chat Handler
// ============================================================================

async function callOpenAI(
  messages: z.infer<typeof messageSchema>[],
  userMessage: string
): Promise<ChatResponse> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Build conversation history for OpenAI
  const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    { role: 'user', content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: openAIMessages,
    tools: toOpenAITools(voiceFunctions),
    tool_choice: 'auto',
    max_tokens: 300,
    temperature: 0.7,
  });

  const choice = completion.choices[0];
  const assistantMessage = choice.message;

  // Check if there's a function call
  if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
    const toolCall = assistantMessage.tool_calls[0];
    // Type guard: only 'function' type has the function property
    if (toolCall.type === 'function') {
      // Generate a contextual fallback message based on the function
      let fallbackMessage = 'Te muestro la informacion.';
      const funcName = toolCall.function.name;

      if (funcName === 'navigate_to_section') {
        const args = JSON.parse(toolCall.function.arguments);
        const sectionDescriptions: Record<string, string> = {
          'hero': 'Te llevo al inicio de la pagina.',
          'benefits': 'Te muestro los beneficios de trabajar con nosotros.',
          'services': 'Aqui puedes ver todos nuestros servicios de IA.',
          'how-it-works': 'Te explico como trabajamos en 6 pasos.',
          'stats': 'Estos son nuestros numeros y resultados.',
          'contact': 'Te llevo al formulario de contacto.',
        };
        fallbackMessage = sectionDescriptions[args.section_id] || 'Te llevo a esa seccion.';
      } else if (funcName === 'open_service_modal') {
        const args = JSON.parse(toolCall.function.arguments);
        const serviceIndex = args.service_index as number;
        const serviceDescriptions: Record<number, string> = {
          0: 'Te muestro Implementacion de IA. Desplegamos chatbots inteligentes, automatizacion de procesos y soluciones personalizadas. Puedes reducir hasta un 70% el tiempo en tareas manuales.',
          1: 'Te muestro Consultoria Estrategica. Analizamos tus procesos, identificamos cuellos de botella y creamos un roadmap de implementacion con ROI proyectado.',
          2: 'Te muestro Formacion y Capacitacion. Workshops practicos, certificaciones y material actualizado para que tu equipo domine las herramientas de IA.',
          3: 'Te muestro Procesos de IA Personalizada. Desarrollamos modelos de Machine Learning y fine-tuning de LLMs entrenados con tus datos.',
        };
        fallbackMessage = serviceDescriptions[serviceIndex] || 'Te muestro los detalles de este servicio.';
      } else if (funcName === 'highlight_element') {
        fallbackMessage = 'Te destaco este elemento para que lo veas mejor.';
      } else if (funcName === 'fill_form_field') {
        fallbackMessage = 'Completo el campo del formulario por ti.';
      } else if (funcName === 'submit_contact_form') {
        fallbackMessage = 'Enviando tu formulario de contacto. Nos pondremos en contacto contigo pronto.';
      }

      return {
        message: assistantMessage.content || fallbackMessage,
        functionCall: {
          name: toolCall.function.name,
          arguments: toolCall.function.arguments,
        },
      };
    }
  }

  return {
    message: assistantMessage.content || 'No tengo una respuesta para eso.',
  };
}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    // Rate limiting: 20 requests per minute
    const ip = getClientIP(request);
    const rateLimitResult = rateLimit(ip, 20, 60_000);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Intenta en unos segundos.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const validatedData = chatRequestSchema.parse(body);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY not configured, using mock response');
      const mockResponse = getMockResponse(validatedData.userMessage);
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // Call OpenAI
    const response = await callOpenAI(
      validatedData.messages,
      validatedData.userMessage
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    // Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos de entrada invalidos' },
        { status: 400 }
      );
    }

    // OpenAI API error
    if (error instanceof OpenAI.APIError) {
      logger.error('OpenAI API error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Error al procesar el mensaje' },
        { status: 502 }
      );
    }

    // Generic error
    logger.error('Chat API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
