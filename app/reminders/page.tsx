'use client'

import { useState } from 'react'
import { usePregnancy } from '@/contexts/PregnancyContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function RemindersPage() {
  const { reminders } = usePregnancy()
  const [showPastReminders, setShowPastReminders] = useState(false)

  const now = new Date()
  const filteredReminders = showPastReminders
    ? reminders
    : reminders.filter(reminder => new Date(reminder.date) >= now)

  const sortedReminders = filteredReminders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rappels</h1>
        <Link href="/">
          <Button variant="outline">Retour</Button>
        </Link>
      </header>
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <Button onClick={() => setShowPastReminders(!showPastReminders)}>
            {showPastReminders ? 'Masquer les rappels passés' : 'Afficher les rappels passés'}
          </Button>
        </div>
        {sortedReminders.length === 0 ? (
          <p>Aucun rappel à afficher.</p>
        ) : (
          <ul className="space-y-4">
            {sortedReminders.map(reminder => (
              <li key={reminder.id} className="border p-4 rounded-md">
                <h2 className="text-lg font-semibold">{reminder.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(reminder.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
                {reminder.notes && <p className="mt-2">{reminder.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

