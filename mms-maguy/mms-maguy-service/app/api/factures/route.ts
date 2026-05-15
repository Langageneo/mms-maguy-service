import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Facture from '@/models/Facture'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const isDevis = searchParams.get('devis') === 'true'
    const factures = await Facture.find({ isDevis })
      .populate('client')
      .populate('commande')
      .sort({ createdAt: -1 })
      .lean()
    return NextResponse.json({ success: true, data: factures })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const facture = await Facture.create(body)
    return NextResponse.json({ success: true, data: facture }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}
