'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClients } from '@/hooks/useClients'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { SERVICE_LABELS, cn } from '@/lib/utils'
import type { ICommande, UrgenceType } from '@/types'

const EMPTY: Partial<ICommande> = {
  typeService: 'impression',
  format: 'A4',
  couleur: 'noir_blanc',
  urgence: 'normal',
  quantite: 1,
  prixEstime: 0,
  avancePaye: false,
  montantAvance: 0,
  statut: 'en_attente',
}

export default function NewCommandePage() {
  const router = useRouter()
  const { clients, loading: loadingClients } = useClients()
  const [form, setForm] = useState<Partial<ICommande>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function upd(key: keyof ICommande, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  const isValid = form.client && form.description && form.dateLivraisonPrevue && form.prixEstime

  async function handleSubmit() {
    if (!isValid) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSuccess(true)
      setTimeout(() => router.push('/commandes'), 1500)
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <p className="text-sm font-semibold text-gray-900">Commande créée avec succès</p>
        <p className="text-xs text-gray-500">3 tâches agenda générées automatiquement</p>
        <p className="text-xs text-gray-400">Redirection...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/commandes" className="btn-secondary p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="page-title">Nouvelle commande</h1>
          <p className="text-xs text-gray-500">Création rapide — moins d'1 minute</p>
        </div>
      </div>

      <div className="card p-5 space-y-5">

        {/* Section 1 — Client + Service */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Client & Service</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Client *</label>
              <select
                className="input"
                value={form.client as string || ''}
                onChange={e => upd('client', e.target.value)}
                disabled={loadingClients}
              >
                <option value="">Sélectionner un client...</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Type de service *</label>
              <select className="input" value={form.typeService} onChange={e => upd('typeService', e.target.value)}>
                {Object.entries(SERVICE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 — Description */}
        <div>
          <label className="label">Description de la commande *</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Ex: Impression de 500 flyers A4 couleur recto-verso..."
            value={form.description || ''}
            onChange={e => upd('description', e.target.value)}
          />
        </div>

        {/* Section 3 — Specs */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Spécifications</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="label">Format</label>
              <select className="input" value={form.format} onChange={e => upd('format', e.target.value)}>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="A5">A5</option>
                <option value="personnalise">Personnalisé</option>
              </select>
            </div>
            <div>
              <label className="label">Couleur</label>
              <select className="input" value={form.couleur} onChange={e => upd('couleur', e.target.value)}>
                <option value="noir_blanc">N&B</option>
                <option value="couleur">Couleur</option>
              </select>
            </div>
            <div>
              <label className="label">Quantité *</label>
              <input
                className="input"
                type="number"
                min={1}
                value={form.quantite}
                onChange={e => upd('quantite', +e.target.value)}
              />
            </div>
            <div>
              <label className="label">Urgence</label>
              <select
                className={cn(
                  'input font-medium',
                  form.urgence === 'critique' && 'text-red-600',
                  form.urgence === 'urgent' && 'text-orange-600',
                )}
                value={form.urgence}
                onChange={e => upd('urgence', e.target.value as UrgenceType)}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="critique">Critique</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4 — Prix */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tarification</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Prix estimé (FCFA) *</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="0"
                value={form.prixEstime || ''}
                onChange={e => upd('prixEstime', +e.target.value)}
              />
            </div>
            <div>
              <label className="label">Prix final (FCFA)</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="Optionnel"
                value={form.prixFinal || ''}
                onChange={e => upd('prixFinal', +e.target.value)}
              />
            </div>
            <div>
              <label className="label">Avance reçue (FCFA)</label>
              <input
                className="input"
                type="number"
                min={0}
                placeholder="0"
                value={form.montantAvance || ''}
                onChange={e => {
                  const v = +e.target.value
                  upd('montantAvance', v)
                  upd('avancePaye', v > 0)
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 5 — Dates */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Planning</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Début production</label>
              <input
                className="input"
                type="date"
                value={form.dateDebutProduction?.toString().split('T')[0] || ''}
                onChange={e => upd('dateDebutProduction', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Date livraison prévue *</label>
              <input
                className="input"
                type="date"
                value={form.dateLivraisonPrevue?.toString().split('T')[0] || ''}
                onChange={e => upd('dateLivraisonPrevue', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Info auto-taches */}
        <div className="bg-brand-50 rounded-lg px-4 py-3">
          <p className="text-xs text-brand-700">
            ✓ 3 tâches agenda seront générées automatiquement : <strong>Impression</strong>, <strong>Finition</strong>, <strong>Livraison</strong>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg">
            Erreur : {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving || !isValid}
            className="btn-primary"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Création...</>
            ) : 'Créer la commande'}
          </button>
          <Link href="/commandes" className="btn-secondary">Annuler</Link>
        </div>
      </div>
    </div>
  )
}
