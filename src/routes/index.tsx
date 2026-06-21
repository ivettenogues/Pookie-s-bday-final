import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Countdown } from '@/components/Countdown'
export const Route = createFileRoute('/')({
component: HomePage,
})
const FLIGHT_DATE = new Date('2026-08-12T10:00:00Z')

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
<p style={{ color: 'var(--gold)', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '16px' }}>
🎂 Happy Birthday 🎂
</p>
<h2
className="font-romantic"
style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-light)', marginBottom: '24px', lineHeight: 1.2 }}
>
10 days to go!
</h2>
<p style={{ color: 'var(--sand)', lineHeight: 1.85, fontSize: '1rem', marginBottom: '36px' }}>
Today we are celebrating! Not only is it your birthday, it's also the final countdown until I fly to Tahiti! Officially only ten days left to go, and for that I have prepared ten little surprises for you, one for each day until we meet again hihi 
<br /><br />
I love you and I can't wait to see you again 💛
</p>
<button
onClick={onClose}
style={{
padding: '14px 40px',
background: 'linear-gradient(135deg, rgba(200,160,80,0.2) 0%, rgba(200,160,80,0.1) 100%)',
border: '1px solid rgba(200,160,80,0.5)',
borderRadius: '50px',
color: 'var(--gold-light)',
fontFamily: "'Cormorant Garamond', serif",
fontSize: '1.05rem',
cursor: 'pointer',
letterSpacing: '0.08em',
          }}
>
Close ✦
</button>
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
<p className="animate-fade-up font-script text-lg mb-3" style={{ color: 'var(--gold)', animationDelay: '0.1s' }}>
Paris → Tahiti
</p>
<h1 className="animate-fade-up font-romantic text-center mb-2" style={{ fontSize: 'clamp(2.8rem, 9vw, 6rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--text-light)', animationDelay: '0.25s' }}>
Vers Toi
</h1>
<p className="animate-fade-up font-romantic italic mb-10" style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', color: 'var(--text-muted)', animationDelay: '0.4s' }}>
Countdown to the day I fly to you
</p>
<div className="animate-fade-up flex items-center gap-4 mb-10" style={{ animationDelay: '0.55s' }}>
<div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
<span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>✦</span>
<div style={{ flex: 1, height: '1px', background: 'rgba(200,160,80,0.25)' }} />
</div>
<div className="animate-fade-up mb-2" style={{ animationDelay: '0.7s' }}>
<Countdown targetDate={FLIGHT_DATE} />
</div>
<p className="animate-fade-up mb-8" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', animationDelay: '0.8s' }}>
Until August 12, 2026
</p>

{/* Start Here button */}
<div className="animate-fade-up mb-10" style={{ animationDelay: '0.9s' }}>
<button
onClick={() => setShowModal(true)}
style={{
display: 'inline-block',
padding: '14px 40px',
background: 'linear-gradient(135deg, rgba(217,110,85,0.18) 0%, rgba(217,110,85,0.08) 100%)',
border: '1px solid rgba(217,110,85,0.5)',
borderRadius: '50px',
color: '#e8a090',
fontFamily: "'Cormorant Garamond', serif",
fontSize: '1.05rem',
fontWeight: 400,
letterSpacing: '0.1em',
cursor: 'pointer',
transition: 'all 0.4s ease',
          }}
onMouseEnter={e => {
const t = e.currentTarget as HTMLElement
t.style.background = 'linear-gradient(135deg, rgba(217,110,85,0.32) 0%, rgba(217,110,85,0.16) 100%)'
t.style.borderColor = 'rgba(217,110,85,0.85)'
t.style.transform = 'translateY(-2px)'
t.style.boxShadow = '0 10px 30px rgba(217,110,85,0.2)'
          }}
onMouseLeave={e => {
const t = e.currentTarget as HTMLElement
t.style.background = 'linear-gradient(135deg, rgba(217,110,85,0.18) 0%, rgba(217,110,85,0.08) 100%)'
t.style.borderColor = 'rgba(217,110,85,0.5)'
t.style.transform = 'translateY(0)'
t.style.boxShadow = 'none'
          }}
>
Start Here ✦
</button>
</div>

{/* Journey button */}
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
Begin the Journey ✦
</Link>
</div>

<p className="animate-fade-up mt-8 font-romantic italic" style={{ fontSize: '0.95rem', color: 'rgba(176,196,216,0.6)', animationDelay: '1.1s' }}>
16 537 km between us · not for long
</p>
</div>

<WaveLayer opacity={0.4} delay="0s" color="#0f3050" />
<WaveLayer opacity={0.25} delay="-4s" color="#1e5f82" />

{showModal && <BirthdayModal onClose={() => setShowModal(false)} />}
</div>
  )
}