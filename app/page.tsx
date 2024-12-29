'use client'

import { usePregnancy } from '@/contexts/PregnancyContext'
import { ModeToggle } from '@/components/ui/mode-toggle'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { differenceInWeeks } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { MonthView } from '@/components/month-view'

export default function Home() {
  const { pregnancyStartDate, symptomData } = usePregnancy()
  const router = useRouter()

  const getWeeksOfAmenorrhea = (date: Date) => {
    if (!pregnancyStartDate) return null
    const weeks = differenceInWeeks(date, pregnancyStartDate)
    return weeks >= 0 ? weeks + 1 : null
  }

  const handleDateSelect = (date: Date) => {
    router.push(`/daily/${date.toISOString().split('T')[0]}`)
  }

  const hasData = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return !!symptomData[dateString]
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suivi de Grossesse</h1>
        <div className="flex items-center space-x-4">
          <Link href="/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main>
        <MonthView
          onSelectDate={handleDateSelect}
          hasData={hasData}
          getWeeksOfAmenorrhea={getWeeksOfAmenorrhea}
        />
      </main>
    </div>
  )
}

