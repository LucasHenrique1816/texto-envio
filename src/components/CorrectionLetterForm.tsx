import React, { useState } from 'react';

const dadosTranspix = `Dados da Transportadora:

Razão Social: TRANSPIX - Transportes e Logística LTDA

CNPJ: 33.233.703/0001-19

IE: 796.876.432.112

Rua João Roberto, Nº 173 – Galpão 1

Bairro: Cidade Industrial Satélite de São Paulo

CEP: 07221-040

Município: Guarulhos – SP`;

const dadosTranscompras = `Dados da Transportadora:

Razão Social: TRANSCOMPRAS – Transporte e Compras Comerciais LTDA

CNPJ: 32.717.811/0002-85

IE: 336.252.554.113

Rua João Roberto, Nº 173

Bairro: Cidade Industrial Satélite de São Paulo

CEP: 07221-040

Guarulhos – SP`;

const CorrectionLetterForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [correcao, setCorrecao] = useState('');
    const [name, setName] = useState('');
    const [carrier, setCarrier] = useState('Transpix');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addTranspix, setAddTranspix] = useState(false);
    const [addTranscompras, setAddTranscompras] = useState(false);

    // Saudação automática conforme o horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const greeting = getGreeting();

    // Monta o texto extra conforme os checks, DENTRO do campo correção
    const correcaoCompleta = `${correcao}${addTranspix ? `\n\n${dadosTranspix}` : ''}${addTranscompras ? `\n\n${dadosTranscompras}` : ''}`;

    // Texto para cópia e pré-visualização (com emojis, negrito só na correção)
    const cartaTextoPreview = `${greeting}
Ola, tudo bem? 📩

✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitação Urgente de Carta de Correção

🧾 Dados da Nota Fiscal:

Número da NF: ${nfNumber}

*Correção: ${correcaoCompleta}*

📌 Observação Importante:
A mercadoria só poderá ser embarcada após o recebimento da carta de correção.

⏳ Urgência:
Precisamos da carta o quanto antes para emissão do CT-e e continuidade do processo logístico.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,

${name}
${carrier}

🚚💨📦`;

    // Texto para WhatsApp (sem emojis, negrito só na correção)
    const cartaTextoWhats = `${greeting}
Ola, tudo bem?

Por gentileza, confirmar o recebimento desta mensagem.

Solicitação Urgente de Carta de Correção

Dados da Nota Fiscal:

Número da NF: ${nfNumber}

*Correção: ${correcaoCompleta}*

Observação Importante:
A mercadoria só poderá ser embarcada após o recebimento da carta de correção.

Urgência:
Precisamos da carta o quanto antes para emissão do CT-e e continuidade do processo logístico.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,

${name}
${carrier}
`;

    // Texto com negrito para email (usando Markdown **correcao**)
    const cartaTextoEmail = `${greeting}
Ola, tudo bem? 📩

✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitação Urgente de Carta de Correção

🧾 Dados da Nota Fiscal:

Número da NF: ${nfNumber}

Correção: ${correcaoCompleta}

📌 Observação Importante:
A mercadoria só poderá ser embarcada após o recebimento da carta de correção.

⏳ Urgência:
Precisamos da carta o quanto antes para emissão do CT-e e continuidade do processo logístico.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,

${name}
${carrier}

🚚💨📦`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cartaTextoPreview).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent('Solicitação de Carta de Correção');
        // Usa o corpo em texto simples, mas com Markdown para negrito
        const body = encodeURIComponent(cartaTextoEmail);
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
        const text = encodeURIComponent(cartaTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Solicitação de Carta de Correção</h2>
            <form className="bg-dark p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">Número da NF:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
                        placeholder="Digite o número da NF"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Correção:</label>
                    <textarea
                        className="form-control"
                        value={correcao}
                        onChange={(e) => setCorrecao(e.target.value)}
                        placeholder="Descreva a correção necessária"
                        rows={3}
                    />
                </div>
                <div className="mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="transpixCheck"
                            checked={addTranspix}
                            onChange={() => setAddTranspix(!addTranspix)}
                        />
                        <label className="form-check-label text-white" htmlFor="transpixCheck">
                            Dados Transpix
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="transcomprasCheck"
                            checked={addTranscompras}
                            onChange={() => setAddTranscompras(!addTranscompras)}
                        />
                        <label className="form-check-label text-white" htmlFor="transcomprasCheck">
                            Dados Transcompras
                        </label>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Seu nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Transportadora:</label>
                    <select
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                    >
                        <option value="Transpix Transporte e Logistica LTDA">Transpix</option>
                        <option value="Transcompras Transportes e Compras Comerciais LTDA">Transcompras</option>
                    </select>
                </div>
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Solicitação
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
                        Enviar Solicitação pelo Gmail
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
                        Enviar Solicitação pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {cartaTextoPreview}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default CorrectionLetterForm;