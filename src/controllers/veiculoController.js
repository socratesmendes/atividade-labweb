const Veiculo = require('../models/Veiculo');
const { NotFoundError, ConflictError } = require('../utils/errors');

const veiculoController = {
  // Criar veícul
  async criar(req, res, next) {
    try {
      const veiculo = new Veiculo(req.body);
      await veiculo.save();
      
      res.status(201).json({
        status: 'success',
        data: {
          veiculo
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(new ConflictError('Chassi já cadastrado'));
      }
      next(error);
    }
  },

  // Listar todos os veículos
  async listar(req, res, next) {
    try {
      const veiculos = await Veiculo.find().populate('clienteId', 'nome cpf');
      
      res.status(200).json({
        status: 'success',
        results: veiculos.length,
        data: {
          veiculos
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar veículo por ID
  async buscarPorId(req, res, next) {
    try {
      const veiculo = await Veiculo.findById(req.params.id).populate('clienteId', 'nome cpf');
      
      if (!veiculo) {
        return next(new NotFoundError('Veículo não encontrado'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          veiculo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar veículo
  async atualizar(req, res, next) {
    try {
      const veiculo = await Veiculo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('clienteId', 'nome cpf');

      if (!veiculo) {
        return next(new NotFoundError('Veículo não encontrado'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          veiculo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Excluir veículo
  async excluir(req, res, next) {
    try {
      const veiculo = await Veiculo.findById(req.params.id).populate('clienteId', 'nome cpf');

      if (!veiculo) {
        return next(new NotFoundError('Veículo não encontrado'));
      }

      // Realizar deletee
      await Veiculo.findByIdAndDelete(req.params.id);

      const proprietario = veiculo.clienteId ? 
        ` (proprietário: ${veiculo.clienteId.nome})` : 
        ' (sem proprietário)';

      res.status(200).json({
        status: 'success',
        message: `O veículo "${veiculo.marca} ${veiculo.modelo}" foi deletado com sucesso`,
        data: {
          veiculoExcluido: {
            id: veiculo._id,
            marca: veiculo.marca,
            modelo: veiculo.modelo,
            ano: veiculo.ano,
            chassi: veiculo.chassi,
            cor: veiculo.cor,
            proprietario: veiculo.clienteId ? {
              id: veiculo.clienteId._id,
              nome: veiculo.clienteId.nome,
              cpf: veiculo.clienteId.cpf
            } : null,
            dataExclusao: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = veiculoController;