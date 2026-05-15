import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Facture from '@/models/Facture'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const facture = await Facture.findById(params.id).populate('client').populate('commande').lean()
    if (!facture) return NextResponse.json({ success: false, error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json({ success: true, data: facture })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const facture = await Facture.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json({ success: true, data: facture })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await Facture.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
