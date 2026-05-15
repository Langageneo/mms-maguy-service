require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

// DB
connectDB()

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/clients',   require('./routes/clients'))
app.use('/api/commandes', require('./routes/commandes'))
app.use('/api/agenda',    require('./routes/agenda'))
app.use('/api/factures',  require('./routes/factures'))
app.use('/api/export',    require('./routes/export'))
app.use('/api/dashboard', require('./routes/dashboard'))

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'MMS Maguy Service' }))

app.listen(PORT, () => {
  console.log(`✅ Backend MMS Maguy démarré sur http://localhost:${PORT}`)
})
