'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ShoppingBag,
  Kanban,
  FileText,
  Download,
  Printer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/agenda',     label: 'Agenda',       icon: CalendarDays },
  { href: '/clients',    label: 'Clients',      icon: Users },
  { href: '/commandes',  label: 'Commandes',    icon: ShoppingBag },
  { href: '/kanban',     label: 'Production',   icon: Kanban },
  { href: '/factures',   label: 'Factures',     icon: FileText },
  { href: '/export',     label: 'Export',       icon: Download },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-[220px] h-full bg-white border-r border-gray-200 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Printer className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 leading-tight">MMS MAGUY</p>
          <p className="text-[10px] text-gray-400 leading-tight">SERVICE</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'sidebar-link',
                active && 'active'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400">v1.0.0 — Abidjan, CI</p>
      </div>
    </aside>
  )
}
