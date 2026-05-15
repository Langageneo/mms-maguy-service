import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isPast, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { StatutCommande, UrgenceType, StatutTache } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: fr })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy 'à' HH:mm", { locale: fr })
}

export function generateReference(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `CMD-${year}-${rand}`
}

export function generateFactureNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `FAC-${year}-${rand}`
}

export function computeStatut(statut: StatutCommande, dateLivraisonPrevue: string): StatutCommande {
  if (['livre', 'annule'].includes(statut)) return statut
  if (isPast(new Date(dateLivraisonPrevue)) && !isToday(new Date(dateLivraisonPrevue))) {
    return 'en_retard'
  }
  return statut
}

export const STATUT_LABELS: Record<StatutCommande, string> = {
  en_attente: 'En attente',
  en_traitement: 'En traitement',
  impression_en_cours: 'Impression',
  finition: 'Finition',
  pret: 'Prêt',
  livre: 'Livré',
  annule: 'Annulé',
  en_retard: 'En retard',
}

export const STATUT_COLORS: Record<StatutCommande, string> = {
  en_attente: 'bg-gray-100 text-gray-700',
  en_traitement: 'bg-blue-100 text-blue-700',
  impression_en_cours: 'bg-indigo-100 text-indigo-700',
  finition: 'bg-purple-100 text-purple-700',
  pret: 'bg-green-100 text-green-700',
  livre: 'bg-emerald-100 text-emerald-700',
  annule: 'bg-red-100 text-red-600',
  en_retard: 'bg-red-100 text-red-700',
}

export const URGENCE_COLORS: Record<UrgenceType, string> = {
  normal: 'bg-gray-100 text-gray-600',
  urgent: 'bg-orange-100 text-orange-700',
  critique: 'bg-red-100 text-red-700',
}

export const URGENCE_LABELS: Record<UrgenceType, string> = {
  normal: 'Normal',
  urgent: 'Urgent',
  critique: 'Critique',
}

export const TACHE_STATUT_COLORS: Record<StatutTache, string> = {
  a_faire: 'bg-gray-100 text-gray-600',
  en_cours: 'bg-blue-100 text-blue-700',
  fait: 'bg-green-100 text-green-700',
}

export const SERVICE_LABELS: Record<string, string> = {
  impression: 'Impression',
  photocopie: 'Photocopie',
  design: 'Design graphique',
  scan: 'Scan',
  plastification: 'Plastification',
  reliure: 'Reliure',
  autre: 'Autre',
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(montant)
}
