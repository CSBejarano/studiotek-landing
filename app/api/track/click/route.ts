import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, insertLeadEvent } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sid = searchParams.get('sid') // sequence_id
  const url = searchParams.get('url') // URL destino

  // Fallback URL si no hay url param
  const redirectUrl = url || 'https://studiotek.es'

  if (sid) {
    const supabase = createSupabaseServerClient()
    if (supabase) {
      // Fire-and-forget: no bloquear el redirect
      void (async () => {
        try {
          // 1. Fetch email_sequence para obtener lead_id
          const { data: sequence } = await supabase
            .from('email_sequences')
            .select('lead_id')
            .eq('id', sid)
            .single()

          if (!sequence) return

          // 2. Update: clicked=true, status='clicked'
          //    Click siempre es el estado mas alto, no hay downgrade posible
          await supabase
            .from('email_sequences')
            .update({ clicked: true, opened: true, status: 'clicked' })
            .eq('id', sid)

          // 3. Log lead event
          await insertLeadEvent({
            lead_id: sequence.lead_id,
            event_type: 'email_clicked',
            metadata: { sequence_id: sid, url: redirectUrl },
          })
        } catch (error) {
          console.error('[TRACK/CLICK] Error tracking click:', error)
        }
      })()
    }
  }

  // SIEMPRE redirect 302 (aunque falle el tracking)
  return NextResponse.redirect(redirectUrl, 302)
}
