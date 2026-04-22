const express = require("express");
const router = express.Router();

const empreendimentos = require("../data/empreendimentos");
const clientes = require("../data/clientes");
const contratos = require("../data/contratos");
const financeiro = require("../data/financeiro");
const unidades = require("../data/unidades");

router.get("/", (req, res) => {
  const totalEmpreendimentos = empreendimentos.length;
  const totalClientes = clientes.length;
  const totalContratos = contratos.length;

  const totalEntradas = financeiro
    .filter(item => item.tipo === "Entrada")
    .reduce((acc, item) => acc + item.valor, 0);

  const totalSaidas = financeiro
    .filter(item => item.tipo === "Saída")
    .reduce((acc, item) => acc + item.valor, 0);

  res.render("index", {
    totalEmpreendimentos,
    totalClientes,
    totalContratos,
    totalEntradas,
    totalSaidas
  });
});

router.get("/empreendimentos", (req, res) => {
  res.render("empreendimentos", { empreendimentos });
});

router.get("/empreendimentos/:id", (req, res) => {
  const empreendimento = empreendimentos.find(e => e.id === req.params.id);

  if (!empreendimento) {
    return res.status(404).send("Empreendimento não encontrado");
  }

  const unidadesDoEmpreendimento = unidades.filter(
    unidade => unidade.empreendimentoId === empreendimento.id
  );

  res.render("empreendimento-detalhe", {
    empreendimento,
    unidades: unidadesDoEmpreendimento
  });
});

router.get("/clientes", (req, res) => {
  res.render("clientes", { clientes });
});

router.get("/contratos", (req, res) => {
  res.render("contratos", { contratos });
});

router.get("/financeiro", (req, res) => {
  res.render("financeiro", { financeiro, empreendimentos });
});

module.exports = router;