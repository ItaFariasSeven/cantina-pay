const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { clienteId, itens } = req.body;

    if (!clienteId || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'clienteId e pelo menos um item são obrigatórios.' });
    }

    for (const item of itens) {
      if (!item.produtoId || !item.quantidade || item.quantidade <= 0) {
        return res.status(400).json({ error: 'Cada item precisa ter produtoId e quantidade maior que zero.' });
      }
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const produtosIds = itens.map(i => i.produtoId);
    const produtos = await prisma.produto.findMany({
      where: { id: { in: produtosIds } }
    });

    if (produtos.length !== produtosIds.length) {
      return res.status(404).json({ error: 'Um ou mais produtos não foram encontrados.' });
    }

    const produtoMap = {};
    for (const p of produtos) {
      produtoMap[p.id] = p;
    }

    let total = 0;
    const itensCompra = itens.map(item => {
      const produto = produtoMap[item.produtoId];
      const precoUnitario = Number(produto.preco);
      const quantidade = Number(item.quantidade);
      const subtotal = precoUnitario * quantidade;
      total += subtotal;

      return {
        produtoId: item.produtoId,
        quantidade,
        precoUnitario
      };
    });

    const result = await prisma.$transaction(async (tx) => {
      const compra = await tx.compra.create({
        data: {
          clienteId,
          total,
          itens: {
            create: itensCompra
          }
        },
        include: {
          itens: {
            include: { produto: true }
          }
        }
      });

      await tx.cliente.update({
        where: { id: clienteId },
        data: {
          saldo: { decrement: total }
        }
      });

      return compra;
    });

    return res.status(201).json({
      message: 'Compra registrada com sucesso.',
      compra: result
    });
  } catch (error) {
    console.error('Erro ao criar compra:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        cliente: true,
        itens: {
          include: { produto: { include: { categoria: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(compras);
  } catch (error) {
    console.error('Erro ao listar compras:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await prisma.compra.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: {
          include: { produto: { include: { categoria: true } } }
        }
      }
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

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await prisma.compra.findUnique({
      where: { id }
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra não encontrada.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.compra.delete({ where: { id } });

      await tx.cliente.update({
        where: { id: compra.clienteId },
        data: {
          saldo: { increment: Number(compra.total) }
        }
      });
    });

    return res.status(200).json({ message: 'Compra cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover compra:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};