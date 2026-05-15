const router = require('express').Router()
const Client = require('../models/Client')
const Commande = require('../models/Commande')
const Facture = require('../models/Facture')

function toCSV(headers, rows) {
  return [headers.join(','), ...rows].join('\n')
}

router.get('/', async (req, res) => {
  try {
    const { type } = req.query

    if (type === 'clients') {
      const data = await Client.find().lean()
      const csv = toCSV(
        ['Nom', 'Type', 'Telephone', 'WhatsApp', 'Email', 'Adresse'],
        data.map(c => [c.nom, c.type, c.telephone, c.whatsapp || '', c.email || '', c.adresse || ''].join(','))
      )
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="clients.csv"')
      return res.send(csv)
    }

    if (type === 'commandes') {
      const data = await Commande.find().populate('client').lean()
      const csv = toCSV(
        ['Reference', 'Client', 'Service', 'Format', 'Quantite', 'Couleur', 'Prix Estime', 'Prix Final', 'Avance', 'Statut', 'Urgence', 'Date Livraison'],
        data.map(c => [
          c.reference, c.client?.nom || '', c.typeService, c.format,
          c.quantite, c.couleur, c.prixEstime, c.prixFinal || '',
          c.montantAvance || 0, c.statut, c.urgence,
          c.dateLivraisonPrevue ? new Date(c.dateLivraisonPrevue).toLocaleDateString('fr-CI') : '',
        ].join(','))
      )
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="commandes.csv"')
      return res.send(csv)
    }

    if (type === 'factures') {
      const data = await Facture.find({ isDevis: false }).populate('client').lean()
      const csv = toCSV(
        ['Numero', 'Client', 'Total', 'Statut', 'Date Emission'],
        data.map(f => [
          f.numero, f.client?.nom || '', f.total, f.statut,
          f.dateEmission ? new Date(f.dateEmission).toLocaleDateString('fr-CI') : '',
        ].join(','))
      )
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="factures.csv"')
      return res.send(csv)
    }

    res.status(400).json({ success: false, error: 'type invalide. Valeurs: clients | commandes | factures' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
