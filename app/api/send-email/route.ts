import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail } from '@/lib/resend'
import { z } from 'zod'

const emailSchema = z.object({
  to: z.string().email(),
  name: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, name } = emailSchema.parse(body)
    const result = await sendConfirmationEmail({ to, name })
    return NextResponse.json({ success: true, result })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: 'Error enviando email' },
      { status: 500 }
    )
  }
}
