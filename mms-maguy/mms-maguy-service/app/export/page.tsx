'use client'
import { useState } from 'react'
import { Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExportItem {
  label: string
  description: string
  type: string
  format: string
  icon: React.ElementType
  color: string
}

const EXPORTS: ExportItem[] = [
  {
    label: 'Clients',
    description: 'Liste complète des clients (nom, contact, type)',
    type: 'clients',
    format: 'CSV',
    icon: FileSpreadsheet,
    color: 'text-emerald-600',
  },
  {
    label: 'Commandes',
    description: 'Toutes les commandes avec statut et prix',
    type: 'commandes',
    format: 'CSV',
    icon: FileSpreadsheet,
    color: 'text-blue-600',
  },
  {
    label: 'Factures',
    description: 'Liste des factures émises',
    type: 'factures',
    format: 'CSV',
    icon: FileText,
    color: 'text-purple-600',
  },
]

export default function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  async function handleExport(type: string, label: string) {
    setDownloading(type)
    try {
      const res = await fetch(`/api/export?type=${type}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-maguy.csv`
      a.click()
      URL.revokeObjectURL(url)
      setDone(prev => [...prev, type])
      setTimeout(() => setDone(prev => prev.filter(d => d !== type)), 3000)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="page-title">Export des données</h1>
        <p className="text-xs text-gray-500 mt-1">Téléchargez vos données en format CSV pour votre comptabilité.</p>
      </div>

      <div className="grid gap-3">
        {EXPORTS.map(({ label, description, type, format, icon: Icon, color }) => {
          const isLoading = downloading === type
          const isDone = done.includes(type)
          return (
            <div key={type} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center', color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-medium border border-gray-200 px-1.5 py-0.5 rounded">{format}</span>
                <button
                  onClick={() => handleExport(type, label)}
                  disabled={isLoading}
                  className={cn(
                    'btn-secondary text-xs gap-1.5 transition-all',
                    isDone && 'border-green-200 text-green-600 bg-green-50'
                  )}
                >
                  {isDone ? (
                    <><CheckCircle className="w-3.5 h-3.5" /> Téléchargé</>
                  ) : isLoading ? (
                    <><div className="w-3.5 h-3.5 border border-gray-400 border-t-transparent rounded-full animate-spin" /> Export...</>
                  ) : (
                    <><Download className="w-3.5 h-3.5" /> Exporter</>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-4 bg-gray-50/50">
        <p className="text-xs text-gray-500">
          💡 Les fichiers CSV sont compatibles avec Excel, Google Sheets et tout logiciel de comptabilité.
        </p>
      </div>
    </div>
  )
}
