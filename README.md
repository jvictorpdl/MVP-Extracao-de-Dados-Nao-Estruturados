# Gemini Invoice Extractor

### Slogan: Transformando Faturas em Dados Estruturados com Inteligência Artificial de Ponta.

-----

## 📄 Descrição Concisa

O **Gemini Invoice Extractor** é uma aplicação Full-Stack desenvolvida para resolver o desafio da **extração eficiente de informações padronizadas de faturas e recibos em formato PDF**. Utilizando o poder da **API Gemini 1.5 Flash** e técnicas avançadas de Processamento de Linguagem Natural (PLN) e OCR (via `pdf-parse`), o sistema automatiza a conversão de documentos não estruturados em dados JSON facilmente consumíveis para fins contábeis, análise financeira, automação de processos e muito mais.

-----

## ✨ Funcionalidades

Este projeto oferece as seguintes funcionalidades principais:

  * **Upload de PDF:** Interface intuitiva para o usuário fazer o upload de arquivos PDF contendo faturas ou recibos.
  * **Extração Inteligente de Dados:** Utiliza a API Gemini para identificar e extrair campos-chave de faturas, como:
      * Número da Fatura
      * Data de Emissão
      * Data de Vencimento
      * Valor Total e Moeda
      * Nome e CNPJ/ID Fiscal do Fornecedor
      * Nome do Cliente
      * Lista detalhada de Itens (descrição, quantidade, valor unitário)
  * **Processamento de PDF:** Capacidade de ler e extrair texto de documentos PDF, preparando-os para a análise da IA.
  * **Saída de Dados Estruturados:** Apresenta os dados extraídos em um formato **JSON** limpo e bem-definido, ideal para integração com outros sistemas ou bancos de dados.
  * **Interface Web Moderna:** Frontend responsivo e com foco em UX/UI, proporcionando uma experiência de usuário intuitiva e visualmente agradável em desktops e dispositivos móveis.
  * **Feedback em Tempo Real:** Indicações visuais de carregamento e mensagens de erro claras para guiar o usuário durante o processo.

-----

## 🚀 Como Usar / Instalação

Siga as instruções abaixo para configurar e executar o projeto localmente.

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

  * **Node.js** (versão 14 ou superior)
  * **npm** (gerenciador de pacotes do Node.js)
  * **Uma chave de API do Google Gemini** (Você pode obtê-la no [Google AI Studio](https://ai.google.dev/) ou via Google Cloud Vertex AI).

### Clonando o Repositório

Primeiro, clone este repositório para sua máquina local:

```bash
git clone https://github.com/jvictorpdl/MVP-Extracao-de-Dados-Nao-Estruturados.git
cd gemini-invoice-extractor
```

### Configuração da API Key

Crie um arquivo chamado `.env` na **raiz** do diretório do projeto (`gemini-invoice-extractor/`). Adicione sua chave de API do Google Gemini neste arquivo:

```
GOOGLE_API_KEY=SUA_CHAVE_DE_API_DO_GEMINI_AQUI
```

**Importante:** Mantenha sua chave de API segura e **nunca a exponha** em seu código ou em repositórios públicos.

### Instalação de Dependências

O projeto é dividido em duas partes: o backend (Node.js/Express) e o frontend (React). Você precisará instalar as dependências para ambos.

1.  **Dependências do Backend (na raiz do projeto):**

    ```bash
    npm install
    ```

2.  **Dependências do Frontend (dentro da pasta `client`):**

    ```bash
    cd client
    npm install
    cd .. # Volte para a raiz do projeto
    ```

### Executando o Projeto

Para rodar o projeto em ambiente de desenvolvimento, você precisará iniciar o backend e o frontend em terminais separados.

1.  **Inicie o Servidor Backend:**
    Abra um terminal na **raiz do projeto** (`gemini-invoice-extractor/`) e execute:

    ```bash
    node server.js
    ```

    O servidor será iniciado na porta `3001`. Você verá uma mensagem como `Servidor rodando em http://localhost:3001`.

2.  **Inicie o Servidor de Desenvolvimento do Frontend:**
    Abra **um novo terminal** (mantenha o terminal do backend rodando) e navegue até o diretório `client/`:

    ```bash
    cd client
    npm start
    ```

    Isso iniciará o aplicativo React (geralmente na porta `3000`) e abrirá automaticamente no seu navegador. O frontend está configurado para fazer requisições de API para o backend através de um proxy durante o desenvolvimento.

### Exemplos de Uso

  * Com ambos os servidores rodando, acesse `http://localhost:3000` no seu navegador.
  * Clique em "Escolher PDF" e selecione um arquivo PDF de fatura.
  * Clique em "Extrair Detalhes".
  * Os detalhes extraídos da fatura serão exibidos na tela em um formato estruturado.

-----

## 📁 Estrutura do Projeto

A estrutura de pastas principal do projeto é a seguinte:

```
gemini-invoice-extractor/
├── node_modules/           # Dependências do backend
├── .env                    # Variáveis de ambiente (sua API Key)
├── package.json            # Dependências e scripts do backend
├── server.js               # Servidor backend (Node.js/Express) e lógica da API Gemini/PDF
├── client/                 # Aplicação React frontend
│   ├── public/             # Arquivos públicos do React (ex: index.html)
│   ├── src/                # Código-fonte do React (componentes, estilos)
│   │   ├── App.js          # Componente principal da aplicação
│   │   └── App.css         # Estilização global da aplicação
│   ├── package.json        # Dependências e scripts do frontend
│   └── ...                 # Outros arquivos do React
└── README.md               # Este arquivo
```

-----

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

  * **Frontend:**
      * **React.js:** Biblioteca JavaScript para construção de interfaces de usuário.
      * **HTML5 / CSS3:** Estrutura e estilização com foco em UX/UI moderna e responsividade.
  * **Backend:**
      * **Node.js:** Ambiente de execução JavaScript.
      * **Express.js:** Framework web para Node.js, para construção da API.
      * **Multer:** Middleware para Node.js que lida com upload de arquivos (`multipart/form-data`).
      * **pdf-parse:** Biblioteca para extração de texto de arquivos PDF.
  * **Inteligência Artificial:**
      * **Google Gemini 1.5 Flash API:** Modelo de linguagem grande (LLM) avançado para processamento de linguagem natural e extração de informações.
      * **@google/generative-ai:** SDK oficial Node.js para interagir com a API Gemini.
  * **Gerenciamento de Pacotes:**
      * **npm**
