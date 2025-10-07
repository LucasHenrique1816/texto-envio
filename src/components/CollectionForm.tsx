import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAutoFillName, LoggedUser } from '../hooks/useAutoFillName';

// Tipo para as props que o formulário irá receber
type FormProps = {
  loggedUser?: LoggedUser | null;
  readOnlyName?: boolean;
};

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

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const CollectionForm: React.FC<FormProps> = ({ loggedUser, readOnlyName = false }) => {
    const [collectionNumber, setCollectionNumber] = useState('');
    const [carrier, setCarrier] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats' | 'dados'>(null);

    // Usa o hook personalizado para preenchimento automático do nome
    const { name, setName, isReadOnly: isNameReadOnly } = useAutoFillName(loggedUser, {
        onlyFillIfEmpty: true,
        makeReadOnly: readOnlyName
    });

    // Saudação baseada no horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const greeting = getGreeting();

    // Texto solicitando dados para agendamento da coleta
    const dadosColetaTexto = `${greeting},\n\n🚚 Para agendar a coleta, por favor, envie todos os dados abaixo, digitados por completo:\n\n✅ Telefone do remetente;\n\n✅ Responsável pela coleta;\n\n✅ Cidade do destinatário;\n\n✅ Peso total (kg);\n\n✅ Quantidade de volumes;\n\n✅ Número da nota;\n\n✅ Tipo de material;\n\n✅ Alguma observação?;\n\n✅ Horário de retirada;\n\n✅ CNPJ do destinatário;\n\n✅ CNPJ do remetente;\n\n✅ Local de coleta;\n\n✅ Ponto de referência;\n\n✅ Frete (quem paga).\n\n🚨 IMPORTANTE: Só com todos os dados digitados corretamente conseguiremos agendar a coleta de forma rápida!\n\nAtenciosamente,\n${name}`;
    const dadosColetaTextoWhats = `${greeting},\n\nPara agendar a coleta envie (todos completos): Telefone remetente; Responsável coleta; Cidade destinatário; Peso total; Qtd volumes; Número nota; Tipo material; Observação; Horário retirada; CNPJ destinatário; CNPJ remetente; Local coleta; Referência; Frete (quem paga). IMPORTANTE: todos os dados necessários para agilidade.\n\nAtenciosamente,\n${name}`;

    const handleDadosCopy = () => {
        navigator.clipboard.writeText(dadosColetaTexto).then(() => alert('Texto copiado para a área de transferência!'));
        setShowModal(null);
    };
    const handleDadosGmail = () => {
        const dest = email && validateEmail(email) ? email : '';
        if (!dest || !validateEmail(dest)) {
            alert('Digite um email válido no campo de email.');
            return;
        }
        const subject = encodeURIComponent('Dados necessários para agendar coleta');
        const body = encodeURIComponent(dadosColetaTexto);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${subject}&body=${body}`, '_blank');
        setShowModal(null);
    };
    const handleDadosWhats = () => {
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length < 10) {
            alert('Digite um número de WhatsApp válido no campo indicado.');
            return;
        }
        if (number.length === 11) number = '55' + number;
        const text = encodeURIComponent(dadosColetaTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    const dadosTransportadora = transportadoras.find(t => t.nome === carrier);

    // Texto com emojis (para cópia, email, preview)
    const coletaTexto = carrier ? `${greeting},

Segue abaixo dados da coleta:

Coleta: ${collectionNumber}
Transportadora: ${dadosTransportadora?.razao} (${dadosTransportadora?.cnpj})

Prazo de retirada de 24 a 48 horas a partir do dia seguinte da solicitação.

Dúvidas, estamos à disposição.

Desculpe pela demora.

Atenciosamente,
${name}

🚚💨💨📦` : '';

    // Texto sem emojis (para WhatsApp)
    const coletaTextoWhats = carrier ? `${greeting},

Segue abaixo dados da coleta:

Coleta: ${collectionNumber}
Transportadora: ${dadosTransportadora?.razao} (${dadosTransportadora?.cnpj})

Prazo de retirada de 24 a 48 horas a partir do dia seguinte da solicitação.

Dúvidas, estamos à disposição.

Desculpe pela demora.

Atenciosamente,
${name}
` : '';

    // Limpar formulário
    const handleClear = () => {
        setCollectionNumber('');
        setCarrier(null);
        setName('');
        setEmail('');
        setWhatsNumber('');
        setShowModal(null);
    };

    // Validação dos campos obrigatórios
    const isCopyValid = collectionNumber.trim() && carrier && name.trim();
    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled = collectionNumber || carrier || name || email || whatsNumber;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(coletaTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite um email válido.');
            return;
        }
        const subject = encodeURIComponent(`Coleta ${collectionNumber}`);
        const body = encodeURIComponent(coletaTexto);
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
        const text = encodeURIComponent(coletaTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Coleta</h2>
            <button
                type="button"
                className="btn btn-info mb-3 me-2"
                onClick={() => setShowModal('dados')}
            >
                Dados para Coleta
            </button>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
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
                    <select
                        className="form-select"
                        value={carrier || ''}
                        onChange={(e) => setCarrier(e.target.value || null)}
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
                    <label className="form-label text-white">
                        Nome:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(onlyLetters(e.target.value))}
                        placeholder="Seu nome"
                        readOnly={isNameReadOnly}
                        style={isNameReadOnly ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Texto de Coleta
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal('gmail')}
                        disabled={!isCopyValid}
                    >
                        Enviar Coleta pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
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
                            {showModal === 'dados' ? dadosColetaTexto : coletaTexto}
                        </pre>
                        {showModal === 'dados' && (
                            <div className="row g-2 mt-2">
                                <div className="col-md-6">
                                    <label className="form-label text-white mb-1">Email (opcional para envio):</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        value={email}
                                        onChange={e => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ''))}
                                        placeholder="destinatario@exemplo.com"
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-white mb-1">WhatsApp (opcional):</label>
                                    <input
                                        type="tel"
                                        className="form-control form-control-sm"
                                        value={whatsNumber}
                                        onChange={e => setWhatsNumber(onlyNumbers(e.target.value))}
                                        placeholder="Ex: 11999999999"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={13}
                                    />
                                </div>
                            </div>
                        )}
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
                            {showModal === 'dados' && (
                                <>
                                    <button className="btn btn-light" type="button" onClick={handleDadosCopy}>Copiar Dados</button>
                                    <button className="btn btn-danger" type="button" onClick={handleDadosGmail} disabled={email ? !validateEmail(email) : false}>Enviar Gmail</button>
                                    <button className="btn btn-success" type="button" onClick={handleDadosWhats} disabled={whatsNumber !== '' && whatsNumber.replace(/\D/g,'').length < 10}>Enviar WhatsApp</button>
                                </>
                            )}
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

export default CollectionForm;