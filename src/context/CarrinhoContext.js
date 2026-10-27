import React, { createContext, useContext, useState, useCallback } from 'react';

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [valorManual, setValorManual] = useState(0);
  const [compraPendenteId, setCompraPendenteId] = useState(null);

  const adicionarItem = useCallback((produto) => {
    setItens((prev) => {
      const existente = prev.find((item) => item.produtoId === produto.id);
      if (existente) {
        return prev.map((item) =>
          item.produtoId === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          produtoId: produto.id,
          nome: produto.nome,
          imagem: produto.imagem,
          precoUnitario: Number(produto.preco),
          quantidade: 1,
        },
      ];
    });
  }, []);

  const removerItem = useCallback((produtoId) => {
    setItens((prev) => {
      const existente = prev.find((item) => item.produtoId === produtoId);
      if (!existente) return prev;

      if (existente.quantidade === 1) {
        return prev.filter((item) => item.produtoId !== produtoId);
      }

      return prev.map((item) =>
        item.produtoId === produtoId
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      );
    });
  }, []);

  const obterQuantidade = useCallback(
    (produtoId) => {
      const item = itens.find((i) => i.produtoId === produtoId);
      return item ? item.quantidade : 0;
    },
    [itens]
  );

  const subtotalItens = itens.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );

  const total = subtotalItens + (Number(valorManual) || 0);

  const limparCarrinho = useCallback(() => {
    setItens([]);
    setValorManual(0);
    setCompraPendenteId(null);
  }, []);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        valorManual,
        setValorManual,
        compraPendenteId,
        setCompraPendenteId,
        adicionarItem,
        removerItem,
        obterQuantidade,
        subtotalItens,
        total,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
}