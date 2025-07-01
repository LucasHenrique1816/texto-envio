import React, { useState } from 'react';

const TranscomprasForm: React.FC = () => {
    const [quotationNumber, setQuotationNumber] = useState('');
    const [nfNumber, setNfNumber] = useState('');
    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Texto com emojis (para cópia, email, preview)
    const transcomprasTexto = `${getGreeting()},\n
📝 Dados da Cotação - NF:\n
- Número da Cotação: ${quotationNumber}
- Número da NF: ${nfNumber}
- Valor: R$ ${value}
- Frete: À vista, pago pelo emitente.

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

🚚💨📦`;

    // Texto sem emojis (para WhatsApp)
    const transcomprasTextoWhats = `${getGreeting()},\n
Dados da Cotação - NF:\n
- Número da Cotação: ${quotationNumber}
- Número da NF: ${nfNumber}
- Valor: R$ ${value}
- Frete: À vista, pago pelo emitente.

Dados Bancários:

- Chave PIX: faturamento02@transcompras.com.br
- Banco 382 BDK - Fiducia SCMEPP
- Agência: 0001
- C/C: 54105-2
- Favorecido: Transcompras Transportes e Compras Comerciais Ltda

Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

Por favor, envie o comprovante de pagamento.

Atenciosamente,
${name}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(transcomprasTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Frete a vista Transcompras ------ URGENTE!!!!!!`);
        const body = encodeURIComponent(transcomprasTexto);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
    };

    const handleSendWhatsApp = () => {
        if (!whatsNumber) {
            alert('Digite o número do WhatsApp.');
            return;
        }
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) {
            number = '55' + number;
        }
        const text = encodeURIComponent(transcomprasTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
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
                <button type="button" className="btn btn-light me-2" onClick={handleCopy}>
                    Copiar Dados Bancários
                </button>
                {/* Campo de email e botão Gmail abaixo do botão copiar */}
                <div className="mb-3 mt-3">
                    <label className="form-label text-white">
                        Email para envio:
                    </label>
                    <input
                        type="email"
                        className="form-control mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="destinatario@exemplo.com"
                    />
                    <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={handleSendGmail}
                    >
                        Enviar Dados pelo Gmail
                    </button>
                </div>
                {/* Campo e botão WhatsApp */}
                <div className="mb-3">
                    <label className="form-label text-white">
                        WhatsApp para envio:
                    </label>
                    <input
                        type="tel"
                        className="form-control mb-2"
                        value={whatsNumber}
                        onChange={(e) => setWhatsNumber(e.target.value)}
                        placeholder="Ex: 11999999999"
                    />
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleSendWhatsApp}
                    >
                        Enviar Dados pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {transcomprasTexto}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default TranscomprasForm;