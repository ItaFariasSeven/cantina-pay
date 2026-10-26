const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { clienteId, valor } = req.body;

    if (!clienteId || valor === undefined || valor === null) {
      return res.status(400).json({ error: 'clienteId e valor são obrigatórios.' });
    }

    if (valor <= 0) {
      return res.status(400).json({ error: 'O valor do pagamento deve ser maior que zero.' });
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: clienteId } });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const pagamento = await prisma.$transaction(async (tx) => {
      const novoPagamento = await tx.pagamento.create({
        data: {
          clienteId,
          valor: Number(valor),
        },
      });

      await tx.cliente.update({
        where: { id: clienteId },
        data: {
          saldo: {
            increment: Number(valor),
          },
        },
      });

      return novoPagamento;
    });

    return res.status(201).json({
      message: 'Pagamento registrado com sucesso.',
      pagamento,
    });
  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      include: {
        cliente: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(pagamentos);
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const pagamento = await prisma.pagamento.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    });

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    return res.status(200).json(pagamento);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const pagamento = await prisma.pagamento.findUnique({
      where: { id },
    });

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.cliente.update({
        where: { id: pagamento.clienteId },
        data: {
          saldo: {
            decrement: Number(pagamento.valor),
          },
        },
      });

      await tx.pagamento.delete({
        where: { id },
      });
    });

    return res.status(200).json({ message: 'Pagamento cancelado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
