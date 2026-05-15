'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ICommande } from '@/types'

export function useCommandes(filters?: { statut?: string; urgence?: string }) {
  const [commandes, setCommandes] = useState<ICommande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters?.statut) params.set('statut', filters.statut)
      if (filters?.urgence) params.set('urgence', filters.urgence)
      const res = await window.fetch(`/api/commandes?${params}`)
      const json = await res.json()
      setCommandes(json.data || [])
    } catch {
      setError('Erreur chargement commandes')
    } finally {
      setLoading(false)
    }
  }, [filters?.statut, filters?.urgence])

  useEffect(() => { fetch() }, [fetch])

  return { commandes, loading, error, refetch: fetch }
}
