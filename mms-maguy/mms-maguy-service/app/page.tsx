'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShoppingBag, Users, AlertTriangle, CheckCircle,
  TrendingUp, Plus, Clock, ArrowRight
} from 'lucide-react'
import { cn, formatMontant, STATUT_LABELS, STATUT_COLORS, URGENCE_COLORS } from '@/lib/utils'
import type { ICommande } from '@/types'

interface Stats {
  totalCommandes: number
  totalClients: number
  tachesRetard: number
  tachesFaites: number
  revenue: number
  commandesEnRetard: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then(r => r.json()),
      fetch('/api/commandes?limit=6').then(r => r.json()),
    ]).then(([s, c]) => {
      setStats(s.data)
      setCommandes(c.data?.slice(0, 6) || [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const kpis = [
    {
      label: 'Commandes totales',
      value: stats?.totalCommandes ?? 0,
      icon: ShoppingBag,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
    },
    {
      label: 'Chiffre d\'affaires',
      value: formatMontant(stats?.revenue ?? 0),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Tâches en retard',
      value: stats?.tachesRetard ?? 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      alert: (stats?.tachesRetard ?? 0) > 0,
    },
    {
      label: 'Tâches terminées',
      value: stats?.tachesFaites ?? 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={cn('card p-4', kpi.alert && 'ring-1 ring-red-200')}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </div>
              <div className={cn('p-2 rounded-lg', kpi.bg)}>
                <kpi.icon className={cn('w-4 h-4', kpi.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active orders */}
        <div className="lg:col-span-2 card">
          <div className="section-header px-5 pt-4">
            <h2 className="text-sm font-semibold text-gray-900">Commandes actives</h2>
            <Link href="/commandes" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Réf.</th>
                  <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Client</th>
                  <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Statut</th>
                  <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Urgence</th>
                </tr>
              </thead>
              <tbody>
                {commandes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-400 py-8 text-xs">
                      Aucune commande
                    </td>
                  </tr>
                ) : commandes.map((cmd) => {
                  const client = cmd.client as { nom?: string }
                  return (
                    <tr key={cmd._id} className="table-row-hover border-b border-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">{cmd.reference}</td>
                      <td className="px-3 py-3 font-medium text-gray-900">{client?.nom ?? '—'}</td>
                      <td className="px-3 py-3">
                        <span className={cn('badge', STATUT_COLORS[cmd.statut])}>
                          {STATUT_LABELS[cmd.statut]}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('badge', URGENCE_COLORS[cmd.urgence])}>
                          {cmd.urgence}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions + Alerts */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Actions rapides</h2>
            <div className="space-y-2">
              <Link href="/commandes/new" className="btn-primary w-full justify-center">
                <Plus className="w-4 h-4" /> Nouvelle commande
              </Link>
              <Link href="/clients/new" className="btn-secondary w-full justify-center">
                <Users className="w-3.5 h-3.5" /> Nouveau client
              </Link>
              <Link href="/agenda" className="btn-secondary w-full justify-center">
                <Clock className="w-3.5 h-3.5" /> Voir l'agenda
              </Link>
            </div>
          </div>

          {/* Alerts */}
          {(stats?.commandesEnRetard ?? 0) > 0 && (
            <div className="card p-4 ring-1 ring-red-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h2 className="text-sm font-semibold text-red-700">Alertes retard</h2>
              </div>
              <p className="text-xs text-red-600">
                <span className="font-bold">{stats?.commandesEnRetard}</span> commande(s) en retard de livraison.
              </p>
              <Link href="/commandes?statut=en_retard" className="mt-2 text-xs text-red-600 hover:underline flex items-center gap-1">
                Voir les retards <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
