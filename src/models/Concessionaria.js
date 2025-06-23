const mongoose = require('mongoose');

const concessionariaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v);
      },
      message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'
    }
  },
  endereco: {
    rua: { type: String, required: true },
    numero: { type: String, required: true },
    bairro: { type: String, required: true },
    cidade: { type: String, required: true },
    estado: { type: String, required: true, maxlength: 2 },
    cep: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{5}-\d{3}$/.test(v);
        },
        message: 'CEP deve estar no formato XXXXX-XXX'
      }
    }
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email inválido'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Concessionaria', concessionariaSchema);