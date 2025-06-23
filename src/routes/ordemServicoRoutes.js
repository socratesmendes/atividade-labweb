const express = require('express');
const ordemServicoController = require('../controllers/ordemServicoController');
const { 
  validate, 
  ordemServicoCreateSchema, 
  ordemServicoUpdateSchema,
  fecharOrdemSchema,
  cancelarOrdemSchema,
  adicionarPecasSchema
} = require('../middlewares/validation');

const router = express.Router();

router
  .route('/')
  .get(ordemServicoController.listar)
  .post(validate(ordemServicoCreateSchema), ordemServicoController.abrir);

router
  .route('/:id')
  .get(ordemServicoController.buscarPorId)
  .put(validate(ordemServicoUpdateSchema), ordemServicoController.atualizar);

router.put('/:id/fechar', validate(fecharOrdemSchema), ordemServicoController.fechar);
router.put('/:id/cancelar', validate(cancelarOrdemSchema), ordemServicoController.cancelar);
router.put('/:id/pecas', validate(adicionarPecasSchema), ordemServicoController.adicionarPecas);

module.exports = router;