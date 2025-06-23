const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v);
      },
      message: 'CPF deve estar no formato XXX.XXX.XXX-XX'
    }
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
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório']
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
  dataNascimento: {
    type: Date,
    required: [true, 'Data de nascimento é obrigatória']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cliente', clienteSchema);