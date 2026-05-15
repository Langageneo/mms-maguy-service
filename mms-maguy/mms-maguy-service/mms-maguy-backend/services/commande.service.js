const { addDays } = require('date-fns')
const Commande = require('../models/Commande')
const Tache = require('../models/Tache')

async function createCommandeWithTaches(data) {
  const dateDebut = data.dateDebutProduction ? new Date(data.dateDebutProduction) : new Date()
  const dateLivraison = new Date(data.dateLivraisonPrevue)

  const commande = await Commande.create({ ...data, dateDebutProduction: dateDebut, dateLivraisonPrevue: dateLivraison, tachesAgenda: [] })

  const taches = await Tache.insertMany([
    { commande: commande._id, type: 'impression', titre: `Impression – ${commande.reference}`, dateEcheance: dateDebut, statut: 'a_faire' },
    { commande: commande._id, type: 'finition',   titre: `Finition – ${commande.reference}`,   dateEcheance: addDays(dateDebut, 1), statut: 'a_faire' },
    { commande: commande._id, type: 'livraison',  titre: `Livraison – ${commande.reference}`,  dateEcheance: dateLivraison, statut: 'a_faire' },
  ])

  commande.tachesAgenda = taches.map(t => t._id)
  await commande.save()
  return commande.populate(['client', 'tachesAgenda'])
}

function computeStatut(commande) {
  const { statut, dateLivraisonPrevue } = commande
  if (['livre', 'annule'].includes(statut)) return statut
  if (new Date(dateLivraisonPrevue) < new Date()) return 'en_retard'
  return statut
}

module.exports = { createCommandeWithTaches, computeStatut }
