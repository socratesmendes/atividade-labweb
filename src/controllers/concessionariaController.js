const Concessionaria = require('../models/Concessionaria');
const { NotFoundError, ConflictError } = require('../utils/errors');

const concessionariaController = {
  // Criar concessionária
  async criar(req, res, next) {
    try {
      const concessionaria = new Concessionaria(req.body);
      await concessionaria.save();
      
      res.status(201).json({
        status: 'success',
        data: {
          concessionaria
        }
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(new ConflictError('CNPJ ou email já cadastrado'));
      }
      next(error);
    }
  },

  // Listar todas as concessionárias
  async listar(req, res, next) {
    try {
      const concessionarias = await Concessionaria.find();
      
      res.status(200).json({
        status: 'success',
        results: concessionarias.length,
        data: {
          concessionarias
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar concessionária por ID
  async buscarPorId(req, res, next) {
    try {
      const concessionaria = await Concessionaria.findById(req.params.id);
      
      if (!concessionaria) {
        return next(new NotFoundError('Concessionária não encontrada'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          concessionaria
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar concessionária
  async atualizar(req, res, next) {
    try {
      const concessionaria = await Concessionaria.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!concessionaria) {
        return next(new NotFoundError('Concessionária não encontrada'));
      }

      res.status(200).json({
        status: 'success',
        data: {
          concessionaria
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Excluir concessionária
  async excluir(req, res, next) {
    try {
      const concessionaria = await Concessionaria.findById(req.params.id);

      if (!concessionaria) {
        return next(new NotFoundError('Concessionária não encontrada'));
      }

      // Realizar delete
      await Concessionaria.findByIdAndDelete(req.params.id);

      res.status(200).json({
        status: 'success',
        message: `A concessionária "${concessionaria.nome}" foi deletada com sucesso`,
        data: {
          concessionariaExcluida: {
            id: concessionaria._id,
            nome: concessionaria.nome,
            cnpj: concessionaria.cnpj,
            email: concessionaria.email,
            dataExclusao: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = concessionariaController;