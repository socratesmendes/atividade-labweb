const express = require('express');
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const { AppError } = require('./utils/errors');

// Importar rotas
const concessionariaRoutes = require('./routes/concessionariaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const ordemServicoRoutes = require('./routes/ordemServicoRoutes');

const app = express();

// Middlewares para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas da API
app.use('/api/concessionarias', concessionariaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/ordens-servico', ordemServicoRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

// Middleware para rotas não encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`Rota ${req.originalUrl} não encontrada`, 404));
});

// Middleware global de tratamento de erros
app.use(errorHandler);

module.exports = app;