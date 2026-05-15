import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Client from '@/models/Client'
import Commande from '@/models/Commande'
import Facture from '@/models/Facture'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') // clients | commandes | factures

    if (type === 'clients') {
      const data = await Client.find().lean()
      const csv = [
        'Nom,Type,Telephone,WhatsApp,Email,Adresse',
        ...data.map((c) =>
          [c.nom, c.type, c.telephone, c.whatsapp || '', c.email || '', c.adresse || ''].join(',')
        ),
      ].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="clients.csv"',
        },
      })
    }

    if (type === 'commandes') {
      const data = await Commande.find().populate('client').lean()
      const csv = [
        'Reference,Client,Service,Format,Quantite,Couleur,Prix Estime,Prix Final,Avance,Statut,Urgence,Date Livraison',
        ...data.map((c) => {
          const client = c.client as { nom?: string }
          return [
            c.reference,
            client?.nom || '',
            c.typeService,
            c.format,
            c.quantite,
            c.couleur,
            c.prixEstime,
            c.prixFinal || '',
            c.montantAvance || 0,
            c.statut,
            c.urgence,
            new Date(c.dateLivraisonPrevue).toLocaleDateString('fr-CI'),
          ].join(',')
        }),
      ].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="commandes.csv"',
        },
      })
    }

    if (type === 'factures') {
      const data = await Facture.find({ isDevis: false }).populate('client').lean()
      const csv = [
        'Numero,Client,Total,Statut,Date Emission',
        ...data.map((f) => {
          const client = f.client as { nom?: string }
          return [
            f.numero,
            client?.nom || '',
            f.total,
            f.statut,
            f.dateEmission ? new Date(f.dateEmission).toLocaleDateString('fr-CI') : '',
          ].join(',')
        }),
      ].join('\n')
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="factures.csv"',
        },
      })
    }

    return NextResponse.json({ success: false, error: 'type invalide' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
