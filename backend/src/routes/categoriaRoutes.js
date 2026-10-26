const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const categoriaController = require('../controllers/categoriaController');

router.post('/', authMiddleware, categoriaController.create);
router.get('/', authMiddleware, categoriaController.findAll);
router.get('/:id', authMiddleware, categoriaController.findOne);
router.put('/:id', authMiddleware, categoriaController.update);
router.delete('/:id', authMiddleware, categoriaController.remove);

module.exports = router;
