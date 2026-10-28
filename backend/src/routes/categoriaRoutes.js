const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const categoriaController = require('../controllers/categoriaController');

// Importações do Multer
const multer = require('multer');
const multerConfig = require('../config/multer');
const upload = multer(multerConfig);

router.post('/', authMiddleware, upload.single('icone'), categoriaController.create);
router.get('/', authMiddleware, categoriaController.findAll);
router.get('/:id', authMiddleware, categoriaController.findOne);
router.put('/:id', authMiddleware, upload.single('icone'), categoriaController.update);
router.delete('/:id', authMiddleware, categoriaController.remove);

module.exports = router;
