'use client'

import { useState, useEffect } from 'react'
import { usePregnancy } from '@/contexts/PregnancyContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function SettingsPage() {
  const { pregnancyStartDate, setPregnancyStartDate } = usePregnancy()
  const [startDate, setStartDate] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (pregnancyStartDate) {
      setStartDate(pregnancyStartDate.toISOString().split('T')[0])
    }
  }, [pregnancyStartDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPregnancyStartDate(new Date(startDate))
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pregnancyStartDate">Date de début de grossesse</Label>
          <Input
            id="pregnancyStartDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Enregistrer</Button>
      </form>
    </div>
  )
}

