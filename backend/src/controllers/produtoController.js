const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { nome, preco, estoque, categoriaId } = req.body;

    if (!nome || preco === undefined || estoque === undefined || !categoriaId) {
      return res.status(400).json({
        error: 'Nome, preço, estoque e categoriaId são obrigatórios.',
      });
    }

    const categoriaExistente = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoriaId,
      },
    });

    return res.status(201).json({
      message: 'Produto criado com sucesso.',
      produto,
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return res.status(200).json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, estoque, categoriaId } = req.body;

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (categoriaId) {
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id: categoriaId },
      });

      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }
    }

    const dadosAtualizados = {};
    if (nome !== undefined) dadosAtualizados.nome = nome;
    if (preco !== undefined) dadosAtualizados.preco = parseFloat(preco);
    if (estoque !== undefined) dadosAtualizados.estoque = parseInt(estoque);
    if (categoriaId !== undefined) dadosAtualizados.categoriaId = categoriaId;

    const produto = await prisma.produto.update({
      where: { id },
      data: dadosAtualizados,
    });

    return res.status(200).json({
      message: 'Produto atualizado com sucesso.',
      produto,
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const produtoExistente = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produtoExistente) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    await prisma.produto.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Produto removido com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
