import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Client from '@/models/Client'
import Commande from '@/models/Commande'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const client = await Client.findById(params.id).lean()
    if (!client) return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 })
    const commandes = await Commande.find({ client: params.id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: { client, commandes } })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const client = await Client.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json({ success: true, data: client })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await Client.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
