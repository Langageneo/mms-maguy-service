const router = require('express').Router()
const Facture = require('../models/Facture')

router.get('/', async (req, res) => {
  try {
    const isDevis = req.query.devis === 'true'
    const factures = await Facture.find({ isDevis }).populate('client').populate('commande').sort({ createdAt: -1 })
    res.json({ success: true, data: factures })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id).populate('client').populate('commande')
    if (!facture) return res.status(404).json({ success: false, error: 'Introuvable' })
    res.json({ success: true, data: facture })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const facture = await Facture.create(req.body)
    res.status(201).json({ success: true, data: facture })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: facture })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Facture.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
