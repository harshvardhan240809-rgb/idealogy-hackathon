import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Clock3,
  Crosshair,
  ShieldCheck,
  TimerReset,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'
import useFacilities from '../hooks/useFacilities'

const platformBenefits = [
  { icon: ShieldCheck, title: 'Verified Facilities', desc: 'Freshly checked facility readiness from prompt calls and audits.', accent: 'green' },
  { icon: Clock3, title: 'Visible Timestamps', desc: 'Know precisely when each status was last validated.', accent: 'gold' },
  { icon: Activity, title: 'Clear Uncertainty', desc: 'Missing or unverified information stays visible and honest.', accent: 'grey' },
  { icon: TimerReset, title: 'Faster Referrals', desc: 'Route toward a stronger first-stop decision under pressure.', accent: 'red' }
]

const statusCards = [
  { tone: 'green', label: 'Verified recently', title: 'Recently checked information', note: 'Facility readiness has been confirmed in a recent review.' },
  { tone: 'amber', label: 'Aging', title: 'Verification is getting old', note: 'Information still exists but should be rechecked soon.' },
  { tone: 'red', label: 'Unavailable', title: 'Currently reported unavailable', note: 'The facility is reported as not currently suitable for this emergency use.' },
  { tone: 'grey', label: 'Unknown', title: 'Not enough verified information', note: 'Status remains unresolved and should not be hidden.' }
]

const whyPoints = [
  { title: 'Location', text: 'Where is the facility and how far away is it?' },
  { title: 'Readiness', text: 'Can it handle the emergency and which checks were completed?' },
  { title: 'Freshness', text: 'When was the information checked and how current is it?' }
]

const userGroups = [
  { title: 'Who it helps', items: ['Patients', 'Families', 'Farmers', 'Outdoor workers'] },
  { title: 'Who acts', items: ['ASHA workers', 'Frontline responders', 'Ambulance/referral staff'] },
  { title: 'Who keeps data current', items: ['Health facilities'] },
  { title: 'Who can partner', items: ['District health departments', 'State health departments', 'NGOs', 'Public-health teams'] }
]

const impactChain = ['Verified readiness', 'Fewer wrong first stops', 'Less lost time', 'Better chance of timely care']

const phaseTrack = ['PILOT', 'DISTRICT', 'STATE']

const missionPoints = ['Location', 'freshness', 'source', 'uncertainty']

