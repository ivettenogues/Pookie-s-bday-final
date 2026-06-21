import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: HomePage,
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

function BirthdayModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7,24,40,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '48px 40px',
          background: 'rgba(200,160,80,0.07)',
          border: '1px solid rgba(200,160,80,0.35)',
          borderRadius: '24px',
          textAlign: 'center',
        }}
        onClick={e => e.stopPropagation()}
      >
    
        <h2 className="font-romantic" style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '24px', lineHeight: 1.2 }}>
          Hello my love!
        </h2>
        <p style={{ color: 'var(--sand)', lineHeight: 1.85, fontSize: '1rem', marginBottom: '36px' }}>
          Time has passed and we will finally be seeing each other again soon. This time, in Tahiti! <br /> To celebrate you, your birthday, and the final countdown before we reunite, I made this little journey for you - starting from your birthday. <br />Ten days of little surprises that I hope will make you smile and remind you of how much I love you.  
          <br /><br />
          Je t'aime fort et j'ai hâte de te retrouver 💛
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '50px',
              color: 'var(--text-muted)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1rem',
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            Close
          </button>
          <Link
            to="/welcome"
            onClick={onClose}
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              background: 'linear-gradient(135deg, rgba(200,160,80,0.2) 0%, rgba(200,160,80,0.1) 100%)',
              border: '1px solid rgba(200,160,80,0.5)',
              borderRadius: '50px',
              color: 'var(--gold-light)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.05rem',
              textDecoration: 'none',
              letterSpacing: '0.08em',
            }}
          >
            Begin the Journey ✦
          </Link>
        </div>
      </div>
    </div>
  )
}

function HomePage() {
  const [showModal, setShowModal] = useState(false)
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f3050 0%, #071828 60%, #040e1a 100%)' }}
    >
      <StarField />
      <div className="absolute pointer-events-none" style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,95,130,0.25) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }} />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Top dedication */}
        <p className="animate-fade-up font-romantic italic mb-10" style={{ fontSize: '0.85rem', color: 'rgba(176,196,216,0.5)', animationDelay: '0.05s', letterSpacing: '0.08em' }}>
          To my best friend and love of my life
        </p>

        {/* Main title */}
        <h1 className="animate-fade-up font-romantic text-center mb-12" style={{ lineHeight: 1.05, color: 'var(--text-light)', animationDelay: '0.25s' }}>
          <span style={{ display: 'block', fontSize: 'clamp(1.4rem, 4.5vw, 2.4rem)', fontWeight: 300, opacity: 0.85, marginBottom: '8px' }}>
            A Journey to
          </span>
          <span style={{ display: 'block', fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 400, lineHeight: 0.95 }}>
            Tahiti
          </span>
        </h1>

        {/* Divider */}
<div className="animate-fade-up flex items-center gap-4 mb-10" style={{ animationDelay: '0.55s' }}>
  <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
  <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>✦</span>
  <div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
</div>

        {/* Start Here button */}
        <div className="animate-fade-up mb-4" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={() => setShowModal(true)}
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
              cursor: 'pointer',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={e => {
              const t = e.currentTarget as HTMLElement
              t.style.background = 'linear-gradient(135deg, rgba(200,160,80,0.3) 0%, rgba(200,160,80,0.15) 100%)'
              t.style.borderColor = 'rgba(200,160,80,0.9)'
              t.style.transform = 'translateY(-2px)'
              t.style.boxShadow = '0 10px 30px rgba(200,160,80,0.2)'
            }}
            onMouseLeave={e => {
              const t = e.currentTarget as HTMLElement
              t.style.background = 'linear-gradient(135deg, rgba(200,160,80,0.15) 0%, rgba(200,160,80,0.08) 100%)'
              t.style.borderColor = 'rgba(200,160,80,0.5)'
              t.style.transform = 'translateY(0)'
              t.style.boxShadow = 'none'
            }}
          >
            Start Here ✦
          </button>
        </div>

        {/* Skip link */}
        <div className="animate-fade-up" style={{ animationDelay: '0.9s' }}>
          <Link
            to="/journey"
            style={{
              color: 'rgba(176,196,216,0.35)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            press here to skip to main page
          </Link>
        </div>

      </div>

      <WaveLayer opacity={0.4} delay="0s" color="#0f3050" />
      <WaveLayer opacity={0.25} delay="-4s" color="#1e5f82" />

      {showModal && <BirthdayModal onClose={() => setShowModal(false)} />}
    </div>
  )
}