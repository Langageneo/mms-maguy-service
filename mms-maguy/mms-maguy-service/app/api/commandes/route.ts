import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { createCommandeWithTaches, getCommandesWithStatut } from '@/services/commande.service'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const statut = searchParams.get('statut')
    const urgence = searchParams.get('urgence')

    let commandes = await getCommandesWithStatut()

    if (statut && statut !== 'tous') {
      commandes = commandes.filter((c) => c.statut === statut)
    }
    if (urgence && urgence !== 'tous') {
      commandes = commandes.filter((c) => c.urgence === urgence)
    }

    return NextResponse.json({ success: true, data: commandes })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const commande = await createCommandeWithTaches(body)
    return NextResponse.json({ success: true, data: commande }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}
