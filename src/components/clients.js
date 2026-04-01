'use client'
import React from 'react'
import '../styles/clients.css'

const brands = [
  'Utopia Vip Travel',
  'Greenhall Capital',
  'Medikids',
  'Litox',
  'Padel Rocha',
  'Art Gallery Vake',
  'Davson',
  'Your Hood',
  'Motors N1',
]

function Clients() {
  const doubled = [...brands, ...brands]

  return (
    <div className='clients-container'>
      <div className="clients-header">
        <h2 className='clients-h2'>Our Clients</h2>
        <span className='clients-description'>trusted by leading brands in georgia and beyond</span>
      </div>
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {doubled.map((brand, i) => (
            <div className="brand-card" key={i}>
              <span className='brand-name'>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Clients