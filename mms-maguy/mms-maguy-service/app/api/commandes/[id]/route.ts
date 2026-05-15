import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Commande from '@/models/Commande'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const commande = await Commande.findById(params.id)
      .populate('client')
      .populate('tachesAgenda')
      .lean()
    if (!commande) return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json({ success: true, data: commande })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const commande = await Commande.findByIdAndUpdate(params.id, body, { new: true })
      .populate('client')
    return NextResponse.json({ success: true, data: commande })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await Commande.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
