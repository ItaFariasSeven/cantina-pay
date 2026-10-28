const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { nomeAluno, nomePai } = req.body;

    if (!nomeAluno || !nomePai) {
      return res.status(400).json({ error: 'Nome do aluno e nome do pai são obrigatórios.' });
    }

    const cliente = await prisma.cliente.create({
      data: { nomeAluno, nomePai }
    });

    return res.status(201).json(cliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nomeAluno: 'asc' } // O ERRO ESTAVA AQUI! Agora ele busca pelo nomeAluno!
    });
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({ where: { id } });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nomeAluno, nomePai, saldo } = req.body;

    const clienteExistente = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: { nomeAluno, nomePai, saldo }
    });

    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const clienteExistente = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    await prisma.cliente.delete({ where: { id } });
    return res.status(200).json({ message: 'Cliente removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover cliente:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.historico = async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const [compras, pagamentos] = await Promise.all([
      prisma.compra.findMany({
        where: { clienteId: id },
        include: {
          itens: {
            include: { produto: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.pagamento.findMany({
        where: { clienteId: id },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const movimentacoes = [];

    for (const compra of compras) {
      const descricao = compra.itens
        .map(item => `${item.produto.nome} x${item.quantidade}`)
        .join(', ');

      movimentacoes.push({
        id: compra.id,
        tipo: 'compra',
        data: compra.createdAt,
        descricao,
        valor: -Number(compra.total)
      });
    }

    for (const pagamento of pagamentos) {
      movimentacoes.push({
        id: pagamento.id,
        tipo: 'pagamento',
        data: pagamento.createdAt,
        descricao: 'Pagamento',
        valor: Number(pagamento.valor)
      });
    }

    movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    return res.status(200).json({
      cliente,
      saldoAtual: Number(cliente.saldo),
      movimentacoes
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
