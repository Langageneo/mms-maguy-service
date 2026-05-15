'use client'
import { useState } from 'react'
import { useClients } from '@/hooks/useClients'
import { Plus, Search, Phone, Mail, ExternalLink } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import type { IClient } from '@/types'

const TYPE_COLORS: Record<string, string> = {
  particulier:  'bg-gray-100 text-gray-600',
  entreprise:   'bg-blue-100 text-blue-700',
  association:  'bg-purple-100 text-purple-700',
  revendeur:    'bg-amber-100 text-amber-700',
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { clients, loading, refetch } = useClients(search)
  const [form, setForm] = useState<Partial<IClient>>({ type: 'particulier' })
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    setSaving(true)
    await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setShowForm(false)
    setForm({ type: 'particulier' })
    refetch()
  }

  return (
    <div className="max-w-5xl space-y-4">
      {/* Header */}
      <div className="section-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="text-xs text-gray-500 mt-0.5">{clients.length} client(s) enregistré(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Nouveau client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Type *</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as IClient['type'] }))}>
                <option value="particulier">Particulier</option>
                <option value="entreprise">Entreprise</option>
                <option value="association">Association / ONG</option>
                <option value="revendeur">Revendeur</option>
              </select>
            </div>
            <div>
              <label className="label">Nom complet / Raison sociale *</label>
              <input className="input" placeholder="Kouamé Amenan..." value={form.nom || ''} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input className="input" placeholder="07 00 00 00 00" value={form.telephone || ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} />
            </div>
            <div>
              <label className="label">WhatsApp</label>
              <input className="input" placeholder="07 00 00 00 00" value={form.whatsapp || ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="email@exemple.ci" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Adresse</label>
              <input className="input" placeholder="Cocody, Abidjan..." value={form.adresse || ''} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input" rows={2} placeholder="Informations utiles..." value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} disabled={saving || !form.nom || !form.telephone} className="btn-primary">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Client</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Depuis</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs">Chargement...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs">Aucun client trouvé</td></tr>
            ) : clients.map((c) => (
              <tr key={c._id} className="table-row-hover border-b border-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{c.nom}</p>
                  {c.adresse && <p className="text-xs text-gray-400">{c.adresse}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('badge', TYPE_COLORS[c.type])}>{c.type}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone className="w-3 h-3" /> {c.telephone}
                    </span>
                    {c.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="w-3 h-3" /> {c.email}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {c.createdAt ? formatDate(c.createdAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {c.whatsapp && (
                      <a
                        href={`https://wa.me/${c.whatsapp.replace(/\s/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline flex items-center gap-1"
                      >
                        WhatsApp <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
