import { google, calendar_v3 } from 'googleapis'

// ============================================================
// Google Calendar integration via Service Account
// ============================================================
// Auth: GOOGLE_SERVICE_ACCOUNT_KEY (base64 encoded JSON)
// Calendar: GOOGLE_CALENDAR_ID (email del calendario del equipo)
// Timezone: Europe/Madrid (CET/CEST)
// ============================================================

const TIMEZONE = 'Europe/Madrid'
const SLOT_DURATION_MINUTES = 30
const BUSINESS_HOURS_START = 10 // 10:00
const BUSINESS_HOURS_END = 18   // 18:00 (last slot at 17:30)

function getCalendarClient(): calendar_v3.Calendar | null {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!keyBase64) return null

  try {
    const credentials = JSON.parse(
      Buffer.from(keyBase64, 'base64').toString('utf-8')
    )

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    return google.calendar({ version: 'v3', auth })
  } catch (error) {
    console.error('[CALENDAR] Failed to initialize Google Calendar client:', error)
    return null
  }
}

/**
 * Generate all possible 30-min slot strings between business hours.
 * Returns ["10:00", "10:30", "11:00", ..., "17:30"]
 */
function generateAllSlots(): string[] {
  const slots: string[] = []
  for (let hour = BUSINESS_HOURS_START; hour < BUSINESS_HOURS_END; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`)
    slots.push(`${String(hour).padStart(2, '0')}:30`)
  }
  return slots
}

const DEV_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00',
  '15:00', '15:30', '16:00', '16:30', '17:00',
]

/**
 * Get available booking slots for a given date.
 *
 * @param date - Date in YYYY-MM-DD format
 * @returns Array of available time slots in "HH:MM" format (Europe/Madrid)
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  // Check weekend (0=Sun, 6=Sat)
  const dateObj = new Date(`${date}T12:00:00`)
  const dayOfWeek = dateObj.getUTCDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return []
  }

  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  // Dev mode: return sample slots
  if (!calendar || !calendarId) {
    console.log('[DEV] Google Calendar not configured, returning sample slots')
    return DEV_SLOTS
  }

  try {
    // Build timezone-aware start/end for the day
    const timeMin = new Date(`${date}T${String(BUSINESS_HOURS_START).padStart(2, '0')}:00:00`)
    const timeMax = new Date(`${date}T${String(BUSINESS_HOURS_END).padStart(2, '0')}:00:00`)

    // We need to convert to UTC-aware strings for the API
    // Use Intl to get the offset for Madrid on that specific date
    const offsetMs = getTimezoneOffsetMs(date)
    const timeMinUTC = new Date(timeMin.getTime() - offsetMs)
    const timeMaxUTC = new Date(timeMax.getTime() - offsetMs)

    const freeBusyResponse = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMinUTC.toISOString(),
        timeMax: timeMaxUTC.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    })

    const busySlots =
      freeBusyResponse.data.calendars?.[calendarId]?.busy ?? []

    const allSlots = generateAllSlots()

    // Filter out slots that overlap with busy periods
    return allSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number)
      const slotStart = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
      const slotStartUTC = new Date(slotStart.getTime() - offsetMs)
      const slotEndUTC = new Date(slotStartUTC.getTime() + SLOT_DURATION_MINUTES * 60 * 1000)

      return !busySlots.some((busy) => {
        const busyStart = new Date(busy.start as string)
        const busyEnd = new Date(busy.end as string)
        // Overlap: slotStart < busyEnd AND slotEnd > busyStart
        return slotStartUTC < busyEnd && slotEndUTC > busyStart
      })
    })
  } catch (error) {
    console.error('[CALENDAR] Error querying freebusy:', error)
    // Fallback to dev slots on error
    return DEV_SLOTS
  }
}

/**
 * Get the UTC offset in milliseconds for Europe/Madrid on a given date.
 */
function getTimezoneOffsetMs(date: string): number {
  // Create a date in the middle of the day to avoid DST edge cases
  const d = new Date(`${date}T12:00:00Z`)
  const utcStr = d.toLocaleString('en-US', { timeZone: 'UTC' })
  const madridStr = d.toLocaleString('en-US', { timeZone: TIMEZONE })
  const utcDate = new Date(utcStr)
  const madridDate = new Date(madridStr)
  return madridDate.getTime() - utcDate.getTime()
}

// ============================================================
// Create Meeting Event
// ============================================================

export interface CreateMeetingParams {
  leadName: string
  leadEmail: string
  company?: string
  date: string   // YYYY-MM-DD
  time: string   // HH:MM (Europe/Madrid)
  notes?: string
}

export interface MeetingResult {
  eventId: string
  meetLink: string
  startTime: string
  endTime: string
}

/**
 * Create a Google Calendar event with Google Meet link.
 *
 * @param params - Meeting parameters
 * @returns Event details including Meet link
 */
export async function createMeetingEvent(
  params: CreateMeetingParams
): Promise<MeetingResult> {
  const calendar = getCalendarClient()
  const calendarId = process.env.GOOGLE_CALENDAR_ID

  // Dev mode
  if (!calendar || !calendarId) {
    console.log('[DEV] Would create meeting:', params)
    const [hours, minutes] = params.time.split(':').map(Number)
    const endMinutes = minutes + SLOT_DURATION_MINUTES
    const endHour = hours + Math.floor(endMinutes / 60)
    const endMin = endMinutes % 60
    return {
      eventId: `dev-event-${Date.now()}`,
      meetLink: 'https://meet.google.com/dev-test-link',
      startTime: `${params.date}T${params.time}:00`,
      endTime: `${params.date}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`,
    }
  }

  const companyLabel = params.company ? ` (${params.company})` : ''
  const summary = `Discovery Call - ${params.leadName}${companyLabel}`

  const startDateTime = `${params.date}T${params.time}:00`
  const [hours, minutes] = params.time.split(':').map(Number)
  const endMinutes = minutes + SLOT_DURATION_MINUTES
  const endHour = hours + Math.floor(endMinutes / 60)
  const endMin = endMinutes % 60
  const endDateTime = `${params.date}T${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}:00`

  const description = [
    `Discovery Call con ${params.leadName}${companyLabel}`,
    '',
    params.notes ? `Notas: ${params.notes}` : '',
    '',
    'Creado automaticamente por StudioTek Booking System',
  ]
    .filter(Boolean)
    .join('\n')

  // Try with Meet link first (requires Google Workspace), fallback without
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = await calendar.events.insert({
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: endDateTime,
          timeZone: TIMEZONE,
        },
        attendees: [{ email: params.leadEmail }],
        conferenceData: {
          createRequest: {
            requestId: `studiotek-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      },
    })
  } catch (meetError) {
    // Fallback: create event without Meet (works with personal Gmail)
    console.warn('[CALENDAR] Meet link creation failed, creating event without Meet:', meetError)
    event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: TIMEZONE,
        },
        end: {
          dateTime: endDateTime,
          timeZone: TIMEZONE,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      },
    })
  }

  const meetLink =
    event.data.conferenceData?.entryPoints?.find(
      (ep: { entryPointType?: string; uri?: string }) => ep.entryPointType === 'video'
    )?.uri ?? ''

  return {
    eventId: event.data.id ?? '',
    meetLink,
    startTime: startDateTime,
    endTime: endDateTime,
  }
}
