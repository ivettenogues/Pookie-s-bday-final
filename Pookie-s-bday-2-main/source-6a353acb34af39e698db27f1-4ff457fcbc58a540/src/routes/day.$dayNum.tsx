import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { getServerDate } from '@/server/date.functions'
import { Countdown } from '@/components/Countdown'

const DAY_PASSWORDS: Record<number, string> = {
  1: '1212', 2: '2345', 3: '9999', 4: '2026', 5: '0208',
  6: '2110', 7: '1208', 8: '2121', 9: '1111', 10: '0000', 11: '0310',
}

// Day N unlocks on Aug (N+1), 2026
// Day 1 = Aug 2, Day 11 = Aug 12
function getUnlockDate(dayNum: number) {
  const month = dayNum + 1  // Aug 2 = day 1, Aug 12 = day 11
  return `2026-08-${String(month).padStart(2, '0')}`
}

export const Route = createFileRoute('/day/$dayNum')({
  loader: async ({ params }) => {
    const n = parseInt(params.dayNum, 10)
    if (isNaN(n) || n < 1 || n > 11) throw redirect({ to: '/journey' })
    const { parisDate } = await getServerDate()
    const unlockDate = getUnlockDate(n)
    const isUnlocked = parisDate >= unlockDate
    return { dayNum: n, isUnlocked, unlockDate, parisDate }
  },
  component: DayPage,
})

function DayPage() {
  const { dayNum, isUnlocked, unlockDate } = Route.useLoaderData()
  const [passwordUnlocked, setPasswordUnlocked] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(`day-${dayNum}-unlocked`) === 'true') {
      setPasswordUnlocked(true)
    }
  }, [dayNum])

  if (!isUnlocked && !passwordUnlocked) {
    return (
      <LockedPage
        unlockDate={unlockDate}
        dayNum={dayNum}
        onUnlock={() => {
          localStorage.setItem(`day-${dayNum}-unlocked`, 'true')
          setPasswordUnlocked(true)
        }}
      />
    )
  }

  const dayComponents: Record<number, ComponentType> = {
    1: Day1, 2: Day2, 3: Day3, 4: Day4, 5: Day5,
    6: Day6, 7: Day7, 8: Day8, 9: Day9, 10: Day10, 11: Day11,
  }
  const DayComponent = dayComponents[dayNum]
  return DayComponent ? <DayComponent /> : null
}

/* ══════════════════════════════════════════════════════════
   SHARED LAYOUT
══════════════════════════════════════════════════════════ */

function PageShell({
  children,
  bgGradient = 'radial-gradient(ellipse at 50% 0%, #0f3050 0%, #071828 60%)',
  dayNum,
}: {
  children: ReactNode
  bgGradient?: string
  dayNum: number
}) {
  return (
    <div style={{ minHeight: '100vh', background: bgGradient, paddingBottom: '80px' }}>
      <div style={{ padding: '24px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/journey" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
          ← Journey
        </Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Day {dayNum} of 11</span>
      </div>
      {children}
    </div>
  )
}

function SectionTitle({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center animate-fade-up" style={{ padding: '48px 24px 32px' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>{label}</p>
      <h1 className="font-romantic" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 300, color: 'var(--text-light)', margin: '0 0 12px' }}>{title}</h1>
      {subtitle && <p className="font-romantic italic" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>{subtitle}</p>}
      <Divider />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-4 mt-5 max-w-xs mx-auto">
      <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
      <span style={{ color: 'var(--gold)' }}>✦</span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   LOCKED PAGE
══════════════════════════════════════════════════════════ */

function LockedPage({ unlockDate, dayNum, onUnlock }: { unlockDate: string; dayNum: number; onUnlock: () => void }) {
  const parts = unlockDate.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const unlockStr = `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`

  const hasPassword = dayNum in DAY_PASSWORDS
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const tryUnlock = (code: string) => {
    if (DAY_PASSWORDS[dayNum] === code) {
      onUnlock()
    } else {
      setError(true)
      setPassword('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 30%, #0f2a40 0%, #071828 60%)', padding: '24px', textAlign: 'center' }}>
      <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '24px' }}>🔒</div>
      <h2 className="font-romantic animate-fade-up" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 300, color: 'var(--text-light)', margin: '0 0 16px' }}>
        Day {dayNum} · {unlockStr}
      </h2>

      {hasPassword ? (
        <>
          <p className="animate-fade-up delay-200" style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.7, marginBottom: '32px' }}>
            Enter the secret code to unlock ❤️
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); tryUnlock(password) }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={password}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPassword(val)
                setError(false)
                if (val.length === 4) tryUnlock(val)
              }}
              placeholder="• • • •"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: `1px solid ${error ? 'rgba(200,80,80,0.6)' : 'rgba(200,160,80,0.4)'}`,
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '1.8rem',
                letterSpacing: '0.4em',
                color: 'var(--text-light)',
                textAlign: 'center',
                width: '160px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                fontFamily: 'monospace',
              }}
            />
            {error && (
              <p style={{ color: 'rgba(200,80,80,0.9)', fontSize: '0.85rem', margin: 0 }}>
                Wrong code. Try again ✦
              </p>
            )}
            <button
              type="submit"
              style={{
                padding: '14px 40px',
                background: 'rgba(200,160,80,0.15)',
                border: '1px solid rgba(200,160,80,0.5)',
                borderRadius: '50px',
                color: 'var(--gold-light)',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                letterSpacing: '0.08em',
              }}
            >
              Open ✦
            </button>
          </form>
        </>
      ) : (
        <p className="animate-fade-up delay-200" style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.7, marginBottom: '40px' }}>
          This memory is not ready yet.<br />
          Come back on {unlockStr} ❤️
        </p>
      )}

      <Link to="/journey" style={{
        padding: '14px 40px',
        background: 'rgba(200,160,80,0.12)',
        border: '1px solid rgba(200,160,80,0.4)',
        borderRadius: '50px',
        color: 'var(--gold-light)',
        textDecoration: 'none',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1rem',
        letterSpacing: '0.08em',
      }}>
        Return to Journey
      </Link>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 1 · August 2 · HAPPY BIRTHDAY 🎂
