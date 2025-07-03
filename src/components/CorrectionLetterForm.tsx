import React, { useState } from 'react';

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    const [carrier, setCarrier] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addTranspix, setAddTranspix] = useState(false);
    const [addTranscompras, setAddTranscompras] = useState(false);
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

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

    // Texto para WhatsApp (sem emojis, negrito só na correção)
    const cartaTextoWhats = `${greeting}
Ola, tudo bem?

Por gentileza, confirmar o recebimento desta mensagem.

Solicitação Urgente de Carta de Correção

Dados da Nota Fiscal:

Número da NF: ${nfNumber}

Correção: ${correcaoCompleta}

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
    const cartaTextoEmail = cartaTextoPreview;

    // Limpar formulário
    const handleClear = () => {
        setNfNumber('');
        setCorrecao('');
        setName('');
        setCarrier('');
        setEmail('');
        setWhatsNumber('');
        setAddTranspix(false);
        setAddTranscompras(false);
        setShowModal(null);
    };

    // Validação dos campos obrigatórios
    const isCopyValid =
        nfNumber.trim() &&
        correcaoCompleta.trim() &&
        name.trim() &&
        carrier;

    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;

    // Verifica se algum campo foi preenchido para mostrar o botão de limpar
    const isAnyFieldFilled =
        nfNumber ||
        correcao ||
        name ||
        email ||
        whatsNumber ||
        addTranspix ||
        addTranscompras ||
        carrier;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(cartaTextoPreview).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite um email válido.');
            return;
        }
        const subject = encodeURIComponent('Carta de Correção -------- URGENTE!!!!!');
        const body = encodeURIComponent(cartaTextoEmail);
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
        const text = encodeURIComponent(cartaTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    // Handler para selecionar apenas um dos dois checks
    const handleCheckTranspix = () => {
        if (!addTranspix) {
            setAddTranspix(true);
            setAddTranscompras(false);
            setCorrecao(dadosTranspix);
        } else {
            setAddTranspix(false);
            setCorrecao('');
        }
    };

    const handleCheckTranscompras = () => {
        if (!addTranscompras) {
            setAddTranscompras(true);
            setAddTranspix(false);
            setCorrecao(dadosTranscompras);
        } else {
            setAddTranscompras(false);
            setCorrecao('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Solicitação de Carta de Correção</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">Número da NF:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(onlyNumbers(e.target.value))}
                        placeholder="Digite o número da NF"
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                            onChange={handleCheckTranspix}
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
                            onChange={handleCheckTranscompras}
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
                        onChange={(e) => setName(onlyLetters(e.target.value))}
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
                        <option value="">Selecione...</option>
                        <option value="Transpix Transporte e Logistica LTDA">Transpix</option>
                        <option value="Transcompras Transportes e Compras Comerciais LTDA">Transcompras</option>
                    </select>
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
                        Enviar Solicitação pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
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
                            {cartaTextoPreview}
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

export default CorrectionLetterForm;