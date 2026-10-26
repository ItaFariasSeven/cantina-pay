const prisma = require('../config/database');

exports.create = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
    }

    const categoriaExistente = await prisma.categoria.findUnique({ where: { nome } });

    if (categoriaExistente) {
      return res.status(409).json({ error: 'Categoria já cadastrada.' });
    }

    const categoria = await prisma.categoria.create({
      data: { nome },
    });

    return res.status(201).json({ message: 'Categoria criada com sucesso.', categoria });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findAll = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    });

    return res.status(200).json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const categoriaExistente = await prisma.categoria.findUnique({ where: { id } });

    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    if (nome && nome !== categoriaExistente.nome) {
      const nomeJaUsado = await prisma.categoria.findUnique({ where: { nome } });
      if (nomeJaUsado) {
        return res.status(409).json({ error: 'Categoria já cadastrada.' });
      }
    }

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        nome: nome || categoriaExistente.nome,
      },
    });

    return res.status(200).json({ message: 'Categoria atualizada com sucesso.', categoria });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const categoriaExistente = await prisma.categoria.findUnique({ where: { id } });

    if (!categoriaExistente) {
      return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    await prisma.categoria.delete({ where: { id } });

    return res.status(200).json({ message: 'Categoria removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
