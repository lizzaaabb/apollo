'use client'
import React from 'react'
import '../styles/services.css'
import Ball from '../components/ball'

function Services() {
  return (
    <div className='services-container'>
      <div className="service-header">
        <h2 className='service-h2'>Services</h2>
        <span className='service-description'>streamline your digital strategy</span>
      </div>

      <div className="service-wrapper">
        <div className="service-card">
          <div className="service-icon-wrap">
            <Ball />
          </div>
          <h3 className='service-card-header'>Web Development</h3>
          <p className='service-card-description'>We create stunning, responsive websites that drive results. Our team of experts will work with you to build a custom website that meets your unique needs and goals.</p>
        </div>

        <div className="service-card">
          <div className="service-icon-wrap">
            <Ball />
          </div>
          <h3 className='service-card-header'>E-commerce Solutions</h3>
          <p className='service-card-description'>Our e-commerce solutions are designed to help you sell more online. We offer a range of services, payment gateway integration, and inventory management.</p>
        </div>

        <div className="service-card">
          <div className="service-icon-wrap">
            <Ball />
          </div>
          <h3 className='service-card-header'>SEO Optimization</h3>
          <p className='service-card-description'>Our SEO optimization services will help your website rank higher in search engine results, driving more traffic and increasing your online visibility.</p>
        </div>

        <div className="service-card">
          <div className="service-icon-wrap">
            <Ball />
          </div>
          <h3 className='service-card-header'>Content Creation</h3>
          <p className='service-card-description'>Our content creation services will help you create engaging, high-quality content that resonates with your target audience and drives results.</p>
        </div>
      </div>
    </div>
  )
}

export default Services