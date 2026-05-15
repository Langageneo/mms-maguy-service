import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, ExternalLink } from 'lucide-react'
import { clientsAPI } from '@/api'
import { cn, formatDate, formatMontant, STATUT_COLORS, STATUT_LABELS } from '@/lib/utils'
import type { IClient, ICommande } from '@/types'

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<IClient | null>(null)
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clientsAPI.getById(id!).then(r => {
      setClient(r.data.data?.client || null)
      setCommandes(r.data.data?.commandes || [])
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!client) return <div className="text-center py-16 text-gray-400 text-sm">Client introuvable</div>

  const totalDepense = commandes.reduce((s, c) => s + (c.prixFinal || c.prixEstime || 0), 0)

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/clients" className="btn-secondary p-2"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="page-title">{client.nom}</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Coordonnées</h2>
          <div className="flex items-center gap-2 text-sm"><Phone className="w-3.5 h-3.5 text-gray-400" />{client.telephone}</div>
          {client.whatsapp && <a href={`https://wa.me/${client.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-green-600 hover:underline"><ExternalLink className="w-3.5 h-3.5" />WhatsApp</a>}
          {client.email && <p className="text-xs text-gray-500">{client.email}</p>}
          {client.adresse && <p className="text-xs text-gray-500">{client.adresse}</p>}
          {client.notes && <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-2">{client.notes}</p>}
          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-400">Depuis</p>
            <p className="text-sm font-medium">{client.createdAt ? formatDate(client.createdAt) : '—'}</p>
          </div>
        </div>
        <div className="sm:col-span-2 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3 text-center"><p className="text-2xl font-bold">{commandes.length}</p><p className="text-xs text-gray-500">Commandes</p></div>
            <div className="card p-3 text-center"><p className="text-lg font-bold">{formatMontant(totalDepense)}</p><p className="text-xs text-gray-500">Total dépensé</p></div>
          </div>
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Historique commandes</h2>
              <Link to="/commandes" className="text-xs text-brand-600 hover:underline">+ Nouvelle</Link>
            </div>
            {commandes.length === 0 ? <p className="text-xs text-gray-400 text-center py-6">Aucune commande</p> : (
              <table className="w-full text-xs">
                <thead><tr className="bg-gray-50/50"><th className="text-left px-4 py-2 text-gray-500 font-medium">Réf.</th><th className="text-left px-4 py-2 text-gray-500 font-medium">Prix</th><th className="text-left px-4 py-2 text-gray-500 font-medium">Statut</th></tr></thead>
                <tbody>{commandes.map(c => (
                  <tr key={c._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-gray-500">{c.reference}</td>
                    <td className="px-4 py-2 font-medium">{formatMontant(c.prixEstime)}</td>
                    <td className="px-4 py-2"><span className={cn('badge text-[10px]', STATUT_COLORS[c.statut])}>{STATUT_LABELS[c.statut]}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
