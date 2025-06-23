const express = require('express');
const concessionariaController = require('../controllers/concessionariaController');
const { 
  validate, 
  concessionariaCreateSchema, 
  concessionariaUpdateSchema 
} = require('../middlewares/validation');

const router = express.Router();

router
  .route('/')
  .get(concessionariaController.listar)
  .post(validate(concessionariaCreateSchema), concessionariaController.criar);

router
  .route('/:id')
  .get(concessionariaController.buscarPorId)
  .put(validate(concessionariaUpdateSchema), concessionariaController.atualizar)
  .delete(concessionariaController.excluir);

module.exports = router;