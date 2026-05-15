const router = require('express').Router()
const Commande = require('../models/Commande')
const Client = require('../models/Client')
const Tache = require('../models/Tache')
const Facture = require('../models/Facture')

router.get('/', async (req, res) => {
  try {
    const now = new Date()

    const [totalCommandes, totalClients, tachesRetard, tachesFaites, facturesPayees, commandesActives] =
      await Promise.all([
        Commande.countDocuments(),
        Client.countDocuments(),
        Tache.countDocuments({ dateEcheance: { $lt: now }, statut: { $ne: 'fait' } }),
        Tache.countDocuments({ statut: 'fait' }),
        Facture.find({ statut: 'payee', isDevis: false }).lean(),
        Commande.find({ statut: { $nin: ['livre', 'annule'] } }).lean(),
      ])

    const revenue = facturesPayees.reduce((s, f) => s + (f.total || 0), 0)
    const commandesEnRetard = commandesActives.filter(c => new Date(c.dateLivraisonPrevue) < now).length

    res.json({
      success: true,
      data: { totalCommandes, totalClients, tachesRetard, tachesFaites, revenue, commandesEnRetard },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
