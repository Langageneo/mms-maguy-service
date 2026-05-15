const mongoose = require('mongoose')

const commandeSchema = new mongoose.Schema({
  reference:    { type: String, unique: true },
  client:       { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  typeService:  {
    type: String,
    enum: ['impression', 'photocopie', 'design', 'scan', 'plastification', 'reliure', 'autre'],
    required: true,
  },
  description:         { type: String, required: true },
  format:              { type: String, enum: ['A3', 'A4', 'A5', 'personnalise'], default: 'A4' },
  quantite:            { type: Number, required: true, min: 1 },
  couleur:             { type: String, enum: ['noir_blanc', 'couleur'], default: 'noir_blanc' },
  prixEstime:          { type: Number, required: true },
  prixFinal:           { type: Number },
  avancePaye:          { type: Boolean, default: false },
  montantAvance:       { type: Number, default: 0 },
  urgence:             { type: String, enum: ['normal', 'urgent', 'critique'], default: 'normal' },
  dateDebutProduction: { type: Date },
  dateLivraisonPrevue: { type: Date, required: true },
  dateLivraisonReelle: { type: Date },
  statut: {
    type: String,
    enum: ['en_attente', 'en_traitement', 'impression_en_cours', 'finition', 'pret', 'livre', 'annule'],
    default: 'en_attente',
  },
  tachesAgenda: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }],
}, { timestamps: true })

commandeSchema.pre('save', async function (next) {
  if (!this.reference) {
    const year = new Date().getFullYear()
    const count = await mongoose.model('Commande').countDocuments()
    this.reference = `CMD-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Commande', commandeSchema)
