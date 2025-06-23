const Joi = require('joi');
const { ValidationError } = require('../utils/errors');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(new ValidationError(message));
    }
    next();
  };
};

const concessionariaCreateSchema = Joi.object({
  nome: Joi.string().required().min(2).max(100),
  cnpj: Joi.string().required().pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  endereco: Joi.object({
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    bairro: Joi.string().required(),
    cidade: Joi.string().required(),
    estado: Joi.string().required().length(2),
    cep: Joi.string().required().pattern(/^\d{5}-\d{3}$/)
  }).required(),
  telefone: Joi.string().required(),
  email: Joi.string().email().required()
});

const clienteCreateSchema = Joi.object({
  nome: Joi.string().required().min(2).max(100),
  cpf: Joi.string().required().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  email: Joi.string().email().required(),
  telefone: Joi.string().required(),
  endereco: Joi.object({
    rua: Joi.string().required(),
    numero: Joi.string().required(),
    bairro: Joi.string().required(),
    cidade: Joi.string().required(),
    estado: Joi.string().required().length(2),
    cep: Joi.string().required().pattern(/^\d{5}-\d{3}$/)
  }).required(),
  dataNascimento: Joi.date().required()
});

const veiculoCreateSchema = Joi.object({
  marca: Joi.string().required().min(2).max(50),
  modelo: Joi.string().required().min(2).max(50),
  ano: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  chassi: Joi.string().required().length(17),
  cor: Joi.string().required(),
  combustivel: Joi.string().valid('Gasolina', 'Álcool', 'Flex', 'Diesel', 'Elétrico', 'Híbrido').required(),
  quilometragem: Joi.number().min(0).default(0),
  preco: Joi.number().min(0),
  status: Joi.string().valid('Disponível', 'Vendido', 'Em Manutenção').default('Disponível'),
  clienteId: Joi.string().hex().length(24)
});

const ordemServicoCreateSchema = Joi.object({
  clienteId: Joi.string().hex().length(24).required(),
  veiculoId: Joi.string().hex().length(24).required(),
  descricaoProblema: Joi.string().required().min(10).max(500),
  servicos: Joi.array().items(Joi.string()).default([]),
  pecas: Joi.array().items(Joi.object({
    nome: Joi.string().required(),
    preco: Joi.number().min(0).required(),
    quantidade: Joi.number().integer().min(1).required()
  })).default([])
});

const concessionariaUpdateSchema = Joi.object({
  nome: Joi.string().min(2).max(100),
  cnpj: Joi.string().pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
  endereco: Joi.object({
    rua: Joi.string(),
    numero: Joi.string(),
    bairro: Joi.string(),
    cidade: Joi.string(),
    estado: Joi.string().length(2),
    cep: Joi.string().pattern(/^\d{5}-\d{3}$/)
  }),
  telefone: Joi.string(),
  email: Joi.string().email(),
  ativo: Joi.boolean()
}).min(1); // Pelo menos um campo deve ser fornecido

const clienteUpdateSchema = Joi.object({
  nome: Joi.string().min(2).max(100),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
  email: Joi.string().email(),
  telefone: Joi.string(),
  endereco: Joi.object({
    rua: Joi.string(),
    numero: Joi.string(),
    bairro: Joi.string(),
    cidade: Joi.string(),
    estado: Joi.string().length(2),
    cep: Joi.string().pattern(/^\d{5}-\d{3}$/)
  }),
  dataNascimento: Joi.date(),
  ativo: Joi.boolean()
}).min(1);

const veiculoUpdateSchema = Joi.object({
  marca: Joi.string().min(2).max(50),
  modelo: Joi.string().min(2).max(50),
  ano: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  chassi: Joi.string().length(17),
  cor: Joi.string(),
  combustivel: Joi.string().valid('Gasolina', 'Álcool', 'Flex', 'Diesel', 'Elétrico', 'Híbrido'),
  quilometragem: Joi.number().min(0),
  preco: Joi.number().min(0),
  status: Joi.string().valid('Disponível', 'Vendido', 'Em Manutenção'),
  clienteId: Joi.string().hex().length(24).allow(null)
}).min(1);

const ordemServicoUpdateSchema = Joi.object({
  descricaoProblema: Joi.string().min(10).max(500),
  servicos: Joi.array().items(Joi.string()),
  pecas: Joi.array().items(Joi.object({
    nome: Joi.string().required(),
    preco: Joi.number().min(0).required(),
    quantidade: Joi.number().integer().min(1).required()
  })),
  status: Joi.string().valid('Aberta', 'Em Andamento', 'Aguardando Peças', 'Concluída', 'Cancelada'),
  observacoes: Joi.string().max(1000)
}).min(1);

const fecharOrdemSchema = Joi.object({
  observacoes: Joi.string().max(1000)
});

const cancelarOrdemSchema = Joi.object({
  observacoes: Joi.string().required().min(10).max(1000)
});

const adicionarPecasSchema = Joi.object({
  pecas: Joi.array().items(Joi.object({
    nome: Joi.string().required(),
    preco: Joi.number().min(0).required(),
    quantidade: Joi.number().integer().min(1).required()
  })).min(1).required()
});

module.exports = {
  validate,
  concessionariaCreateSchema,
  clienteCreateSchema,
  veiculoCreateSchema,
  ordemServicoCreateSchema,
  concessionariaUpdateSchema,
  clienteUpdateSchema,
  veiculoUpdateSchema,
  ordemServicoUpdateSchema,
  fecharOrdemSchema,
  cancelarOrdemSchema,
  adicionarPecasSchema,
  concessionariaSchema: concessionariaCreateSchema,
  clienteSchema: clienteCreateSchema,
  veiculoSchema: veiculoCreateSchema,
  ordemServicoSchema: ordemServicoCreateSchema
};