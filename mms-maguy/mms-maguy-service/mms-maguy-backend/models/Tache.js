const mongoose = require('mongoose')

const tacheSchema = new mongoose.Schema({
  commande:     { type: mongoose.Schema.Types.ObjectId, ref: 'Commande', required: true },
  type:         { type: String, enum: ['impression', 'finition', 'livraison'], required: true },
  titre:        { type: String, required: true },
  dateEcheance: { type: Date, required: true },
  statut:       { type: String, enum: ['a_faire', 'en_cours', 'fait'], default: 'a_faire' },
  notes:        { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Tache', tacheSchema)
