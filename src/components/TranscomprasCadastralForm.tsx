import React, { useState } from 'react';

const TranscomprasCadastralForm: React.FC = () => {
    // Saudação automática conforme o horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    const greeting = getGreeting();

    const cadastralTexto = `${greeting},

📦 Dados Cadastrais

Abaixo seguem os dados cadastrais completos da TRANSCOMPRAS – Transporte e Compras Comerciais LTDA,

🧾 Informações Cadastrais
Razão Social: TRANSCOMPRAS – Transporte e Compras Comerciais LTDA

CNPJ: 32.717.811/0002-85

IE: 336.252.554.113

📍 Endereço Comercial
Logradouro: Rua João Roberto, Nº 173

Bairro: Cidade Industrial Satélite de São Paulo

CEP: 07221-040

Município: Guarulhos – SP

📬 Canais de Contato
E-mail para Coletas: coleta.sp@transcompras.com.br

E-mail para Cotações: comercial.sp@transcompras.com.br

Telefone Fixo: (11) 3927-2050

WhatsApp: (11) 98317-0750

Caso precise de cotações, agendamentos de coletas ou mais informações, estaremos à disposição para atendê-lo(a) com agilidade e atenção.

Atenciosamente,
${name}
Equipe TRANSCOMPRAS`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cadastralTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent('Dados Cadastrais TRANSCOMPRAS');
        const body = encodeURIComponent(cadastralTexto);
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
        const text = encodeURIComponent(cadastralTexto);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Envio de Dados Cadastrais TRANSCOMPRAS</h2>
            <form className="bg-dark p-4 rounded">
                {/* Saudação automática removida do input */}
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
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Dados Cadastrais
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
                        {cadastralTexto}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default TranscomprasCadastralForm;