import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react'
import { exportAPI } from '@/api'
import { cn } from '@/lib/utils'

const EXPORTS = [
  { label: 'Clients', desc: 'Liste complète des clients', type: 'clients' as const, icon: FileSpreadsheet, color: 'text-emerald-600' },
  { label: 'Commandes', desc: 'Toutes les commandes avec statut', type: 'commandes' as const, icon: FileSpreadsheet, color: 'text-blue-600' },
  { label: 'Factures', desc: 'Liste des factures émises', type: 'factures' as const, icon: FileText, color: 'text-purple-600' },
]

export default function Export() {
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  async function handle(type: 'clients' | 'commandes' | 'factures') {
    setLoading(type)
    await exportAPI.download(type)
    setLoading(null)
    setDone(p => [...p, type])
    setTimeout(() => setDone(p => p.filter(d => d !== type)), 3000)
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div><h1 className="page-title">Export des données</h1><p className="text-xs text-gray-500 mt-1">Téléchargez vos données en format CSV.</p></div>
      <div className="grid gap-3">
        {EXPORTS.map(({ label, desc, type, icon: Icon, color }) => {
          const isLoading = loading === type
          const isDone = done.includes(type)
          return (
            <div key={type} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center', color)}><Icon className="w-5 h-5" /></div>
                <div><p className="text-sm font-medium text-gray-900">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">CSV</span>
                <button onClick={() => handle(type)} disabled={!!isLoading} className={cn('btn-secondary text-xs gap-1.5', isDone && 'border-green-200 text-green-600 bg-green-50')}>
                  {isDone ? <><CheckCircle className="w-3.5 h-3.5" />Téléchargé</>
                    : isLoading ? <><div className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" />Export...</>
                    : <><Download className="w-3.5 h-3.5" />Exporter</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="card p-4 bg-gray-50/50"><p className="text-xs text-gray-500">💡 Fichiers CSV compatibles Excel, Google Sheets et logiciels de comptabilité.</p></div>
    </div>
  )
}
