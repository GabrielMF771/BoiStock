# BoiStock - Sistema de Gerenciamento Agropecuário

O **BoiStock** é uma aplicação web desenvolvida para a centralização, controle de inventário e gestão de fluxo de insumos, ferramentas e mercadorias no setor agropecuário. O sistema fornece monitoramento em tempo real dos níveis de estoque para subsidiar a tomada de decisões no manejo e cadeia de suprimentos.

## 🚀 Funcionalidades

- **Dashboard de Indicadores:** Monitoramento de métricas de giro de estoque, total de itens cadastrados e indicadores visuais de progresso de metas de inventário.
- **Gestão de Inventário (CRUD):** Módulo para listagem, cadastro, atualização e remoção de produtos com persistência em banco de dados.
- **Controle de Acesso:** Autenticação com JWT e perfis de usuário (Gerente e Operador).
- **Layout Responsivo:** Adaptação completa da interface para visualização em desktops, tablets e dispositivos móveis.

## 🛠️ Tecnologias e Arquitetura

O projeto adota uma arquitetura monolítica simplificada com separação clara entre a camada de apresentação e a API de dados:

- **Back-end:** Node.js, Express.js, Prisma ORM, JWT e Bcrypt.
- **Banco de Dados:** MySQL 8.
- **Front-end:** HTML5, CSS3 e JavaScript (ES6+).
- **Infraestrutura:** Docker Compose para ambiente de desenvolvimento opcional.


## 📁 Estrutura de Pastas do Projeto

```text
BoiStock/
├── app.js                        # Servidor principal da aplicação
├── package.json                  # Dependências e scripts npm
├── package-lock.json             # Controle de versões das dependências
├── .env                          # Variáveis de ambiente locais
├── .env.example                  # Modelo de configuração do ambiente
├── docker-compose.yml            # Configuração do MySQL via Docker
├── boistockdb.sql                # Script SQL do banco de dados
│
├── middlewares/                  # Middlewares da aplicação
│   └── auth.js                   # Autenticação JWT e controle de acesso
│
├── prisma/                       # Configuração do Prisma ORM
│   ├── schema.prisma             # Modelos e mapeamento do banco
│   ├── seed.js                   # Seed inicial do sistema
│   └── migrations/               # Histórico de migrações
│
├── routes/                       # Rotas da API REST
│   └── api.js                    # Endpoints de usuários e produtos
│
└── public/                       # Arquivos estáticos e interface web
    ├── index.html                # Página inicial
    ├── login.html                # Tela de autenticação
    ├── change-password.html      # Alteração obrigatória de senha
    ├── password.html             # Recuperação/alteração de senha
    │
    ├── script.js                 # Scripts da landing page
    ├── login.js                  # Lógica de autenticação
    ├── change-password.js        # Lógica de troca de senha
    │
    ├── style.css                 # Estilos globais
    ├── login.css                 # Estilos da tela de login
    │
    ├── assets/
    │   ├── favicon.ico
    │   └── images/
    │       └── image.png
    │
    └── dashboard/                # Área administrativa do sistema
        ├── dashboard.html        # Painel principal
        ├── products.html         # Gestão de produtos
        ├── add.html              # Cadastro de produtos
        ├── edit.html             # Edição de produtos
        ├── settings.html         # Configurações do sistema
        │
        ├── css/
        │
        └── js/
            ├── dashboard.js      # Indicadores e métricas
            ├── products.js       # CRUD de produtos
            ├── edit.js           # Edição de produtos
            ├── settings.js       # Configurações do sistema
            ├── logout.js         # Encerramento de sessão
            └── theme.js          # Alternância de tema
```


## 🔧 Instalação

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm
- MySQL 8 (local ou Docker)

### 1. Clonar o repositório

```bash
git clone https://github.com/GabrielMF771/BoiStock
cd BoiStock
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

JWT_SECRET=sua_chave_secreta_aqui

DATABASE_URL="mysql://usuario:senha@localhost:3306/boistockdb"
```


## 🗄️ Configuração do Banco de Dados

Escolha uma das opções abaixo.

### Opção 1 — Docker

Suba o container MySQL:

```bash
docker compose up -d
```

Verifique se está em execução:

```bash
docker ps
```

Utilize no `.env`:

```env
DATABASE_URL="mysql://root:docker@localhost:3306/boistockdb"
```

### Opção 2 — MySQL Local

Crie o banco:

```sql
CREATE DATABASE IF NOT EXISTS boistockdb;
```

Utilize no `.env`:

```env
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/boistockdb"
```


## 🚀 Inicialização do Projeto

Após configurar o banco de dados:

### Criar as tabelas

```bash
npx prisma db push
```

### Popular o banco com dados iniciais

```bash
npx prisma db seed
```

### Iniciar a aplicação

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## 🔑 Credenciais Iniciais

A seed cria automaticamente um usuário administrador:

```text
Email: admin@boistock.com
Senha: 12345
Cargo: gerente
```

## 🐳 Comandos Úteis do Docker

```bash
# Parar o container
docker compose stop

# Remover o container
docker compose down

# Ver logs
docker logs -f agroboi
```