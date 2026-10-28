const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const compraRoutes = require('./routes/compraRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Backend CantinaPay rodando!' });
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rotas protegidas
app.use('/clientes', clienteRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/compras', compraRoutes);
app.use('/pagamentos', pagamentoRoutes);

module.exports = app;