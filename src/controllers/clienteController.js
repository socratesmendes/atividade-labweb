const Cliente = require('../models/Cliente');
const { NotFoundError, ConflictError } = require('../utils/errors');

const clienteController = {
  // Criar cliente
  async criar(req, res, next) {
    try {
      const cliente = new Cliente(req.body);
      await cliente.save();
      
      res.status(201).json({
        status: 'success',
        data: {
          cliente
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(new ConflictError('CPF ou email já cadastrado'));
      }
      next(error);
    }
  },

  // Listar todos os clientes
  async listar(req, res, next) {
    try {
      const clientes = await Cliente.find();
      
      res.status(200).json({
        status: 'success',
        results: clientes.length,
        data: {
          clientes
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar cliente por ID
  async buscarPorId(req, res, next) {
    try {
      const cliente = await Cliente.findById(req.params.id);
      
      if (!cliente) {
        return next(new NotFoundError('Cliente não encontrado'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          cliente
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar cliente
  async atualizar(req, res, next) {
    try {
      const cliente = await Cliente.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!cliente) {
        return next(new NotFoundError('Cliente não encontrado'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          cliente
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Excluir cliente
  async excluir(req, res, next) {
    try {
      const cliente = await Cliente.findById(req.params.id);

      if (!cliente) {
        return next(new NotFoundError('Cliente não encontrado'));
      }

      // Realizar delete
      await Cliente.findByIdAndDelete(req.params.id);

      res.status(200).json({
        status: 'success',
        message: `O cliente "${cliente.nome}" foi deletado com sucesso`,
        data: {
          clienteExcluido: {
            id: cliente._id,
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email,
            dataExclusao: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = clienteController;