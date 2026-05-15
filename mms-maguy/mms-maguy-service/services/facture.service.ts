import { connectDB } from '@/lib/db'
import Facture from '@/models/Facture'

export async function getAllFactures(isDevis = false) {
  await connectDB()
  return Facture.find({ isDevis })
    .populate('client')
    .populate('commande')
    .sort({ createdAt: -1 })
    .lean()
}

export async function getFactureById(id: string) {
  await connectDB()
  return Facture.findById(id).populate('client').populate('commande').lean()
}

export async function createFacture(data: {
  client: string
  commande?: string
  lignes: { description: string; quantite: number; prixUnitaire: number; total: number }[]
  sousTotal: number
  tva?: number
  total: number
  isDevis?: boolean
  notes?: string
  dateEcheance?: string
}) {
  await connectDB()
  return Facture.create(data)
}

export async function updateFacture(id: string, data: Record<string, unknown>) {
  await connectDB()
  return Facture.findByIdAndUpdate(id, data, { new: true })
}

export async function convertDevisToFacture(id: string) {
  await connectDB()
  return Facture.findByIdAndUpdate(
    id,
    { isDevis: false, statut: 'envoyee' },
    { new: true }
  ).populate('client')
}

export async function deleteFacture(id: string) {
  await connectDB()
  return Facture.findByIdAndDelete(id)
}
