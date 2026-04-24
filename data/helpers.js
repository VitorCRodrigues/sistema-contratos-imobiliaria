function getResumoUnidades(unidades) {
  const resumo = {
    total: unidades.length,
    livres: 0,
    negociacao: 0,
    vendidas: 0,
    permutadas: 0,
    canceladas: 0
  };

  unidades.forEach((unidade) => {
    if (unidade.status === "livre") resumo.livres++;
    else if (unidade.status === "negociacao") resumo.negociacao++;
    else if (unidade.status === "vendido") resumo.vendidas++;
    else if (unidade.status === "permutado") resumo.permutadas++;
    else if (unidade.status === "cancelado") resumo.canceladas++;
  });

  return resumo;
}

module.exports = {
  getResumoUnidades
};