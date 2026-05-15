'use client'
import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ITache } from '@/types'

const TACHE_COLORS: Record<string, string> = {
  fait: 'bg-green-100 text-green-800 border-green-200',
  en_cours: 'bg-blue-100 text-blue-800 border-blue-200',
  a_faire: 'bg-gray-100 text-gray-700 border-gray-200',
}

function getTacheColor(t: ITache): string {
  if (t.statut === 'fait') return TACHE_COLORS.fait
  if (t.statut === 'en_cours') return TACHE_COLORS.en_cours
  const isLate = isPast(new Date(t.dateEcheance)) && t.statut !== 'fait'
  if (isLate) return 'bg-red-100 text-red-800 border-red-200'
  return TACHE_COLORS.a_faire
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [taches, setTaches] = useState<ITache[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ITache | null>(null)

  useEffect(() => {
    fetch('/api/agenda')
      .then(r => r.json())
      .then(j => { setTaches(j.data || []); setLoading(false) })
  }, [])

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  })

  function tachesForDay(day: Date) {
    return taches.filter(t => isSameDay(new Date(t.dateEcheance), day))
  }

  async function updateTacheStatut(id: string, statut: string) {
    await fetch(`/api/agenda/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    setTaches(prev => prev.map(t => t._id === id ? { ...t, statut: statut as ITache['statut'] } : t))
    setSelected(null)
  }

  return (
    <div className="max-w-5xl space-y-4">
      {/* Header */}
      <div className="section-header">
        <h1 className="page-title">Agenda production</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="btn-secondary p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-900 capitalize min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </span>
          <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="btn-secondary p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs">
        {[
          { color: 'bg-green-400', label: 'Fait' },
          { color: 'bg-blue-400', label: 'En cours' },
          { color: 'bg-gray-300', label: 'À faire' },
          { color: 'bg-red-400', label: 'En retard' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1 text-gray-500">
            <span className={cn('w-2 h-2 rounded-full', color)} />{label}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <div className="card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
            <div key={d} className="text-center py-2 text-xs font-medium text-gray-500">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-xs">Chargement...</div>
        ) : (
          <div className="grid grid-cols-7">
            {/* Empty cells for first week */}
            {Array.from({ length: (days[0].getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-gray-50 bg-gray-50/30" />
            ))}
            {days.map(day => {
              const dayTaches = tachesForDay(day)
              const today = isToday(day)
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[80px] p-1.5 border-b border-r border-gray-100',
                    today && 'bg-brand-50/30'
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1',
                    today ? 'bg-brand-600 text-white' : 'text-gray-600'
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="space-y-0.5">
                    {dayTaches.slice(0, 3).map(t => (
                      <button
                        key={t._id}
                        onClick={() => setSelected(t)}
                        className={cn(
                          'w-full text-left text-[10px] px-1.5 py-0.5 rounded border truncate',
                          getTacheColor(t)
                        )}
                      >
                        {t.titre}
                      </button>
                    ))}
                    {dayTaches.length > 3 && (
                      <p className="text-[10px] text-gray-400 pl-1">+{dayTaches.length - 3}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Task detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="card p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-1">{selected.titre}</h3>
            <p className="text-xs text-gray-500 mb-4">Échéance : {format(new Date(selected.dateEcheance), 'dd MMM yyyy', { locale: fr })}</p>
            <div className="flex gap-2">
              {(['a_faire', 'en_cours', 'fait'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => selected._id && updateTacheStatut(selected._id, s)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    selected.statut === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {s === 'a_faire' ? 'À faire' : s === 'en_cours' ? 'En cours' : 'Fait'}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="mt-3 w-full btn-secondary text-xs">Fermer</button>
          </div>
        </div>
      )}
    </div>
  )
}
