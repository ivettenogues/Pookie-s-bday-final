import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Countdown } from '@/components/Countdown'

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Target: Aug 12, 2026 at 12:00 Paris time (CEST = UTC+2)
const FLIGHT_DATE = new Date('2026-08-12T10:00:00Z') // 12:00 Paris = 10:00 UTC

function StarField() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = ''
    const count = 80
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div')
      const size = Math.random() * 2.5 + 0.5
      star.className = 'star'
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 85}%;
        animation-duration: ${2 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${0.3 + Math.random() * 0.7};
      `
      el.appendChild(star)
    }
  }, [])

  return <div ref={ref} className="absolute inset-0 pointer-events-none" />
}

function WaveLayer({ opacity, delay, color }: { opacity: number; delay: string; color: string }) {
  return (
    <div className="wave-container" style={{ animationDelay: delay }}>
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className={delay === '0s' ? 'wave-layer-1' : 'wave-layer-2'}
      >
        <path
          d="M0,40 C200,10 400,70 600,40 C800,10 1000,70 1200,40 L1200,80 L0,80 Z"
          fill={color}
          fillOpacity={opacity}
        />
      </svg>
    </div>
  )
}

function HomePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #0f3050 0%, #071828 60%, #040e1a 100%)',
      }}
    >
      <StarField />

      {/* Glow orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(30,95,130,0.25) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Small label */}
        <p
          className="animate-fade-up font-script text-lg mb-3"
          style={{ color: 'var(--gold)', animationDelay: '0.1s' }}
        >
          Paris → Tahiti
        </p>

        {/* Title */}
        <h1
          className="animate-fade-up font-romantic text-center mb-2"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: 'var(--text-light)',
            animationDelay: '0.25s',
          }}
        >
          Vers Toi
        </h1>

        <p
          className="animate-fade-up font-romantic italic mb-10"
          style={{
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            color: 'var(--text-muted)',
            animationDelay: '0.4s',
          }}
        >
          Countdown to the day I fly to you
        </p>

        {/* Divider */}
        <div
          className="animate-fade-up flex items-center gap-4 mb-10"
          style={{ animationDelay: '0.55s' }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
          <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>✦</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
        </div>

        {/* Countdown */}
        <div className="animate-fade-up mb-2" style={{ animationDelay: '0.7s' }}>
          <Countdown targetDate={FLIGHT_DATE} />
        </div>

        <p
          className="animate-fade-up mb-12"
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            animationDelay: '0.8s',
          }}
        >
          Until August 12, 2026
        </p>

        {/* Enter button */}
        <div className="animate-fade-up" style={{ animationDelay: '1.0s' }}>
          <Link
            to="/journey"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              background: 'linear-gradient(135deg, rgba(200,160,80,0.15) 0%, rgba(200,160,80,0.08) 100%)',
              border: '1px solid rgba(200,160,80,0.5)',
              borderRadius: '50px',
              color: 'var(--gold-light)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={(e) => {
              const t = e.currentTarget as HTMLElement
              t.style.background =
                'linear-gradient(135deg, rgba(200,160,80,0.3) 0%, rgba(200,160,80,0.15) 100%)'
              t.style.borderColor = 'rgba(200,160,80,0.9)'
              t.style.transform = 'translateY(-2px)'
              t.style.boxShadow = '0 10px 30px rgba(200,160,80,0.2)'
            }}
            onMouseLeave={(e) => {
              const t = e.currentTarget as HTMLElement
              t.style.background =
                'linear-gradient(135deg, rgba(200,160,80,0.15) 0%, rgba(200,160,80,0.08) 100%)'
              t.style.borderColor = 'rgba(200,160,80,0.5)'
              t.style.transform = 'translateY(0)'
              t.style.boxShadow = 'none'
            }}
          >
            Begin the Journey ✦
          </Link>
        </div>

        {/* Distance note */}
        <p
          className="animate-fade-up mt-8 font-romantic italic"
          style={{
            fontSize: '0.95rem',
            color: 'rgba(176,196,216,0.6)',
            animationDelay: '1.1s',
          }}
        >
          16 537 km between us · not for long
        </p>
      </div>

      {/* Wave layers at bottom */}
      <WaveLayer opacity={0.4} delay="0s" color="#0f3050" />
      <WaveLayer opacity={0.25} delay="-4s" color="#1e5f82" />
    </div>
  )
}
