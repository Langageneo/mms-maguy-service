import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isPast, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { StatutCommande, UrgenceType, StatutTache } from '@/types'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatDate = (d: string | Date) => format(new Date(d), 'dd MMM yyyy', { locale: fr })
export const formatDateTime = (d: string | Date) => format(new Date(d), "dd MMM yyyy 'à' HH:mm", { locale: fr })
export const formatMontant = (n: number) => new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(n)

export function isLate(dateLivraisonPrevue: string, statut: StatutCommande) {
  if (['livre', 'annule'].includes(statut)) return false
  return isPast(new Date(dateLivraisonPrevue)) && !isToday(new Date(dateLivraisonPrevue))
}

export const STATUT_LABELS: Record<StatutCommande, string> = {
  en_attente: 'En attente', en_traitement: 'En traitement',
  impression_en_cours: 'Impression', finition: 'Finition',
  pret: 'Prêt', livre: 'Livré', annule: 'Annulé', en_retard: 'En retard',
}
export const STATUT_COLORS: Record<StatutCommande, string> = {
  en_attente: 'bg-gray-100 text-gray-700', en_traitement: 'bg-blue-100 text-blue-700',
  impression_en_cours: 'bg-indigo-100 text-indigo-700', finition: 'bg-purple-100 text-purple-700',
  pret: 'bg-green-100 text-green-700', livre: 'bg-emerald-100 text-emerald-700',
  annule: 'bg-red-100 text-red-600', en_retard: 'bg-red-100 text-red-700',
}
export const URGENCE_COLORS: Record<UrgenceType, string> = {
  normal: 'bg-gray-100 text-gray-600', urgent: 'bg-orange-100 text-orange-700', critique: 'bg-red-100 text-red-700',
}
export const URGENCE_LABELS: Record<UrgenceType, string> = { normal: 'Normal', urgent: 'Urgent', critique: 'Critique' }
export const TACHE_COLORS: Record<StatutTache, string> = {
  a_faire: 'bg-gray-100 text-gray-600', en_cours: 'bg-blue-100 text-blue-700', fait: 'bg-green-100 text-green-700',
}
export const SERVICE_LABELS: Record<string, string> = {
  impression: 'Impression', photocopie: 'Photocopie', design: 'Design graphique',
  scan: 'Scan', plastification: 'Plastification', reliure: 'Reliure', autre: 'Autre',
}
export const FACTURE_STATUT_COLORS: Record<string, string> = {
  brouillon: 'bg-gray-100 text-gray-600', envoyee: 'bg-blue-100 text-blue-700',
  payee: 'bg-green-100 text-green-700', annulee: 'bg-red-100 text-red-600',
}
