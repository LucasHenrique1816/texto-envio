import React, { useState } from 'react';

const AutorizacaoEmbarqueForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [quotationNumber, setQuotationNumber] = useState('');
    const [freightValue, setFreightValue] = useState('');
    const [carrier, setCarrier] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const textoComEmojis = `${getGreeting()}, tudo bem? 📩
✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitamos a Autorização para Embarque do frete abaixo:

🧾 Dados do Frete:

Número da NF: ${nfNumber}

Número da Cotação: ${quotationNumber}

Valor do Frete: R$ ${freightValue}

Transportadora: ${carrier}

📌 Observação Importante:
A mercadoria só será embarcada mediante autorização da empresa contratante.

⏳ Urgência:
Solicitamos a autorização com brevidade para emissão do CT-e e liberação do embarque.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,
${name}

🚚💨📦`;

    const textoSemEmojis = `${getGreeting()}, tudo bem?
Por gentileza, confirmar o recebimento desta mensagem.

Solicitamos a Autorização para Embarque do frete abaixo:

Dados do Frete:

Número da NF: ${nfNumber}

Número da Cotação: ${quotationNumber}

Valor do Frete: R$ ${freightValue}

Transportadora: ${carrier}

Observação Importante:
A mercadoria só será embarcada mediante autorização da empresa contratante.

Urgência:
Solicitamos a autorização com brevidade para emissão do CT-e e liberação do embarque.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,
${name}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(textoComEmojis).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent('Solicitação de Autorização para Embarque');
        const body = encodeURIComponent(textoComEmojis);
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
        const text = encodeURIComponent(textoSemEmojis);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Autorização de Embarque</h2>
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Nota Fiscal:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
                        placeholder="Digite o número da NF"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Cotação:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={quotationNumber}
                        onChange={(e) => setQuotationNumber(e.target.value)}
                        placeholder="Digite o número da cotação"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Valor do Frete:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={freightValue}
                        onChange={(e) => setFreightValue(e.target.value)}
                        placeholder="Digite o valor do frete"
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
                        placeholder="Digite o nome da transportadora"
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
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Texto
                </button>
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
                        Enviar pelo Gmail
                    </button>
                </div>
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
                        Enviar pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {textoComEmojis}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default AutorizacaoEmbarqueForm;