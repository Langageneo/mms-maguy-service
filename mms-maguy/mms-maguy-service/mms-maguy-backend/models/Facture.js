const mongoose = require('mongoose')

const ligneSchema = new mongoose.Schema({
  description:  { type: String, required: true },
  quantite:     { type: Number, required: true },
  prixUnitaire: { type: Number, required: true },
  total:        { type: Number, required: true },
}, { _id: false })

const factureSchema = new mongoose.Schema({
  numero:       { type: String, unique: true },
  commande:     { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
  client:       { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  lignes:       [ligneSchema],
  sousTotal:    { type: Number, required: true },
  tva:          { type: Number, default: 0 },
  total:        { type: Number, required: true },
  statut:       { type: String, enum: ['brouillon', 'envoyee', 'payee', 'annulee'], default: 'brouillon' },
  isDevis:      { type: Boolean, default: false },
  dateEmission: { type: Date, default: Date.now },
  dateEcheance: { type: Date },
  notes:        { type: String },
}, { timestamps: true })

factureSchema.pre('save', async function (next) {
  if (!this.numero) {
    const year = new Date().getFullYear()
    const count = await mongoose.model('Facture').countDocuments()
    const prefix = this.isDevis ? 'DEV' : 'FAC'
    this.numero = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

module.exports = mongoose.model('Facture', factureSchema)
