import { NextRequest, NextResponse } from 'next/server'
import { insertLead } from '@/lib/supabase'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email invalido'),
  company: z.string().optional(),
  phone: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  service_interest: z.string().optional(),
  privacy_accepted: z.boolean(),
  commercial_accepted: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)
    const lead = await insertLead(validatedData)
    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error('Error saving lead:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
