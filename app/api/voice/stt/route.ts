import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit, getClientIP } from '@/lib/rate-limit';
import { createLogger } from '@/lib/logger';

const logger = createLogger('VOICE-STT');

// ============================================================================
// Speech-to-Text API using OpenAI Whisper
// ============================================================================

interface ErrorResponse {
  success: false;
  error: string;
}

interface SuccessResponse {
  success: true;
  transcript: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
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

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY not configured, STT unavailable');
      return NextResponse.json(
        { success: false, error: 'Servicio de transcripcion no disponible' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No se recibio archivo de audio' },
        { status: 400 }
      );
    }

    // Validate file size (max 25MB for Whisper API)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'El archivo de audio es demasiado grande' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
      response_format: 'text',
    });

    return NextResponse.json({
      success: true,
      transcript: transcription,
    });
  } catch (error) {
    // OpenAI API error
    if (error instanceof OpenAI.APIError) {
      logger.error('OpenAI STT API error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Error al transcribir audio' },
        { status: 502 }
      );
    }

    // Generic error
    logger.error('STT API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
