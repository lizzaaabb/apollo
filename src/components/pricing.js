'use client'
import ShapeCanvas from './ShapeCanvas'
import '../styles/pricing.css'

const CONTENT = [
  {
    category: 'Graphic Design',
    items: [
      { title: 'Simple Logo',       price: '₾50',    description: 'Clean, minimal logo to represent your brand identity.',                          shape: 'tetrahedron',  solidColor: 0xf0a882, emissive: 0xb05030 },
      { title: 'Professional Logo', price: '₾300',   description: 'Detailed, unique logo with full concept and multiple variations.',               shape: 'octahedron',   solidColor: 0x9adfc0, emissive: 0x2a9060 },
      { title: 'Brand Identity',    price: '₾600',   description: 'Logo, color palette, typography and full usage guidelines.',                     shape: 'icosahedron',  solidColor: 0xe0a0c8, emissive: 0xa04878 },
      { title: 'Brand Book',        price: '₾1,200', description: 'Full brand system — print and digital ready, complete style guide.',             shape: 'dodecahedron', solidColor: 0xa8c4f0, emissive: 0x3058a8 },
    ],
  },
  {
    category: 'Web Development',
    items: [
      { title: 'Landing Page',      price: '₾700',   description: 'Single page, fast and modern. Perfect for showcasing a product or service.',    shape: 'tetrahedron',  solidColor: 0xc8a8f0, emissive: 0x7030c0 },
      { title: 'Business Website',  price: '₾1,500', description: 'Multi-page informational website. +₾100 per additional page.',                  shape: 'octahedron',   solidColor: 0xa0cce8, emissive: 0x2868a0 },
      { title: 'Catalog Website',   price: '₾1,500', description: 'Product or service catalog without payment integration.',                        shape: 'icosahedron',  solidColor: 0xf0d090, emissive: 0xa07820 },
      { title: 'E-Commerce',        price: '₾2,700', description: 'Full online store with payment integration, cart and order management.',         shape: 'dodecahedron', solidColor: 0xb8e8a0, emissive: 0x48a028 },
    ],
  },
]

const WHATSAPP = '574065469'

function PricingCard({ item }) {
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
        <ShapeCanvas
          shape={item.shape}
          solidColor={item.solidColor}
          emissive={item.emissive}
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
        <h2 className='pricing-title'>Simple pricing</h2>
        <p className='pricing-subtitle'>No hidden fees. Every project starts with a free consultation.</p>
      </div>

      {CONTENT.map((section) => (
        <div key={section.category} className='pricing-section'>
          <div className='pricing-section-label'>
            <span>{section.category}</span>
            <div className='pricing-section-line' />
          </div>
          <div className='pricing-grid'>
            {section.items.map((item) => (
              <PricingCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}