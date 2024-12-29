'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type SymptomData = {
  [date: string]: {
    symptoms: Record<string, number>
    bloodPressure: string
    notes: string
  }
}

type Reminder = {
  id: string
  title: string
  date: Date
  notes: string
}

type PregnancyContextType = {
  symptomData: SymptomData
  updateSymptomData: (date: string, data: SymptomData[string]) => void
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  pregnancyStartDate: Date | null
  setPregnancyStartDate: (date: Date) => void
}

const PregnancyContext = createContext<PregnancyContextType | undefined>(undefined)

export const usePregnancy = () => {
  const context = useContext(PregnancyContext)
  if (!context) {
    throw new Error('usePregnancy must be used within a PregnancyProvider')
  }
  return context
}

export const PregnancyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [symptomData, setSymptomData] = useState<SymptomData>({})
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [pregnancyStartDate, setPregnancyStartDate] = useState<Date | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('pregnancyData')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setSymptomData(parsedData.symptomData || {})
      setReminders(parsedData.reminders || [])
      setPregnancyStartDate(parsedData.pregnancyStartDate ? new Date(parsedData.pregnancyStartDate) : null)
    }
  }, [])

  const saveToLocalStorage = (data: { symptomData: SymptomData; reminders: Reminder[]; pregnancyStartDate: Date | null }) => {
    localStorage.setItem('pregnancyData', JSON.stringify(data))
  }

  const updateSymptomData = (date: string, data: SymptomData[string]) => {
    setSymptomData(prev => {
      const newData = { ...prev, [date]: data }
      saveToLocalStorage({ symptomData: newData, reminders, pregnancyStartDate })
      return newData
    })
  }

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: Date.now().toString() }
    setReminders(prev => {
      const newReminders = [...prev, newReminder]
      saveToLocalStorage({ symptomData, reminders: newReminders, pregnancyStartDate })
      return newReminders
    })
  }

  const setPregnancyStartDateAndSave = (date: Date) => {
    setPregnancyStartDate(date)
    saveToLocalStorage({ symptomData, reminders, pregnancyStartDate: date })
  }

  return (
    <PregnancyContext.Provider 
      value={{ 
        symptomData, 
        updateSymptomData, 
        reminders, 
        addReminder, 
        pregnancyStartDate, 
        setPregnancyStartDate: setPregnancyStartDateAndSave 
      }}
    >
      {children}
    </PregnancyContext.Provider>
  )
}

