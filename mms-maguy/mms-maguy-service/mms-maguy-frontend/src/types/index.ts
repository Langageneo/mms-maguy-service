export type ClientType = 'particulier' | 'entreprise' | 'association' | 'revendeur'
export interface IClient {
  _id?: string; type: ClientType; nom: string; telephone: string
  whatsapp?: string; email?: string; adresse?: string; notes?: string
  createdAt?: string; updatedAt?: string
}

export type ServiceType = 'impression' | 'photocopie' | 'design' | 'scan' | 'plastification' | 'reliure' | 'autre'
export type FormatType = 'A3' | 'A4' | 'A5' | 'personnalise'
export type CouleurType = 'noir_blanc' | 'couleur'
export type UrgenceType = 'normal' | 'urgent' | 'critique'
export type StatutCommande = 'en_attente' | 'en_traitement' | 'impression_en_cours' | 'finition' | 'pret' | 'livre' | 'annule' | 'en_retard'

export interface ICommande {
  _id?: string; reference?: string; client: IClient | string
  typeService: ServiceType; description: string; format: FormatType
  quantite: number; couleur: CouleurType; prixEstime: number
  prixFinal?: number; avancePaye: boolean; montantAvance?: number
  urgence: UrgenceType; dateCreation?: string; dateDebutProduction?: string
  dateLivraisonPrevue: string; dateLivraisonReelle?: string
  statut: StatutCommande; tachesAgenda?: ITache[]; createdAt?: string
}

export type StatutTache = 'a_faire' | 'en_cours' | 'fait'
export type TypeTache = 'impression' | 'finition' | 'livraison'
export interface ITache {
  _id?: string; commande: ICommande | string; type: TypeTache
  titre: string; dateEcheance: string; statut: StatutTache; notes?: string
}

export type StatutFacture = 'brouillon' | 'envoyee' | 'payee' | 'annulee'
export interface ILigneFacture { description: string; quantite: number; prixUnitaire: number; total: number }
export interface IFacture {
  _id?: string; numero?: string; commande?: ICommande | string
  client: IClient | string; lignes: ILigneFacture[]
  sousTotal: number; tva?: number; total: number
  statut: StatutFacture; isDevis?: boolean
  dateEmission?: string; dateEcheance?: string; notes?: string; createdAt?: string
}

export interface IDashboardStats {
  totalCommandes: number; totalClients: number; tachesRetard: number
  tachesFaites: number; revenue: number; commandesEnRetard: number
}
