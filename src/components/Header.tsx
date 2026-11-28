import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Menu, X, Info, ChevronDown, ShieldCheck, Mail, Calendar, BarChart3 } from 'lucide-react'

interface HeaderProps {
  onNotifyComingSoon?: (featureName: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onNotifyComingSoon }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false)
  const toolsDropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

            {/* Compact Helping Tools Dropdown */}
            <div className="relative" ref={toolsDropdownRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  toolsDropdownOpen || location.pathname.includes('/category/')
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
                aria-expanded={toolsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Helping Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Teaching & Learning Tools
                  </div>

                  <Link
                    to="/category/digital-banking?tab=capability"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">डिजिटल साथी (Digital Saathi)</div>
                      <div className="text-[11px] text-slate-500">4 आसान सवाल व बैंकिंग सुरक्षा</div>
                    </div>
                  </Link>

                  <Link
                    to="/category/gmail"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-rose-50 text-slate-800 hover:text-rose-950 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Gmail Mastery</div>
                      <div className="text-[11px] text-slate-500">36 ट्यूटोरियल्स व 4 गाइडेड प्रोजेक्ट्स</div>
                    </div>
                  </Link>

                  <Link
                    to="/category/calendar"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50 text-slate-800 hover:text-blue-950 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Calendar Mastery</div>
                      <div className="text-[11px] text-slate-500">समय नियोजन, शेड्यूलिंग व पोस्टर्स</div>
                    </div>
                  </Link>

                  <Link
                    to="/category/power-bi"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-amber-50 text-slate-800 hover:text-amber-950 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Power BI Mastery</div>
                      <div className="text-[11px] text-slate-500">डेटा विज़ुअलाइज़ेशन व स्लाइसर्स</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

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
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-4 space-y-2.5 shadow-lg">
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

          {/* Mobile Helping Tools Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Helping Tools
            </div>
            <div className="space-y-1 mt-1">
              <Link
                to="/category/digital-banking?tab=capability"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-950 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>डिजिटल साथी (Digital Saathi)</span>
              </Link>

              <Link
                to="/category/gmail"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-rose-950 hover:bg-rose-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Gmail Mastery</span>
              </Link>

              <Link
                to="/category/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-blue-950 hover:bg-blue-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Calendar Mastery</span>
              </Link>

              <Link
                to="/category/power-bi"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-amber-950 hover:bg-amber-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span>Power BI Mastery</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <a
              href="#about"
              onClick={handleAboutClick}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-teal-700"
            >
              About
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
