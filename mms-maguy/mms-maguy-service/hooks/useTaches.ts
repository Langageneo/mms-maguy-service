'use client'
import { useState, useEffect, useCallback } from 'react'
import type { ITache } from '@/types'

export function useTaches(statut?: string) {
  const [taches, setTaches] = useState<ITache[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = statut && statut !== 'tous' ? `?statut=${statut}` : ''
      const res = await window.fetch(`/api/agenda${params}`)
      const json = await res.json()
      setTaches(json.data || [])
    } finally {
      setLoading(false)
    }
  }, [statut])

  useEffect(() => { fetch() }, [fetch])

  return { taches, loading, refetch: fetch }
}
