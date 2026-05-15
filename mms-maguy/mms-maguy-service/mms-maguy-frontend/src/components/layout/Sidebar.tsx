import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Users, ShoppingBag, Kanban, FileText, Download, Printer } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/',          label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/agenda',    label: 'Agenda',      icon: CalendarDays },
  { to: '/clients',   label: 'Clients',     icon: Users },
  { to: '/commandes', label: 'Commandes',   icon: ShoppingBag },
  { to: '/kanban',    label: 'Production',  icon: Kanban },
  { to: '/factures',  label: 'Factures',    icon: FileText },
  { to: '/export',    label: 'Export',      icon: Download },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[220px] h-full bg-white border-r border-gray-200 shrink-0">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Printer className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 leading-tight">MMS MAGUY</p>
          <p className="text-[10px] text-gray-400 leading-tight">SERVICE</p>
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => cn('sidebar-link', isActive && 'active')}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400">v1.0.0 — Abidjan, CI</p>
      </div>
    </aside>
  )
}
