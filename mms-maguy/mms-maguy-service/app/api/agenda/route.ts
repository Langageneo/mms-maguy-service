import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Tache from '@/models/Tache'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const statut = searchParams.get('statut')
    const query: Record<string, string> = {}
    if (statut && statut !== 'tous') query.statut = statut

    const taches = await Tache.find(query)
      .populate({ path: 'commande', populate: { path: 'client' } })
      .sort({ dateEcheance: 1 })
      .lean()

    return NextResponse.json({ success: true, data: taches })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const tache = await Tache.create(body)
    return NextResponse.json({ success: true, data: tache }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}
