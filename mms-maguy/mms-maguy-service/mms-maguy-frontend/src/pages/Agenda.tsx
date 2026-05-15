import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { agendaAPI } from '@/api'
import { cn } from '@/lib/utils'
import type { ITache } from '@/types'

function getTacheColor(t: ITache) {
  if (t.statut === 'fait') return 'bg-green-100 text-green-800 border-green-200'
  if (t.statut === 'en_cours') return 'bg-blue-100 text-blue-800 border-blue-200'
  if (isPast(new Date(t.dateEcheance))) return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-700 border-gray-200'
}

export default function Agenda() {
  const [current, setCurrent] = useState(new Date())
  const [taches, setTaches] = useState<ITache[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ITache | null>(null)

  useEffect(() => { agendaAPI.getAll().then(r => { setTaches(r.data.data || []); setLoading(false) }) }, [])

  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) })
  const tachesForDay = (d: Date) => taches.filter(t => isSameDay(new Date(t.dateEcheance), d))
  const firstDayOffset = (days[0].getDay() + 6) % 7

  async function updateStatut(id: string, statut: string) {
    await agendaAPI.update(id, { statut })
    setTaches(prev => prev.map(t => t._id === id ? { ...t, statut: statut as ITache['statut'] } : t))
    setSelected(null)
  }

  return (
    <div className="max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Agenda production</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold text-gray-900 capitalize min-w-[140px] text-center">{format(current, 'MMMM yyyy', { locale: fr })}</span>
          <button onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        {[['bg-green-400', 'Fait'], ['bg-blue-400', 'En cours'], ['bg-gray-300', 'À faire'], ['bg-red-400', 'En retard']].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1 text-gray-500"><span className={cn('w-2 h-2 rounded-full', c)} />{l}</span>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
            <div key={d} className="text-center py-2 text-xs font-medium text-gray-500">{d}</div>
          ))}
        </div>
        {loading ? <div className="text-center py-10 text-gray-400 text-xs">Chargement...</div> : (
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e${i}`} className="min-h-[80px] border-b border-r border-gray-50 bg-gray-50/30" />)}
            {days.map(day => {
              const dt = tachesForDay(day)
              const today = isToday(day)
              return (
                <div key={day.toISOString()} className={cn('min-h-[80px] p-1.5 border-b border-r border-gray-100', today && 'bg-brand-50/30')}>
                  <span className={cn('text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1', today ? 'bg-brand-600 text-white' : 'text-gray-600')}>{format(day, 'd')}</span>
                  <div className="space-y-0.5">
                    {dt.slice(0, 3).map(t => (
                      <button key={t._id} onClick={() => setSelected(t)} className={cn('w-full text-left text-[10px] px-1.5 py-0.5 rounded border truncate', getTacheColor(t))}>{t.titre}</button>
                    ))}
                    {dt.length > 3 && <p className="text-[10px] text-gray-400 pl-1">+{dt.length - 3}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="card p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900 mb-1">{selected.titre}</h3>
            <p className="text-xs text-gray-500 mb-4">Échéance : {format(new Date(selected.dateEcheance), 'dd MMM yyyy', { locale: fr })}</p>
            <div className="flex gap-2">
              {(['a_faire', 'en_cours', 'fait'] as const).map(s => (
                <button key={s} onClick={() => selected._id && updateStatut(selected._id, s)} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors', selected.statut === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')}>
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
