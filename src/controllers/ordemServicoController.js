const OrdemServico = require('../models/OrdemServico');
const Cliente = require('../models/Cliente');
const Veiculo = require('../models/Veiculo');
const { NotFoundError, ValidationError } = require('../utils/errors');

const ordemServicoController = {
  // Abrir ordem de serviço
  async abrir(req, res, next) {
    try {
      const { clienteId, veiculoId } = req.body;

      // Verificar se cliente existe
      const cliente = await Cliente.findById(clienteId);
      if (!cliente) {
        return next(new NotFoundError('Cliente não encontrado'));
      }

      // Verificar se veículo existe
      const veiculo = await Veiculo.findById(veiculoId);
      if (!veiculo) {
        return next(new NotFoundError('Veículo não encontrado'));
      }

      const ordemServico = new OrdemServico(req.body);
      await ordemServico.save();
      
      // Popular dados para resposta
      await ordemServico.populate([
        { path: 'clienteId', select: 'nome cpf telefone' },
        { path: 'veiculoId', select: 'marca modelo ano chassi' }
      ]);
      
      res.status(201).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Listar ordens de serviço
  async listar(req, res, next) {
    try {
      const { status, clienteId } = req.query;
      let filtro = {};

      if (status) filtro.status = status;
      if (clienteId) filtro.clienteId = clienteId;

      const ordensServico = await OrdemServico.find(filtro)
        .populate('clienteId', 'nome cpf telefone')
        .populate('veiculoId', 'marca modelo ano chassi')
        .sort({ dataAbertura: -1 });
      
      res.status(200).json({
        status: 'success',
        results: ordensServico.length,
        data: {
          ordensServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar ordem de serviço por ID
  async buscarPorId(req, res, next) {
    try {
      const ordemServico = await OrdemServico.findById(req.params.id)
        .populate('clienteId', 'nome cpf telefone email')
        .populate('veiculoId', 'marca modelo ano chassi cor');
      
      if (!ordemServico) {
        return next(new NotFoundError('Ordem de serviço não encontrada'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar ordem de serviço
  async atualizar(req, res, next) {
    try {
      const ordemServico = await OrdemServico.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate([
        { path: 'clienteId', select: 'nome cpf telefone' },
        { path: 'veiculoId', select: 'marca modelo ano chassi' }
      ]);

      if (!ordemServico) {
        return next(new NotFoundError('Ordem de serviço não encontrada'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Fechar ordem de serviço
  async fechar(req, res, next) {
    try {
      const { observacoes } = req.body;
      
      const ordemServico = await OrdemServico.findById(req.params.id);
      
      if (!ordemServico) {
        return next(new NotFoundError('Ordem de serviço não encontrada'));
      }

      if (ordemServico.status === 'Concluída') {
        return next(new ValidationError('Ordem de serviço já está concluída'));
      }

      ordemServico.status = 'Concluída';
      ordemServico.dataConclusao = new Date();
      if (observacoes) ordemServico.observacoes = observacoes;

      await ordemServico.save();
      
      await ordemServico.populate([
        { path: 'clienteId', select: 'nome cpf telefone' },
        { path: 'veiculoId', select: 'marca modelo ano chassi' }
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Cancelar ordem de serviço
  async cancelar(req, res, next) {
    try {
      const { observacoes } = req.body;
      
      const ordemServico = await OrdemServico.findById(req.params.id);
      
      if (!ordemServico) {
        return next(new NotFoundError('Ordem de serviço não encontrada'));
      }

      if (ordemServico.status === 'Concluída') {
        return next(new ValidationError('Não é possível cancelar ordem de serviço concluída'));
      }

      ordemServico.status = 'Cancelada';
      if (observacoes) ordemServico.observacoes = observacoes;

      await ordemServico.save();
      
      await ordemServico.populate([
        { path: 'clienteId', select: 'nome cpf telefone' },
        { path: 'veiculoId', select: 'marca modelo ano chassi' }
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Adicionar peças à ordem de serviço
  async adicionarPecas(req, res, next) {
    try {
      const { pecas } = req.body;
      
      const ordemServico = await OrdemServico.findById(req.params.id);
      
      if (!ordemServico) {
        return next(new NotFoundError('Ordem de serviço não encontrada'));
      }

      if (ordemServico.status === 'Concluída' || ordemServico.status === 'Cancelada') {
        return next(new ValidationError('Não é possível adicionar peças a ordem de serviço concluída ou cancelada'));
      }

      ordemServico.pecas.push(...pecas);
      await ordemServico.save();

      await ordemServico.populate([
        { path: 'clienteId', select: 'nome cpf telefone' },
        { path: 'veiculoId', select: 'marca modelo ano chassi' }
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          ordemServico
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ordemServicoController;