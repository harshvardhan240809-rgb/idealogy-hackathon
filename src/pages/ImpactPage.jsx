import { ArrowRight, HeartPulse, Shield, TrendingUp } from 'lucide-react'

export default function ImpactPage() {
  return (
    <div className="page-shell container">
      <section className="section-block intro-block">
        <span className="eyebrow">Impact & SDG alignment</span>
        <h1>Proposed impact path requiring validation.</h1>
        <p>VishPath is designed to support referral clarity and decision confidence in emergency pathways across rural and tribal areas. This is a prototype framework for evaluation, not a claim of measured outcomes.</p>
      </section>

      <section className="impact-list">
        <div className="impact-card">
          <Shield size={22} />
          <h3>SDG 3</h3>
          <p>Good Health and Well-being</p>
        </div>
        <div className="impact-card">
          <TrendingUp size={22} />
          <h3>SDG 9</h3>
          <p>Industry, Innovation and Infrastructure</p>
        </div>
        <div className="impact-card">
          <HeartPulse size={22} />
          <h3>SDG 10</h3>
          <p>Reduced Inequalities</p>
        </div>
      </section>

      <section className="section-block">
        <div className="impact-flow">
          <span>Verified readiness</span>
          <ArrowRight size={16} />
          <span>Fewer wrong first stops</span>
          <ArrowRight size={16} />
          <span>Less lost time</span>
          <ArrowRight size={16} />
          <span>Better chance of timely care</span>
        </div>
        <p className="muted-note">This is a proposed impact chain requiring validation in field conditions and with real operational data.</p>
      </section>

      <section className="section-block market-panel">
        <div className="market-grid">
          <div>
            <h3>Pilot</h3>
            <p>District-level prototype validation</p>
          </div>
          <div>
            <h3>District</h3>
            <p>Sehore, Bhopal, Raisen, Vidisha, Dewas and adjacent areas</p>
          </div>
          <div>
            <h3>State</h3>
            <p>Madhya Pradesh</p>
          </div>
        </div>
      </section>
    </div>
  )
}
