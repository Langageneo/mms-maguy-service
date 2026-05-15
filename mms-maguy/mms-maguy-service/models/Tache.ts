import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITacheDoc extends Document {
  commande: mongoose.Types.ObjectId
  type: 'impression' | 'finition' | 'livraison'
  titre: string
  dateEcheance: Date
  statut: 'a_faire' | 'en_cours' | 'fait'
  notes?: string
}

const TacheSchema = new Schema<ITacheDoc>(
  {
    commande: { type: Schema.Types.ObjectId, ref: 'Commande', required: true },
    type: {
      type: String,
      enum: ['impression', 'finition', 'livraison'],
      required: true,
    },
    titre: { type: String, required: true },
    dateEcheance: { type: Date, required: true },
    statut: {
      type: String,
      enum: ['a_faire', 'en_cours', 'fait'],
      default: 'a_faire',
    },
    notes: { type: String },
  },
  { timestamps: true }
)

const Tache: Model<ITacheDoc> =
  mongoose.models.Tache || mongoose.model<ITacheDoc>('Tache', TacheSchema)

export default Tache
