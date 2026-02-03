import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/google-calendar'

// ============================================================
// GET /api/booking/slots?date=YYYY-MM-DD
// Public endpoint - returns available time slots for a date
// ============================================================

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MAX_ADVANCE_DAYS = 14

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    // Validate date parameter exists
    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: date' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!DATE_REGEX.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Parse and validate the date is a real date
    const parsed = new Date(`${date}T12:00:00`)
    if (isNaN(parsed.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date' },
        { status: 400 }
      )
    }

    // Validate date is not in the past (compare in Europe/Madrid timezone)
    const nowMadrid = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })
    )
    const todayStr = [
      nowMadrid.getFullYear(),
      String(nowMadrid.getMonth() + 1).padStart(2, '0'),
      String(nowMadrid.getDate()).padStart(2, '0'),
    ].join('-')

    if (date < todayStr) {
      return NextResponse.json(
        { success: false, error: 'Date must be today or in the future' },
        { status: 400 }
      )
    }

    // Validate date is within the next 14 days
    const todayDate = new Date(`${todayStr}T00:00:00`)
    const requestedDate = new Date(`${date}T00:00:00`)
    const diffDays = Math.round(
      (requestedDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays > MAX_ADVANCE_DAYS) {
      return NextResponse.json(
        {
          success: false,
          error: `Date must be within the next ${MAX_ADVANCE_DAYS} days`,
        },
        { status: 400 }
      )
    }

    // If date is today, filter out past slots
    const slots = await getAvailableSlots(date)

    let filteredSlots = slots
    if (date === todayStr) {
      const currentHour = nowMadrid.getHours()
      const currentMinute = nowMadrid.getMinutes()
      filteredSlots = slots.filter((slot) => {
        const [h, m] = slot.split(':').map(Number)
        // Only show slots at least 1 hour from now
        return h > currentHour + 1 || (h === currentHour + 1 && m > currentMinute)
      })
    }

    return NextResponse.json({
      success: true,
      date,
      slots: filteredSlots,
      timezone: 'Europe/Madrid',
    })
  } catch (error) {
    console.error('[BOOKING] Slots error:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
