const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { compraId, valor } = req.body;

    if (!compraId || valor === undefined || valor === null) {
      return res.status(400).json({ error: 'compraId e valor são obrigatórios.' });
    }

    const valorPagamento = Number(valor);

    if (valorPagamento <= 0) {
      return res.status(400).json({ error: 'O valor do pagamento deve ser maior que zero.' });
    }

    // Busca a compra COM os pagamentos já feitos nela para sabermos o saldo
    const compra = await prisma.compra.findUnique({ 
      where: { id: Number(compraId) },
      include: { pagamentos: true }
    });

    if (!compra) {
      return res.status(404).json({ error: 'Compra não encontrada.' });
    }

    // Calcula o saldo devedor atual da compra
    const totalPagoAteAgora = compra.pagamentos.reduce((acc, p) => acc + Number(p.valor), 0);
    const valorDaCompra = Number(compra.total);
    const saldoDevedor = valorDaCompra - totalPagoAteAgora;

    // Trava de segurança no backend
    if (valorPagamento > saldoDevedor) {
      return res.status(400).json({ error: `O valor excede o saldo devedor da compra (R$ ${saldoDevedor.toFixed(2)}).` });
    }

    const pagamento = await prisma.$transaction(async (tx) => {
      // Cria o pagamento vinculado à compra e ao cliente
      const novoPagamento = await tx.pagamento.create({
        data: {
          compraId: compra.id,
          clienteId: compra.clienteId, 
          valor: valorPagamento,
        },
      });

      // Atualiza o saldo do cliente (abatendo a dívida total dele)
      if (compra.clienteId) {
        await tx.cliente.update({
          where: { id: compra.clienteId },
          data: {
            saldo: {
              increment: valorPagamento,
            },
          },
        });
      }

      // Verifica se o pagamento de agora quitou a compra 100%
      const novoTotalPago = totalPagoAteAgora + valorPagamento;
      
      // Se quitou totalmente, muda o status para "paga" para ela sumir da tela
      if (novoTotalPago >= valorDaCompra) {
        await tx.compra.update({
          where: { id: compra.id },
          data: { status: 'paga' }
        });
      }

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
        compra: {
          include: {
            cliente: true,
          },
        },
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
      where: { id: Number(id) },
      include: {
        cliente: true,
        compra: {
          include: {
            cliente: true,
          },
        },
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
      where: { id: Number(id) },
    });

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    await prisma.$transaction(async (tx) => {
      // Reverte o saldo do cliente
      if (pagamento.clienteId) {
        await tx.cliente.update({
          where: { id: pagamento.clienteId },
          data: {
            saldo: {
              decrement: Number(pagamento.valor),
            },
          },
        });
      }
      
      // Deleta o pagamento
      await tx.pagamento.delete({
        where: { id: Number(id) },
      });
      
      // Ao deletar um pagamento, a compra volta a ficar pendente
      if (pagamento.compraId) {
        await tx.compra.update({
           where: { id: pagamento.compraId },
           data: { status: 'pendente' }
        });
      }
    });

    return res.status(200).json({ message: 'Pagamento cancelado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};