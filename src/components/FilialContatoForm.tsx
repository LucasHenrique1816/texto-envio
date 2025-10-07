import React, { useState } from 'react';

const filiais = [
    {
        nome: 'Aracaju-SE',
        texto: `📍 Dados de Contato – Filial Aracaju/SE

📞 Telefone fixo: (79) 3114-4861
💬 WhatsApp: (79) 3114-4860
✉️ E-mail para cotações: cotacao.se@transcompras.com.br
✉️ E-mail para coletas: coleta.se@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Aracaju/SE

Telefone fixo: (79) 3114-4861
WhatsApp: (79) 3114-4860
E-mail para cotações: cotacao.se@transcompras.com.br
E-mail para coletas: coleta.se@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Salvador-BA',
        texto: `📍 Dados de Contato – Filial Salvador/BA

📞 Telefone fixo: (71) 3616-3351
💬 WhatsApp: (71) 9313-8000
✉️ E-mail: coleta.ba@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Salvador/BA

Telefone fixo: (71) 3616-3351
WhatsApp: (71) 9313-8000
E-mail: coleta.ba@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Rio de Janeiro-RJ',
        texto: `📍 Dados de Contato – Filial Rio de Janeiro/RJ

💬 WhatsApp: (21) 98207-9999
💬 WhatsApp: (21) 97965-4300
✉️ E-mail: rio@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Rio de Janeiro/RJ

WhatsApp: (21) 98207-9999
WhatsApp: (21) 97965-4300
E-mail: rio@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Maceió-AL',
        texto: `📍 Dados de Contato – Filial Maceió/AL

📞 Telefone fixo: (82) 2126-4600
💬 WhatsApp: (82) 2126-4904
✉️ E-mail: atendimento.mcz@transpixlog.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Maceió/AL

Telefone fixo: (82) 2126-4600
WhatsApp: (82) 2126-4904
E-mail: atendimento.mcz@transpixlog.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Recife-PE',
        texto: `📍 Dados de Contato – Filial Recife/PE

📞 Telefone fixo: (81) 3972-7411
💬 WhatsApp: (81) 9696-8080
✉️ E-mail: atendimento.rec@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Recife/PE

Telefone fixo: (81) 3972-7411
WhatsApp: (81) 9696-8080
E-mail: atendimento.rec@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Guarulhos-SP',
        texto: `📍 Dados de Contato – Filial Guarulhos/SP

📞 Telefone fixo: (11) 3927-2050
💬 WhatsApp: (11) 98317-0750
✉️ E-mail para coletas: coleta.sp@transcompras.com.br
✉️ E-mail para cotações: comercial.sp@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Guarulhos/SP

Telefone fixo: (11) 3927-2050
WhatsApp: (11) 98317-0750
E-mail para coletas: coleta.sp@transcompras.com.br
E-mail para cotações: comercial.sp@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
];

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Bom dia' : 'Boa tarde';
};

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FilialContatoForm: React.FC = () => {
    const [filialSelecionada, setFilialSelecionada] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    const greeting = getGreeting();

    const filial = filiais.find(f => f.nome === filialSelecionada);
    const textoFilial = filial ? `${greeting},\n\n${filial.texto}` : '';
    const textoFilialWhats = filial ? `${greeting},\n\n${filial.textoSemEmojis}` : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilialSelecionada(e.target.value);
    };

    const handleClear = () => {
        setFilialSelecionada(null);
        setEmail('');
        setWhatsNumber('');
        setShowModal(null);
    };

    const isCopyValid = !!filialSelecionada;
    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled = filialSelecionada || email || whatsNumber;

    const handleCopy = () => {
        if (!filialSelecionada) return;
        navigator.clipboard.writeText(textoFilial).then(() => {
            alert('Texto copiado para a Ã¡rea de transferÃªncia!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!validateEmail(email)) {
            alert('Digite um email vÃ¡lido.');
            return;
        }
        const subject = encodeURIComponent(`Contato Filial ${filialSelecionada}`);
        const body = encodeURIComponent(textoFilial);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
        setShowModal(null);
    };

    const handleSendWhatsApp = () => {
        if (whatsNumber.length < 10) {
            alert('Digite um nÃºmero de WhatsApp vÃ¡lido.');
            return;
        }
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) {
            number = '55' + number;
        }
        const text = encodeURIComponent(textoFilialWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para dados de contato das filiais</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulÃ¡rio
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">Selecione a filial:</label>
                    <div className="d-flex flex-wrap">
                        {filiais.map(filial => (
                            <div className="form-check me-4 mb-2" key={filial.nome}>
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="filial"
                                    id={filial.nome}
                                    value={filial.nome}
                                    checked={filialSelecionada === filial.nome}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label text-white" htmlFor={filial.nome}>
                                    {filial.nome}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Dados de Contato
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
                        {textoFilial}
                    </pre>
                </div>
            </form>

            {/* Modal de confirmaÃ§Ã£o */}
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
                            {textoFilial}
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

export default FilialContatoForm;

