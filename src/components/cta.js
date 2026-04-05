'use client'
import React, { useEffect, useRef } from 'react'
import Apollo from '../components/apollo'
import '../styles/cta.css'

const PHONE_HREF = 'tel:+995574065469'
const WA_HREF    = 'https://wa.me/995574065469'
const INSTA_HREF = 'https://instagram.com/apollocreations_net'
const FB_HREF    = '#'
const MAIL_HREF  = 'mailto:hello@apollocreations.net'
const PHONE      = '+995 574 06 54 69'

function Soc({ href, label, target, children }) {
  return (
    <a href={href} target={target} rel={target ? 'noreferrer' : undefined}
       aria-label={label} className="soc">{children}</a>
  )
}

const IcInsta = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)
const IcFb = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
)
const IcWa = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.836L.057 23.571a.75.75 0 00.92.921l5.656-1.453A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.953-1.355l-.355-.211-3.684.946.977-3.565-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
)
const IcMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
)

export default function CTA() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="ctaf" ref={sectionRef}>

      <div className="glow" aria-hidden />

      <div className="grid">

        <div className="left anim-left">
          <span className="eyebrow"><span className="dot" />Start a project</span>
          <h2 className="headline">
            <span className="dim">Ready to build</span>
            <span className="dim">something</span>
            <em>unforgettable?</em>
          </h2>
          <p className="sub">
            From bold identities to immersive 3D worlds —
            we turn ideas into experiences people remember.
          </p>
          <div className="actions">
            <a href={WA_HREF} target="_blank" rel="noreferrer" className="btn-solid">Message on WhatsApp</a>
            <a href={PHONE_HREF} className="btn-ghost">Call Us</a>
          </div>
        </div>

        <div className="model-wrap">
          <Apollo />
        </div>

        <div className="right anim-right">
          <div className="glass-card">
            <p className="card-label">Our Promise</p>
            <p className="card-copy">
              Your vision, built in <strong>3D</strong>.<br />
              Not a template. Not a trend.<br />
              Something <strong>entirely yours.</strong>
            </p>
            <div className="divider" />
            <div className="stats">
              <div className="stat"><span className="sn">48h</span><span className="sl">First draft</span></div>
              <div className="stat"><span className="sn">100%</span><span className="sl">Custom</span></div>
              <div className="stat"><span className="sn">∞</span><span className="sl">Revisions</span></div>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-info">
              <a href={PHONE_HREF} className="cphone">{PHONE}</a>
              <a href={MAIL_HREF}  className="cemail">hello@apollocreations.net</a>
            </div>
            <div className="socials">
              <Soc href={INSTA_HREF} label="Instagram" target="_blank"><IcInsta /></Soc>
              <Soc href={FB_HREF}    label="Facebook"  target="_blank"><IcFb /></Soc>
              <Soc href={WA_HREF}    label="WhatsApp"  target="_blank"><IcWa /></Soc>
              <Soc href={MAIL_HREF}  label="Email"><IcMail /></Soc>
            </div>
          </div>

          <p className="trust">Trusted by businesses across Georgia &amp; Europe</p>
        </div>

      </div>

      <footer className="bar anim-bar">
        <span className="f-brand">Apollo Creations</span>
        <span className="f-copy">© {new Date().getFullYear()} All rights reserved.</span>
      </footer>

    </section>
  )
}