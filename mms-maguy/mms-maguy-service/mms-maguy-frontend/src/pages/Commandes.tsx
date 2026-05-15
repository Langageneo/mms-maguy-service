import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter } from 'lucide-react'
import { commandesAPI, clientsAPI } from '@/api'
import { cn, formatDate, formatMontant, STATUT_LABELS, STATUT_COLORS, URGENCE_COLORS, SERVICE_LABELS } from '@/lib/utils'
import type { ICommande, IClient, StatutCommande, UrgenceType } from '@/types'

const STATUTS = [
  { value: 'tous', label: 'Tous' }, { value: 'en_attente', label: 'En attente' },
  { value: 'en_traitement', label: 'En traitement' }, { value: 'impression_en_cours', label: 'Impression' },
  { value: 'finition', label: 'Finition' }, { value: 'pret', label: 'Prêt' },
  { value: 'livre', label: 'Livré' }, { value: 'en_retard', label: 'En retard' },
]

const EMPTY_FORM: Partial<ICommande> = { typeService: 'impression', format: 'A4', couleur: 'noir_blanc', urgence: 'normal', quantite: 1, prixEstime: 0, avancePaye: false, montantAvance: 0, statut: 'en_attente' }

export default function Commandes() {
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [clients, setClients] = useState<IClient[]>([])
  const [statut, setStatut] = useState('tous')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<ICommande>>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = (s = statut) => { setLoading(true); commandesAPI.getAll(s !== 'tous' ? { statut: s } : {}).then(r => { setCommandes(r.data.data || []); setLoading(false) }) }
  useEffect(() => { load(); clientsAPI.getAll().then(r => setClients(r.data.data || [])) }, [])
  useEffect(() => { load(statut) }, [statut])

  const upd = (k: keyof ICommande, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit() {
    if (!form.client || !form.description || !form.dateLivraisonPrevue) return
    setSaving(true)
    await commandesAPI.create(form)
    setSaving(false); setShowForm(false); setForm(EMPTY_FORM); load()
  }

  async function updateStatut(id: string, s: StatutCommande) {
    await commandesAPI.update(id, { statut: s }); load()
  }

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Commandes</h1><p className="text-xs text-gray-500">{commandes.length} résultat(s)</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" />Nouvelle commande</button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        {STATUTS.map(s => <button key={s.value} onClick={() => setStatut(s.value)} className={cn('px-3 py-1 rounded-full text-xs font-medium transition-colors', statut === s.value ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50')}>{s.label}</button>)}
      </div>

      {showForm && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold mb-4">Nouvelle commande</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div><label className="label">Client *</label>
              <select className="input" value={form.client as string || ''} onChange={e => upd('client', e.target.value)}>
                <option value="">Sélectionner...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.nom}</option>)}
              </select></div>
            <div><label className="label">Service *</label>
              <select className="input" value={form.typeService} onChange={e => upd('typeService', e.target.value)}>
                {Object.entries(SERVICE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></div>
            <div><label className="label">Urgence</label>
              <select className="input" value={form.urgence} onChange={e => upd('urgence', e.target.value as UrgenceType)}>
                <option value="normal">Normal</option><option value="urgent">Urgent</option><option value="critique">Critique</option>
              </select></div>
            <div className="md:col-span-2 lg:col-span-3"><label className="label">Description *</label><textarea className="input" rows={2} value={form.description || ''} onChange={e => upd('description', e.target.value)} /></div>
            <div><label className="label">Format</label>
              <select className="input" value={form.format} onChange={e => upd('format', e.target.value)}>
                <option value="A4">A4</option><option value="A3">A3</option><option value="A5">A5</option><option value="personnalise">Personnalisé</option>
              </select></div>
            <div><label className="label">Couleur</label>
              <select className="input" value={form.couleur} onChange={e => upd('couleur', e.target.value)}>
                <option value="noir_blanc">Noir & Blanc</option><option value="couleur">Couleur</option>
              </select></div>
            <div><label className="label">Quantité *</label><input className="input" type="number" min={1} value={form.quantite} onChange={e => upd('quantite', +e.target.value)} /></div>
            <div><label className="label">Prix estimé (FCFA) *</label><input className="input" type="number" min={0} value={form.prixEstime} onChange={e => upd('prixEstime', +e.target.value)} /></div>
            <div><label className="label">Avance (FCFA)</label><input className="input" type="number" min={0} value={form.montantAvance} onChange={e => { const v = +e.target.value; upd('montantAvance', v); upd('avancePaye', v > 0) }} /></div>
            <div><label className="label">Date livraison *</label><input className="input" type="date" value={form.dateLivraisonPrevue?.toString().split('T')[0] || ''} onChange={e => upd('dateLivraisonPrevue', e.target.value)} /></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSubmit} disabled={saving || !form.client || !form.description || !form.dateLivraisonPrevue} className="btn-primary">{saving ? 'Création...' : 'Créer la commande'}</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Réf.</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Client</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Service</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Prix</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Livraison</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Urgence</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Statut</th>
            <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium"></th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-xs">Chargement...</td></tr>
              : commandes.length === 0 ? <tr><td colSpan={8} className="text-center py-10 text-gray-400 text-xs">Aucune commande</td></tr>
              : commandes.map(cmd => {
                const client = cmd.client as IClient
                return (
                  <tr key={cmd._id} className="hover:bg-gray-50 border-b border-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{cmd.reference}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{client?.nom ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{SERVICE_LABELS[cmd.typeService]}</td>
                    <td className="px-4 py-3 text-xs font-medium">{formatMontant(cmd.prixEstime)}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{cmd.dateLivraisonPrevue ? formatDate(cmd.dateLivraisonPrevue) : '—'}</td>
                    <td className="px-4 py-3"><span className={cn('badge', URGENCE_COLORS[cmd.urgence])}>{cmd.urgence}</span></td>
                    <td className="px-4 py-3">
                      <select className={cn('badge cursor-pointer border-0 outline-none', STATUT_COLORS[cmd.statut])} value={cmd.statut} onChange={e => cmd._id && updateStatut(cmd._id, e.target.value as StatutCommande)}>
                        {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3"><Link to={`/commandes/${cmd._id}`} className="text-xs text-brand-600 hover:underline">Détail</Link></td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
