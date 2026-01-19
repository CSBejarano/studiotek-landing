import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY not configured, STT unavailable');
      return NextResponse.json(
        { success: false, error: 'Servicio de transcripción no disponible' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No se recibió archivo de audio' },
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
      console.error('OpenAI STT API error:', error.message);
      return NextResponse.json(
        { success: false, error: 'Error al transcribir audio' },
        { status: 502 }
      );
    }

    // Generic error
    console.error('STT API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
