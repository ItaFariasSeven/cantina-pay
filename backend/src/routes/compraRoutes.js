const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const compraController = require('../controllers/compraController');

router.post('/', authMiddleware, compraController.create);
router.get('/', authMiddleware, compraController.findAll);
router.get('/:id', authMiddleware, compraController.findOne);
router.delete('/:id', authMiddleware, compraController.remove);

module.exports = router;
