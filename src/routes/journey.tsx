import { createFileRoute, Link } from '@tanstack/react-router'
import { getServerDate } from '@/server/date.functions'

export const Route = createFileRoute('/journey')({
  loader: async () => {
    const { parisDate } = await getServerDate()
    return { parisDate }
  },
  component: JourneyPage,
})

const DAYS = [
  { num: 1, date: 'August 2', unlockDate: '2026-08-02', icon: '🎂', title: 'Happy Birthday', subtitle: "A message from those who love you", color: '#c87070', hasPassword: true },
  { num: 2, date: 'August 3', unlockDate: '2026-08-03', icon: '💌', title: 'A little letter', subtitle: "Because I'll never say that I love you enough", color: '#c8a050', hasPassword: true },
  { num: 3, date: 'August 4', unlockDate: '2026-08-04', icon: '🧩', title: 'My favorite memories', subtitle: 'Tap! Tap! Tap!', color: '#7090c8', hasPassword: true },
  { num: 4, date: 'August 5', unlockDate: '2026-08-05', icon: '📩', title: 'Open When…', subtitle: 'Little messages from me to you', color: '#70c8a0', hasPassword: true },
  { num: 5, date: 'August 6', unlockDate: '2026-08-06', icon: '🎁', title: 'Birthday Surprise', subtitle: "Something I've been keeping for you", color: '#c870a0', hasPassword: true },
  { num: 6, date: 'August 7', unlockDate: '2026-08-07', icon: '🗺️', title: 'Places That Made Us', subtitle: 'Every place that brought us closer', color: '#70b8c8', hasPassword: true },
  { num: 7, date: 'August 8', unlockDate: '2026-08-08', icon: '🌟', title: 'Our Future', subtitle: 'All the adventures still ahead', color: '#a0c870', hasPassword: true },
  { num: 8, date: 'August 9', unlockDate: '2026-08-09', icon: '✨', title: 'Because of You', subtitle: 'The ways you changed my world', color: '#c8c070', hasPassword: true },
  { num: 9, date: 'August 10', unlockDate: '2026-08-10', icon: '🎁', title: 'Birthday Surprise II', subtitle: 'One more thing just for you', color: '#b070c8', hasPassword: true },
  { num: 10, date: 'August 11', unlockDate: '2026-08-11', icon: '🌅', title: 'T‑Minus One', subtitle: 'Tomorrow I come to you', color: '#c89050', hasPassword: true },
]

function hexToRgb(hex: string) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '255,255,255'
}

function JourneyPage() {
  const { parisDate } = Route.useLoaderData()

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0f3050 0%, #071828 60%)',
        paddingBottom: '80px',
      }}
    >
      {/* Header */}
      <div className="text-center pt-14 pb-8 px-6">
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginBottom: '24px',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Back
        </Link>
        <h1
          className="font-romantic animate-fade-up"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: 'var(--text-light)', margin: '0 0 8px' }}
        >
          The Journey
        </h1>
        <p
          className="font-romantic italic animate-fade-up delay-200"
          style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}
        >
          August 2 → August 12, 2026
        </p>
        <div className="flex items-center gap-4 mt-6 max-w-sm mx-auto animate-fade-up delay-300">
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.2)' }} />
          <span style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>✦</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.2)' }} />
        </div>
      </div>

      {/* Days grid */}
      <div
        className="max-w-4xl mx-auto px-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {DAYS.map((day, i) => {
          const isUnlocked = parisDate >= day.unlockDate
          const isToday = parisDate === day.unlockDate
          const isLast = day.num === DAYS.length
          return (
            <DayCard
              key={day.num}
              day={day}
              isUnlocked={isUnlocked}
              isToday={isToday}
              animDelay={`${i * 60}ms`}
              featured={isLast}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-10 px-4" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span>Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <span>Coming soon</span>
        </div>
      </div>
    </div>
  )
}

function DayCard({ day, isUnlocked, isToday, animDelay, featured }: {
  day: typeof DAYS[0]
  isUnlocked: boolean
  isToday: boolean
  animDelay: string
  featured?: boolean
}) {
  const rgb = hexToRgb(day.color)
  const isClickable = isUnlocked || day.hasPassword

  const inner = (
    <div
      style={{
        padding: featured ? '32px 24px' : '24px',
        background: isUnlocked
          ? `linear-gradient(135deg, rgba(${rgb},0.16) 0%, rgba(255,255,255,0.04) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isUnlocked ? `rgba(${rgb},0.4)` : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        opacity: isUnlocked ? 1 : 0.55,
        position: 'relative' as const,
        height: '100%',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: featured ? 'flex' : 'block',
        flexDirection: featured ? 'column' as const : undefined,
        alignItems: featured ? 'center' : undefined,
        textAlign: featured ? 'center' as const : undefined,
        boxShadow: featured && isUnlocked ? `0 8px 32px rgba(${rgb},0.25)` : undefined,
      }}
    >
      {isToday && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'var(--gold)', color: '#071828',
          fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: '20px',
        }}>
          Today
        </div>
      )}
      <div style={{ fontSize: featured ? '2.6rem' : '2rem', marginBottom: '12px', filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
        {isUnlocked ? day.icon : (day.hasPassword ? '🔑' : '🔒')}
      </div>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
        Day {day.num} · {day.date}
      </div>
      <h3 className="font-romantic" style={{ fontSize: featured ? '1.6rem' : '1.25rem', fontWeight: 400, color: isUnlocked ? 'var(--text-light)' : 'var(--text-muted)', margin: '0 0 6px' }}>
        {isUnlocked ? day.title : 'Locked'}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: featured ? '360px' : undefined }}>
        {isUnlocked ? day.subtitle : (day.hasPassword ? 'Enter the code to unlock ✦' : 'This memory is not ready yet. Come back tomorrow ❤️')}
      </p>
      {isUnlocked && (
        <div style={{ marginTop: '16px', fontSize: '0.8rem', color: day.color }}>Open →</div>
      )}
    </div>
  )

  const wrapperStyle: React.CSSProperties = {
    animationDelay: animDelay,
    ...(featured ? { gridColumn: '1 / -1' } : {}),
  }

  if (isClickable) {
    return (
      <div className="animate-fade-up" style={wrapperStyle}>
        <Link
          to="/day/$dayNum"
          params={{ dayNum: String(day.num) }}
          style={{ textDecoration: 'none', display: 'block' }}
        >
          {inner}
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-up" style={wrapperStyle}>
      {inner}
    </div>
  )
}