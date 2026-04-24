let empreendimentos = [
  {
    id: "high-tower",
    nome: "High Tower Jardins",
    endereco: "Aracruz/ES",
    status: "ativo",
    descricao: "Empreendimento residencial com unidades e lojas.",
    memorialLink: "#",
    plantaLink: "#",
    tabelaVendaLink: "#"
  },
  {
    id: "reserva-verde",
    nome: "Reserva Verde",
    endereco: "Vitória/ES",
    status: "em_planejamento",
    descricao: "Empreendimento em fase inicial de estruturação.",
    memorialLink: "#",
    plantaLink: "#",
    tabelaVendaLink: "#"
  }
];

function getAllEmpreendimentos() {
  return empreendimentos;
}

function getEmpreendimentoById(id) {
  return empreendimentos.find(e => e.id === id);
}

function addEmpreendimento(novoEmpreendimento) {
  empreendimentos.push(novoEmpreendimento);
}

function removeEmpreendimento(id) {
  empreendimentos = empreendimentos.filter(e => e.id !== id);
}

module.exports = {
  getAllEmpreendimentos,
  getEmpreendimentoById,
  addEmpreendimento,
  removeEmpreendimento
};