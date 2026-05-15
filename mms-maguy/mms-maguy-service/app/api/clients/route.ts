import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Client from '@/models/Client'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')
    const query = q ? { $text: { $search: q } } : {}
    const clients = await Client.find(query).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: clients })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const client = await Client.create(body)
    return NextResponse.json({ success: true, data: client }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 400 })
  }
}
