# Estrutura de Dados

## Cliente
- id
- nome
- cpfCnpj
- telefone
- email
- tipo
- observacoes

## Empreendimento
- id
- nome
- endereco
- status
- descricao
- memorialLink
- plantaLink
- tabelaVendaLink

## Unidade
- id
- empreendimentoId
- numero
- pavimento
- tipologia
- metragem
- status
- clienteId

## Venda
- id
- clienteId
- unidadeId
- valor
- status
- data

## Contrato
- id
- nome
- categoria
- descricao
- formLink
- status

## LancamentoFinanceiro
- id
- empreendimentoId
- categoria
- tipo
- valor
- data
- observacao