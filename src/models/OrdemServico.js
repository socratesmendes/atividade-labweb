const mongoose = require('mongoose');

const ordemServicoSchema = new mongoose.Schema({
  numero: {
    type: String,
    unique: true
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  veiculoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Veiculo',
    required: [true, 'Veículo é obrigatório']
  },
  descricaoProblema: {
    type: String,
    required: [true, 'Descrição do problema é obrigatória'],
    minlength: [10, 'Descrição deve ter pelo menos 10 caracteres'],
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  servicos: [{
    type: String,
    trim: true
  }],
  pecas: [{
    nome: {
      type: String,
      required: true,
      trim: true
    },
    preco: {
      type: Number,
      required: true,
      min: [0, 'Preço da peça não pode ser negativo']
    },
    quantidade: {
      type: Number,
      required: true,
      min: [1, 'Quantidade deve ser pelo menos 1']
    }
  }],
  status: {
    type: String,
    enum: {
      values: ['Aberta', 'Em Andamento', 'Aguardando Peças', 'Concluída', 'Cancelada'],
      message: 'Status deve ser: Aberta, Em Andamento, Aguardando Peças, Concluída ou Cancelada'
    },
    default: 'Aberta'
  },
  dataAbertura: {
    type: Date,
    default: Date.now
  },
  dataConclusao: {
    type: Date
  },
  valorTotal: {
    type: Number,
    min: [0, 'Valor total não pode ser negativo']
  },
  observacoes: {
    type: String,
    maxlength: [1000, 'Observações devem ter no máximo 1000 caracteres']
  }
}, {
  timestamps: true
});

// Gerar número da ordem de serviço automaticamente
ordemServicoSchema.pre('save', async function(next) {
  if (!this.numero) {
    const count = await this.constructor.countDocuments();
    this.numero = `OS${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calcular valor total automaticamente
ordemServicoSchema.pre('save', function(next) {
  if (this.pecas && this.pecas.length > 0) {
    this.valorTotal = this.pecas.reduce((total, peca) => {
      return total + (peca.preco * peca.quantidade);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('OrdemServico', ordemServicoSchema);