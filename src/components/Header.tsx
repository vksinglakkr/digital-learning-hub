import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Menu, X, Info } from 'lucide-react'

interface HeaderProps {
  onNotifyComingSoon?: (featureName: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onNotifyComingSoon }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (location.pathname === '/') {
      const element = document.querySelector('#about')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/copyright')
      }
    } else {
      navigate('/#about')
    }
  }

  const handleInfoClick = () => {
    if (onNotifyComingSoon) {
      onNotifyComingSoon('Digital Learning Hub — Interactive Learning for Real Skills')
    } else {
      navigate('/copyright')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <Link 
            to="/" 
            onClick={handleHomeClick}
            className="flex items-center gap-3 group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight block">
                Digital Learning Hub
              </span>
              <span className="text-[10px] sm:text-[11px] text-teal-700 font-bold tracking-wider uppercase block -mt-1">
                INTERACTIVE LEARNING
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-3">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/' 
                  ? 'bg-teal-50 text-teal-800' 
                  : 'text-slate-600 hover:text-teal-700'
              }`}
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={handleAboutClick}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
            >
              About
            </a>
            <button
              onClick={handleInfoClick}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="About Digital Learning Hub"
              aria-label="About Digital Learning Hub"
            >
              <Info className="w-4 h-4" />
            </button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={handleInfoClick}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              title="About Digital Learning Hub"
              aria-label="About Digital Learning Hub"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={(e) => {
              setMobileMenuOpen(false)
              handleHomeClick(e)
            }}
            className={`block px-3 py-2 rounded-lg text-base font-semibold ${
              location.pathname === '/' 
                ? 'text-teal-800 bg-teal-50' 
                : 'text-slate-700 hover:bg-slate-50 hover:text-teal-700'
            }`}
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={handleAboutClick}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700"
          >
            About
          </a>
        </div>
      )}
    </header>
  )
}
