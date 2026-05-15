import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Commande from '@/models/Commande'
import Client from '@/models/Client'
import Tache from '@/models/Tache'
import Facture from '@/models/Facture'

export async function GET() {
  try {
    await connectDB()
    const now = new Date()

    const [totalCommandes, totalClients, tachesTotal, facturesPayees, commandesActives] =
      await Promise.all([
        Commande.countDocuments(),
        Client.countDocuments(),
        Tache.countDocuments(),
        Facture.find({ statut: 'payee', isDevis: false }).lean(),
        Commande.find({ statut: { $nin: ['livre', 'annule'] } }).lean(),
      ])

    const tachesRetard = await Tache.countDocuments({
      dateEcheance: { $lt: now },
      statut: { $ne: 'fait' },
    })

    const tachesFaites = await Tache.countDocuments({ statut: 'fait' })

    const revenue = facturesPayees.reduce((sum, f) => sum + (f.total || 0), 0)

    const commandesEnRetard = commandesActives.filter(
      (c) => new Date(c.dateLivraisonPrevue) < now
    )

    return NextResponse.json({
      success: true,
      data: {
        totalCommandes,
        totalClients,
        tachesTotal,
        tachesRetard,
        tachesFaites,
        revenue,
        commandesEnRetard: commandesEnRetard.length,
      },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
