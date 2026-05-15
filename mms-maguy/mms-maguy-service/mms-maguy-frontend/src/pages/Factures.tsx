import { useEffect, useState } from 'react'
import { Plus, Printer, Download, FileText } from 'lucide-react'
import { facturesAPI, clientsAPI } from '@/api'
import { cn, formatDate, formatMontant, FACTURE_STATUT_COLORS } from '@/lib/utils'
import type { IFacture, IClient, ILigneFacture } from '@/types'

const emptyLigne = (): ILigneFacture => ({ description: '', quantite: 1, prixUnitaire: 0, total: 0 })

export default function Factures() {
  const [tab, setTab] = useState<'factures' | 'devis'>('factures')
  const [items, setItems] = useState<IFacture[]>([])
  const [clients, setClients] = useState<IClient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [lignes, setLignes] = useState<ILigneFacture[]>([emptyLigne()])
  const [clientId, setClientId] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => { setLoading(true); facturesAPI.getAll(tab === 'devis').then(r => { setItems(r.data.data || []); setLoading(false) }) }
  useEffect(() => { load(); clientsAPI.getAll().then(r => setClients(r.data.data || [])) }, [])
  useEffect(() => { load() }, [tab])

  const updLigne = (i: number, k: keyof ILigneFacture, v: string | number) => setLignes(prev => {
    const next = [...prev]; next[i] = { ...next[i], [k]: v }
    if (k === 'quantite' || k === 'prixUnitaire') next[i].total = next[i].quantite * next[i].prixUnitaire
    return next
  })

  const sousTotal = lignes.reduce((s, l) => s + l.total, 0)

  async function handleSubmit() {
    if (!clientId) return
    setSaving(true)
    await facturesAPI.create({ client: clientId, lignes, sousTotal, total: sousTotal, isDevis: tab === 'devis', notes, statut: 'brouillon' })
    setSaving(false); setShowForm(false); setLignes([emptyLigne()]); setClientId(''); load()
  }

  async function convertToFacture(id: string) {
    await facturesAPI.update(id, { isDevis: false }); load()
  }

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['factures', 'devis'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-colors', tab === t ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600')}>{t === 'factures' ? 'Factures' : 'Devis'}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" />Nouveau {tab === 'devis' ? 'devis' : 'facture'}</button>
      </div>

      {showForm && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Nouveau {tab === 'devis' ? 'devis' : 'facture'}</h2>
          <div className="mb-4"><label className="label">Client *</label>
            <select className="input max-w-xs" value={clientId} onChange={e => setClientId(e.target.value)}>
              <option value="">Sélectionner...</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
            </select></div>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-1">
              <span className="col-span-5">Description</span><span className="col-span-2">Qté</span><span className="col-span-2">P.U.</span><span className="col-span-2">Total</span>
            </div>
            {lignes.map((l, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input className="input col-span-5 text-xs" placeholder="Description..." value={l.description} onChange={e => updLigne(i, 'description', e.target.value)} />
                <input className="input col-span-2 text-xs" type="number" min={1} value={l.quantite} onChange={e => updLigne(i, 'quantite', +e.target.value)} />
                <input className="input col-span-2 text-xs" type="number" min={0} value={l.prixUnitaire} onChange={e => updLigne(i, 'prixUnitaire', +e.target.value)} />
                <span className="col-span-2 text-xs font-medium px-2">{formatMontant(l.total)}</span>
                <button onClick={() => setLignes(p => p.filter((_, j) => j !== i))} className="col-span-1 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
              </div>
            ))}
            <button onClick={() => setLignes(p => [...p, emptyLigne()])} className="text-xs text-brand-600 hover:underline">+ Ajouter une ligne</button>
          </div>
          <div className="flex justify-end mb-4"><p className="text-sm font-bold">Total : {formatMontant(sousTotal)}</p></div>
          <textarea className="input mb-4" rows={2} placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={handleSubmit} disabled={saving || !clientId} className="btn-primary">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Numéro</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Client</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Total</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Statut</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Date</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-xs">Chargement...</td></tr>
              : items.length === 0 ? <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-xs">Aucun élément</td></tr>
              : items.map(f => {
                const client = f.client as IClient
                return (
                  <tr key={f._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 flex items-center gap-1.5"><FileText className="w-3 h-3" />{f.numero}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{client?.nom ?? '—'}</td>
                    <td className="px-4 py-3 font-medium">{formatMontant(f.total)}</td>
                    <td className="px-4 py-3"><span className={cn('badge', FACTURE_STATUT_COLORS[f.statut])}>{f.statut}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{f.createdAt ? formatDate(f.createdAt) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600" title="Imprimer"><Printer className="w-3.5 h-3.5" /></button>
                        <button className="text-gray-400 hover:text-gray-600" title="Télécharger"><Download className="w-3.5 h-3.5" /></button>
                        {tab === 'devis' && <button onClick={() => f._id && convertToFacture(f._id)} className="text-xs text-brand-600 hover:underline">→ Facture</button>}
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
