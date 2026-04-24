const express = require("express");
const router = express.Router();

const empreendimentosData = require("../data/empreendimentos");
const clientes = require("../data/clientes");
const contratos = require("../data/contratos");
const financeiro = require("../data/financeiro");
const unidades = require("../data/unidades");
const { getResumoUnidades } = require("../data/helpers");

const empreendimentoStatusMap = {
  ativo: "Ativo",
  em_planejamento: "Em planejamento",
  concluido: "Concluído"
};

const unidadeStatusMap = {
  livre: "Livre",
  negociacao: "Negociação",
  vendido: "Vendido",
  permutado: "Permutado",
  cancelado: "Cancelado"
};

const financeiroTipoMap = {
  entrada: "Entrada",
  saida: "Saída"
};

router.get("/", (req, res) => {
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();

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
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();

  const empreendimentosComResumo = empreendimentos.map((empreendimento) => {
    const unidadesDoEmpreendimento = unidades.filter(
      unidade => unidade.empreendimentoId === empreendimento.id
    );

    return {
      ...empreendimento,
      statusLabel: empreendimentoStatusMap[empreendimento.status] || empreendimento.status,
      resumo: getResumoUnidades(unidadesDoEmpreendimento)
    };
  });

  res.render("empreendimentos", { empreendimentos: empreendimentosComResumo });
});

router.post("/empreendimentos", (req, res) => {
  const { nome, endereco, status, descricao, memorialLink, plantaLink, tabelaVendaLink } = req.body;

  const id = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  empreendimentosData.addEmpreendimento({
    id,
    nome,
    endereco,
    status,
    descricao,
    memorialLink: memorialLink || "#",
    plantaLink: plantaLink || "#",
    tabelaVendaLink: tabelaVendaLink || "#"
  });

  res.redirect("/empreendimentos");
});

router.post("/empreendimentos/:id/delete", (req, res) => {
  empreendimentosData.removeEmpreendimento(req.params.id);
  res.redirect("/empreendimentos");
});

router.get("/empreendimentos/:id", (req, res) => {
  const empreendimento = empreendimentosData.getEmpreendimentoById(req.params.id);

  if (!empreendimento) {
    return res.status(404).send("Empreendimento não encontrado");
  }

  const unidadesDoEmpreendimento = unidades
    .filter(unidade => unidade.empreendimentoId === empreendimento.id)
    .map((unidade) => ({
      ...unidade,
      statusLabel: unidadeStatusMap[unidade.status] || unidade.status
    }));

  const resumo = getResumoUnidades(unidadesDoEmpreendimento);

  res.render("empreendimento-detalhe", {
    empreendimento: {
      ...empreendimento,
      statusLabel: empreendimentoStatusMap[empreendimento.status] || empreendimento.status
    },
    unidades: unidadesDoEmpreendimento,
    resumo
  });
});

router.get("/espelho", (req, res) => {
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();
  const empreendimentoId = req.query.empreendimento || empreendimentos[0]?.id;

  const empreendimentoSelecionado = empreendimentos.find(
    e => e.id === empreendimentoId
  );

  const unidadesDoEmpreendimento = unidades
    .filter(unidade => unidade.empreendimentoId === empreendimentoId)
    .map((unidade) => {
      const cliente = clientes.find(c => c.id === unidade.clienteId);

      return {
        ...unidade,
        statusLabel: unidadeStatusMap[unidade.status] || unidade.status,
        clienteNome: cliente ? cliente.nome : null
      };
    });

  res.render("espelho", {
    empreendimentos,
    empreendimentoSelecionado,
    unidades: unidadesDoEmpreendimento
  });
});

router.get("/clientes", (req, res) => {
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();

  const clientesComRelacionamento = clientes.map((cliente) => {
    const empreendimento = empreendimentos.find(
      e => e.id === cliente.empreendimentoId
    );

    const unidade = unidades.find(
      u => u.id === cliente.unidadeId
    );

    return {
      ...cliente,
      empreendimentoNome: empreendimento ? empreendimento.nome : "Não vinculado",
      unidadeNumero: unidade ? unidade.numero : "Não vinculada"
    };
  });

  res.render("clientes", { clientes: clientesComRelacionamento });
});

router.get("/contratos", (req, res) => {
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();

  const statusMap = {
    disponivel: "Disponível",
    em_preenchimento: "Em preenchimento",
    gerado: "Gerado",
    pendente: "Pendente"
  };

  const contratosComRelacionamento = contratos.map((contrato) => {
    const empreendimento = empreendimentos.find(
      e => e.id === contrato.empreendimentoId
    );

    const unidade = unidades.find(
      u => u.id === contrato.unidadeId
    );

    const cliente = clientes.find(
      c => c.id === contrato.clienteId
    );

    return {
      ...contrato,
      statusLabel: statusMap[contrato.status] || contrato.status,
      empreendimentoNome: empreendimento ? empreendimento.nome : "Não vinculado",
      unidadeNumero: unidade ? unidade.numero : "Não vinculada",
      clienteNome: cliente ? cliente.nome : "Não vinculado"
    };
  });

  res.render("contratos", { contratos: contratosComRelacionamento });
});

router.get("/financeiro", (req, res) => {
  const empreendimentos = empreendimentosData.getAllEmpreendimentos();
  const empreendimentoId = req.query.empreendimento || "todos";

  let financeiroFiltrado = financeiro;

  if (empreendimentoId !== "todos") {
    financeiroFiltrado = financeiro.filter(
      item => item.empreendimentoId === empreendimentoId
    );
  }

  const financeiroComRelacionamento = financeiroFiltrado.map((item) => {
    const empreendimento = empreendimentos.find(
      e => e.id === item.empreendimentoId
    );

    return {
      ...item,
      tipoLabel: financeiroTipoMap[item.tipo] || item.tipo,
      empreendimentoNome: empreendimento ? empreendimento.nome : "Não vinculado"
    };
  });

  const totalEntradas = financeiroFiltrado
    .filter(item => item.tipo === "entrada")
    .reduce((acc, item) => acc + item.valor, 0);

  const totalSaidas = financeiroFiltrado
    .filter(item => item.tipo === "saida")
    .reduce((acc, item) => acc + item.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  res.render("financeiro", {
    financeiro: financeiroComRelacionamento,
    empreendimentos,
    empreendimentoSelecionado: empreendimentoId,
    totalEntradas,
    totalSaidas,
    saldo
  });
});

module.exports = router;