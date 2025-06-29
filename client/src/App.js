import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(''); // Para exibir o nome do arquivo selecionado

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name);
      setExtractedData(null);
      setError(null);
    } else {
      setSelectedFile(null);
      setFileName('');
      setError('Por favor, selecione um arquivo PDF válido.');
      setExtractedData(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Nenhum arquivo PDF selecionado.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    try {
      const response = await fetch('/api/extract-invoice-details', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro desconhecido ao processar a fatura.');
      }

      const data = await response.json();
      setExtractedData(data);
    } catch (err) {
      console.error('Erro ao enviar o arquivo:', err);
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">
          <span className="gradient-text">Gemini</span> Extrator de Faturas
        </h1>
        <p className="app-subtitle">
          Transformando PDFs em Dados Estruturados com IA de Ponta.
        </p>
      </header>

      <main className="main-content">
        <section className="upload-section">
          <form onSubmit={handleSubmit} className="upload-form">
            <label htmlFor="file-upload" className="file-upload-label">
              <span className="icon-upload">📁</span> Escolher PDF
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-upload-input"
              />
            </label>
            {fileName && <p className="file-name">Arquivo selecionado: <strong>{fileName}</strong></p>}
            
            <button
              type="submit"
              className="submit-button"
              disabled={loading || !selectedFile}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Processando...
                </>
              ) : (
                'Extrair Detalhes'
              )}
            </button>
          </form>

          {error && <p className="message error-message" role="alert">Erro: {error}</p>}
          {loading && !error && <p className="message loading-message">Analisando seu PDF...</p>}
        </section>

        {extractedData && (
          <section className="results-section">
            <h2 className="results-title">Detalhes da Fatura Extraídos:</h2>
            <div className="extracted-data-card">
              {/* Renderização Estruturada dos Dados */}
              <div className="data-row">
                <span className="data-label">Número da Fatura:</span>
                <span className="data-value">{extractedData.numero_fatura || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Data de Emissão:</span>
                <span className="data-value">{extractedData.data_emissao || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Data de Vencimento:</span>
                <span className="data-value">{extractedData.data_vencimento || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Valor Total:</span>
                <span className="data-value">
                  {extractedData.valor_total !== null ? `${extractedData.moeda || ''} ${extractedData.valor_total.toFixed(2)}` : 'N/A'}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">Fornecedor:</span>
                <span className="data-value">{extractedData.nome_fornecedor || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">CNPJ Fornecedor:</span>
                <span className="data-value">{extractedData.cnpj_fornecedor || 'N/A'}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Cliente:</span>
                <span className="data-value">{extractedData.nome_cliente || 'N/A'}</span>
              </div>

              {extractedData.itens && extractedData.itens.length > 0 && (
                <div className="items-section">
                  <h3 className="items-title">Itens da Fatura:</h3>
                  <ul className="items-list">
                    {extractedData.itens.map((item, index) => (
                      <li key={index} className="item-card">
                        <span className="item-desc">{item.descricao}</span>
                        <span className="item-qty">Qtd: {item.quantidade || 'N/A'}</span>
                        <span className="item-val">Valor Unit.: {item.valor_unitario !== null ? item.valor_unitario.toFixed(2) : 'N/A'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opção para ver o JSON bruto, útil para depuração */}
              <details className="raw-json-details">
                <summary>Ver JSON Bruto</summary>
                <pre className="raw-json-code">
                  {JSON.stringify(extractedData, null, 2)}
                </pre>
              </details>
            </div>
          </section>
        )}
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Gemini AI - Desenvolvido com Tecnologia de Ponta</p>
      </footer>
    </div>
  );
}

export default App;