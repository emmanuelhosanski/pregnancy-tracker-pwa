'use client'

import { useParams, useRouter } from 'next/navigation'
import { DailyView } from '@/components/daily-view'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function DailyPage() {
  const params = useParams()
  const router = useRouter()
  const date = new Date(params.date as string)

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      <DailyView date={date} />
    </div>
  )
}

