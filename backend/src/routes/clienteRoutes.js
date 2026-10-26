const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const clienteController = require('../controllers/clienteController');

router.post('/', authMiddleware, clienteController.create);
router.get('/', authMiddleware, clienteController.findAll);
router.get('/:id', authMiddleware, clienteController.findOne);
router.put('/:id', authMiddleware, clienteController.update);
router.get('/:id/historico', authMiddleware, clienteController.historico);
router.delete('/:id', authMiddleware, clienteController.remove);

module.exports = router;