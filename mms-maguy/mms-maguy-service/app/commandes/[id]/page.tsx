'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import {
  formatDate, formatMontant, cn,
  STATUT_LABELS, STATUT_COLORS, URGENCE_COLORS,
  SERVICE_LABELS, TACHE_STATUT_COLORS
} from '@/lib/utils'
import type { ICommande, IClient, ITache, StatutCommande } from '@/types'

export default function CommandeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [commande, setCommande] = useState<ICommande | null>(null)
  const [loading, setLoading] = useState(true)

  function load() {
    fetch(`/api/commandes/${id}`)
      .then(r => r.json())
      .then(j => { setCommande(j.data || null); setLoading(false) })
  }
  useEffect(load, [id])

  async function updateStatut(statut: StatutCommande) {
    await fetch(`/api/commandes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    load()
  }

  async function updateTache(tid: string, statut: string) {
    await fetch(`/api/agenda/${tid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    load()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!commande) return <div className="text-center py-16 text-gray-400 text-sm">Commande introuvable</div>

  const client = commande.client as IClient
  const taches = (commande.tachesAgenda || []) as unknown as ITache[]

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/commandes" className="btn-secondary p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">{commande.reference}</h1>
          <p className="text-xs text-gray-500">{SERVICE_LABELS[commande.typeService]}</p>
        </div>
        <span className={cn('badge ml-auto', STATUT_COLORS[commande.statut])}>
          {STATUT_LABELS[commande.statut]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Infos commande */}
        <div className="card p-4 space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Détails</h2>
          <p className="text-sm text-gray-700">{commande.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <span>Format : <strong>{commande.format}</strong></span>
            <span>Couleur : <strong>{commande.couleur === 'couleur' ? 'Couleur' : 'N&B'}</strong></span>
            <span>Quantité : <strong>{commande.quantite}</strong></span>
            <span>Urgence : <span className={cn('badge', URGENCE_COLORS[commande.urgence])}>{commande.urgence}</span></span>
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1 text-xs text-gray-600">
            <p>Livraison prévue : <strong>{commande.dateLivraisonPrevue ? formatDate(commande.dateLivraisonPrevue) : '—'}</strong></p>
            {commande.dateLivraisonReelle && (
              <p>Livraison réelle : <strong>{formatDate(commande.dateLivraisonReelle)}</strong></p>
            )}
          </div>
        </div>

        {/* Client + Prix */}
        <div className="space-y-3">
          <div className="card p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Client</h2>
            <p className="text-sm font-medium text-gray-900 mb-1">{client?.nom}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client?.telephone}</span>
              {client?.whatsapp && (
                <a href={`https://wa.me/${client.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 flex items-center gap-1 hover:underline">
                  <ExternalLink className="w-3 h-3" /> WA
                </a>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Facturation</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Prix estimé</span>
                <span className="font-medium">{formatMontant(commande.prixEstime)}</span>
              </div>
              {commande.prixFinal && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Prix final</span>
                  <span className="font-bold text-gray-900">{formatMontant(commande.prixFinal)}</span>
                </div>
              )}
              {commande.avancePaye && (
                <div className="flex justify-between text-green-600">
                  <span>Avance reçue</span>
                  <span className="font-medium">{formatMontant(commande.montantAvance || 0)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statut rapide */}
      <div className="card p-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Changer le statut</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(STATUT_LABELS) as [StatutCommande, string][]).map(([k, v]) => (
            <button
              key={k}
              onClick={() => updateStatut(k)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                commande.statut === k
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Tâches agenda */}
      {taches.length > 0 && (
        <div className="card p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tâches de production</h2>
          <div className="space-y-2">
            {taches.map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.titre}</p>
                  <p className="text-xs text-gray-400">Échéance : {t.dateEcheance ? formatDate(t.dateEcheance) : '—'}</p>
                </div>
                <select
                  value={t.statut}
                  onChange={e => t._id && updateTache(t._id, e.target.value)}
                  className={cn('badge border-0 outline-none cursor-pointer text-xs', TACHE_STATUT_COLORS[t.statut])}
                >
                  <option value="a_faire">À faire</option>
                  <option value="en_cours">En cours</option>
                  <option value="fait">Fait</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
