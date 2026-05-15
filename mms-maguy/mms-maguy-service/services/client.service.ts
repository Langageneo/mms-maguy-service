import { connectDB } from '@/lib/db'
import Client from '@/models/Client'
import Commande from '@/models/Commande'

export async function getAllClients(search?: string) {
  await connectDB()
  const query = search ? { $or: [
    { nom: { $regex: search, $options: 'i' } },
    { telephone: { $regex: search, $options: 'i' } },
  ]} : {}
  return Client.find(query).sort({ createdAt: -1 }).lean()
}

export async function getClientById(id: string) {
  await connectDB()
  const client = await Client.findById(id).lean()
  if (!client) return null
  const commandes = await Commande.find({ client: id }).sort({ createdAt: -1 }).lean()
  return { client, commandes }
}

export async function createClient(data: {
  type: string
  nom: string
  telephone: string
  whatsapp?: string
  email?: string
  adresse?: string
  notes?: string
}) {
  await connectDB()
  return Client.create(data)
}

export async function updateClient(id: string, data: Partial<{
  type: string
  nom: string
  telephone: string
  whatsapp: string
  email: string
  adresse: string
  notes: string
}>) {
  await connectDB()
  return Client.findByIdAndUpdate(id, data, { new: true })
}

export async function deleteClient(id: string) {
  await connectDB()
  return Client.findByIdAndDelete(id)
}
