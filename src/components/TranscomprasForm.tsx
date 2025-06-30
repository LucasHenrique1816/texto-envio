import React, { useState } from 'react';

const TranscomprasForm: React.FC = () => {
    const [quotationNumber, setQuotationNumber] = useState('');
    const [nfNumber, setNfNumber] = useState('');
    const [value, setValue] = useState('');
    const [name, setName] = useState('');

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const handleCopy = () => {
        const textToCopy = `${getGreeting()},\n\n📝 Dados da Cotação - NF:\n\n- Número da Cotação: ${quotationNumber}\n- Número da NF: ${nfNumber}\n- Valor: R$ ${value}\n- Frete: À vista, pago pelo emitente.\n\n📋 Dados Bancários:\n\n- Chave PIX: faturamento02@transcompras.com.br\n- Banco 382 BDK - Fiducia SCMEPP\n- Agência: 0001\n- C/C: 54105-2\n- Favorecido: Transcompras Transportes e Compras Comerciais Ltda\n\n🚚 Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.\n\n⚠️ Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.\n\n🚨Por favor, envie o comprovante de pagamento.\n\nAtenciosamente,\n${name}\n\n🚚💨📦`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Dados Bancários Transcompras</h2>
            <form className="bg-dark p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Cotação:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={quotationNumber}
                        onChange={(e) => setQuotationNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da NF:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Valor:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Nome:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </div>
                <button type="button" className="btn btn-light" onClick={handleCopy}>
                    Copiar Dados Bancários
                </button>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
{`${getGreeting()},\n
📝 Dados da Cotação - NF:\n
- Número da Cotação: ${quotationNumber}
- Número da NF: ${nfNumber}
- Valor: R$ ${value}
- Frete: À vista.

📋 Dados Bancários:

- Chave PIX: faturamento02@transcompras.com.br
- Banco 382 BDK - Fiducia SCMEPP
- Agência: 0001
- C/C: 54105-2
- Favorecido: Transcompras Transportes e Compras Comerciais Ltda

🚚 Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

⚠️ Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

🚨Por favor, envie o comprovante de pagamento.

Atenciosamente,
${name}

🚚💨📦`}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default TranscomprasForm;