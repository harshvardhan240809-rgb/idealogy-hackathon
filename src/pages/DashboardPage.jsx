import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Edit3, Eye, PlusCircle, ShieldCheck } from 'lucide-react'
import { getFacilities, updateFacility } from '../services/facilityService'
import useFacilities from '../hooks/useFacilities'
import StatusBadge from '../components/StatusBadge'
import { formatDate } from '../utils/helpers'

const emptyForm = {
  id: '',
  name: '',
  district: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  asvAvailable: true,
  trainedStaff: true,
  emergencyCare: true,
  status: 'VERIFIED',
  verificationSource: 'Demo update',
  verifiedBy: 'Admin',
  notes: ''
}

export default function DashboardPage() {
  const { facilities, setFacilities, source } = useFacilities()
  const [form, setForm] = useState(emptyForm)
  const [selectedFacilityId, setSelectedFacilityId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('vishpath-admin') || '{}')
    } catch {
      return {}
    }
  }, [])

  if (!admin.authenticated) {
    return <Navigate to="/login" replace />
  }

  const stats = {
    total: facilities.length,
    verified: facilities.filter((f) => f.status === 'VERIFIED').length,
    aging: facilities.filter((f) => f.status === 'AGING').length,
    unavailable: facilities.filter((f) => f.status === 'UNAVAILABLE').length,
    unknown: facilities.filter((f) => f.status === 'UNKNOWN').length
  }

  function hydrateForm(facility) {
    setSelectedFacilityId(facility.id)
    setForm({
      id: facility.id || '',
      name: facility.name || '',
      district: facility.district || '',
      address: facility.address || '',
      latitude: facility.latitude !== undefined && facility.latitude !== null ? String(facility.latitude) : '',
      longitude: facility.longitude !== undefined && facility.longitude !== null ? String(facility.longitude) : '',
      phone: facility.phone || '',
      asvAvailable: Boolean(facility.asvAvailable),
      trainedStaff: Boolean(facility.trainedStaff),
      emergencyCare: Boolean(facility.emergencyCare),
      status: facility.status || 'VERIFIED',
      verificationSource: facility.verificationSource || 'Demo update',
      verifiedBy: facility.verifiedBy || 'Admin',
      notes: facility.notes || '',
      verificationHistory: facility.verificationHistory || []
    })
    setError('')
    setSuccess('')
  }

  function resetForm() {
    setSelectedFacilityId('')
    setForm(emptyForm)
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.district || !form.address) {
      setError('Name, district and address are required.')
      setSuccess('')
      return
    }

    if (Number.isNaN(Number(form.latitude)) || Number.isNaN(Number(form.longitude))) {
      setError('Latitude and longitude must be valid numbers.')
      setSuccess('')
      return
    }

    const facility = {
      ...form,
      id: form.id || `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      lastVerified: new Date().toISOString(),
      status: form.status,
      verificationHistory: [{
        date: new Date().toISOString(),
        status: form.status,
        source: form.verificationSource,
        verifiedBy: form.verifiedBy,
        notes: form.notes || 'Admin verification update.'
      }, ...(Array.isArray(form.verificationHistory) ? form.verificationHistory : [])]
    }

    try {
      const result = await updateFacility(facility)
      setFacilities(getFacilities())
      setSelectedFacilityId(facility.id)
      setForm({ ...emptyForm, id: facility.id })
      setError('')
      const destination = result.persisted ? (source === 'mongodb' ? 'MongoDB' : 'the demo API') : 'this browser only; the API is unavailable'
      setSuccess(`Facility saved to ${destination}.`)
    } catch (saveError) {
      setError(saveError.message || 'Facility could not be saved.')
      setSuccess('')
    }
  }

  function handleFieldChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleQuickVerify(facility) {
    const updated = {
      ...facility,
      status: 'VERIFIED',
      lastVerified: new Date().toISOString(),
      verificationSource: 'Admin verification',
      verifiedBy: 'Admin',
      verificationHistory: [{
        date: new Date().toISOString(),
        status: 'VERIFIED',
        source: 'Admin verification',
        verifiedBy: 'Admin',
        notes: 'Quick verification completed from the dashboard.'
      }, ...(facility.verificationHistory || [])]
    }

    try {
      const result = await updateFacility(updated)
      setFacilities(getFacilities())
      const destination = result.persisted ? (source === 'mongodb' ? 'MongoDB' : 'the demo API') : 'this browser only; the API is unavailable'
      setSuccess(`${facility.name} was saved to ${destination}.`)
      setError('')
    } catch (saveError) {
      setError(saveError.message || 'Facility could not be verified.')
      setSuccess('')
    }
  }

  function handleEditFacility(facility) {
    hydrateForm(facility)
  }

  return (
    <div className="page-shell container dashboard-shell">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <h3>Dashboard</h3>
          <nav>
            <span className="nav-chip active">Dashboard</span>
            <span className="nav-chip">Facilities</span>
            <span className="nav-chip">Add Facility</span>
            <span className="nav-chip">Verification Log</span>
            <span className="nav-chip">Users</span>
            <span className="nav-chip">Settings</span>
          </nav>
          <button type="button" className="btn btn-secondary" onClick={() => {
            localStorage.removeItem('vishpath-admin')
            navigate('/login')
          }}>
            Log out
          </button>
        </aside>

        <main className="dashboard-main">
          <section className="stats-grid">
            <div className="stat-card"><span>Total Facilities</span><strong>{stats.total}</strong></div>
            <div className="stat-card success"><span>Verified Recently</span><strong>{stats.verified}</strong></div>
            <div className="stat-card warning"><span>Aging</span><strong>{stats.aging}</strong></div>
            <div className="stat-card danger"><span>Unavailable</span><strong>{stats.unavailable}</strong></div>
            <div className="stat-card neutral"><span>Unknown</span><strong>{stats.unknown}</strong></div>
          </section>

          <section className="dashboard-table-card">
            <div className="section-head">
              <h3>Recent Verifications</h3>
              <Link to="/verification-log" className="btn btn-ghost small">View log</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Checked On</th>
                  <th>Source</th>
                  <th>Verified By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {facilities.slice(0, 6).map((facility) => (
                  <tr key={facility.id}>
                    <td>{facility.name}</td>
                    <td>{facility.district}</td>
                    <td><StatusBadge status={facility.status} /></td>
                    <td>{formatDate(facility.lastVerified)}</td>
                    <td>{facility.verificationSource}</td>
                    <td>{facility.verifiedBy}</td>
                    <td className="table-actions">
                      <Link to={`/facility/${facility.id}`} aria-label={`View ${facility.name}`}><Eye size={14} /></Link>
                      <button type="button" aria-label={`Edit ${facility.name}`} onClick={() => handleEditFacility(facility)}><Edit3 size={14} /></button>
                      <button type="button" aria-label={`Verify ${facility.name}`} onClick={() => handleQuickVerify(facility)}><ShieldCheck size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="dashboard-form-card">
            <div className="section-head">
              <h3>{selectedFacilityId ? 'Edit Facility' : 'Add / Edit Facility'}</h3>
              <div className="section-head-actions">
                <button type="button" className="btn btn-ghost small" onClick={resetForm}>New</button>
                <PlusCircle size={18} />
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="facility-form">
              <div className="input-grid">
                <label>Facility name<input value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} /></label>
                <label>District<input value={form.district} onChange={(e) => handleFieldChange('district', e.target.value)} /></label>
                <label className="full-width">Address<input value={form.address} onChange={(e) => handleFieldChange('address', e.target.value)} /></label>
                <label>Latitude<input value={form.latitude} onChange={(e) => handleFieldChange('latitude', e.target.value)} /></label>
                <label>Longitude<input value={form.longitude} onChange={(e) => handleFieldChange('longitude', e.target.value)} /></label>
                <label>Phone<input value={form.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} /></label>
                <label>Verification source<input value={form.verificationSource} onChange={(e) => handleFieldChange('verificationSource', e.target.value)} /></label>
                <label>Verifier<input value={form.verifiedBy} onChange={(e) => handleFieldChange('verifiedBy', e.target.value)} /></label>
                <label>Status
                  <select value={form.status} onChange={(e) => handleFieldChange('status', e.target.value)}>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="AGING">AGING</option>
                    <option value="UNAVAILABLE">UNAVAILABLE</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </label>
                <label>ASV availability
                  <select value={String(form.asvAvailable)} onChange={(e) => handleFieldChange('asvAvailable', e.target.value === 'true')}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
                <label>Trained staff
                  <select value={String(form.trainedStaff)} onChange={(e) => handleFieldChange('trainedStaff', e.target.value === 'true')}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
                <label>Emergency care
                  <select value={String(form.emergencyCare)} onChange={(e) => handleFieldChange('emergencyCare', e.target.value === 'true')}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
                <label className="full-width">Notes<textarea rows="3" value={form.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} /></label>
              </div>
              <button type="submit" className="btn btn-primary">Save facility</button>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}
