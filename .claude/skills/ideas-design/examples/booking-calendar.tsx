/**
 * BookingCalendar Component Template
 *
 * A week-view calendar for displaying and selecting booking dates.
 * Shows event dots for days with bookings and supports date selection.
 *
 * Features:
 * - Week view with 7 day columns
 * - Event count indicators (dots)
 * - Keyboard navigation support
 * - Responsive design
 * - WCAG AA compliant
 *
 * Usage:
 * ```tsx
 * <BookingCalendar
 *   bookings={bookings}
 *   selectedDate={selectedDate}
 *   onDateSelect={setSelectedDate}
 * />
 * ```
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, cn } from '@ideas/ui';

// ============================================================================
// Types
// ============================================================================

interface Booking {
  id: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  // ... other booking fields
}

interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;        // Optional: earliest selectable date
  maxDate?: Date;        // Optional: latest selectable date
  className?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Get array of dates for the current week view
 */
function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }

  return dates;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if date is today
 */
function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Format date for screen readers
 */
function formatDateForSR(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============================================================================
// Component
// ============================================================================

export function BookingCalendar({
  bookings,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  className
}: BookingCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay()); // Start of week
    return today;
  });

  // Get dates for current week
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);

  // Count bookings per day
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();

    bookings.forEach((booking) => {
      const key = booking.date.toDateString();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(booking);
    });

    return map;
  }, [bookings]);

  // Navigation handlers
  const handlePreviousWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // Check if date is selectable
  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    return bookingsByDate.get(date.toDateString()) || [];
  };

  // Current month/year for header
  const monthYearLabel = currentWeekStart.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold capitalize">
            {monthYearLabel}
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousWeek}
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekStart(new Date())}
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextWeek}
              aria-label="Siguiente semana"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div role="grid" aria-label="Calendario de reservas">
          {/* Day of week headers */}
          <div
            role="row"
            className="grid grid-cols-7 gap-2 mb-2"
          >
            {DAYS_OF_WEEK.map((day, i) => (
              <div
                key={day}
                role="columnheader"
                className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div role="row" className="grid grid-cols-7 gap-2">
            {weekDates.map((date) => {
              const dayBookings = getBookingsForDate(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isCurrentDay = isToday(date);
              const isDisabled = isDateDisabled(date);
              const isPastDate = date < new Date() && !isCurrentDay;

              return (
                <button
                  key={date.toISOString()}
                  role="gridcell"
                  aria-label={formatDateForSR(date)}
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onDateSelect(date)}
                  className={cn(
                    // Base styles
                    "relative aspect-square rounded-lg border-2 transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",

                    // State styles
                    isSelected && "border-primary bg-primary text-primary-foreground font-semibold",
                    !isSelected && isCurrentDay && "border-primary/50 bg-primary/5 font-semibold",
                    !isSelected && !isCurrentDay && "border-border",
                    isPastDate && !isSelected && "text-muted-foreground"
                  )}
                >
                  {/* Date number */}
                  <span className="absolute top-1 left-0 right-0 text-center text-sm">
                    {date.getDate()}
                  </span>

                  {/* Event indicators (dots) */}
                  {dayBookings.length > 0 && (
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                      {dayBookings.slice(0, 3).map((booking, i) => (
                        <div
                          key={booking.id}
                          className={cn(
                            "h-1 w-1 rounded-full",
                            booking.status === 'pending' && "bg-amber-500",
                            booking.status === 'confirmed' && "bg-green-500",
                            booking.status === 'completed' && "bg-slate-400",
                            booking.status === 'cancelled' && "bg-red-500",
                            isSelected && "bg-primary-foreground"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <div
                          className={cn(
                            "h-1 w-1 rounded-full",
                            isSelected ? "bg-primary-foreground" : "bg-muted-foreground"
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}

                  {/* Screen reader only booking count */}
                  {dayBookings.length > 0 && (
                    <span className="sr-only">
                      {dayBookings.length} {dayBookings.length === 1 ? 'reserva' : 'reservas'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Estado de reservas:
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              <span>Pendiente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              <span>Confirmada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
              <span>Completada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
              <span>Cancelada</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Keyboard Navigation Enhancement (Optional)
// ============================================================================

/**
 * To add arrow key navigation between dates:
 *
 * 1. Track focused date with useState
 * 2. Add onKeyDown handler to grid container
 * 3. Handle ArrowLeft, ArrowRight, ArrowUp, ArrowDown
 * 4. Update tabIndex to manage focus (only focused date has tabIndex={0})
 *
 * Example:
 *
 * const [focusedDate, setFocusedDate] = useState<Date | null>(null);
 *
 * const handleKeyDown = (e: React.KeyboardEvent) => {
 *   if (!focusedDate) return;
 *
 *   switch (e.key) {
 *     case 'ArrowLeft':
 *       // Move focus to previous day
 *       break;
 *     case 'ArrowRight':
 *       // Move focus to next day
 *       break;
 *     // ... etc
 *   }
 * };
 */
