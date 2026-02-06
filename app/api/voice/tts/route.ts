import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VOICE-TTS');

// ============================================================================
// Input Validation
// ============================================================================

const ttsRequestSchema = z.object({
  text: z.string().min(1, 'El texto no puede estar vacio').max(4096, 'El texto es demasiado largo'),
});

// ============================================================================
// Error Response Type
// ============================================================================

interface ErrorResponse {
  success: false;
  error: string;
}

// ============================================================================
// API Route Handler
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse> | Response> {
  try {
    // Rate limiting: 30 requests per minute
    const ip = getClientIP(request);
    const rateLimitResult = rateLimit(ip, 30, 60_000);

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { success: false, error: 'Demasiadas solicitudes. Intenta en unos segundos.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();
    const validatedData = ttsRequestSchema.parse(body);

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY not configured, TTS unavailable');
      return NextResponse.json(
        { success: false, error: 'Servicio de voz no disponible' },
        { status: 503 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI TTS API
    const mp3Response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'onyx',
      input: validatedData.text,
      response_format: 'mp3',
      speed: 1.0,
    });

    // Get the audio as ArrayBuffer
    const audioBuffer = await mp3Response.arrayBuffer();

    // Return audio stream with proper headers
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    // Zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Texto invalido o demasiado largo' },
        { status: 400 }
      );
    }

    // OpenAI API error
    if (error instanceof OpenAI.APIError) {
      logger.error('OpenAI TTS API error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Error al generar audio' },
        { status: 502 }
      );
    }

    // Generic error
    logger.error('TTS API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
