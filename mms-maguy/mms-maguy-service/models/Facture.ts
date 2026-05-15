import mongoose, { Schema, Document, Model } from 'mongoose'

const LigneFactureSchema = new Schema({
  description: { type: String, required: true },
  quantite: { type: Number, required: true },
  prixUnitaire: { type: Number, required: true },
  total: { type: Number, required: true },
}, { _id: false })

export interface IFactureDoc extends Document {
  numero: string
  commande?: mongoose.Types.ObjectId
  client: mongoose.Types.ObjectId
  lignes: { description: string; quantite: number; prixUnitaire: number; total: number }[]
  sousTotal: number
  tva?: number
  total: number
  statut: 'brouillon' | 'envoyee' | 'payee' | 'annulee'
  dateEmission?: Date
  dateEcheance?: Date
  notes?: string
  isDevis: boolean
}

const FactureSchema = new Schema<IFactureDoc>(
  {
    numero: { type: String, unique: true },
    commande: { type: Schema.Types.ObjectId, ref: 'Commande' },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    lignes: [LigneFactureSchema],
    sousTotal: { type: Number, required: true },
    tva: { type: Number, default: 0 },
    total: { type: Number, required: true },
    statut: {
      type: String,
      enum: ['brouillon', 'envoyee', 'payee', 'annulee'],
      default: 'brouillon',
    },
    isDevis: { type: Boolean, default: false },
    dateEmission: { type: Date, default: Date.now },
    dateEcheance: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

FactureSchema.pre('save', async function (next) {
  if (!this.numero) {
    const year = new Date().getFullYear()
    const count = await mongoose.model('Facture').countDocuments()
    const prefix = this.isDevis ? 'DEV' : 'FAC'
    this.numero = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

const Facture: Model<IFactureDoc> =
  mongoose.models.Facture || mongoose.model<IFactureDoc>('Facture', FactureSchema)

export default Facture
