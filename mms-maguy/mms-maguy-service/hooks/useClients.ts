'use client'
import { useState, useEffect, useCallback } from 'react'
import type { IClient } from '@/types'

export function useClients(query?: string) {
  const [clients, setClients] = useState<IClient[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = query ? `?q=${encodeURIComponent(query)}` : ''
      const res = await window.fetch(`/api/clients${params}`)
      const json = await res.json()
      setClients(json.data || [])
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => { fetch() }, [fetch])

  return { clients, loading, refetch: fetch }
}
