'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { IClient } from '@/types'

const EMPTY: Partial<IClient> = { type: 'particulier' }

export default function NewClientPage() {
  const router = useRouter()
  const [form, setForm] = useState<Partial<IClient>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const isValid = form.nom && form.telephone

  async function handleSubmit() {
    if (!isValid) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSuccess(true)
      setTimeout(() => router.push('/clients'), 1500)
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
        <p className="text-sm font-semibold text-gray-900">Client enregistré</p>
        <p className="text-xs text-gray-400">Redirection...</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/clients" className="btn-secondary p-2">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="page-title">Nouveau client</h1>
      </div>

      <div className="card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="label">Nom / Raison sociale *</label>
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
          <div className="sm:col-span-2">
            <label className="label">Notes</label>
            <textarea className="input" rows={2} placeholder="Informations utiles..." value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-lg">Erreur : {error}</div>}

        <div className="flex gap-3 pt-1">
          <button onClick={handleSubmit} disabled={saving || !isValid} className="btn-primary">
            {saving ? 'Enregistrement...' : 'Enregistrer le client'}
          </button>
          <Link href="/clients" className="btn-secondary">Annuler</Link>
        </div>
      </div>
    </div>
  )
}
