const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const produtoController = require('../controllers/produtoController');

router.post('/', authMiddleware, produtoController.create);
router.get('/', authMiddleware, produtoController.findAll);
router.get('/:id', authMiddleware, produtoController.findOne);
router.put('/:id', authMiddleware, produtoController.update);
router.delete('/:id', authMiddleware, produtoController.remove);

module.exports = router;
