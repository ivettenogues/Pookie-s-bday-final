import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(targetDate))

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (time.total <= 0) {
    return (
      <div className="text-center animate-fade-in">
        <p className="font-romantic shimmer-text" style={{ fontSize: '2rem' }}>
          C'est aujourd'hui ✈️
        </p>
      </div>
    )
  }

  const units = [
    { value: time.days,    label: 'Jours' },
    { value: time.hours,   label: 'Heures' },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Secondes' },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 'clamp(12px, 4vw, 32px)' }}>
      {units.map(({ value, label }, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(12px, 4vw, 32px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="countdown-digit">{String(value).padStart(2, '0')}</div>
            <div className="countdown-label">{label}</div>
          </div>
          {i < units.length - 1 && (
            <div className="countdown-digit" style={{ marginBottom: '22px', opacity: 0.35 }}>:</div>
          )}
        </div>
      ))}
    </div>
  )
}
