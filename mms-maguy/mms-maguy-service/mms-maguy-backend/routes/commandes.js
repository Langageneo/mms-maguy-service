const router = require('express').Router()
const Commande = require('../models/Commande')
const { createCommandeWithTaches, computeStatut } = require('../services/commande.service')

// GET /api/commandes
router.get('/', async (req, res) => {
  try {
    const { statut, urgence } = req.query
    let commandes = await Commande.find().populate('client').sort({ createdAt: -1 }).lean()

    // Calcul statut en_retard dynamique
    commandes = commandes.map(c => ({ ...c, statut: computeStatut(c) }))

    if (statut && statut !== 'tous') commandes = commandes.filter(c => c.statut === statut)
    if (urgence && urgence !== 'tous') commandes = commandes.filter(c => c.urgence === urgence)

    res.json({ success: true, data: commandes })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/commandes/:id
router.get('/:id', async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('client')
      .populate('tachesAgenda')
    if (!commande) return res.status(404).json({ success: false, error: 'Introuvable' })
    res.json({ success: true, data: commande })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/commandes
router.post('/', async (req, res) => {
  try {
    const commande = await createCommandeWithTaches(req.body)
    res.status(201).json({ success: true, data: commande })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// PUT /api/commandes/:id
router.put('/:id', async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('client')
    res.json({ success: true, data: commande })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// DELETE /api/commandes/:id
router.delete('/:id', async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
