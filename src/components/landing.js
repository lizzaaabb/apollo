'use client'
import React from 'react'
import '../styles/landing.css'
import ThreeBackground from './three'
import Main from '../components/main'
import Services from '../components/services'

function Landing() {
  return (
    <>
      <ThreeBackground />

      <div className='landing-container'>
        <Main/>
        <Services />
      </div>
    </>
  )
}

export default Landing