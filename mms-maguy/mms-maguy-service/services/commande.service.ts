import { addDays } from 'date-fns'
import Commande from '@/models/Commande'
import Tache from '@/models/Tache'
import { connectDB } from '@/lib/db'

export async function createCommandeWithTaches(data: {
  client: string
  typeService: string
  description: string
  format: string
  quantite: number
  couleur: string
  prixEstime: number
  prixFinal?: number
  avancePaye: boolean
  montantAvance?: number
  urgence: string
  dateDebutProduction?: string
  dateLivraisonPrevue: string
}) {
  await connectDB()

  const dateDebut = data.dateDebutProduction
    ? new Date(data.dateDebutProduction)
    : new Date()

  const dateLivraison = new Date(data.dateLivraisonPrevue)

  // Create commande first (without taches)
  const commande = await Commande.create({
    ...data,
    dateDebutProduction: dateDebut,
    dateLivraisonPrevue: dateLivraison,
    tachesAgenda: [],
  })

  // Auto-generate 3 taches
  const tacheDefs = [
    {
      type: 'impression',
      titre: `Impression – ${commande.reference}`,
      dateEcheance: dateDebut,
    },
    {
      type: 'finition',
      titre: `Finition – ${commande.reference}`,
      dateEcheance: addDays(dateDebut, 1),
    },
    {
      type: 'livraison',
      titre: `Livraison – ${commande.reference}`,
      dateEcheance: dateLivraison,
    },
  ]

  const taches = await Tache.insertMany(
    tacheDefs.map((t) => ({ ...t, commande: commande._id, statut: 'a_faire' }))
  )

  commande.tachesAgenda = taches.map((t) => t._id)
  await commande.save()

  return commande.populate(['client', 'tachesAgenda'])
}

export async function getCommandesWithStatut() {
  await connectDB()
  const commandes = await Commande.find()
    .populate('client')
    .sort({ createdAt: -1 })
    .lean()

  return commandes.map((c) => {
    const now = new Date()
    const livraison = new Date(c.dateLivraisonPrevue)
    const isLate = livraison < now && !['livre', 'annule'].includes(c.statut)
    return { ...c, statut: isLate ? 'en_retard' : c.statut }
  })
}
