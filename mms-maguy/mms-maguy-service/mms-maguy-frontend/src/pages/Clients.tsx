import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Phone, ExternalLink } from 'lucide-react'
import { clientsAPI } from '@/api'
import { cn, formatDate } from '@/lib/utils'
import type { IClient } from '@/types'

const TYPE_COLORS: Record<string, string> = {
  particulier: 'bg-gray-100 text-gray-600', entreprise: 'bg-blue-100 text-blue-700',
  association: 'bg-purple-100 text-purple-700', revendeur: 'bg-amber-100 text-amber-700',
}

const EMPTY: Partial<IClient> = { type: 'particulier' }

export default function Clients() {
  const [clients, setClients] = useState<IClient[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<IClient>>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = (q?: string) => {
    setLoading(true)
    clientsAPI.getAll(q).then(r => { setClients(r.data.data || []); setLoading(false) })
  }

  useEffect(() => { load() }, [])
  useEffect(() => { const t = setTimeout(() => load(search), 300); return () => clearTimeout(t) }, [search])

  async function handleSubmit() {
    if (!form.nom || !form.telephone) return
    setSaving(true)
    await clientsAPI.create(form)
    setSaving(false); setShowForm(false); setForm(EMPTY); load()
  }

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Clients</h1><p className="text-xs text-gray-500 mt-0.5">{clients.length} client(s)</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau client</button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Nouveau client</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label">Type *</label>
              <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as IClient['type'] }))}>
                <option value="particulier">Particulier</option><option value="entreprise">Entreprise</option>
                <option value="association">Association / ONG</option><option value="revendeur">Revendeur</option>
              </select></div>
            <div><label className="label">Nom *</label><input className="input" placeholder="Kouamé Amenan..." value={form.nom || ''} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} /></div>
            <div><label className="label">Téléphone *</label><input className="input" placeholder="07 00 00 00 00" value={form.telephone || ''} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} /></div>
            <div><label className="label">WhatsApp</label><input className="input" placeholder="07 00 00 00 00" value={form.whatsapp || ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div><label className="label">Adresse</label><input className="input" placeholder="Cocody, Abidjan..." value={form.adresse || ''} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} /></div>
            <div className="md:col-span-2"><label className="label">Notes</label><textarea className="input" rows={2} value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} disabled={saving || !form.nom || !form.telephone} className="btn-primary">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input className="input pl-9" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} /></div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Client</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Type</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Contact</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Depuis</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs">Chargement...</td></tr>
              : clients.length === 0 ? <tr><td colSpan={5} className="text-center py-10 text-gray-400 text-xs">Aucun client</td></tr>
              : clients.map(c => (
                <tr key={c._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                  <td className="px-4 py-3"><p className="font-medium text-gray-900">{c.nom}</p>{c.adresse && <p className="text-xs text-gray-400">{c.adresse}</p>}</td>
                  <td className="px-4 py-3"><span className={cn('badge', TYPE_COLORS[c.type])}>{c.type}</span></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs text-gray-600"><Phone className="w-3 h-3" />{c.telephone}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.createdAt ? formatDate(c.createdAt) : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/clients/${c._id}`} className="text-xs text-brand-600 hover:underline">Voir</Link>
                      {c.whatsapp && <a href={`https://wa.me/${c.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline flex items-center gap-1">WA <ExternalLink className="w-3 h-3" /></a>}
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
