const prisma = require('../config/database');

exports.criar = async (req, res) => {
  try {
    const { itens, valorManual, total, clienteId } = req.body;

    if (!clienteId) {
      return res.status(400).json({ error: 'O clienteId é obrigatório.' });
    }

    const compra = await prisma.compra.create({
      data: {
        valorManual: Number(valorManual) || 0,
        total: Number(total) || 0,
        clienteId: clienteId,
        itens: {
          create: (itens || []).map(item => ({
            produtoId: item.produtoId,
            quantidade: Number(item.quantidade),
            precoUnitario: Number(item.precoUnitario)
          }))
        }
      },
      include: {
        itens: true, // Já retorna os itens criados para conferência
      }
    });

    return res.status(201).json(compra);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao criar compra' });
  }
};

exports.vincularCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { clienteId } = req.body;

    if (!clienteId) {
      return res.status(400).json({ error: 'clienteId é obrigatório.' });
    }

    const compra = await prisma.compra.findUnique({
      where: { id },
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra não encontrada.' });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const compraAtualizada = await prisma.compra.update({
      where: { id },
      data: { clienteId },
      include: {
        cliente: true,
        itens: true,
      },
    });

    return res.status(200).json(compraAtualizada);
  } catch (error) {
    console.error('Erro ao vincular cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.listar = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        cliente: true,
        itens: {
          include: { produto: true },
        },
        pagamentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(compras);
  } catch (error) {
    console.error('Erro ao listar compras:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await prisma.compra.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: { produto: true },
        },
        pagamentos: true,
      },
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra não encontrada.' });
    }

    return res.status(200).json(compra);
  } catch (error) {
    console.error('Erro ao buscar compra:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};