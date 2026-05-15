'use client'
import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'

const TITLES: Record<string, string> = {
  '/':           'Tableau de bord',
  '/agenda':     'Agenda production',
  '/clients':    'Clients',
  '/commandes':  'Commandes',
  '/kanban':     'Kanban production',
  '/factures':   'Factures & Devis',
  '/export':     'Export données',
}

export function Topbar() {
  const path = usePathname()
  const title = Object.entries(TITLES).find(([k]) =>
    k === '/' ? path === '/' : path.startsWith(k)
  )?.[1] ?? 'MMS Maguy Service'

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
          M
        </div>
      </div>
    </header>
  )
}
