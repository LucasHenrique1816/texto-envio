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

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TermoIsencaoAvariaForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [transportadora, setTransportadora] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [nome, setNome] = useState('');
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    const greeting = getGreeting();

    const dadosTransportadora = transportadoras.find(t => t.nome === transportadora);

    const textoComEmojis = transportadora ? `${greeting}, tudo bem? 📩
✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitamos Termo de Isenção de avaria para a seguinte NF:

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
` : '';

    const textoSemEmojis = transportadora ? `${greeting}, tudo bem?
Por gentileza, confirmar o recebimento desta mensagem.

Solicitamos Termo de Isenção de avaria para a seguinte NF:

Número da NF: ${nfNumber}

Transportadora: ${dadosTransportadora?.razao} (${dadosTransportadora?.cnpj})

Observação Importante:
A mercadoria só poderá ser embarcada após o envio do termo de isenção devidamente preenchido e assinado.

Urgência:
Aguardamos o documento o quanto antes para emissão do CT-e e prosseguimento com o embarque.

Desde já, agradecemos pela atenção e colaboração!

Atenciosamente,
${nome}
` : '';

    // Limpar formulário
    const handleClear = () => {
        setNfNumber('');
        setTransportadora(null);
        setEmail('');
        setWhatsNumber('');
        setNome('');
        setShowModal(null);
    };

    // Validação dos campos obrigatórios
    const isCopyValid = nfNumber.trim() && transportadora && nome.trim();
    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled = nfNumber || transportadora || nome || email || whatsNumber;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(textoComEmojis).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite um email válido.');
            return;
        }
        const subject = encodeURIComponent('Termo de isenção ------ URGENTE!!!!!!');
        const body = encodeURIComponent(textoComEmojis);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
        setShowModal(null);
    };

    const handleSendWhatsApp = () => {
        if (!isWhatsValid) {
            alert('Digite um número de WhatsApp válido.');
            return;
        }
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) {
            number = '55' + number;
        }
        const text = encodeURIComponent(textoSemEmojis);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Solicitação de Termo de Isenção de Avaria</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
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
                        value={transportadora || ''}
                        onChange={(e) => setTransportadora(e.target.value || null)}
                    >
                        <option value="">Selecione...</option>
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
                        onChange={(e) => setNome(onlyLetters(e.target.value))}
                        placeholder="Digite seu nome"
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Solicitação
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal('gmail')}
                        disabled={!isCopyValid}
                    >
                        Enviar pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
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

            {/* Modal de confirmação */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.7)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <form className="bg-dark p-4 rounded" style={{ maxWidth: 600, width: '90%' }} onSubmit={e => e.preventDefault()}>
                        <div className="mb-3 text-center">
                            <span style={{ fontSize: 22 }}>⚠️</span>
                            <span className="text-warning fw-bold mx-2" style={{ fontSize: 18 }}>
                                Confirme as informações antes de enviar
                            </span>
                            <span style={{ fontSize: 22 }}>⚠️</span>
                        </div>
                        <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
                            {textoComEmojis}
                        </pre>
                        {showModal === 'gmail' && (
                            <div className="mb-3">
                                <label className="form-label text-white">
                                    Email para envio:
                                </label>
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ''))}
                                    placeholder="destinatario@exemplo.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        )}
                        {showModal === 'whats' && (
                            <div className="mb-3">
                                <label className="form-label text-white">
                                    WhatsApp para envio:
                                </label>
                                <input
                                    type="tel"
                                    className="form-control mb-2"
                                    value={whatsNumber}
                                    onChange={(e) => setWhatsNumber(onlyNumbers(e.target.value))}
                                    placeholder="Ex: 11999999999"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={13}
                                    required
                                />
                            </div>
                        )}
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button
                                className="btn btn-secondary"
                                type="button"
                                onClick={() => setShowModal(null)}
                            >
                                Alterar dados
                            </button>
                            {showModal === 'copy' && (
                                <button className="btn btn-light" type="button" onClick={handleCopy}>
                                    Confirmar e Copiar
                                </button>
                            )}
                            {showModal === 'gmail' && (
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={handleSendGmail}
                                    disabled={!validateEmail(email)}
                                >
                                    Confirmar e Enviar Gmail
                                </button>
                            )}
                            {showModal === 'whats' && (
                                <button
                                    className="btn btn-success"
                                    type="button"
                                    onClick={handleSendWhatsApp}
                                    disabled={whatsNumber.length < 10}
                                >
                                    Confirmar e Enviar WhatsApp
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TermoIsencaoAvariaForm;