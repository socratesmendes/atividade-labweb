# 🚗 API REST - Sistema de Ordem de Serviço para Concessionária

Uma API REST completa desenvolvida em Node.js com Express e MongoDB para gerenciar um sistema de ordens de serviço para concessionárias de carros.

## 📋 Índice

- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Modelos de Dados](#modelos-de-dados)
- [Validações](#validações)
- [Tratamento de Erros](#tratamento-de-erros)

## ✨ Características

- ✅ CRUD Completo para Concessionárias, Clientes, Veículos e Ordens de Serviço
- ✅ Validação Diferenciada para criação (campos obrigatórios) e atualização (campos opcionais)
- ✅ Tratamento de Erros robusto com classes especializadas
- ✅ Mensagens Informativas de exclusão com dados completos
- ✅ Relacionamentos entre entidades via populate do Mongoose
- ✅ Geração automática de números de ordem de serviço (OS000001, OS000002...)
- ✅ Cálculo automático de valores totais das peças
- ✅ Middlewares de segurança
- ✅ Health Check endpoint para monitoramento

## 🛠 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Joi** - Validação de esquemas (schemas separados para create/update)
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

```
concessionaria-api/
├── src/
│   ├── config/
│   │   └── database.js           # Configuração do MongoDB
│   ├── models/
│   │   ├── Concessionaria.js     # Model da Concessionária 
│   │   ├── Cliente.js            # Model do Cliente 
│   │   ├── Veiculo.js            # Model do Veículo 
│   │   └── OrdemServico.js       # Model da Ordem de Serviço
│   ├── controllers/
│   │   ├── concessionariaController.js # Controle das Concessionárias
│   │   ├── clienteController.js        # Controle dos Clientes
│   │   ├── veiculoController.js        # Controle dos Veículos
│   │   └── ordemServicoController.js   # Controle das Ordens de Serviço
│   ├── middlewares/
│   │   ├── errorHandler.js       # Middleware de tratamento de erros
│   │   └── validation.js         # Middleware de validação
│   ├── routes/
│   │   ├── concessionariaRoutes.js 
│   │   ├── clienteRoutes.js        
│   │   ├── veiculoRoutes.js        
│   │   └── ordemServicoRoutes.js   
│   ├── utils/
│   │   └── errors.js             # Classes de erro customizadas
│   └── app.js                    # Configuração do Express
├── .env                          # Variáveis de ambiente
├── .gitignore
├── package.json                  
├── README.md
└── server.js                     # Ponto de entrada da aplicação
```

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd concessionaria-api
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute a aplicação

```bash
npm run dev
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| `DB_CONNECTION_STRING` | URL de conexão MongoDB |

## 🎯 Uso

### Health Check
```bash
GET /api/health
```

Retorna o status da API:
```json
{
  "status": "success",
  "message": "API funcionando corretamente",
  "timestamp": "2025-06-23T10:30:00.000Z"
}
```

## 🔗 Endpoints da API

### 🏢 Concessionárias

| Método | Endpoint | Descrição | Validação |
|--------|----------|-----------|-----------|
| `GET` | `/api/concessionarias` | Listar todas as concessionárias | - |
| `POST` | `/api/concessionarias` | Criar nova concessionária | Schema completo |
| `GET` | `/api/concessionarias/:id` | Buscar concessionária por ID | - |
| `PUT` | `/api/concessionarias/:id` | Atualizar concessionária | Schema parcial |
| `DELETE` | `/api/concessionarias/:id` | Excluir concessionária (hard delete) | - |

### 👥 Clientes

| Método | Endpoint | Descrição | Validação |
|--------|----------|-----------|-----------|
| `GET` | `/api/clientes` | Listar todos os clientes | - |
| `POST` | `/api/clientes` | Criar novo cliente | Schema completo |
| `GET` | `/api/clientes/:id` | Buscar cliente por ID | - |
| `PUT` | `/api/clientes/:id` | Atualizar cliente | Schema parcial |
| `DELETE` | `/api/clientes/:id` | Excluir cliente (hard delete) | - |

### 🚗 Veículos

| Método | Endpoint | Descrição | Validação |
|--------|----------|-----------|-----------|
| `GET` | `/api/veiculos` | Listar todos os veículos | - |
| `POST` | `/api/veiculos` | Registrar novo veículo | Schema completo |
| `GET` | `/api/veiculos/:id` | Buscar veículo por ID | - |
| `PUT` | `/api/veiculos/:id` | Atualizar veículo | Schema parcial |
| `DELETE` | `/api/veiculos/:id` | Excluir veículo (hard delete) | - |

### 🔧 Ordens de Serviço

| Método | Endpoint | Descrição | Validação |
|--------|----------|-----------|-----------|
| `GET` | `/api/ordens-servico` | Listar ordens de serviço | - |
| `GET` | `/api/ordens-servico?status=Aberta` | Filtrar por status | - |
| `GET` | `/api/ordens-servico?clienteId=ID` | Filtrar por cliente | - |
| `POST` | `/api/ordens-servico` | Abrir nova ordem de serviço | Schema completo |
| `GET` | `/api/ordens-servico/:id` | Buscar ordem por ID | - |
| `PUT` | `/api/ordens-servico/:id` | Atualizar ordem de serviço | Schema parcial |
| `PATCH` | `/api/ordens-servico/:id/fechar` | Fechar ordem de serviço | Observações opcionais |
| `PATCH` | `/api/ordens-servico/:id/cancelar` | Cancelar ordem de serviço | Observações obrigatórias |
| `PATCH` | `/api/ordens-servico/:id/pecas` | Adicionar peças à ordem | Array de peças |

## 📊 Modelos de Dados

### Concessionária
```json
{
  "nome": "AutoMax Veículos",
  "cnpj": "12.345.678/0001-90",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "telefone": "(11) 1234-5678",
  "email": "contato@automax.com"
}
```

### Cliente
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-01",
  "email": "joao@email.com",
  "telefone": "(11) 9876-5432",
  "endereco": {
    "rua": "Rua das Palmeiras",
    "numero": "456",
    "bairro": "Jardim América",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "dataNascimento": "1990-05-15"
}
```

### Veículo
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2023,
  "chassi": "1HGBH41JXMN109186",
  "cor": "Branco",
  "combustivel": "Flex",
  "quilometragem": 15000,
  "preco": 85000,
  "status": "Disponível",
  "clienteId": "64abc123def456789"
}
```

### Ordem de Serviço
```json
{
  "numero": "OS000001",
  "clienteId": "64abc123def456789",
  "veiculoId": "64def456ghi789012",
  "descricaoProblema": "Ruído estranho no motor",
  "servicos": ["Troca de óleo", "Revisão geral"],
  "pecas": [
    {
      "nome": "Filtro de óleo",
      "preco": 45.90,
      "quantidade": 1
    }
  ],
  "status": "Aberta",
  "dataAbertura": "2025-06-23T10:00:00.000Z",
  "dataConclusao": null,
  "valorTotal": 45.90,
  "observacoes": ""
}
```

## ✅ Validações

### Sistema de Validação Dupla

A API implementa **dois tipos de schemas** para cada entidade:

#### **Schemas de Criação (POST)**
- Todos os campos obrigatórios são validados
- Usado nos endpoints `POST`

#### **Schemas de Atualização (PUT)**
- Campos opcionais (apenas os enviados são validados)
- Pelo menos 1 campo deve ser fornecido
- Usado nos endpoints `PUT`

### Validações Implementadas

- **CNPJ**: Formato `XX.XXX.XXX/XXXX-XX`
- **CPF**: Formato `XXX.XXX.XXX-XX`
- **CEP**: Formato `XXXXX-XXX`
- **Email**: Formato de email válido
- **Chassi**: Exatamente 17 caracteres
- **Ano**: Entre 1900 e ano atual + 1
- **Status de Veículo**: `Disponível`, `Vendido`, `Em Manutenção`
- **Status de OS**: `Aberta`, `Em Andamento`, `Aguardando Peças`, `Concluída`, `Cancelada`
- **Combustível**: `Gasolina`, `Álcool`, `Flex`, `Diesel`, `Elétrico`, `Híbrido`

## ⚠️ Tratamento de Erros

A API possui um sistema robusto de tratamento de erros com classes especializadas:

### Classes de Erro

- **AppError**: Erro base da aplicação
- **ValidationError**: Erros de validação (400)
- **NotFoundError**: Recurso não encontrado (404)
- **ConflictError**: Conflito de dados (409)
- **UnauthorizedError**: Não autorizado (401)
- **ForbiddenError**: Acesso negado (403)

### Formato de Resposta de Erro

```json
{
  "status": "error|fail",
  "message": "Descrição do erro"
}
```

### Erros Tratados Automaticamente

- Erros de validação do Mongoose
- Erros de duplicação (chaves únicas)
- Erros de casting de ID
- Erros de validação do Joi

### Exemplo de Resposta de Exclusão

```json
{
  "status": "success",
  "message": "O cliente \"João Silva\" foi deletado com sucesso",
  "data": {
    "clienteExcluido": {
      "id": "64def456ghi789012",
      "nome": "João Silva",
      "cpf": "123.456.789-01",
      "email": "joao@email.com",
      "dataExclusao": "2025-06-23T14:32:15.456Z"
    }
  }
}
```

---

**Desenvolvido com Node.js utilizando Framework Express conectado à um banco MongoDB**