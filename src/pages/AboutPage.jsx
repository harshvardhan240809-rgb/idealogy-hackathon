import { Building2, HeartHandshake, Shield, UserRound } from 'lucide-react'

const team = [
  { name: 'Harsh Vardhan Singh', role: 'Product strategy & systems design' },
  { name: 'Avni Mandwe', role: 'User experience & research' },
  { name: 'Preyal Jaiswal', role: 'Interface design & prototyping' }
]

export default function AboutPage() {
  return (
    <div className="page-shell container">
      <section className="section-block intro-block">
        <span className="eyebrow">About VishPath</span>
        <h1>Built for emergency referral clarity in rural Madhya Pradesh.</h1>
        <p>VishPath is a proposed emergency referral platform that helps families and responders identify facilities that are not only nearby, but also capable and recently verified.</p>
      </section>

      <section className="info-grid three-col about-grid">
        <div className="info-card">
          <Building2 size={18} />
          <h3>Institution</h3>
          <p>Acropolis Institute of Technology and Research</p>
        </div>
        <div className="info-card">
          <Shield size={18} />
          <h3>Track</h3>
          <p>Track 2 — UN SDGs</p>
        </div>
        <div className="info-card">
          <HeartHandshake size={18} />
          <h3>Purpose</h3>
          <p>Safer referral decisions under time pressure.</p>
        </div>
      </section>

      <section className="section-block">
        <h3>Team</h3>
        <div className="team-grid">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div className="avatar"><UserRound size={22} /></div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
