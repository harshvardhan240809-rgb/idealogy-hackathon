import { Suspense, lazy } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'

const HomePage = lazy(() => import('./pages/HomePage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const FacilityPage = lazy(() => import('./pages/FacilityPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const ImpactPage = lazy(() => import('./pages/ImpactPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const VerificationLogPage = lazy(() => import('./pages/VerificationLogPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

function RouteFallback() {
  return (
    <div className="page-shell container">
      <div className="route-loading">
        <div className="skeleton-card">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>VishPath</strong>
          <p>Emergency referral mapping for rural and tribal areas.</p>
        </div>
        <div className="footer-links">
          <Link to="/map">Map</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/verification-log">History</Link>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/facility/:id" element={<FacilityPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verification-log" element={<VerificationLogPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Link to="/map" className="emergency-button">Emergency Map</Link>
      </div>
    </BrowserRouter>
  )
}