══════════════════════════════════════════════════════════ */

function Confetti() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const colors = ['#c87070','#c8a050','#70a8c8','#c870a0','#70c8a0','#c8c070']
    el.innerHTML = ''
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div')
      piece.className = 'confetti-piece'
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -10px;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${3 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 3}s;
      `
      el.appendChild(piece)
    }
  }, [])
  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />
}

function Day1() {
  return (
    <PageShell dayNum={1} bgGradient="radial-gradient(ellipse at 50% 0%, #2a0f1a 0%, #071828 60%)">
      <Confetti />
      <SectionTitle label="Day 1 · August 2" title="Happy Birthday my love" subtitle="Here's a message from those who love you" />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
        <div className="glass animate-fade-up delay-300" style={{ padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
          <div className="animate-heartbeat" style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎂</div>
          <p className="font-romantic" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', color: 'var(--text-light)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
            I know being far away from your loved ones on your birthday can be hard, but I hope this brings a smile to your face. You are beyond loved and cherished by all your family and friends. 
            Joyeux anniversaire, je t'aime ❤️
          </p>
        </div>

        {/* Birthday video — place your video at /public/birthday-video.mp4 */}
        <div
          className="animate-fade-up delay-400"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '32px',
            border: '1px solid rgba(200,160,80,0.3)',
            background: 'rgba(0,0,0,0.4)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          <video
            controls
            playsInline
            style={{ width: '100%', display: 'block', maxHeight: '520px', background: '#000' }}
          >
            <source src="/birthday-video.mp4" type="video/mp4" />
          </video>
     </div>

      </div>

      </PageShell>

    )

}

/* ══════════════════════════════════════════════════════════
   DAY 2 · August 3 · LOVE LETTER 💌
══════════════════════════════════════════════════════════ */

function Day2() {
  return (
    <PageShell dayNum={2} bgGradient="radial-gradient(ellipse at 30% 20%, #1a0f2a 0%, #071828 70%)">
      <SectionTitle label="Day 2 · August 3" title="A Letter From My Heart" subtitle="Words I have been saving for you" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 24px 40px' }}>
        <div className="animate-fade-up delay-300" style={{
          background: 'linear-gradient(135deg, rgba(245,230,200,0.06) 0%, rgba(245,230,200,0.02) 100%)',
          border: '1px solid rgba(245,230,200,0.15)',
          borderRadius: '20px',
          padding: 'clamp(28px, 6vw, 52px)',
        }}>
          <p className="font-script" style={{ fontSize: '1.4rem', color: 'var(--gold)', marginBottom: '28px' }}>My love,</p>
          {[
            "J'ai eu envie d’écrire cette lettre depuis longtemps. À chaque fois que j’essayais, je me rendais compte que je n’avais pas les bons mots. Alors j’ai continué à attendre le bon moment. Je crois que ton anniversaire est le bon moment.",
            "La distance est étrange. Elle rétrécit le monde d’une manière inattendue, puis l’étire d’une autre. Quand on est séparés, chaque petite chose devient importante, le bon comme le mauvais. On devient plus insécurisés, on a plus de doutes, on a besoin de plus d’être rassurés. Des disputes qui auraient normalement été réglées en une courte conversation et une étreinte durent soudain des jours, et les différences de routines, de modes de vie, de contextes et de fuseaux horaires rendent parfois difficile le sentiment de vivre vraiment les mêmes moments. Et pourtant, la distance nous oblige aussi à faire des choix plus forts : communiquer quand c’est difficile, prioriser quand ce n'est pas pratique, rester même quand c’est épuisant, et continuer à choisir d’avancer jour après jour. Le bon, le mauvais, les leçons et les erreurs de ces derniers mois, je garde tout. Je crois qu’avec le recul, on réalisera peut-être que c’était la clé pour construire les bases d’une relation qui peut durer toute une vie.",
            "Tu m’as demandé un soir, quand je venais te voir à Antibes, si j’étais heureuse. Je veux te répondre correctement maintenant : oui. Mille fois oui. Pas parce que la distance est facile, ou belle, ou quelque chose que l’on choisirait — mais parce que même si je sais que j’ai déjà été heureuse avant, aujourd’hui j’ai toujours le sentiment qu’il me manque quelque chose. Oui, je pourrais être heureuse, mais je sais aussi que je serais plus heureuse avec toi. Et c’est rare, et je ne le prends pas à la légère.",
        
            "Alors bon anniversaire, mon amour. Merci d’avoir été patient avec moi pendant tous ces mois. Merci d’avoir fait de cette distance un prologue plutôt qu’un mur. Plus que dix jours et je serai là.",
            "Attends-moi encore un peu.",
          ].map((para, i) => (
            <p key={i} style={{ color: 'var(--sand)', lineHeight: 1.9, marginBottom: '20px', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)' }}>
              {para}
            </p>
          ))}
          <div style={{ borderTop: '1px solid rgba(200,160,80,0.2)', paddingTop: '24px', marginTop: '8px' }}>
            <p className="font-script" style={{ fontSize: '1.3rem', color: 'var(--gold)', textAlign: 'right' }}>
              Je t'aime fort,<br />
              <span style={{ fontSize: '1.5rem' }}>I.</span>
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 3 · August 4 · EMOJI MEMORIES 🧩
══════════════════════════════════════════════════════════ */

const memories = [
  { emoji: '🌊', date: 'Juillet 2024', title: 'The Ocean Call', memory: 'The first time you described the sea in Tahiti, I understood why you stayed. "It\'s not just blue," you said, "it\'s every shade of feeling at once." I replayed that for days.' },
  { emoji: '☕', date: 'Août 2024', title: 'Morning Coffee', memory: 'You always send me coffee pictures when you wake up. It became my alarm clock — better than any sound. There\'s something incredibly intimate about sharing a cup across 16,000 km.' },
  { emoji: '🌙', date: 'Septembre 2024', title: 'Late Night Calls', memory: 'You\'re always in my tomorrow, I\'m always in your yesterday. And somehow we found a time that was ours — that strange, quiet hour where Paris sleeps and Tahiti softens.' },
  { emoji: '🌺', date: 'Octobre 2024', title: 'Tiare', memory: 'You sent me a pressed tiare flower in an envelope once. It arrived a little battered, still fragrant. I kept it. I still have it. It smells like you now.' },
  { emoji: '🎵', date: 'Novembre 2024', title: 'Our Playlist', memory: 'The playlist we built together, one song at a time, from two different hemispheres. Every song a tiny telegram — "this is what I\'m feeling," "this made me think of you."' },
  { emoji: '📸', date: 'Décembre 2024', title: 'Your Sunsets', memory: 'I have a folder on my phone. Just your sunsets. 47 of them. Each one slightly different — sometimes gold, sometimes violent orange, sometimes soft pink. All of them yours.' },
  { emoji: '😂', date: 'Janvier 2025', title: 'The Laugh', memory: 'I can\'t even explain what started it, but we laughed for forty straight minutes on that call. Real, breathless, ridiculous laughter. I needed that more than I knew.' },
  { emoji: '🌴', date: 'Février 2025', title: 'Tahiti Dream', memory: 'You described your island to me so many times that I dreamed about it before I\'d ever seen a photo. In my dreams it\'s always 5pm light, always warm, always you on the porch.' },
  { emoji: '💬', date: 'Mars 2025', title: 'The Message', memory: 'The morning you sent "je pensais à toi en me réveillant" — just that, nothing else — and I read it on the metro and my whole day changed colour.' },
  { emoji: '🌅', date: 'Avril 2025', title: 'Synchronized Sunset', memory: 'We timed it once — you watching sunset in Tahiti, me watching sunset in Paris, 12 hours apart but somehow the same sky. You said the clouds looked like the ones above Montmartre.' },
  { emoji: '📚', date: 'Mai 2025', title: 'Same Book', memory: 'We read the same book at the same time. Different copies, different continents. We\'d text each chapter. It was the closest I\'ve felt to being in the same room with you.' },
  { emoji: '✈️', date: 'Juin 2025', title: 'The Promise', memory: 'The day I booked the ticket. I sent you just the booking confirmation, no message. You replied with a single heart. That was enough — more than enough.' },
]

// Deterministic heart positions — no Math.random() to avoid hydration mismatch
const HEARTS_DATA = [
  {x: 12, y:  9, size: 2.4, rot: -12, delay: 0.1},
  {x: 32, y: 11, size: 2.0, rot:   6, delay: 0.5},
  {x: 55, y:  7, size: 2.6, rot:  -8, delay: 0.2},
  {x: 76, y: 13, size: 2.1, rot:  14, delay: 0.7},
  {x: 88, y: 26, size: 2.3, rot:  -5, delay: 0.3},
  {x: 20, y: 42, size: 2.3, rot:  10, delay: 0.4},
  {x: 42, y: 46, size: 2.0, rot: -15, delay: 0.0},
  {x: 63, y: 38, size: 2.4, rot:   5, delay: 0.6},
  {x: 84, y: 50, size: 1.9, rot: -10, delay: 0.3},
  {x: 10, y: 72, size: 2.2, rot:  -5, delay: 0.8},
  {x: 36, y: 77, size: 2.1, rot:  12, delay: 0.1},
  {x: 62, y: 70, size: 2.3, rot: -20, delay: 0.5},
]

function Day3() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <PageShell dayNum={3} bgGradient="radial-gradient(ellipse at 60% 10%, #0f1f3a 0%, #071828 60%)">
      <SectionTitle label="Day 3 · August 4" title="Our Memories" subtitle="Tap a heart to unlock a memory" />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px 40px' }}>
        {/* Heart field */}
        <div
          style={{
            position: 'relative',
            minHeight: '480px',
            marginBottom: '24px',
          }}
        >
          {HEARTS_DATA.map((h, i) => (
            <button
              key={i}
              onClick={() => setOpen(i)}
              className="animate-fade-in"
              style={{
                position: 'absolute',
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: `translate(-50%, -50%) rotate(${h.rot}deg)`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: `${h.size}rem`,
                animation: 'heartbeat 1.8s ease-in-out infinite',
                animationDelay: `${h.delay}s`,
                filter: 'drop-shadow(0 0 10px rgba(217,110,85,0.5))',
                transition: 'filter 0.2s ease, transform 0.2s ease',
                lineHeight: 1,
                padding: '8px',
              }}
              aria-label={memories[i].title}
            >
              ❤️
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(176,196,216,0.4)', fontSize: '0.85rem', marginTop: '8px' }}>
          {open === null ? 'Tap a heart to reveal a memory' : ''}
        </p>
      </div>

      {/* Memory modal */}
      {open !== null && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7,24,40,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 200,
          }}
          onClick={() => setOpen(null)}
        >
          <div
            className="glass animate-fade-up"
            style={{
              maxWidth: '420px',
              width: '100%',
              padding: '36px',
              background: 'rgba(217,110,85,0.1)',
              border: '1px solid rgba(217,110,85,0.35)',
              borderRadius: '20px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '3rem' }}>{memories[open].emoji}</span>
            </div>
            <p style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 8px' }}>
              {memories[open].date}
            </p>
            <h3 className="font-romantic" style={{ fontSize: '1.5rem', color: 'var(--text-light)', textAlign: 'center', margin: '0 0 18px', fontWeight: 400 }}>
              {memories[open].title}
            </h3>
            <p style={{ color: 'var(--sand)', lineHeight: 1.78, margin: '0 0 28px', fontSize: '0.95rem' }}>
              {memories[open].memory}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {open > 0 && (
                <button
                  onClick={() => setOpen(open - 1)}
                  style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  ‹ Prev
                </button>
              )}
              <button
                onClick={() => setOpen(null)}
                style={{ padding: '10px 24px', background: 'rgba(217,110,85,0.18)', border: '1px solid rgba(217,110,85,0.4)', borderRadius: '50px', color: 'var(--sand)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ✕ Close
              </button>
              {open < memories.length - 1 && (
                <button
                  onClick={() => setOpen(open + 1)}
                  style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Next ›
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 4 · August 5 · OPEN WHEN 📩
══════════════════════════════════════════════════════════ */

const openWhenLetters = [
  {
    label: 'Open when you miss me',
    icon: '💙',
    sealColor: '#4a6fa8',
    text: "I'm here. Not in the room, I know — but in every message I've ever sent you, every call that ran too long, every song I added to our playlist thinking of you. The distance is real but so is this: I choose you every single day, from 16,000 km away. That doesn't stop when we're not talking. I miss you too. Meet me there, in that feeling — it means we're thinking of each other at the same time. That's not nothing. That's everything.",
  },
  {
    label: "Open when you're feeling low",
    icon: '🌧️',
    sealColor: '#5a7a9a',
    text: "Some days are just hard. Not because anything went wrong necessarily, but because the weight of ordinary life feels heavier. On those days, I want you to remember: you have made it through every difficult day so far. Every single one. That's a 100% success rate. I love you on the good days and even more on the ones like this. Let yourself rest. Let yourself feel it. I'll be here when you come up for air.",
  },
  {
    label: 'Open when you need to laugh',
    icon: '😄',
    sealColor: '#4a8a5a',
    text: "Remember when we tried to count how many times the call dropped during that one conversation and eventually just gave up and texted 'same'? Or when you described your neighbour's rooster in such detail that I laughed so hard I cried? Or when we both said the exact same weird phrase at the exact same time on a call and then just stared at each other across continents, stunned? You're ridiculous, and I am utterly delighted to know you.",
  },
  {
    label: "Open when you want to know you're loved",
    icon: '❤️',
    sealColor: '#a04040',
    text: "You are loved. Completely. Not the 'you're great but' kind of love — the full thing, no asterisks. I love your specific way of thinking, your honesty, the way you get excited about small things that matter to you. I love your voice when you're sleepy. I love that you remember details I mentioned once, weeks ago. I love that you exist. I love you so much it sometimes feels like a physical thing, like something I carry around. You are so, so loved.",
  },
  {
    label: "Open when you can't sleep",
    icon: '🌙',
    sealColor: '#6a4a9a',
    text: "It's quiet there now. The lagoon is probably doing that thing where it looks like black glass. I can't see it from Paris but I imagine it sometimes, and I imagine you near it. Close your eyes. Think of one good thing from today — just one. Hold it gently. You don't have to fix anything right now. The night is just asking you to rest. And when morning comes, I'll be there in your messages. I always am. Sleep well, mon amour.",
  },
  {
    label: "Open when you're waiting for me",
    icon: '✈️',
    sealColor: '#8a7030',
    text: "I am coming. I want you to know that I am actually, literally, on my way. Every single day between now and August 12 is just time folding itself up to close the distance between us. The wait is almost over. Think about where you want to take me first — the specific place, the specific light. I want to see everything through your eyes. I want to finally be in the same place as you, at the same time, under the same sky. Almost there, my love. Almost.",
  },
]

function OpenWhenCard({ letter, index }: { letter: typeof openWhenLetters[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        style={{
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: isOpen ? '0 10px 40px rgba(0,0,0,0.45)' : '0 4px 18px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.35s ease',
          border: '1px solid rgba(200,170,110,0.18)',
        }}
      >
        {/* Envelope flap */}
        <div
          style={{
            position: 'relative',
            background: isOpen
              ? 'linear-gradient(175deg, #c8a472 0%, #b8904a 100%)'
              : 'linear-gradient(175deg, #d4b080 0%, #c09860 100%)',
            height: isOpen ? '52px' : '88px',
            transition: 'height 0.4s ease, background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Fold-line SVG */}
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
          >
            <line x1="0" y1="0" x2="50" y2="50" stroke="#3a2a0a" strokeWidth="0.6" />
            <line x1="100" y1="0" x2="50" y2="50" stroke="#3a2a0a" strokeWidth="0.6" />
          </svg>

          {isOpen ? (
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#5a3e18', opacity: 0.75, zIndex: 1 }}>
              {letter.label}
            </span>
          ) : (
            /* Wax seal */
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25), transparent 60%), ${letter.sealColor}`,
                boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                zIndex: 1,
                marginTop: '8px',
              }}
            >
              {letter.icon}
            </div>
          )}
        </div>

        {/* Envelope body */}
        <div
          style={{
            background: 'linear-gradient(180deg, #faf2e0 0%, #f5e8cc 100%)',
            borderTop: '1px solid rgba(90,62,20,0.15)',
            padding: '20px 22px',
          }}
        >
          {!isOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{letter.icon}</span>
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: '#5a3e18',
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {letter.label}
              </p>
              <span style={{ fontSize: '0.75rem', color: '#9a7a40', opacity: 0.7, flexShrink: 0 }}>Tap →</span>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{letter.icon}</span>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.02rem',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: '#5a3e18',
                  }}
                >
                  {letter.label}
                </p>
              </div>
              <div style={{ borderTop: '1px solid rgba(90,62,20,0.15)', paddingTop: '14px' }}>
                <p
                  style={{
                    margin: '0 0 16px',
                    color: '#2e1e0a',
                    lineHeight: 1.82,
                    fontSize: '0.92rem',
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {letter.text}
                </p>
                <p
                  style={{
                    margin: 0,
                    textAlign: 'right',
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1.1rem',
                    color: '#8a6030',
                  }}
                >
                  Avec amour ❤️
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Day4() {
  return (
    <PageShell
      dayNum={4}
      bgGradient="radial-gradient(ellipse at 40% 10%, #1a1208 0%, #071828 60%)"
    >
      <SectionTitle label="Day 4 · August 5" title="Open When…" subtitle="Letters sealed with love, for whatever you feel" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {openWhenLetters.map((letter, i) => (
          <OpenWhenCard key={i} letter={letter} index={i} />
        ))}
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 5 · August 6 · BIRTHDAY SURPRISE #1 🎁
══════════════════════════════════════════════════════════ */

const lovingReasons = [
  "The way you explain things — you always find an angle I hadn't considered",
  "How you remember the small things I mention in passing",
  "Your laugh — specifically when something catches you off guard",
  "The fact that you're honest with me, even when it would be easier not to be",
  "The way you describe your home — with such precise, unguarded love",
  "How you handle silence on calls: never awkward, always comfortable",
  "Your curiosity — the way you want to understand things properly",
  "That you read the same book as me just to have something to share",
  "The way distance made you more present, not less",
  "Your voice at the end of a long day",
  "The fact that you ask how I am and actually listen to the answer",
  "How completely yourself you are — no performance, just you",
  "The way you love the ocean — without sentimentality, just real",
  "That you pressed a flower and sent it in an envelope",
  "Your patience with bad connections, with time zones, with all of it",
  "How you make even ordinary things feel worth describing",
  "The specific way you type when you're tired — slower, warmer",
  "That you know when I need reassurance and give it without being asked",
  "The way you see beauty in small, specific things",
  "That you exist on this planet and somehow crossed my path",
]

function Day5() {
  const [revealed, setRevealed] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const displayCount = showAll ? lovingReasons.length : revealed
  const visible = lovingReasons.slice(0, displayCount)

  return (
    <PageShell dayNum={5} bgGradient="radial-gradient(ellipse at 60% 0%, #2a0f25 0%, #071828 60%)">
      <SectionTitle label="Day 5 · August 6 · Birthday Surprise" title="Why I Love You" subtitle="A few of the reasons. There are so many more." />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {visible.map((reason, i) => (
            <div
              key={i}
              className="glass animate-fade-up"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animationDelay: `${i < 5 ? i * 100 : 0}ms`,
              }}
            >
              <span style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '3px', flexShrink: 0 }}>✦</span>
              <p style={{ margin: 0, color: 'var(--sand)', lineHeight: 1.6, fontSize: '0.95rem' }}>{reason}</p>
            </div>
          ))}
        </div>

        {!showAll && revealed < lovingReasons.length && (
          <div className="text-center">
            <button
              onClick={() => setRevealed(Math.min(revealed + 4, lovingReasons.length))}
              style={{
                padding: '14px 40px',
                background: 'rgba(200,160,80,0.12)',
                border: '1px solid rgba(200,160,80,0.4)',
                borderRadius: '50px',
                color: 'var(--gold-light)',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              Reveal more ✦
            </button>
            <br />
            <button onClick={() => setShowAll(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
              Show all at once
            </button>
          </div>
        )}

        {(showAll || revealed >= lovingReasons.length) && (
          <div className="glass text-center animate-fade-up" style={{ padding: '28px', marginTop: '16px', background: 'rgba(200,160,80,0.08)', border: '1px solid rgba(200,160,80,0.3)' }}>
            <p className="font-script" style={{ fontSize: '1.5rem', color: 'var(--gold)', margin: '0 0 8px' }}>And so many more.</p>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Some things are better said in person — and soon, very soon, I will.</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 6 · August 7 · SPECIAL GIFT 🎁
══════════════════════════════════════════════════════════ */

function Day6() {
  const [revealed, setRevealed] = useState(false)

  return (
    <PageShell dayNum={6} bgGradient="radial-gradient(ellipse at 50% 0%, #1a0f2a 0%, #071828 70%)">
      <SectionTitle label="Day 6 · August 7" title="Un Cadeau Magique" subtitle="From those who love you most" />
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '0 20px 60px' }}>

        {!revealed ? (
          <div
            className="glass animate-fade-up delay-300 text-center"
            style={{ padding: '56px 36px', cursor: 'pointer', border: '1px solid rgba(200,160,80,0.25)' }}
            onClick={() => setRevealed(true)}
          >
            <div className="animate-float" style={{ fontSize: '5rem', marginBottom: '24px' }}>🎁</div>
            <p className="font-romantic" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: 'var(--gold)', margin: '0 0 12px' }}>
              A gift is waiting for you…
            </p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              From mes parents, with all their heart
            </p>
            <button
              style={{
                padding: '14px 44px',
                background: 'rgba(200,160,80,0.15)',
                border: '1px solid rgba(200,160,80,0.5)',
                borderRadius: '50px',
                color: 'var(--gold-light)',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.05rem',
                letterSpacing: '0.08em',
              }}
            >
              Reveal the gift ✦
            </button>
          </div>
        ) : (
          <div className="animate-fade-up">
            {/* Main gift card */}
            <div
              className="glass text-center"
              style={{
                padding: '48px 36px',
                background: 'linear-gradient(135deg, rgba(200,160,80,0.1) 0%, rgba(217,110,85,0.06) 100%)',
                border: '1px solid rgba(200,160,80,0.4)',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '4.5rem', marginBottom: '20px' }}>🏰</div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
                Le cadeau de mes parents
              </p>
              <h2
                className="font-romantic"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  fontWeight: 300,
                  color: 'var(--text-light)',
                  margin: '0 0 8px',
                }}
              >
                Disneyland Paris
              </h2>
              <p className="font-romantic italic" style={{ color: 'var(--gold-light)', fontSize: '1.2rem', margin: '0 0 28px' }}>
                🎡 La magie t'attend
              </p>
              <p
                style={{
                  color: 'var(--sand)',
                  lineHeight: 1.85,
                  fontSize: '1rem',
                  maxWidth: '440px',
                  margin: '0 auto 32px',
                }}
              >
                When you're back, mes parents are offering you a magical day at Disneyland Paris —
                their gift to you, with all their love. Welcome to the family, in the most
                enchanted way possible. ✨
              </p>

              {/* Ticket badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '18px 32px',
                  background: 'rgba(200,160,80,0.12)',
                  border: '1px solid rgba(200,160,80,0.45)',
                  borderRadius: '14px',
                }}
              >
                <span style={{ fontSize: '2rem' }}>🎫</span>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: '0 0 3px', fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Le cadeau
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      color: 'var(--gold-light)',
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 600,
                    }}
                  >
                    Billets · Disneyland Paris
                  </p>
                </div>
              </div>
            </div>

            {/* Closing note */}
            <div
              className="glass text-center animate-fade-up"
              style={{
                padding: '28px',
                background: 'rgba(217,110,85,0.06)',
                border: '1px solid rgba(217,110,85,0.2)',
              }}
            >
              <p
                className="font-romantic italic"
                style={{ fontSize: '1.15rem', color: 'var(--sand)', margin: 0, lineHeight: 1.75 }}
              >
                "Every fairytale needs its castle — and ours starts right there."
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 7 · August 8 · OUR FUTURE 🌟
══════════════════════════════════════════════════════════ */

const futures = [
  { icon: '🌅', title: 'Watch a sunrise from the water', desc: 'Proper sunrise — before the heat comes up, when the sky is still deciding what colour to be. I want to be in the ocean when it happens.' },
  { icon: '🍳', title: 'Cook together in a real kitchen', desc: "Not over video call, not 'and here's what I made' — together, in the same kitchen, with actual ingredients and actual chaos." },
  { icon: '🚴', title: 'Explore somewhere neither of us has been', desc: 'A place where we have equal footing. Equal confusion and wonder. Discovering something side by side, for the first time, together.' },
  { icon: '📖', title: 'Read in the same room', desc: 'No talking, just two people reading different books in the same light. That specific peaceful coexistence. I\'ve wanted that for months.' },
  { icon: '🌊', title: 'Swim to the horizon', desc: 'Or as close as we can get. Just keep going out until the shore is small and it\'s just us and the open water and the sky.' },
  { icon: '🎵', title: 'Dance together — actually dance', desc: 'To our playlist. To something neither of us expected to like. At some odd hour when it feels completely natural to be ridiculous together.' },
  { icon: '🌃', title: 'Stay up too late for no reason', desc: 'Because the night is good and the conversation is good and for once there\'s no timezone to respect, no call to end, no goodnight to say.' },
  { icon: '📷', title: 'Take exactly one photo', desc: "Not for anything. Just one, to prove it happened. That we were here, together, exactly where we promised we'd be." },
]

function Day7() {
  return (
    <PageShell dayNum={7} bgGradient="radial-gradient(ellipse at 50% 0%, #0f2a0f 0%, #071828 60%)">
      <SectionTitle label="Day 7 · August 8" title="Our Future Together" subtitle="Things I want to do with you, starting soon" />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {futures.map((item, i) => (
            <div
              key={i}
              className="glass animate-fade-up"
              style={{
                padding: '24px',
                animationDelay: `${i * 80}ms`,
                borderTop: '2px solid rgba(160,200,112,0.3)',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{item.icon}</div>
              <h3 className="font-romantic" style={{ fontSize: '1.15rem', fontWeight: 500, color: 'var(--text-light)', margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="glass text-center animate-fade-up" style={{ padding: '28px', marginTop: '24px', background: 'rgba(160,200,112,0.06)', border: '1px solid rgba(160,200,112,0.2)' }}>
          <p className="font-script" style={{ fontSize: '1.4rem', color: '#a0c870', margin: '0 0 8px' }}>This is only the beginning</p>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>Five more days until we start doing them.</p>
        </div>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 8 · August 9 · BECAUSE OF YOU ✨
══════════════════════════════════════════════════════════ */

const becauseOfYou = [
  { before: 'I used to sleep through sunrises.', after: 'Now I catch them sometimes, thinking of yours.' },
  { before: 'I kept playlists mostly for myself.', after: 'Now every new song gets evaluated: would he like this?' },
  { before: 'I thought long-distance was impossible.', after: 'You made me revise that completely.' },
  { before: 'I forgot what it felt like to be properly listened to.', after: 'You reminded me.' },
  { before: 'I thought I knew what I wanted.', after: "You showed me some things I hadn't even considered." },
  { before: 'I was ambivalent about Tahiti.', after: 'Now I feel like I already have a home there.' },
  { before: 'Time zones were just an inconvenience.', after: "Now they're the shape of the distance between us — something to solve together." },
  { before: 'I read alone.', after: 'Now reading feels like a shared activity.' },
]

function Day8() {
  return (
    <PageShell dayNum={8} bgGradient="radial-gradient(ellipse at 30% 30%, #1a1a0a 0%, #071828 60%)">
      <SectionTitle label="Day 8 · August 9" title="Because of You" subtitle="The ways you've quietly changed things" />
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 20px' }}>
        {becauseOfYou.map((item, i) => (
          <div
            key={i}
            className="animate-fade-up"
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px',
              animationDelay: `${i * 100}ms`,
            }}
          >
            <div style={{ width: '3px', background: `hsl(${50 + i * 15}, 70%, 60%)`, borderRadius: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ color: 'rgba(176,196,216,0.55)', margin: '0 0 6px', fontSize: '0.88rem', fontStyle: 'italic', textDecoration: 'line-through', textDecorationColor: 'rgba(176,196,216,0.3)' }}>{item.before}</p>
              <p style={{ color: 'var(--sand)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>{item.after}</p>
            </div>
          </div>
        ))}
        <div className="glass text-center animate-fade-up" style={{ padding: '28px', marginTop: '20px', background: 'rgba(200,192,112,0.07)', border: '1px solid rgba(200,192,112,0.25)' }}>
          <p className="font-romantic italic" style={{ fontSize: '1.2rem', color: 'var(--sand)', margin: 0 }}>
            "You didn't change me. You just showed me parts of myself I hadn't met yet."
          </p>
        </div>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 9 · August 10 · BIRTHDAY SURPRISE #2 🎁
══════════════════════════════════════════════════════════ */

const bucketList = [
  { text: 'Watch the sunset from Pointe Vénus', emoji: '🌅' },
  { text: 'Swim with sharks in Moorea lagoon', emoji: '🦈' },
  { text: 'Cook a real Tahitian meal together', emoji: '🍤' },
  { text: 'Sleep under the stars with no screen', emoji: '🌌' },
  { text: 'Find a deserted beach and stay all day', emoji: '🏖️' },
  { text: 'Dance somewhere unexpected, at night', emoji: '💃' },
  { text: 'Watch a storm come in from the ocean', emoji: '⛈️' },
  { text: 'Take a boat to somewhere with no plan', emoji: '⛵' },
  { text: 'Wake up together and do absolutely nothing', emoji: '☀️' },
  { text: 'Make a memory we\'ll describe for years', emoji: '📸' },
]

function Day9() {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const toggle = (i: number) => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })

  return (
    <PageShell dayNum={9} bgGradient="radial-gradient(ellipse at 70% 10%, #1a0a2a 0%, #071828 60%)">
      <SectionTitle label="Day 9 · August 10 · Birthday Surprise II" title="Our Tahiti Bucket List" subtitle="Ten things I want us to do. Together. Soon." />
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {bucketList.map((item, i) => (
            <div
              key={i}
              className="glass animate-fade-up bucket-item"
              onClick={() => toggle(i)}
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                animationDelay: `${i * 80}ms`,
                opacity: checked.has(i) ? 0.5 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              <div className={`bucket-check ${checked.has(i) ? 'checked' : ''}`}>
                {checked.has(i) && <span style={{ color: '#071828', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: '1.3rem' }}>{item.emoji}</span>
              <p style={{
                margin: 0,
                color: 'var(--sand)',
                fontSize: '0.95rem',
                textDecoration: checked.has(i) ? 'line-through' : 'none',
                textDecorationColor: 'rgba(200,160,80,0.5)',
                flex: 1,
              }}>{item.text}</p>
            </div>
          ))}
        </div>
        {checked.size > 0 && (
          <div className="glass text-center animate-fade-in" style={{ padding: '20px', background: 'rgba(176,112,200,0.08)', border: '1px solid rgba(176,112,200,0.25)' }}>
            <p style={{ color: '#b070c8', margin: 0, fontSize: '0.9rem' }}>
              {checked.size === bucketList.length
                ? '🎉 We did it all. What a life.'
                : `${checked.size} done · ${bucketList.length - checked.size} adventures to go`}
            </p>
          </div>
        )}
        <p style={{ textAlign: 'center', color: 'rgba(176,196,216,0.4)', fontSize: '0.8rem', marginTop: '16px' }}>
          Tap to mark things as done when we do them together ❤️
        </p>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 10 · August 11 · T-MINUS ONE 🌅
══════════════════════════════════════════════════════════ */

const FLIGHT_DATE = new Date('2026-08-12T10:00:00Z') // 12:00 Paris (CEST) = 10:00 UTC

function Day10() {
  return (
    <PageShell dayNum={10} bgGradient="radial-gradient(ellipse at 50% 0%, #1a2a0a 0%, #071828 60%)">
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <p className="animate-fade-up font-romantic italic" style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '16px' }}>
          Day 10 · August 11
        </p>
        <h1 className="animate-fade-up font-romantic delay-100" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 300, color: 'var(--text-light)', margin: '0 0 8px' }}>
          T‑Minus One
        </h1>
        <p className="animate-fade-up delay-200 font-romantic italic" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '48px' }}>
          Tomorrow, I come to you.
        </p>

        <div className="glass animate-fade-up delay-300" style={{ padding: '32px', maxWidth: '460px', marginBottom: '40px', background: 'rgba(200,160,80,0.07)', border: '1px solid rgba(200,160,80,0.25)' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Time until takeoff
          </p>
          <Countdown targetDate={FLIGHT_DATE} />
        </div>

        <div className="animate-fade-up delay-400" style={{ maxWidth: '520px' }}>
          {[
            "Tonight, pack lightly. Don't overthink it. I'm almost there.",
            "Tomorrow morning I wake up in Paris for the last time before I see you. I have been thinking about that sentence for months.",
            "Everything between us has been moving toward this — every goodnight text, every frozen call, every timezone calculation. It was all pointing to tomorrow.",
            "Sleep well, mon amour. This is the last night we go to sleep apart.",
          ].map((para, i) => (
            <p key={i} style={{ color: 'var(--sand)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>{para}</p>
          ))}
        </div>

        <div className="animate-float" style={{ fontSize: '3rem', marginTop: '32px' }}>🌅</div>
      </div>
    </PageShell>
  )
}

/* ══════════════════════════════════════════════════════════
   DAY 11 · August 12 · MISSION CONTROL ✈️
══════════════════════════════════════════════════════════ */

function MissionBlink({ children }: { children: ReactNode }) {
  return <span className="mission-blink">{children}</span>
}

function Day11() {
  const [arrived, setArrived] = useState(false)
  const missionGreen = '#00ff88'

  return (
    <div style={{ minHeight: '100vh', background: '#050f0a', fontFamily: "'Lato', monospace", color: missionGreen, paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid rgba(0,255,136,0.15)`, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/journey" style={{ color: 'rgba(0,255,136,0.5)', fontSize: '0.75rem', letterSpacing: '0.15em', textDecoration: 'none' }}>
          ← JOURNEY
        </Link>
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(0,255,136,0.5)' }}>DAY 11 · AUG 12</span>
      </div>

      <div className="scanline" style={{ padding: '40px 24px', maxWidth: '720px', margin: '0 auto' }}>
        {/* Title */}
        <div className="animate-fade-up text-center" style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: 'rgba(0,255,136,0.5)', marginBottom: '12px' }}>
            MISSION CONTROL · PARIS → TAHITI
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 300, color: missionGreen, margin: '0 0 8px', textShadow: `0 0 30px ${missionGreen}` }}>
            I'm Coming To You
          </h1>
          <p style={{ color: 'rgba(0,255,136,0.6)', fontSize: '0.9rem' }}>
            <MissionBlink>●</MissionBlink> MISSION ACTIVE
          </p>
        </div>

        {/* Status panels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'DEPARTURE', value: 'CDG · Paris Charles de Gaulle', sub: 'Charles de Gaulle Airport' },
            { label: 'ARRIVAL', value: 'PPT · Faa\'a International', sub: 'Papeete, Tahiti' },
            { label: 'FLIGHT', value: 'EDIT ME', sub: 'Update with your flight number' },
            { label: 'STATUS', value: 'EN ROUTE', sub: 'I am on my way to you' },
          ].map((item, i) => (
            <div
              key={i}
              className="animate-fade-up"
              style={{
                border: `1px solid rgba(0,255,136,0.2)`,
                borderRadius: '8px',
                padding: '16px',
                background: 'rgba(0,255,136,0.03)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(0,255,136,0.4)', margin: '0 0 6px' }}>{item.label}</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: missionGreen }}>{item.value}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(0,255,136,0.5)', margin: 0 }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* FlightRadar link */}
        <div
          className="animate-fade-up delay-400 mission-glow"
          style={{
            border: `1px solid rgba(0,255,136,0.4)`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            background: 'rgba(0,255,136,0.04)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '12px', color: 'rgba(0,255,136,0.5)' }}>
            LIVE FLIGHT TRACKING
          </p>
          <a
            href="https://www.flightradar24.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              border: `1px solid ${missionGreen}`,
              borderRadius: '6px',
              color: '#050f0a',
              background: missionGreen,
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.15em',
              fontSize: '0.85rem',
              marginBottom: '12px',
              transition: 'all 0.3s ease',
            }}
          >
            ▶ TRACK FLIGHT
          </a>
          <br />
          <span style={{ fontSize: '0.72rem', color: 'rgba(0,255,136,0.4)' }}>
            Open FlightRadar24 and enter your flight number to track in real time
          </span>
        </div>

        {/* Emotional message */}
        <div
          className="animate-fade-up delay-600"
          style={{
            border: '1px solid rgba(0,255,136,0.1)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            background: 'rgba(0,255,136,0.02)',
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', lineHeight: 1.8, color: 'rgba(0,255,136,0.9)', margin: '0 0 24px', fontStyle: 'italic' }}>
            "Every message, every time zone, every long night apart was leading here.
            I am in the air above the Pacific, getting closer to you with every second.
            When this plane lands, the distance is finally, completely, over."
          </p>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', color: 'rgba(0,255,136,0.4)' }}>— somewhere between Paris and paradise</p>
        </div>

        {/* Arrived button */}
        {!arrived ? (
          <div className="text-center mt-8 animate-fade-up" style={{ marginTop: '32px' }}>
            <button
              onClick={() => setArrived(true)}
              style={{
                background: 'none',
                border: '1px solid rgba(0,255,136,0.3)',
                borderRadius: '6px',
                padding: '12px 32px',
                color: 'rgba(0,255,136,0.5)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
              }}
            >
              I ARRIVED ▶
            </button>
          </div>
        ) : (
          <div className="animate-fade-in text-center" style={{ marginTop: '32px', padding: '32px', border: '1px solid rgba(0,255,136,0.5)', borderRadius: '12px' }}>
            <p style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontFamily: "'Cormorant Garamond', serif", margin: '0 0 12px', color: missionGreen }}>
              🎉 Mission Complete
            </p>
            <p style={{ color: 'rgba(0,255,136,0.7)', margin: 0, lineHeight: 1.7 }}>
              We are in the same place.<br />
              Same sky. Same air.<br />
              Finally, finally together.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════════ */
