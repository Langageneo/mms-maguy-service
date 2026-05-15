const router = require('express').Router()
const Tache = require('../models/Tache')

router.get('/', async (req, res) => {
  try {
    const { statut } = req.query
    const query = statut && statut !== 'tous' ? { statut } : {}
    const taches = await Tache.find(query)
      .populate({ path: 'commande', populate: { path: 'client' } })
      .sort({ dateEcheance: 1 })
    res.json({ success: true, data: taches })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const tache = await Tache.create(req.body)
    res.status(201).json({ success: true, data: tache })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const tache = await Tache.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: tache })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Tache.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
