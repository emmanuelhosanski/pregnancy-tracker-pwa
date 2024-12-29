'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { usePregnancy } from '@/contexts/PregnancyContext'
import { AddReminderDialog } from '@/components/add-reminder-dialog'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useToast } from '@/components/ui/use-toast'
import { Battery, Brain, Thermometer, Baby, Activity, Stethoscope, StickyNote, Bell, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const symptoms = [
  { name: 'Fatigue', icon: Battery },
  { name: 'Maux de tête', icon: Brain },
  { name: 'Nausées', icon: Activity },
  { name: 'Fièvre', icon: Thermometer },
  { name: 'Mouvements du bébé', icon: Baby }
]

const symptomColors = ['#4CAF50', '#FDD835', '#FB8C00', '#E53935', '#9C27B0']

export function DailyView({ date }: { date: Date }) {
  const { symptomData, updateSymptomData, addReminder, reminders } = usePregnancy()
  const [formData, setFormData] = useState({
    symptoms: {} as Record<string, number>,
    bloodPressure: '',
    notes: '',
  })
  const [showAddReminder, setShowAddReminder] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const dateString = date.toISOString().split('T')[0]
    if (symptomData[dateString]) {
      setFormData(symptomData[dateString])
    } else {
      setFormData({
        symptoms: {} as Record<string, number>,
        bloodPressure: '',
        notes: '',
      })
    }
  }, [date, symptomData])

  const handleSymptomChange = (symptom: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: { ...prev.symptoms, [symptom]: value },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dateString = date.toISOString().split('T')[0]
    updateSymptomData(dateString, formData)
    toast({
      title: "Données enregistrées",
      description: "Vos informations ont été sauvegardées avec succès.",
    })
    router.push('/')
  }

  const handleAddReminder = (reminder: { title: string; date: Date; notes: string }) => {
    addReminder(reminder)
    setShowAddReminder(false)
    toast({
      title: "Rappel ajouté",
      description: "Votre rappel a été ajouté avec succès.",
    })
  }

  const dayReminders = reminders.filter(
    reminder => reminder.date.toDateString() === date.toDateString()
  )

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Retour
      </Button>
      <h2 className="text-2xl font-semibold">
        {format(date, "EEEE d MMMM", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase())}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {symptoms.map(({ name, icon: Icon }) => (
          <div key={name} className="space-y-2">
            <Label className="flex items-center">
              <Icon className="mr-2 h-5 w-5" />
              {name}
            </Label>
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map(level => (
                <Button
                  key={level}
                  type="button"
                  variant="outline"
                  className="w-10 h-10 p-0"
                  style={{
                    backgroundColor: formData.symptoms[name] === level ? symptomColors[level] : 'transparent',
                    color: formData.symptoms[name] === level ? 'white' : 'inherit',
                  }}
                  onClick={() => handleSymptomChange(name, level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="bloodPressure" className="flex items-center">
            <Stethoscope className="mr-2 h-5 w-5" />
            Tension artérielle
          </Label>
          <Input
            id="bloodPressure"
            value={formData.bloodPressure}
            onChange={e => setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))}
            placeholder="Ex: 120/80"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center">
            <StickyNote className="mr-2 h-5 w-5" />
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Ajoutez vos observations ici..."
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            <h3 className="text-lg font-semibold">Rappels</h3>
          </div>
          {dayReminders.length > 0 ? (
            <ul className="space-y-2">
              {dayReminders.map(reminder => (
                <li key={reminder.id} className="border p-2 rounded-md">
                  <h4 className="font-semibold">{reminder.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(reminder.date), "HH:mm", { locale: fr })}
                  </p>
                  {reminder.notes && <p className="mt-1 text-sm">{reminder.notes}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun rappel pour ce jour.</p>
          )}
        </div>
        <div className="flex justify-between">
          <Button type="submit">Enregistrer</Button>
          <Button type="button" variant="outline" onClick={() => setShowAddReminder(true)}>Ajouter un rappel</Button>
        </div>
      </form>
      <AddReminderDialog
        isOpen={showAddReminder}
        onClose={() => setShowAddReminder(false)}
        onAddReminder={handleAddReminder}
        defaultDate={date}
      />
    </div>
  )
}

