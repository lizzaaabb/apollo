'use client'
import React from 'react'
import '../styles/landing.css'
import ThreeBackground from './three'
import Main from '../components/main'
import Services from '../components/services'
import Clients from '../components/clients'
import Projects from './projects'
import Pricing from './pricing'
import CTA from './cta'

function Landing() {
  return (
    <>
      <ThreeBackground />

      <div className='landing-container'>
        <Main/>
        <Services />
        <Clients />
        <Projects />
        <Pricing />
        <CTA />
      </div>
    </>
  )
}

export default Landing