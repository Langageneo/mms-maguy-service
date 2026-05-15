const router = require('express').Router()
const Client = require('../models/Client')
const Commande = require('../models/Commande')

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const { q } = req.query
    const query = q ? { $or: [
      { nom: { $regex: q, $options: 'i' } },
      { telephone: { $regex: q, $options: 'i' } },
    ]} : {}
    const clients = await Client.find(query).sort({ createdAt: -1 })
    res.json({ success: true, data: clients })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client) return res.status(404).json({ success: false, error: 'Client introuvable' })
    const commandes = await Commande.find({ client: req.params.id }).sort({ createdAt: -1 })
    res.json({ success: true, data: { client, commandes } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/clients
router.post('/', async (req, res) => {
  try {
    const client = await Client.create(req.body)
    res.status(201).json({ success: true, data: client })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: client })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
