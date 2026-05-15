import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export default api

// CLIENTS
export const clientsAPI = {
  getAll: (q?: string) => api.get('/clients', { params: q ? { q } : {} }),
  getById: (id: string) => api.get(`/clients/${id}`),
  create: (data: unknown) => api.post('/clients', data),
  update: (id: string, data: unknown) => api.put(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
}

// COMMANDES
export const commandesAPI = {
  getAll: (params?: { statut?: string; urgence?: string }) => api.get('/commandes', { params }),
  getById: (id: string) => api.get(`/commandes/${id}`),
  create: (data: unknown) => api.post('/commandes', data),
  update: (id: string, data: unknown) => api.put(`/commandes/${id}`, data),
  delete: (id: string) => api.delete(`/commandes/${id}`),
}

// AGENDA
export const agendaAPI = {
  getAll: (statut?: string) => api.get('/agenda', { params: statut ? { statut } : {} }),
  create: (data: unknown) => api.post('/agenda', data),
  update: (id: string, data: unknown) => api.put(`/agenda/${id}`, data),
  delete: (id: string) => api.delete(`/agenda/${id}`),
}

// FACTURES
export const facturesAPI = {
  getAll: (devis = false) => api.get('/factures', { params: { devis } }),
  getById: (id: string) => api.get(`/factures/${id}`),
  create: (data: unknown) => api.post('/factures', data),
  update: (id: string, data: unknown) => api.put(`/factures/${id}`, data),
  delete: (id: string) => api.delete(`/factures/${id}`),
}

// DASHBOARD
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
}

// EXPORT
export const exportAPI = {
  download: async (type: 'clients' | 'commandes' | 'factures') => {
    const res = await api.get('/export', { params: { type }, responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}-maguy.csv`
    a.click()
    URL.revokeObjectURL(url)
  },
}
