const express = require('express');
const clienteController = require('../controllers/clienteController');
const { 
  validate, 
  clienteCreateSchema, 
  clienteUpdateSchema 
} = require('../middlewares/validation');

const router = express.Router();

router
  .route('/')
  .get(clienteController.listar)
  .post(validate(clienteCreateSchema), clienteController.criar);

router
  .route('/:id')
  .get(clienteController.buscarPorId)
  .put(validate(clienteUpdateSchema), clienteController.atualizar)
  .delete(clienteController.excluir);

module.exports = router;