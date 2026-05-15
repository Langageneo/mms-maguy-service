import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Tache from '@/models/Tache'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const body = await req.json()
    const tache = await Tache.findByIdAndUpdate(params.id, body, { new: true })
    return NextResponse.json({ success: true, data: tache })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await Tache.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
