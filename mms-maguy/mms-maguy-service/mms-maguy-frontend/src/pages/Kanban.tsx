import { useEffect, useState } from 'react'
import { isPast } from 'date-fns'
import { commandesAPI } from '@/api'
import { cn, formatDate, URGENCE_COLORS } from '@/lib/utils'
import type { ICommande, IClient, StatutCommande } from '@/types'

const COLS: { statut: StatutCommande; label: string; color: string }[] = [
  { statut: 'en_attente',          label: 'En attente',    color: 'border-t-gray-400' },
  { statut: 'en_traitement',       label: 'En traitement', color: 'border-t-blue-500' },
  { statut: 'impression_en_cours', label: 'Impression',    color: 'border-t-indigo-500' },
  { statut: 'finition',            label: 'Finition',      color: 'border-t-purple-500' },
  { statut: 'pret',                label: 'Prêt ✓',       color: 'border-t-green-500' },
  { statut: 'en_retard' as StatutCommande, label: '⚠ Retard', color: 'border-t-red-500' },
]

export default function Kanban() {
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [loading, setLoading] = useState(true)
  const [dragging, setDragging] = useState<string | null>(null)

  useEffect(() => { commandesAPI.getAll().then(r => { setCommandes(r.data.data || []); setLoading(false) }) }, [])

  const colCards = (statut: StatutCommande) => {
    if (statut === 'en_retard') return commandes.filter(c => isPast(new Date(c.dateLivraisonPrevue)) && !['livre', 'annule'].includes(c.statut))
    return commandes.filter(c => {
      const late = isPast(new Date(c.dateLivraisonPrevue)) && !['livre', 'annule'].includes(c.statut)
      return c.statut === statut && !late
    })
  }

  async function moveCard(id: string, statut: StatutCommande) {
    setCommandes(prev => prev.map(c => c._id === id ? { ...c, statut } : c))
    await commandesAPI.update(id, { statut })
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-4">
      <h1 className="page-title">Kanban production</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLS.map(({ statut, label, color }) => {
          const cards = colCards(statut)
          return (
            <div key={statut} className="shrink-0 w-64"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (dragging && statut !== 'en_retard') { moveCard(dragging, statut); setDragging(null) } }}>
              <div className={cn('card border-t-2 px-3 py-2 mb-3 flex items-center justify-between', color)}>
                <span className="text-sm font-semibold text-gray-800">{label}</span>
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">{cards.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {cards.map(cmd => {
                  const client = cmd.client as IClient
                  const late = isPast(new Date(cmd.dateLivraisonPrevue))
                  return (
                    <div key={cmd._id} draggable onDragStart={() => setDragging(cmd._id!)}
                      className={cn('card p-3 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-shadow', late && statut !== 'en_retard' && 'ring-1 ring-red-200')}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-xs font-mono text-gray-400">{cmd.reference}</p>
                        <span className={cn('badge text-[10px]', URGENCE_COLORS[cmd.urgence])}>{cmd.urgence}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{client?.nom ?? '—'}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{cmd.description}</p>
                      <p className={cn('text-[10px]', late ? 'text-red-600 font-medium' : 'text-gray-400')}>📅 {cmd.dateLivraisonPrevue ? formatDate(cmd.dateLivraisonPrevue) : '—'}</p>
                      {statut !== 'en_retard' && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <select className="w-full text-[10px] text-gray-500 bg-transparent border-0 outline-none cursor-pointer"
                            value={cmd.statut} onChange={e => cmd._id && moveCard(cmd._id, e.target.value as StatutCommande)}>
                            <option value="en_attente">→ En attente</option>
                            <option value="en_traitement">→ En traitement</option>
                            <option value="impression_en_cours">→ Impression</option>
                            <option value="finition">→ Finition</option>
                            <option value="pret">→ Prêt</option>
                            <option value="livre">→ Livré</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
