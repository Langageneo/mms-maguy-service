const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['particulier', 'entreprise', 'association', 'revendeur'],
    default: 'particulier',
    required: true,
  },
  nom:       { type: String, required: true, trim: true },
  telephone: { type: String, required: true, trim: true },
  whatsapp:  { type: String, trim: true },
  email:     { type: String, trim: true, lowercase: true },
  adresse:   { type: String, trim: true },
  notes:     { type: String },
}, { timestamps: true })

clientSchema.index({ nom: 'text', telephone: 'text' })

module.exports = mongoose.model('Client', clientSchema)