function HomePage() {
  const { facilities, source } = useFacilities()
  const sourceLabel = source === 'mongodb' ? 'MongoDB' : source === 'demo' ? 'Demo data' : source === 'unavailable' ? 'Local fallback' : 'Browser storage'
  const totalFacilities = facilities.length
  const verifiedFacilities = facilities.filter((facility) => facility.status === 'VERIFIED').length
  const verifiedPercent = totalFacilities ? Math.round((verifiedFacilities / totalFacilities) * 100) : 0
  const districtStats = Object.values(facilities.reduce((districts, facility) => {
    const district = facility.district?.trim()
    if (!district) return districts
    if (!districts[district]) districts[district] = { name: district, total: 0, verified: 0 }
    districts[district].total += 1
    if (facility.status === 'VERIFIED') districts[district].verified += 1
    return districts
  }, {}))
    .sort((first, second) => second.total - first.total || first.name.localeCompare(second.name))
    .slice(0, 3)

  return (
    <div className="page-shell home-page-shell">
      <section className="hero-shell">
        <div className="container hero-section">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="hero-copy">
            <span className="eyebrow">Emergency referral intelligence</span>
            <h1>VishPath</h1>
            <h2>The Golden Hour Atlas</h2>
            <h3>Right Hospital. Right Time. More Lives.</h3>
            <p>Verified emergency referral mapping for rural and tribal Madhya Pradesh.</p>
            <div className="hero-actions">
              <Link to="/map" className="btn btn-primary large">Open Emergency Map</Link>
            </div>
            <div className="hero-trust-row" aria-label="Trust points">
              <span className="hero-trust-pill">Verified facility checks</span>
              <span className="hero-trust-pill">Live route guidance</span>
              <span className="hero-trust-pill">Rural-first design</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="hero-visual-panel" aria-label="Facility readiness dashboard">
            <div className="hero-panel-window">
              <div className="panel-header">
                <span>Facility records · {sourceLabel}</span>
              </div>

              <div className="panel-metrics">
                <div className="metric-card metric-primary">
                  <small>Districts represented</small>
                  <strong>{new Set(facilities.map((facility) => facility.district?.trim()).filter(Boolean)).size}</strong>
                </div>
                <div className="metric-card">
                  <small>Verified status</small>
                  <strong>{verifiedPercent}%</strong>
                </div>
              </div>

              <div className="signal-list">
                {districtStats.length ? districtStats.map((district) => {
                  const verifiedRate = Math.round((district.verified / district.total) * 100)
                  return (
                    <div className="signal-row" key={district.name}>
                      <span>{district.name}</span>
                      <div className="signal-bar" aria-label={`${verifiedRate}% of records in ${district.name} are marked verified`}>
                        <i style={{ width: `${verifiedRate}%` }} />
                      </div>
                    </div>
                  )
                }) : <p className="panel-empty">No facility records available.</p>}
              </div>

              <div className="alert-box">
                <ShieldCheck size={18} />
                <div>
                  <strong>Facilities marked verified</strong>
                  <span>{verifiedFacilities} of {totalFacilities} records</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="container hero-step-row">
          <div className="hero-step-item"><span>01</span><small>Find</small></div>
          <div className="hero-step-item"><span>02</span><small>Verify</small></div>
          <div className="hero-step-item"><span>03</span><small>Route</small></div>
        </div>
      </section>

      <section className="feature-grid container">
        {platformBenefits.map(({ icon: Icon, title, desc, accent }) => (
          <motion.article key={title} whileHover={{ y: -4 }} className={`feature-card ${accent}`}>
            <div className="feature-icon"><Icon size={18} /></div>
            <h4>{title}</h4>
            <p>{desc}</p>
          </motion.article>
        ))}
      </section>

      <section className="problem-section section-block">
        <div className="container problem-shell">
          <div className="section-heading center">
            <span className="eyebrow accent">The problem</span>
            <h2>The nearest hospital is not always the nearest capable hospital.</h2>
            <p>In an emergency, knowing where a facility is isn’t enough. You need to know what was recently verified.</p>
          </div>

          <div className="story-flow">
            <div className="story-steps">
              <div className="story-step-vertical"><span>TODAY</span><small>Snakebite</small></div>
              <div className="story-step-vertical"><small>Nearest hospital</small></div>
              <div className="story-step-vertical"><small>Readiness unknown</small></div>
              <div className="story-step-vertical"><small>Extra referral</small></div>
              <div className="story-step-vertical danger"><small>Lost time</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section section-block">
        <div className="container mission-shell">
          <div className="section-heading center">
            <span className="eyebrow">Our Mission</span>
            <h2>Make emergency referral information clearer, fresher and more accountable.</h2>
          </div>

          <div className="mission-layout">
            <div className="mission-visual">
              <div className="mission-image-shape">
                <div className="mini-rural-card" />
              </div>
            </div>

            <div className="mission-panel">
              <p>VishPath brings location, facility readiness, source, timestamp and uncertainty into one view.</p>
              <p>When emergencies unfold under time pressure, clear visibility matters. A facility can be nearby but still not be a strong first stop if readiness details are stale, missing or inconsistent.</p>
              <div className="mission-tags">
                {missionPoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block status-section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Facility status</span>
            <h2>Know What Was Checked</h2>
          </div>

          <div className="status-grid">
            {statusCards.map(({ tone, label, title, note }) => (
              <article key={title} className={`status-card ${tone}`}>
                <span className="status-topline">{label}</span>
                <h3>{title}</h3>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block info-section dark-panel">
        <div className="container">
          <div className="section-heading center inverted">
            <span className="eyebrow accent">Why VishPath</span>
            <h2>More than a map.</h2>
          </div>

          <div className="why-grid">
            {whyPoints.map(({ title, text }) => (
              <div key={title} className="why-card">
                <div className="why-bullet" />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>

          <div className="why-footer">
            <span>Transparency + Review Ownership + Visible Limitations</span>
          </div>
        </div>
      </section>

      <section className="section-block impact-section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Impact / SDGs</span>
            <h2>Designed for measurable impact</h2>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon"><ShieldCheck size={20} /></div>
              <h3>SDG 3</h3>
              <p>Good Health &amp; Well-being</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon"><Crosshair size={20} /></div>
              <h3>SDG 9</h3>
              <p>Industry, Innovation &amp; Infrastructure</p>
            </div>
            <div className="impact-card">
              <div className="impact-icon"><Users size={20} /></div>
              <h3>SDG 10</h3>
              <p>Reduced Inequalities</p>
            </div>
          </div>

          <div className="impact-chain">
            {impactChain.map((item, index) => (
              <div key={item} className="impact-step">
                <span>{item}</span>
                {index < impactChain.length - 1 && <ArrowRight size={16} />}
              </div>
            ))}
          </div>
          <p className="muted-note">Proposed impact chain — validation required.</p>
        </div>
      </section>

      <section className="section-block user-section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Target users</span>
            <h2>Built for the people making referral decisions.</h2>
          </div>

          <div className="user-grid">
            {userGroups.map(({ title, items }) => (
              <div key={title} className="user-card">
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block rollout-section">
        <div className="container">
          <div className="section-heading center">
            <span className="eyebrow">Rollout</span>
            <h2>Start locally, validate demand, then consider scale.</h2>
          </div>

          <div className="rollout-track">
            {phaseTrack.map((phase, index) => (
              <div key={phase} className="phase-node">
                <span>{phase}</span>
                {index < phaseTrack.length - 1 && <div className="phase-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block cta-banner">
        <div className="container cta-inner">
          <div>
            <span className="eyebrow">Emergency information only</span>
            <h2>Never delay emergency care while using VishPath.</h2>
          </div>
          <div className="cta-actions">
            <Link to="/map" className="btn btn-primary large">Open Emergency Map</Link>
            <Link to="/dashboard" className="btn btn-secondary large">Dashboard</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
