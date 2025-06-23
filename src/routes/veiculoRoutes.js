const express = require('express');
const veiculoController = require('../controllers/veiculoController');
const { 
  validate, 
  veiculoCreateSchema, 
  veiculoUpdateSchema 
} = require('../middlewares/validation');

const router = express.Router();

router
  .route('/')
  .get(veiculoController.listar)
  .post(validate(veiculoCreateSchema), veiculoController.criar);

router
  .route('/:id')
  .get(veiculoController.buscarPorId)
  .put(validate(veiculoUpdateSchema), veiculoController.atualizar)
  .delete(veiculoController.excluir);

module.exports = router;