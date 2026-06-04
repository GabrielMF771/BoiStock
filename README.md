# BoiStock - Sistema de Gerenciamento Agropecuário

O **BoiStock** é uma aplicação web desenvolvida para a centralização, controle de inventário e gestão de fluxo de insumos, ferramentas e mercadorias no setor agropecuário. O sistema fornece monitoramento em tempo real dos níveis de estoque para subsidiar a tomada de decisões no manejo e cadeia de suprimentos.

## 🚀 Funcionalidades

- **Dashboard de Indicadores:** Monitoramento de métricas de giro de estoque, total de itens cadastrados e indicadores visuais de progresso de metas de inventário.
- **Gestão de Inventário (CRUD):** Módulo para listagem, cadastro, atualização e remoção de produtos com persistência em banco de dados.
- **Layout Responsivo:** Adaptação completa da interface para visualização em desktops, tablets e dispositivos móveis.

## 🛠️ Tecnologias e Arquitetura

O projeto adota uma arquitetura monolítica simplificada com separação clara entre a camada de apresentação e a API de dados:

- **Back-end:** Node.js com o ecossistema Express para roteamento dinâmico, manipulação de parâmetros de URL e distribuição de ativos estáticos.
- **Front-end:** HTML5 semântico, JavaScript nativo (ES6+), manipulação assíncrona de DOM e CSS3 avançado estruturado via Flexbox e CSS Grid.

---

## 📁 Estrutura de Pastas do Projeto

O projeto segue o padrão arquitetural (**Arquitetura Monolítica Simplificada com Divisão de Camadas**), isolando a aplicação institucional da área administrativa:

```text
BoiStock/
├── app.js                   # Servidor Express e configuração de rotas básicas
├── package.json             # Dependências e scripts do projeto
└── public/                  # Diretório raiz de arquivos estáticos
    ├── index.html           # Página inicial / Landing Page institucional
    ├── style.css            # Estilos da página inicial
    ├── app.js               # Scripts globais da landing page
    ├── assets/              # Mídias e identidades visuais globais
    │   ├── favicon.ico
    │   └── images/
    └── dashboard/           # Módulos restritos do painel de controle
        ├── dashboard.html   # Tela principal de métricas
        ├── products.html    # Tela de listagem e gerenciamento
        ├── add.html         # Formulário de cadastro de produtos
        ├── edit.html        # Formulário de edição de produtos
        ├── settings.html    # Tela de configurações do sistema
        ├── css/
        │   └── dashboard-style.css  # CSS unificado e otimizado da dashboard
        └── js/
            ├── dashboard.js
            ├── products.js
            ├── edit.js
            ├── settings.js
            └── theme.js     # Script isolado para controle do Tema Escuro
```

---

## 🔧 Execução local

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Versão LTS recomendada)
- Gerenciador de pacotes **npm**
- Banco de dados MySQL (via Docker **ou** MySQL Workbench)

### Instalação

1. **Clonar o repositório:**
```bash
git clone https://github.com/GabrielMF771/BoiStock
cd BoiStock
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Configurar o arquivo `.env`:**

Crie um arquivo `.env` na raiz do projeto. O formato da URL muda conforme o banco que você está usando:

```env
PORT=3000

# Docker (ver seção abaixo)
DATABASE_URL="mysql://root:docker@localhost:3306/boistockdb"

# MySQL Workbench (banco local já instalado)
# DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/boistockdb"
```

4. **Criar as tabelas no banco:**
```bash
npx prisma db push
```

5. **Iniciar o servidor:**
```bash
npm run dev
```

6. **Acessar a aplicação:**

Abra o navegador em [http://localhost:3000](http://localhost:3000)

---

## 🐳 Executando o banco com Docker

Use essa opção se não tiver o MySQL instalado localmente.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **em execução**

### Passo a passo

1. **Suba o container MySQL:**
```bash
docker compose up -d
```

Isso inicia um container MySQL 8.0 chamado `agroboi` na porta `3306` com o banco `boistockdb` já criado automaticamente.

2. **Confirme que o container está rodando:**
```bash
docker ps
```

Você deve ver `agroboi` com status `Up`.

3. **Configure o `.env`** com a URL do Docker:
```env
PORT=3000
DATABASE_URL="mysql://root:docker@localhost:3306/boistockdb"
```

4. **Crie as tabelas via Prisma:**
```bash
npx prisma db push
```

5. **Inicie o servidor:**
```bash
npm run dev
```

6. **Acesse:** [http://localhost:3000](http://localhost:3000)

### Comandos úteis do Docker

```bash
# Parar o container sem apagar os dados
docker compose stop

# Remover o container (os dados são perdidos)
docker compose down

# Ver logs do MySQL em tempo real
docker logs -f agroboi
```

---

## 🗄️ Executando o banco com MySQL Workbench

Use essa opção se já tiver o MySQL instalado localmente.

### Pré-requisitos

- [MySQL](https://dev.mysql.com/downloads/mysql/) instalado e **em execução**
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) (opcional, para visualizar o banco)

### Passo a passo

1. **Abra o MySQL Workbench** e conecte-se à sua instância local.

2. **Crie o banco de dados** executando no editor SQL:
```sql
CREATE DATABASE IF NOT EXISTS boistockdb;
```

3. **Configure o `.env`** com usuário e senha da sua instalação MySQL:
```env
PORT=3000
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/boistockdb"
```

> O usuário padrão do MySQL é geralmente `root`. A senha é a que foi definida durante a instalação.

4. **Crie as tabelas via Prisma:**
```bash
npx prisma db push
```

5. **Inicie o servidor:**
```bash
npm run dev
```

6. **Acesse:** [http://localhost:3000](http://localhost:3000)