import React, { useState } from 'react';

const filiais = [
    {
        nome: 'Aracaju-SE',
        texto: `📍 Dados de Contato – Filial Aracaju/SE

📞 Telefone Fixo: (79) 3114-4861
💬 WhatsApp: (79) 3114-4860
📧 E-mail para Cotações: cotacao.se@transcompras.com.br
📧 E-mail para Coletas: coleta.se@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Aracaju/SE

Telefone Fixo: (79) 3114-4861
WhatsApp: (79) 3114-4860
E-mail para Cotações: cotacao.se@transcompras.com.br
E-mail para Coletas: coleta.se@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Salvador-BA',
        texto: `📍 Dados de Contato – Filial Salvador/BA

📞 Telefone Fixo: (71) 3616-3351
💬 WhatsApp: (71) 9313-8000
📧 E-mail: coleta.ba@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Salvador/BA

Telefone Fixo: (71) 3616-3351
WhatsApp: (71) 9313-8000
E-mail: coleta.ba@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Rio de Janeiro-RJ',
        texto: `📍 Dados de Contato – Filial Rio de Janeiro/RJ

💬 WhatsApp: (21) 97965-4300
📧 E-mail: rio@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Rio de Janeiro/RJ

WhatsApp: (21) 97965-4300
E-mail: rio@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Maceió-AL',
        texto: `📍 Dados de Contato – Filial Maceió/AL

📞 Telefone Fixo: (82) 2126-4600
💬 WhatsApp: (82) 2126-4904
📧 E-mail: atendimento.mcz@transpixlog.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Maceió/AL

Telefone Fixo: (82) 2126-4600
WhatsApp: (82) 2126-4904
E-mail: atendimento.mcz@transpixlog.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Recife-PE',
        texto: `📍 Dados de Contato – Filial Recife/PE

📞 Telefone Fixo: (81) 3972-7411
💬 WhatsApp: (81) 9696-8080
📧 E-mail: atendimento.rec@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Recife/PE

Telefone Fixo: (81) 3972-7411
WhatsApp: (81) 9696-8080
E-mail: atendimento.rec@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
    {
        nome: 'Guarulhos-SP',
        texto: `📍 Dados de Contato – Filial Guarulhos/SP

📞 Telefone Fixo: (11) 3927-2050
💬 WhatsApp: (11) 98317-0750
📧 E-mail para Coletas: coleta.sp@transcompras.com.br
📧 E-mail para Cotações: comercial.sp@transcompras.com.br

🚚 Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
        textoSemEmojis: `Dados de Contato – Filial Guarulhos/SP

Telefone Fixo: (11) 3927-2050
WhatsApp: (11) 98317-0750
E-mail para Coletas: coleta.sp@transcompras.com.br
E-mail para Cotações: comercial.sp@transcompras.com.br

Transcompras & Transpix Transportes
Estamos à disposição para o que precisar!`,
    },
];

const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Bom dia' : 'Boa tarde';
};

const FilialContatoForm: React.FC = () => {
    const [filialSelecionada, setFilialSelecionada] = useState(filiais[0].nome);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');

    const greeting = getGreeting();

    const filial = filiais.find(f => f.nome === filialSelecionada);
    const textoFilial = `${greeting},\n\n${filial?.texto || ''}`;
    const textoFilialWhats = `${greeting},\n\n${filial?.textoSemEmojis || ''}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilialSelecionada(e.target.value);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(textoFilial).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Contato Filial ${filialSelecionada}`);
        const body = encodeURIComponent(textoFilial);
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
        const text = encodeURIComponent(textoFilialWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para Dados de Contato das Filiais</h2>
            <form className="bg-dark p-4 rounded">
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
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Dados de Contato
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
                        {textoFilial}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default FilialContatoForm;