import { connectDB } from '@/lib/db'
import Tache from '@/models/Tache'

export async function getAllTaches(statut?: string) {
  await connectDB()
  const query = statut && statut !== 'tous' ? { statut } : {}
  return Tache.find(query)
    .populate({ path: 'commande', populate: { path: 'client' } })
    .sort({ dateEcheance: 1 })
    .lean()
}

export async function updateTache(id: string, data: Partial<{
  statut: string
  notes: string
  dateEcheance: string
}>) {
  await connectDB()
  return Tache.findByIdAndUpdate(id, data, { new: true })
}

export async function deleteTache(id: string) {
  await connectDB()
  return Tache.findByIdAndDelete(id)
}
