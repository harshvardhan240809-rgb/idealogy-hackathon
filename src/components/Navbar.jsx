import { Link, NavLink } from 'react-router-dom'
import { MapPinned, Menu, ShieldAlert, WifiOff, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Emergency Map' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/impact', label: 'Impact' },
  { to: '/about', label: 'About' },
  { to: '/dashboard', label: 'Dashboard' }
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return (
    <>
      <header className="topbar">
        {!online && (
          <div className="connection-banner">
            <WifiOff size={14} /> Connection limited — showing last available information.
          </div>
        )}
        <nav className="nav container" aria-label="Main navigation">
          <Link to="/" className="brand" aria-label="VishPath home">
            <span className="brand-mark"><MapPinned size={18} /></span>
            <div>
              <strong>VishPath</strong>
              <small>The Golden Hour Atlas</small>
            </div>
          </Link>

          <div className="nav-links desktop-only">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <button type="button" className="demo-mode-toggle" onClick={() => setDemoOpen(true)}>
              DEMO DATA
            </button>
            <span className="network-pill">{online ? <><Wifi size={14} /> Online</> : <><WifiOff size={14} /> Offline</>}</span>
            <Link to="/map" className="btn btn-primary">Emergency Map</Link>
            <button type="button" className="menu-toggle mobile-only" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
              {mobileOpen ? <span>×</span> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-link" onClick={() => setMobileOpen(false)}>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {demoOpen && (
        <div className="modal-backdrop" onClick={() => setDemoOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon"><ShieldAlert size={18} /></div>
              <h3>Demo mode</h3>
            </div>
            <p>
              This prototype uses sample facility data for demonstration. Verification status shown here is not a real medical availability guarantee.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setDemoOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
