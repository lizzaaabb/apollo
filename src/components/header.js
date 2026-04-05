'use client'
import React, { useState } from 'react'
import '../styles/header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu  = () => setMenuOpen(false)

  return (
    <>
      <div className='header-container'>
        <div className='logo-container'>
          <h1 className='logo'>Apollo Creations</h1>
        </div>

        {/* Desktop nav */}
        <div className='nav-links'>
          <a href='#' className='nav-link'>Home</a>
          <a href='#' className='nav-link'>Projects</a>
          <a href='#' className='nav-link'>About</a>
          <a href='#' className='nav-link'>Contact</a>
        </div>

        {/* Burger button */}
        <button
          className={`burger ${menuOpen ? 'burger--open' : ''}`}
          onClick={toggleMenu}
          aria-label='Toggle menu'
        >
          <span className='burger__line' />
          <span className='burger__line' />
          <span className='burger__line' />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'sidebar--open' : ''}`}>
        <div className='sidebar__header'>
          <h2 className='sidebar__logo'>Apollo Creations</h2>
          <button className='sidebar__close' onClick={closeMenu} aria-label='Close menu'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path d='M18 6L6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round'/>
            </svg>
          </button>
        </div>

        <nav className='sidebar__nav'>
          {['Home', 'Projects', 'About', 'Contact'].map((item, i) => (
            <a
              key={item}
              href='#'
              className='sidebar__link'
              style={{ animationDelay: menuOpen ? `${i * 0.07}s` : '0s' }}
              onClick={closeMenu}
            >
              <span className='sidebar__link-num'>0{i + 1}</span>
              {item}
            </a>
          ))}
        </nav>

        <div className='sidebar__footer'>
          <p>© 2026 Apollo Creations</p>
        </div>
      </aside>
    </>
  )
}

export default Header