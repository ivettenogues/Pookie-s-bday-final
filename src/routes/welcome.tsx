import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/welcome')({
  component: WelcomePage,
})

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
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className={delay === '0s' ? 'wave-layer-1' : 'wave-layer-2'}>
        <path d="M0,40 C200,10 400,70 600,40 C800,10 1000,70 1200,40 L1200,80 L0,80 Z" fill={color} fillOpacity={opacity} />
      </svg>
    </div>
  )
}

function WelcomePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0f3050 0%, #071828 60%, #040e1a 100%)',
        padding: '24px',
      }}
    >
      <StarField />
      <div className="absolute pointer-events-none" style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,95,130,0.25) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }} />

      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        <p
          className="animate-fade-up font-script"
          style={{ color: 'var(--gold)', fontSize: '1.1rem', marginBottom: '20px', animationDelay: '0.1s' }}
        >
          Before we begin
        </p>

        <h1
          className="animate-fade-up font-romantic"
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.2rem)',
            fontWeight: 300,
            color: 'var(--text-light)',
            marginBottom: '28px',
            lineHeight: 1.2,
            animationDelay: '0.25s',
          }}
        >
          How the Polynesians Found Their Way
        </h1>

        <p
          className="animate-fade-up font-romantic italic"
          style={{
            color: 'var(--text-muted)',
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.8,
            marginBottom: '40px',
            animationDelay: '0.4s',
          }}
        >
          {/* Placeholder — write the real story here */}
          Long before instruments, Polynesian navigators crossed thousands of
          kilometers of open ocean guided only by the stars, the swell of the
          water, and the flight of birds. They always found their way home.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '0.55s' }}>
          <Link
            to="/countdown"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
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
          >
            Next →
          </Link>
        </div>
      </div>

      <WaveLayer opacity={0.4} delay="0s" color="#0f3050" />
      <WaveLayer opacity={0.25} delay="-4s" color="#1e5f82" />
    </div>
  )
}
