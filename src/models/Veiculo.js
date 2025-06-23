const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'Marca é obrigatória'],
    trim: true,
    maxlength: [50, 'Marca deve ter no máximo 50 caracteres']
  },
  modelo: {
    type: String,
    required: [true, 'Modelo é obrigatório'],
    trim: true,
    maxlength: [50, 'Modelo deve ter no máximo 50 caracteres']
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: [1900, 'Ano deve ser maior que 1900'],
    max: [new Date().getFullYear() + 1, 'Ano não pode ser maior que o próximo ano']
  },
  chassi: {
    type: String,
    required: [true, 'Chassi é obrigatório'],
    unique: true,
    length: [17, 'Chassi deve ter exatamente 17 caracteres'],
    uppercase: true
  },
  cor: {
    type: String,
    required: [true, 'Cor é obrigatória'],
    trim: true
  },
  combustivel: {
    type: String,
    required: [true, 'Combustível é obrigatório'],
    enum: {
      values: ['Gasolina', 'Álcool', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'],
      message: 'Combustível deve ser: Gasolina, Álcool, Flex, Diesel, Elétrico ou Híbrido'
    }
  },
  quilometragem: {
    type: Number,
    default: 0,
    min: [0, 'Quilometragem não pode ser negativa']
  },
  preco: {
    type: Number,
    min: [0, 'Preço não pode ser negativo']
  },
  status: {
    type: String,
    enum: {
      values: ['Disponível', 'Vendido', 'Em Manutenção'],
      message: 'Status deve ser: Disponível, Vendido ou Em Manutenção'
    },
    default: 'Disponível'
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Veiculo', veiculoSchema);