'use client'
import React, { useState } from 'react'
import '../styles/cta.css'

const PHONE      = '+995 574 06 54 69'
const PHONE_HREF = 'tel:+995574065469'
const WA_HREF    = 'https://wa.me/995574065469'
const INSTA_HREF = 'https://instagram.com/apollocreations_net'
const FB_HREF    = '#'
const MAIL_HREF  = 'mailto:hello@apollocreations.net'

function SocBtn({ href, label, target, children }) {
  const [h, setH] = useState(false)
  return (
    <a
      href={href} target={target} rel={target ? 'noreferrer' : undefined}
      aria-label={label}
      className={`soc-btn${h ? ' hov' : ''}`}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    >
      {children}
    </a>
  )
}

export default function CTA() {
  return (
    <div className='cta-root'>

      <div className='grid-lines' aria-hidden='true'>
        <span /><span /><span /><span />
      </div>

      {/* ══ LEFT ══ */}
      <div className='cta-left'>

        <div className='cta-tag'>
          <span className='tag-dot' />
          Start a project
        </div>

        <h2 className='cta-headline'>
          <span className='line-a'>Grow your</span>
          <span className='line-b'>Business</span>
          <span className='line-c'>With Apollo</span>
        </h2>

        <p className='cta-sub'>
          From a bold logo to a full e-commerce store —
          let's build something that works as hard as you do.
        </p>

        <div className='cta-btns'>
          <a href={WA_HREF} target='_blank' rel='noreferrer' className='btn-primary'>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/>
              <path d='M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.836L.057 23.571a.75.75 0 00.92.921l5.656-1.453A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.953-1.355l-.355-.211-3.684.946.977-3.565-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z'/>
            </svg>
            Message on WhatsApp
          </a>
          <a href={PHONE_HREF} className='btn-ghost'>
            <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z'/>
            </svg>
            Call Us
          </a>
        </div>

      </div>

      {/* ══ RIGHT ══ */}
      <div className='cta-right'>

        {/* ── big promise stat ── */}
        <div className='stat-row'>
          <div className='stat'>
            <span className='stat-num'>48h</span>
            <span className='stat-label'>First draft delivered</span>
          </div>
          <div className='stat-div' />
          <div className='stat'>
            <span className='stat-num'>100%</span>
            <span className='stat-label'>Custom — no templates</span>
          </div>
          <div className='stat-div' />
          <div className='stat'>
            <span className='stat-num'>∞</span>
            <span className='stat-label'>Revisions until perfect</span>
          </div>
        </div>

        {/* ── contact card ── */}
        <div className='contact-card'>

          <p className='card-label'>Direct contact</p>

          <a href={PHONE_HREF} className='card-phone'>{PHONE}</a>
          <a href={MAIL_HREF}  className='card-email'>hello@apollocreations.net</a>

          <div className='card-divider' />

          <div className='card-bottom'>
            <div className='card-socials'>
              <SocBtn href={INSTA_HREF} label='Instagram' target='_blank'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='2' y='2' width='20' height='20' rx='5'/>
                  <circle cx='12' cy='12' r='4'/>
                  <circle cx='17.5' cy='6.5' r='0.5' fill='currentColor' stroke='none'/>
                </svg>
              </SocBtn>
              <SocBtn href={FB_HREF} label='Facebook' target='_blank'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'/>
                </svg>
              </SocBtn>
              <SocBtn href={WA_HREF} label='WhatsApp' target='_blank'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/>
                  <path d='M12 0C5.373 0 0 5.373 0 12c0 2.118.554 4.107 1.523 5.836L.057 23.571a.75.75 0 00.92.921l5.656-1.453A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.953-1.355l-.355-.211-3.684.946.977-3.565-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z'/>
                </svg>
              </SocBtn>
              <SocBtn href={MAIL_HREF} label='Email'>
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='2' y='4' width='20' height='16' rx='2'/>
                  <path d='M2 7l10 7 10-7'/>
                </svg>
              </SocBtn>
            </div>
            <a href={WA_HREF} target='_blank' rel='noreferrer' className='card-cta-arrow'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M7 17L17 7M7 7h10v10'/>
              </svg>
            </a>
          </div>

        </div>

        {/* ── trust line ── */}
        <p className='trust-line'>
          Trusted by businesses across Georgia &amp; Europe
        </p>

      </div>

      {/* ══ FOOTER BAR ══ */}
      <footer className='cta-footer'>
        <span className='f-brand'>Apollo Creations</span>
        <span className='f-copy'>© {new Date().getFullYear()} All rights reserved.</span>
      </footer>

    </div>
  )
}