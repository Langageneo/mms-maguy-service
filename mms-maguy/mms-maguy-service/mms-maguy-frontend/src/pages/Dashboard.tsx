import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Users, AlertTriangle, CheckCircle, TrendingUp, Plus, Clock, ArrowRight } from 'lucide-react'
import { dashboardAPI, commandesAPI } from '@/api'
import { cn, formatMontant, STATUT_LABELS, STATUT_COLORS, URGENCE_COLORS } from '@/lib/utils'
import type { IDashboardStats, ICommande, IClient } from '@/types'

export default function Dashboard() {
  const [stats, setStats] = useState<IDashboardStats | null>(null)
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), commandesAPI.getAll()])
      .then(([s, c]) => {
        setStats(s.data.data)
        setCommandes(c.data.data?.slice(0, 6) || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>

  const kpis = [
    { label: 'Commandes totales', value: stats?.totalCommandes ?? 0, icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: "Chiffre d'affaires", value: formatMontant(stats?.revenue ?? 0), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tâches en retard', value: stats?.tachesRetard ?? 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', alert: (stats?.tachesRetard ?? 0) > 0 },
    { label: 'Tâches terminées', value: stats?.tachesFaites ?? 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className={cn('card p-4', k.alert && 'ring-1 ring-red-200')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-gray-900">{k.value}</p>
              </div>
              <div className={cn('p-2 rounded-lg', k.bg)}>
                <k.icon className={cn('w-4 h-4', k.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-gray-900">Commandes actives</h2>
            <Link to="/commandes" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Voir tout <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Réf.</th>
              <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Client</th>
              <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Statut</th>
              <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Urgence</th>
            </tr></thead>
            <tbody>
              {commandes.length === 0
                ? <tr><td colSpan={4} className="text-center text-gray-400 py-8 text-xs">Aucune commande</td></tr>
                : commandes.map(cmd => {
                  const client = cmd.client as IClient
                  return (
                    <tr key={cmd._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{cmd.reference}</td>
                      <td className="px-3 py-3 font-medium text-gray-900">{client?.nom ?? '—'}</td>
                      <td className="px-3 py-3"><span className={cn('badge', STATUT_COLORS[cmd.statut])}>{STATUT_LABELS[cmd.statut]}</span></td>
                      <td className="px-3 py-3"><span className={cn('badge', URGENCE_COLORS[cmd.urgence])}>{cmd.urgence}</span></td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Actions rapides</h2>
            <div className="space-y-2">
              <Link to="/commandes" className="btn-primary w-full justify-center"><Plus className="w-4 h-4" /> Nouvelle commande</Link>
              <Link to="/clients" className="btn-secondary w-full justify-center"><Users className="w-3.5 h-3.5" /> Nouveau client</Link>
              <Link to="/agenda" className="btn-secondary w-full justify-center"><Clock className="w-3.5 h-3.5" /> Voir l'agenda</Link>
            </div>
          </div>
          {(stats?.commandesEnRetard ?? 0) > 0 && (
            <div className="card p-4 ring-1 ring-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-semibold text-red-700">Retards</h2>
              </div>
              <p className="text-xs text-red-600"><span className="font-bold">{stats?.commandesEnRetard}</span> commande(s) en retard.</p>
              <Link to="/commandes?statut=en_retard" className="mt-2 text-xs text-red-600 hover:underline flex items-center gap-1">Voir <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
