import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IClientDoc extends Document {
  type: 'particulier' | 'entreprise' | 'association' | 'revendeur'
  nom: string
  telephone: string
  whatsapp?: string
  email?: string
  adresse?: string
  notes?: string
}

const ClientSchema = new Schema<IClientDoc>(
  {
    type: {
      type: String,
      enum: ['particulier', 'entreprise', 'association', 'revendeur'],
      required: true,
      default: 'particulier',
    },
    nom: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    adresse: { type: String, trim: true },
    notes: { type: String },
  },
  { timestamps: true }
)

ClientSchema.index({ nom: 'text', telephone: 'text' })

const Client: Model<IClientDoc> =
  mongoose.models.Client || mongoose.model<IClientDoc>('Client', ClientSchema)

export default Client
