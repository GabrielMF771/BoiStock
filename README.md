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

### Instalação e Inicialização

1. **Clonar o repositório:**
```bash
   git clone https://github.com/GabrielMF771/BoiStock
   cd BoiStock
```

2. **Instalar dependências de produção e desenvolvimento:**
```bash
   npm install
```

3. **Configurar as credenciais do sistema:**
Crie um arquivo chamado .env na raiz do projeto e defina as variáveis de ambiente com os dados de acesso do seu servidor MySQL local:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=boistockdb
PORT=3000
```

4. **Incicie o servidor**
```bash
   node server.js
```

4. **Acessar a aplicação**
Abra o seu navegador e acesse o endereço: [http://localhost:3000](http://localhost:3000)