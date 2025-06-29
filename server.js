// gemini-invoice-extractor/server.js
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path'); // Importa o módulo path

const app = express();
const port = process.env.PORT || 3001;

// Configuração upload de arquivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não suportado. Por favor, envie um PDF.'), false);
        }
    }
});

app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
    console.error("Erro: A variável de ambiente GOOGLE_API_KEY não está definida.");
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/extract-invoice-details', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo PDF enviado.' });
    }

    let invoiceText;
    try {
        const data = await pdfParse(req.file.buffer);
        invoiceText = data.text;

        if (!invoiceText || invoiceText.trim() === '') {
            return res.status(400).json({ error: 'Não foi possível extrair texto do PDF fornecido ou o PDF está vazio.' });
        }
        console.log("Texto extraído do PDF:\n", invoiceText.substring(0, 500) + "...");
    } catch (pdfError) {
        console.error('Erro ao processar o PDF:', pdfError);
        return res.status(500).json({ error: 'Erro ao processar o arquivo PDF.' });
    }

    const prompt = `
    Extraia os seguintes detalhes da fatura/recibo fornecido.
    Retorne os resultados em formato JSON. Se um campo não for encontrado, use null.
    As datas devem estar no formato YYYY-MM-DD. Valores monetários devem ser números (float ou int).

    Campos a extrair:
    - "numero_fatura": O número de identificação da fatura.
    - "data_emissao": A data em que a fatura foi emitida.
    - "data_vencimento": A data de vencimento da fatura.
    - "valor_total": O valor total da fatura.
    - "moeda": A moeda do valor total (ex: "BRL", "USD", "EUR").
    - "nome_fornecedor": O nome da empresa que emitiu a fatura.
    - "cnpj_fornecedor": O CNPJ ou ID fiscal do fornecedor.
    - "nome_cliente": O nome do cliente para quem a fatura foi emitida.
    - "itens": Uma lista de objetos, onde cada objeto tem "descricao" (string), "quantidade" (int) e "valor_unitario" (float). Se não houver itens detalhados, uma lista vazia.

    Exemplo de formato de saída JSON:
    {
      "numero_fatura": "INV-2023-001",
      "data_emissao": "2023-01-15",
      "data_vencimento": "2023-02-15",
      "valor_total": 1500.75,
      "moeda": "BRL",
      "nome_fornecedor": "Empresa ABC Ltda.",
      "cnpj_fornecedor": "12.345.678/0001-90",
      "nome_cliente": "Cliente Exemplo S.A.",
      "itens": [
        { "descricao": "Serviço de Consultoria", "quantidade": 1, "valor_unitario": 1000.00 },
        { "descricao": "Licença de Software", "quantidade": 5, "valor_unitario": 100.15 }
      ]
    }

    Texto da Fatura:
    ${invoiceText}
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        let jsonString = responseText.replace(/```json\n?|\n?```/g, '').trim();

        console.log("Resposta bruta do Gemini:", responseText);
        console.log("String JSON para parsear:", jsonString);

        const extractedData = JSON.parse(jsonString);
        res.json(extractedData);

    } catch (error) {
        console.error('Erro ao chamar a API Gemini:', error);
        let errorMessage = 'Erro interno do servidor ao processar a fatura.';
        if (error.response && error.response.candidates && error.response.candidates.length > 0) {
            errorMessage = error.response.candidates[0].finishReason || errorMessage;
        } else if (error.message) {
            errorMessage = error.message;
        }
        res.status(500).json({ error: errorMessage });
    }
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`API Key carregada: ${API_KEY ? 'Sim' : 'Não'}`);
});