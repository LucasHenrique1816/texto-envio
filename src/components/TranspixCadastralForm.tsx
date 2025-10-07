import React, { useState, useEffect } from 'react';

// Tipo para as props que o formulário irá receber
type FormProps = {
  loggedUser?: {
    login: string;
    nome_completo: string;
    role: string;
  } | null;
  readOnlyName?: boolean;
};

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TranspixCadastralForm: React.FC<FormProps> = ({ loggedUser, readOnlyName = false }) => {
    // Saudação automática conforme o horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    // Preenche automaticamente o nome com o nome completo do usuário logado
    useEffect(() => {
        if (loggedUser?.nome_completo && !name) {
            setName(loggedUser.nome_completo);
        }
    }, [loggedUser, name]);

    const greeting = getGreeting();

    // Texto com emojis (para cópia, email, preview)
    const cadastralTexto = `${greeting},

📦 Dados Cadastrais

Abaixo seguem os dados cadastrais completos da TRANSPIX – Transportes e Logística LTDA.

🧾 Informações Cadastrais
Razão Social: TRANSPIX – Transportes e Logística LTDA

CNPJ: 33.233.703/0001-19

IE: 796.876.432.112

📍 Endereço Comercial
Logradouro: Rua João Roberto, Nº 173 – Galpão 1

Bairro: Cidade Industrial Satélite de São Paulo

CEP: 07221-040

Município: Guarulhos – SP

📬 Canais de Contato
E-mail para Coletas: coleta.sp@transcompras.com.br

E-mail para Cotações: comercial.sp@transcompras.com.br

Telefone Fixo: (11) 3927-2050

WhatsApp: (11) 98317-0750

Caso precise de cotações, agendamentos de coletas ou mais informações, estamos à disposição para atendê-lo(a) com agilidade e atenção.

Atenciosamente,
${name}
Equipe TRANSPIX`;

    // Texto sem emojis (para WhatsApp)
    const cadastralTextoWhats = `${greeting},

Dados Cadastrais

Abaixo seguem os dados cadastrais completos da TRANSPIX – Transportes e Logística LTDA.

Informações Cadastrais
Razão Social: TRANSPIX – Transportes e Logística LTDA

CNPJ: 33.233.703/0001-19

IE: 796.876.432.112

Endereço Comercial
Logradouro: Rua João Roberto, Nº 173 – Galpão 1

Bairro: Cidade Industrial Satélite de São Paulo

CEP: 07221-040

Município: Guarulhos – SP

Canais de Contato
E-mail para Coletas: coleta.sp@transcompras.com.br

E-mail para Cotações: comercial.sp@transcompras.com.br

Telefone Fixo: (11) 3927-2050

WhatsApp: (11) 98317-0750

Caso precise de cotações, agendamentos de coletas ou mais informações, estamos à disposição para atendê-lo(a) com agilidade e atenção.

Atenciosamente,
${name}
Equipe TRANSPIX`;

    // Limpar formulário
    const handleClear = () => {
        setName('');
        setEmail('');
        setWhatsNumber('');
        setShowModal(null);
    };

    // Validação dos campos obrigatórios
    const isCopyValid = name.trim();
    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;

    // Verifica se algum campo foi preenchido para mostrar o botão de limpar
    const isAnyFieldFilled = name || email || whatsNumber;

    const handleCopy = () => {
        navigator.clipboard.writeText(cadastralTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!validateEmail(email)) {
            alert('Digite um email válido.');
            return;
        }
        const subject = encodeURIComponent('Dados Cadastrais TRANSPIX');
        const body = encodeURIComponent(cadastralTexto);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
        setShowModal(null);
    };

    const handleSendWhatsApp = () => {
        if (whatsNumber.length < 10) {
            alert('Digite um número de WhatsApp válido.');
            return;
        }
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) {
            number = '55' + number;
        }
        const text = encodeURIComponent(cadastralTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Envio de Dados Cadastrais TRANSPIX</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">Seu nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(onlyLetters(e.target.value))}
                        placeholder="Seu nome"
                        readOnly={readOnlyName}
                        style={readOnlyName ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Dados Cadastrais
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal('gmail')}
                        disabled={!isCopyValid}
                    >
                        Enviar Dados pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
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
                            {cadastralTexto}
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

export default TranspixCadastralForm;
