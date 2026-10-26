const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const pagamentoController = require('../controllers/pagamentoController');

router.post('/', authMiddleware, pagamentoController.create);
router.get('/', authMiddleware, pagamentoController.findAll);
router.get('/:id', authMiddleware, pagamentoController.findOne);
router.delete('/:id', authMiddleware, pagamentoController.remove);

module.exports = router;
