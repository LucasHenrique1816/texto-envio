import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CollectionForm: React.FC = () => {
    const [collectionNumber, setCollectionNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    // Saudação baseada no horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const coletaTexto = `${getGreeting()},\n
Segue abaixo dados da coleta:\n
Coleta: ${collectionNumber}
Transportadora: ${carrier}

Prazo de retirada de 24 a 48 horas a partir do dia seguinte da solicitação.

Dúvidas, estamos à disposição.

Desculpe pela demora.

Atenciosamente,
${name}

🚚💨💨📦`;

    const handleCopy = () => {
        navigator.clipboard.writeText(coletaTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Coleta ${collectionNumber}`);
        const body = encodeURIComponent(coletaTexto);
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
        const text = encodeURIComponent(coletaTexto);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Coleta</h2>
            <form className="bg-dark p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Coleta:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={collectionNumber}
                        onChange={(e) => setCollectionNumber(e.target.value)}
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
                    Copiar Texto de Coleta
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
                        Enviar Coleta pelo Gmail
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
                        Enviar Coleta pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {coletaTexto}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default CollectionForm;