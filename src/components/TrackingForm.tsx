import React, { useState } from 'react';

const stateOptions = [
    { label: 'Sergipe', value: 'Sergipe', prazo: '6 a 9' },
    { label: 'Bahia', value: 'Bahia', prazo: '6 a 9' },
    { label: 'Maceió', value: 'Maceió', prazo: '6 a 10' },
    { label: 'Recife', value: 'Recife', prazo: '6 a 10' },
];

const transportadoras = [
    {
        nome: 'Transpix',
        razao: 'TRANSPIX - Transportes e Logística LTDA',
    },
    {
        nome: 'Transcompras',
        razao: 'Transcompras - Transporte e Compras Comerciais LTDA',
    },
];

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TrackingForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [date, setDate] = useState('');
    const [state, setState] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [transportadora, setTransportadora] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    // Saudação automática conforme o horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const greeting = getGreeting();

    // Função para formatar data de yyyy-mm-dd para dd/mm/yyyy
    const formatDate = (isoDate: string) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    // Atualiza o prazo automaticamente ao selecionar o estado
    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = stateOptions.find(opt => opt.value === e.target.value);
        setState(e.target.value);
        setDeliveryTime(selected ? selected.prazo : '');
    };

    const dadosTransportadora = transportadoras.find(t => t.nome === transportadora);

    // Texto com emojis (para cópia, email, preview)
    const trackingText = transportadora ? `${greeting}

Olá, tudo bem? 👋

Referente à Nota Fiscal nº ${nfNumber}, informamos que a mercadoria saiu para transporte em ${formatDate(date)} 🚚.

O prazo estimado para entrega é de ${deliveryTime} dias corridos ⏳📦.

Transportadora: ${dadosTransportadora?.razao}

Permanecemos à disposição para qualquer dúvida.
Atenciosamente,
${name} 
🚚💨💨📦` : '';

    // Texto sem emojis (para WhatsApp)
    const trackingTextWhats = transportadora ? `${greeting}

Olá, tudo bem?

Referente à Nota Fiscal nº ${nfNumber}, informamos que a mercadoria saiu para transporte em ${formatDate(date)}.

O prazo estimado para entrega é de ${deliveryTime} dias corridos.

Transportadora: ${dadosTransportadora?.razao}

Permanecemos à disposição para qualquer dúvida.
Atenciosamente,
${name}
` : '';

    // Limpar formulário
    const handleClear = () => {
        setNfNumber('');
        setDate('');
        setState('');
        setDeliveryTime('');
        setTransportadora(null);
        setName('');
        setEmail('');
        setWhatsNumber('');
        setShowModal(null);
    };

    // Validação dos campos obrigatórios
    const isCopyValid = nfNumber.trim() && date && state && deliveryTime && transportadora && name.trim();
    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled = nfNumber || date || state || deliveryTime || transportadora || name || email || whatsNumber;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(trackingText).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite um email válido.');
            return;
        }
        const subject = encodeURIComponent(`Rastreamento NF ${nfNumber}`);
        const body = encodeURIComponent(trackingText);
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
        const text = encodeURIComponent(trackingTextWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Rastreamento de Nota Fiscal</h2>
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
                        onChange={(e) => setNfNumber(e.target.value)}
                        placeholder="Ex: 123456"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Data de saída:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Estado de destino:</label>
                    <select
                        className="form-control"
                        value={state}
                        onChange={handleStateChange}
                    >
                        <option value="">Selecione o estado</option>
                        {stateOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Prazo para entrega (dias):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={deliveryTime}
                        disabled
                        placeholder="Selecione o estado"
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
                    <label className="form-label text-white">Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(onlyLetters(e.target.value))}
                        placeholder="Seu nome"
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Texto de Rastreamento
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal('gmail')}
                        disabled={!isCopyValid}
                    >
                        Enviar Rastreamento pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
                    >
                        Enviar Rastreamento pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {trackingText}
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
                            {trackingText}
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

export default TrackingForm;