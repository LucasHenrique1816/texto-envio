import React, { useState } from 'react';

const stateOptions = [
    { label: 'Sergipe', value: 'Sergipe', prazo: '6 a 9' },
    { label: 'Bahia', value: 'Bahia', prazo: '6 a 9' },
    { label: 'Maceió', value: 'Maceió', prazo: '6 a 10' },
    { label: 'Recife', value: 'Recife', prazo: '6 a 10' },
];

const TrackingForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [date, setDate] = useState('');
    const [state, setState] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [carrier, setCarrier] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

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

    // Texto com emojis (para cópia, email, preview)
    const trackingText = `${greeting}

Olá, tudo bem? 👋

Referente à Nota Fiscal nº ${nfNumber}, informamos que a mercadoria saiu para transporte em ${formatDate(date)} 🚚.

O prazo estimado para entrega é de ${deliveryTime} dias corridos ⏳📦.

Transportadora: ${carrier}

Permanecemos à disposição para qualquer dúvida.
Atenciosamente,
${name} 
🚚💨💨📦`;

    // Texto sem emojis (para WhatsApp)
    const trackingTextWhats = `${greeting}

Olá, tudo bem?

Referente à Nota Fiscal nº ${nfNumber}, informamos que a mercadoria saiu para transporte em ${formatDate(date)}.

O prazo estimado para entrega é de ${deliveryTime} dias corridos.

Transportadora: ${carrier}

Permanecemos à disposição para qualquer dúvida.
Atenciosamente,
${name}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingText).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Rastreamento NF ${nfNumber}`);
        const body = encodeURIComponent(trackingText);
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
        const text = encodeURIComponent(trackingTextWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Rastreamento de Nota Fiscal</h2>
            <form className="bg-dark p-4 rounded">
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
                    <input
                        type="text"
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        placeholder="Nome da transportadora"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Nome:</label>
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
                    Copiar Texto de Rastreamento
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
                        Enviar Rastreamento pelo Gmail
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
        </div>
    );
};

export default TrackingForm;