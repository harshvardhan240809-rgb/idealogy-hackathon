import express from 'express'
import mongoose from 'mongoose'
import { demoFacilities } from './src/data/demoData.js'

try {
  process.loadEnvFile()
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const app = express()
const PORT = process.env.PORT || 4000
const mongoUri = process.env.MONGODB_URI
const facilitySchema = new mongoose.Schema({}, {
  collection: 'facilities',
  strict: false,
  versionKey: false
})
const Facility = mongoose.models.Facility || mongoose.model('Facility', facilitySchema)
let dataMode = mongoUri ? 'connecting' : 'demo'

app.use(express.json())

function serializeFacility(record) {
  const { _id, ...facility } = record
  return { ...facility, id: facility.id || String(_id) }
}

function facilityQuery(id) {
  if (!mongoose.isValidObjectId(id)) return { id }
  return { $or: [{ id }, { _id: new mongoose.Types.ObjectId(id) }] }
}

function unavailable(res) {
  return res.status(503).json({ message: 'MongoDB is configured but unavailable.' })
}

app.get('/api/health', (_req, res) => {
  const available = dataMode !== 'unavailable'
  res.status(available ? 200 : 503).json({
    status: available ? 'ok' : 'unavailable',
    mode: dataMode,
    message: dataMode === 'mongodb' ? 'MongoDB facility API running.' : 'VishPath demo API running.'
  })
})

app.get('/api/facilities', async (_req, res, next) => {
  if (dataMode === 'unavailable') return unavailable(res)
  if (dataMode === 'demo') return res.json(demoFacilities)

  try {
    const records = await Facility.find({}).lean()
    return res.json(records.map(serializeFacility))
  } catch (error) {
    return next(error)
  }
})

app.get('/api/facilities/:id', async (req, res, next) => {
  if (dataMode === 'unavailable') return unavailable(res)

  try {
    const facility = dataMode === 'mongodb'
      ? await Facility.findOne(facilityQuery(req.params.id)).lean()
      : demoFacilities.find((item) => item.id === req.params.id)
    if (!facility) return res.status(404).json({ message: 'Facility not found.' })
    return res.json(dataMode === 'mongodb' ? serializeFacility(facility) : facility)
  } catch (error) {
    return next(error)
  }
})

app.put('/api/facilities/:id', async (req, res, next) => {
  if (dataMode === 'unavailable') return unavailable(res)

  try {
    const facility = { ...req.body, id: req.params.id }
    if (dataMode === 'mongodb') {
      const record = await Facility.findOneAndUpdate(
        facilityQuery(req.params.id),
        { $set: facility },
        { new: true, upsert: true, lean: true }
      )
      return res.json(serializeFacility(record))
    }

    const index = demoFacilities.findIndex((item) => item.id === req.params.id)
    if (index >= 0) demoFacilities[index] = { ...demoFacilities[index], ...facility }
    else demoFacilities.unshift(facility)
    return res.json(demoFacilities[index >= 0 ? index : 0])
  } catch (error) {
    return next(error)
  }
})

app.use((error, _req, res, _next) => {
  console.error('Facility API request failed:', error.message)
  res.status(500).json({ message: 'Facility API request failed.' })
})

async function startServer() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri)
      dataMode = 'mongodb'
      console.log('MongoDB connected.')
    } catch (error) {
      dataMode = 'unavailable'
      console.error('MongoDB connection failed:', error.message)
    }
  } else {
    console.log('MongoDB not configured; using demo data.')
  }

  app.listen(PORT, () => {
    console.log(`VishPath API listening on http://localhost:${PORT} (${dataMode} mode).`)
  })
}

startServer()
