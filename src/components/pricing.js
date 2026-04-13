'use client'
import Crystal from '../components/crystals'
import '../styles/pricing.css'

const CRYSTALS = [
  { src: '/crystal1.glb' },
  { src: '/crystal2.glb' },
  { src: '/crystal6.glb', exposure: '1.4', environment: 'legacy' },
  { src: '/crystal4.glb' },
]

const ITEMS = [
  { title: 'Landing Page',     price: '₾700',   description: 'Single page, fast and modern. Perfect for showcasing a product or service.' },
  { title: 'Business Website', price: '₾1,500', description: 'Multi-page informational website. +₾100 per additional page.' },
  { title: 'Catalog Website',  price: '₾1,500', description: 'Product or service catalog without payment integration.' },
  { title: 'E-Commerce',       price: '₾2,700', description: 'Full online store with payment integration, cart and order management.' },
]

const WHATSAPP = '574065469'

function PricingCard({ item, crystal }) {
  return (
    <div className='pricing-card'>
      <div className='pricing-card-header'>
        <h3 className='pricing-card-title'>{item.title}</h3>
        <div className='pricing-card-price'>
          <span className='pricing-card-from'>from</span>
          <span className='pricing-card-amount'>{item.price}</span>
        </div>
      </div>
      <div className='pricing-card-shape'>
        <Crystal
          src={crystal.src}
          exposure={crystal.exposure}
          environment={crystal.environment}
        />
      </div>
      <div className='pricing-card-body'>
        <p className='pricing-card-desc'>{item.description}</p>
      </div>
      <div className='pricing-card-footer'>
        <a href={`https://wa.me/${WHATSAPP}`} target='_blank' rel='noreferrer' className='pricing-card-btn'>
          Get Started
        </a>
        <a href={`https://wa.me/${WHATSAPP}`} target='_blank' rel='noreferrer' className='pricing-card-arrow'>
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path d='M7 17L17 7M7 7h10v10' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <div className='pricing-wrapper'>
      <div className='pricing-header'>
        <span className='pricing-label'>Pricing</span>
        <h2 className='pricing-title'>Transparent pricing</h2>
        <p className='pricing-subtitle'>No hidden fees. Every project starts with a free consultation.</p>
      </div>
      <div className='pricing-grid'>
        {ITEMS.map((item, index) => (
          <PricingCard key={item.title} item={item} crystal={CRYSTALS[index]} />
        ))}
      </div>
    </div>
  )
}