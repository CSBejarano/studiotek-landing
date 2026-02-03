import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, insertLeadEvent } from '@/lib/supabase'

// Pixel transparente 1x1 PNG en base64
const TRANSPARENT_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sid = searchParams.get('sid') // sequence_id

  if (sid) {
    const supabase = createSupabaseServerClient()
    if (supabase) {
      // Fire-and-forget: no bloquear la respuesta de imagen
      void (async () => {
        try {
          // 1. Fetch email_sequence para obtener lead_id
          const { data: sequence } = await supabase
            .from('email_sequences')
            .select('lead_id, status')
            .eq('id', sid)
            .single()

          if (!sequence) return

          // 2. Update: opened=true, status='opened'
          //    Solo si status es 'sent' (no downgrade si ya es 'clicked')
          if (sequence.status === 'sent') {
            await supabase
              .from('email_sequences')
              .update({ opened: true, status: 'opened' })
              .eq('id', sid)
          } else if (sequence.status !== 'opened' && sequence.status !== 'clicked') {
            // Si por alguna razon esta en otro estado, al menos marcar opened
            await supabase
              .from('email_sequences')
              .update({ opened: true })
              .eq('id', sid)
          }

          // 3. Log lead event
          await insertLeadEvent({
            lead_id: sequence.lead_id,
            event_type: 'email_opened',
            metadata: { sequence_id: sid },
          })
        } catch (error) {
          console.error('[TRACK/OPEN] Error tracking open:', error)
        }
      })()
    }
  }

  // SIEMPRE retornar imagen transparente (aunque falle el tracking)
  return new NextResponse(TRANSPARENT_PIXEL, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}
