const express = require('express');
const router = express.Router();
const db = require('../database');

function checkAuth(req, res, next) {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (token !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ sucesso: false, erro: 'Token inválido' });
  }
  next();
}

function logWebhook(tipo, payload, status, erro = null) {
  db.prepare(
    'INSERT INTO webhook_logs (tipo, payload, status, erro) VALUES (?, ?, ?, ?)'
  ).run([tipo, JSON.stringify(payload), status, erro]);
}

router.post('/cliente', checkAuth, (req, res) => {
  const { nome, cpfCnpj, telefone, email, tipo, observacoes, empreendimentoId, unidadeId } = req.body;

  try {
    const result = db.prepare(
      'INSERT INTO clientes (nome, cpfCnpj, telefone, email, tipo, observacoes, empreendimentoId, unidadeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run([nome, cpfCnpj || null, telefone || null, email || null, tipo || 'Comprador', observacoes || null, empreendimentoId || null, unidadeId || null]);

    const novoId = Number(result.lastInsertRowid);

    if (unidadeId) {
      db.prepare('UPDATE unidades SET clienteId = ?, status = ? WHERE id = ?').run([novoId, 'negociacao', unidadeId]);
    }

    logWebhook('cliente', req.body, 'sucesso');
    res.json({ sucesso: true, id: novoId });
  } catch (err) {
    logWebhook('cliente', req.body, 'erro', err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.post('/contrato', checkAuth, (req, res) => {
  const { clienteId, empreendimentoId, unidadeId, categoria, nome } = req.body;

  try {
    const id = `wh-${Date.now()}`;
    db.prepare(
      'INSERT INTO contratos (id, nome, categoria, empreendimentoId, unidadeId, clienteId, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run([id, nome, categoria || null, empreendimentoId || null, unidadeId || null, clienteId, 'em_preenchimento']);

    logWebhook('contrato', req.body, 'sucesso');
    res.json({ sucesso: true, id });
  } catch (err) {
    logWebhook('contrato', req.body, 'erro', err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.post('/financeiro', checkAuth, (req, res) => {
  const { empreendimentoId, categoria, tipo, valor, data, observacao } = req.body;

  try {
    const tipoNormalizado = (tipo || '').toLowerCase();
    const result = db.prepare(
      'INSERT INTO financeiro (empreendimentoId, categoria, tipo, valor, data, observacao) VALUES (?, ?, ?, ?, ?, ?)'
    ).run([empreendimentoId || null, categoria || null, tipoNormalizado, valor, data || null, observacao || null]);

    const novoId = Number(result.lastInsertRowid);

    logWebhook('financeiro', req.body, 'sucesso');
    res.json({ sucesso: true, id: novoId });
  } catch (err) {
    logWebhook('financeiro', req.body, 'erro', err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.post('/unidade-status', checkAuth, (req, res) => {
  const { unidadeId, status, clienteId } = req.body;

  const statusValidos = ['livre', 'negociacao', 'vendido', 'permutado', 'cancelado'];
  if (!statusValidos.includes(status)) {
    logWebhook('unidade-status', req.body, 'erro', `Status inválido: ${status}`);
    return res.status(400).json({ sucesso: false, erro: `Status inválido: ${status}` });
  }

  try {
    db.prepare('UPDATE unidades SET status = ?, clienteId = ? WHERE id = ?').run([status, clienteId || null, unidadeId]);

    logWebhook('unidade-status', req.body, 'sucesso');
    res.json({ sucesso: true, id: unidadeId });
  } catch (err) {
    logWebhook('unidade-status', req.body, 'erro', err.message);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

router.get('/logs', checkAuth, (req, res) => {
  const logs = db.prepare('SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 50').all();
  res.json({ sucesso: true, logs });
});

module.exports = router;
