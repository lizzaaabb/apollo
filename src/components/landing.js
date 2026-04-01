'use client'
import React from 'react'
import '../styles/landing.css'
import ThreeBackground from './three'
import Main from '../components/main'

function Landing() {
  return (
    <>
      <ThreeBackground />

      <div className='landing-container'>
        <Main/>
      </div>
    </>
  )
}

export default Landing