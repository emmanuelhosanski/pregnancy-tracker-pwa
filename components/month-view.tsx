'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MonthViewProps {
  onSelectDate: (date: Date) => void
  hasData: (date: Date) => boolean
  getWeeksOfAmenorrhea: (date: Date) => number | null
}

export function MonthView({ onSelectDate, hasData, getWeeksOfAmenorrhea }: MonthViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={goToPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <Button variant="ghost" onClick={goToNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center font-medium text-sm">
            {day}
          </div>
        ))}
        {daysInMonth.map(date => {
          const isToday = date.toDateString() === new Date().toDateString()
          const hasDataForDay = hasData(date)
          const weeksOfAmenorrhea = getWeeksOfAmenorrhea(date)

          return (
            <Button
              key={date.toISOString()}
              variant="outline"
              className={`h-14 ${isToday ? 'border-primary' : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <div className="flex flex-col items-center">
                <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                  {format(date, 'd')}
                </span>
                {weeksOfAmenorrhea !== null && (
                  <span className="text-[10px] text-muted-foreground">{weeksOfAmenorrhea} SA</span>
                )}
                {hasDataForDay && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
                )}
              </div>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

