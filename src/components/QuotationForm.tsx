import React, { useState } from 'react';

const QuotationForm: React.FC = () => {
    const [quotationNumber, setQuotationNumber] = useState('');
    const [value, setValue] = useState('');
    const [carrier, setCarrier] = useState('');
    const [payer, setPayer] = useState('');
    const [name, setName] = useState('');
    const [freteAVista, setFreteAVista] = useState(true);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const freteText = `Pago pelo ${payer}${freteAVista ? ' à vista' : ''} (sujeito a alteração se houver divergência nos dados informados).`;

    // Texto com emojis (para cópia, email, preview)
    const cotacaoTexto = `${getGreeting()},\n
📝 Dados da Cotação:\n
- Numero da Cotação: ${quotationNumber}
- Valor: R$ ${value}
- Transportadora: ${carrier}
- Frete: ${freteText}
- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.
- Validade da cotação: 30 dias.

🔔 Dúvidas ou negociações? Estamos à disposição!

Desculpe pela demora e obrigado pela paciência.

Atenciosamente,
${name}

🚚💨📦`;

    // Texto sem emojis (para WhatsApp)
    const cotacaoTextoWhats = `${getGreeting()},\n
Dados da Cotação:\n
- Numero da Cotação: ${quotationNumber}
- Valor: R$ ${value}
- Transportadora: ${carrier}
- Frete: ${freteText}
- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.
- Validade da cotação: 30 dias.

Dúvidas ou negociações? Estamos à disposição!

Desculpe pela demora e obrigado pela paciência.

Atenciosamente,
${name}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cotacaoTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Cotação ${quotationNumber}`);
        const body = encodeURIComponent(cotacaoTexto);
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
        const text = encodeURIComponent(cotacaoTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Formulário de Cotação</h2>
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
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
                        Transportadora:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Pagador do Frete:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        placeholder="Ex: destinatário, remetente"
                    />
                    <div className="form-check mt-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="freteAVista"
                            checked={freteAVista}
                            onChange={() => setFreteAVista(!freteAVista)}
                        />
                        <label className="form-check-label text-white" htmlFor="freteAVista">
                            Frete à vista
                        </label>
                    </div>
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
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Cotação
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
                        Enviar Cotação pelo Gmail
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
                        Enviar Cotação pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {cotacaoTexto}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default QuotationForm;