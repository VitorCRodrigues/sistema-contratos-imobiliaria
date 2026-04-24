const contratos = [
  {
    id: "promessa-compra-venda",
    nome: "Contrato de Promessa de Compra e Venda",
    categoria: "Compra e venda",
    descricao: "Contrato principal da venda da unidade.",
    formLink: "#",
    status: "disponivel",
    empreendimentoId: "high-tower",
    unidadeId: 2,
    clienteId: 1
  },
  {
    id: "anexo-compra-venda",
    nome: "Anexo ao Contrato de Promessa de Compra e Venda",
    categoria: "Anexo",
    descricao: "Declaração e termo de ciência.",
    formLink: "#",
    status: "em_preenchimento",
    empreendimentoId: "high-tower",
    unidadeId: 2,
    clienteId: 1
  },
  {
    id: "termo-outorga",
    nome: "Termo de Anuência com Outorga de Poderes",
    categoria: "Termo",
    descricao: "Documento de anuência e outorga.",
    formLink: "#",
    status: "gerado",
    empreendimentoId: "high-tower",
    unidadeId: 2,
    clienteId: 1
  },
  {
    id: "termo-emprestimo",
    nome: "Termo de Ciência e Anuência para Empréstimo",
    categoria: "Termo",
    descricao: "Documento relacionado ao financiamento da produção.",
    formLink: "#",
    status: "pendente",
    empreendimentoId: "high-tower",
    unidadeId: 2,
    clienteId: 1
  },
  {
    id: "permuta",
    nome: "Contrato de Permuta",
    categoria: "Permuta",
    descricao: "Permuta de terreno por unidades futuras.",
    formLink: "#",
    status: "disponivel",
    empreendimentoId: "reserva-verde",
    unidadeId: null,
    clienteId: 2
  }
];

module.exports = contratos;