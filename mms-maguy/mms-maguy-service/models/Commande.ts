import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICommandeDoc extends Document {
  reference: string
  client: mongoose.Types.ObjectId
  typeService: 'impression' | 'photocopie' | 'design' | 'scan' | 'plastification' | 'reliure' | 'autre'
  description: string
  format: 'A3' | 'A4' | 'A5' | 'personnalise'
  quantite: number
  couleur: 'noir_blanc' | 'couleur'
  prixEstime: number
  prixFinal?: number
  avancePaye: boolean
  montantAvance?: number
  urgence: 'normal' | 'urgent' | 'critique'
  dateDebutProduction?: Date
  dateLivraisonPrevue: Date
  dateLivraisonReelle?: Date
  statut: 'en_attente' | 'en_traitement' | 'impression_en_cours' | 'finition' | 'pret' | 'livre' | 'annule'
  tachesAgenda: mongoose.Types.ObjectId[]
}

const CommandeSchema = new Schema<ICommandeDoc>(
  {
    reference: { type: String, unique: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    typeService: {
      type: String,
      enum: ['impression', 'photocopie', 'design', 'scan', 'plastification', 'reliure', 'autre'],
      required: true,
    },
    description: { type: String, required: true },
    format: { type: String, enum: ['A3', 'A4', 'A5', 'personnalise'], default: 'A4' },
    quantite: { type: Number, required: true, min: 1 },
    couleur: { type: String, enum: ['noir_blanc', 'couleur'], default: 'noir_blanc' },
    prixEstime: { type: Number, required: true },
    prixFinal: { type: Number },
    avancePaye: { type: Boolean, default: false },
    montantAvance: { type: Number, default: 0 },
    urgence: { type: String, enum: ['normal', 'urgent', 'critique'], default: 'normal' },
    dateDebutProduction: { type: Date },
    dateLivraisonPrevue: { type: Date, required: true },
    dateLivraisonReelle: { type: Date },
    statut: {
      type: String,
      enum: ['en_attente', 'en_traitement', 'impression_en_cours', 'finition', 'pret', 'livre', 'annule'],
      default: 'en_attente',
    },
    tachesAgenda: [{ type: Schema.Types.ObjectId, ref: 'Tache' }],
  },
  { timestamps: true }
)

// Auto-generate reference before save
CommandeSchema.pre('save', async function (next) {
  if (!this.reference) {
    const year = new Date().getFullYear()
    const count = await mongoose.model('Commande').countDocuments()
    this.reference = `CMD-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

const Commande: Model<ICommandeDoc> =
  mongoose.models.Commande || mongoose.model<ICommandeDoc>('Commande', CommandeSchema)

export default Commande
