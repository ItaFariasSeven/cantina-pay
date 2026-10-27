const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const compraController = require('../controllers/compraController');

router.post('/', authMiddleware, compraController.criar);
router.get('/', authMiddleware, compraController.listar);
router.get('/:id', authMiddleware, compraController.buscarPorId);
router.patch('/:id/vincular-cliente', authMiddleware, compraController.vincularCliente);

module.exports = router;
