import { Compass, MapPinned, ShieldCheck, Stethoscope } from 'lucide-react'

const steps = [
  { icon: Compass, title: '1. Check the emergency map', text: 'Look for verified facilities near the patient or referral route.' },
  { icon: ShieldCheck, title: '2. Review verification status', text: 'See timestamps, source, and known capability gaps before moving.' },
  { icon: Stethoscope, title: '3. Use route confidence', text: 'Choose the facility with timely access and appropriate emergency support.' },
  { icon: MapPinned, title: '4. Revalidate when needed', text: 'Update facility readiness as conditions change in the field.' }
]

export default function HowItWorksPage() {
  return (
    <div className="page-shell container">
      <section className="section-block intro-block">
        <span className="eyebrow">How VishPath works</span>
        <h1>Simple, fast, and transparent emergency referrals.</h1>
        <p>VishPath is designed to help families, front-line responders, and ambulance teams identify a facility that is both nearby and reasonably capable.</p>
      </section>

      <section className="steps-grid">
        {steps.map(({ icon: Icon, title, text }) => (
          <div key={title} className="step-card">
            <div className="feature-icon"><Icon size={18} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section className="comparison-panel section-block">
        <div className="container small-panel">
          <span className="eyebrow">The decision path</span>
          <h3>Same bite. Two routes.</h3>
          <div className="route-compare">
            <div className="compare-box">
              <h4>Basic listing</h4>
              <ul>
                <li>Nearest hospital</li>
                <li>Readiness unknown</li>
                <li>Extra referral</li>
              </ul>
            </div>
            <div className="compare-box active">
              <h4>VishPath</h4>
              <ul>
                <li>Verified capable facility</li>
                <li>Fresh verification</li>
                <li>Route</li>
                <li>First-stop confidence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
