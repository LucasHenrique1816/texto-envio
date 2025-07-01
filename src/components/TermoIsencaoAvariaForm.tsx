import React, { useState } from 'react';

const transportadoras = [
    
    {
        nome: 'Transpix',
        razao: 'TRANSPIX - Transportes e Logística LTDA',
        cnpj: '33.233.703/0001-19',
    },
    {
        nome: 'Transcompras',
        razao: 'Transcompras - Transporte e Compras Comerciais LTDA',
        cnpj: '32.717.811/0002-85',
    },
];

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Bom dia' : 'Boa tarde';
};

const TermoIsencaoAvariaForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [transportadora, setTransportadora] = useState(transportadoras[0].nome);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [nome, setNome] = useState('');

    const greeting = getGreeting();

    const dadosTransportadora = transportadoras.find(t => t.nome === transportadora);

    const textoComEmojis = `${greeting}, tudo bem? 📩
✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitação de Termo de Isenção de avaria

🧾 Número da NF: ${nfNumber}

🚚 Transportadora: ${dadosTransportadora?.razao} (${dadosTransportadora?.cnpj})

📌 Observação Importante:
A mercadoria só poderá ser embarcada após o envio do termo de isenção devidamente preenchido e assinado.

⏳ Urgência:
Aguardamos o documento o quanto antes para emissão do CT-e e prosseguimento com o embarque.

Desde já, agradecemos pela atenção e colaboração!

Atenciosamente,
${nome}

🚚💨📦
`;

    const textoSemEmojis = `${greeting}, tudo bem?
Por gentileza, confirmar o recebimento desta mensagem.

Solicitação de Termo de Isenção de avaria

Número da NF: ${nfNumber}

Transportadora: ${dadosTransportadora?.razao} (${dadosTransportadora?.cnpj})

Observação Importante:
A mercadoria só poderá ser embarcada após o envio do termo de isenção devidamente preenchido e assinado.

Urgência:
Aguardamos o documento o quanto antes para emissão do CT-e e prosseguimento com o embarque.

Desde já, agradecemos pela atenção e colaboração!

Atenciosamente,
${nome}
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
        const subject = encodeURIComponent('Solicitação de Termo de Isenção de Avaria');
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
            <h2 className="text-white">Solicitação de Termo de Isenção de Avaria</h2>
            <form className="bg-dark p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">Número da Nota Fiscal:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
                        placeholder="Digite o número da NF"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Transportadora:</label>
                    <select
                        className="form-select"
                        value={transportadora}
                        onChange={(e) => setTransportadora(e.target.value)}
                    >
                        {transportadoras.map(t => (
                            <option key={t.nome} value={t.nome}>
                                {t.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Seu nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite seu nome"
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Solicitação
                </button>
                {/* Campo de email e botão Gmail */}
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

export default TermoIsencaoAvariaForm;