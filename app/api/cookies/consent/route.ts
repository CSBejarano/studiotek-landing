import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase';
import { createLogger } from '@/lib/logger';

// ============================================================================
// Cookie Consent Persistence API
// ============================================================================
//
// DDL for Supabase table:
//
// CREATE TABLE IF NOT EXISTS public.cookie_consents (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   session_id TEXT NOT NULL,
//   ip_hash TEXT NOT NULL,
//   consent JSONB NOT NULL,
//   action TEXT NOT NULL CHECK (action IN ('accept_all', 'reject_all', 'custom')),
//   user_agent TEXT,
//   page_url TEXT,
//   consent_version TEXT DEFAULT '1.0',
//   created_at TIMESTAMPTZ DEFAULT now()
// );
// CREATE INDEX idx_cookie_consents_session_id ON public.cookie_consents(session_id);
// CREATE INDEX idx_cookie_consents_created_at ON public.cookie_consents(created_at DESC);
// ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;
//
// ============================================================================

const logger = createLogger('COOKIES');

const consentRequestSchema = z.object({
  consent: z.object({
    technical: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
  }),
  action: z.enum(['accept_all', 'reject_all', 'custom']),
  sessionId: z.string().min(1),
  consentVersion: z.string().default('1.0'),
});

/**
 * Hash an IP address using SHA-256 (Web Crypto API).
 */
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = consentRequestSchema.parse(body);

    // Get client info
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const rawIP = forwarded?.split(',')[0]?.trim() || realIP?.trim() || '127.0.0.1';
    const ipHash = await hashIP(rawIP);
    const userAgent = request.headers.get('user-agent') || null;
    const pageUrl = request.headers.get('referer') || null;

    // Create Supabase client
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      logger.debug('Supabase not configured, skipping consent persistence');
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Insert consent record
    const { error } = await supabase.from('cookie_consents').insert([
      {
        session_id: validatedData.sessionId,
        ip_hash: ipHash,
        consent: validatedData.consent,
        action: validatedData.action,
        user_agent: userAgent,
        page_url: pageUrl,
        consent_version: validatedData.consentVersion,
      },
    ]);

    if (error) {
      logger.error('Failed to persist consent:', error.message);
      return NextResponse.json(
        { success: false, error: 'Error al guardar consentimiento' },
        { status: 500 }
      );
    }

    logger.info(`Consent persisted: ${validatedData.action} (session: ${validatedData.sessionId})`);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Datos de consentimiento invalidos' },
        { status: 400 }
      );
    }

    logger.error('Consent API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
