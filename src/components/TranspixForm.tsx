import React, { useState } from 'react';

const onlyNumbers = (value: string) => value.replace(/\D/g, '');
const onlyLetters = (value: string) => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
const formatCurrency = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (!v) return '';
    v = (parseInt(v, 10) / 100).toFixed(2) + '';
    v = v.replace('.', ',');
    v = v.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return v;
};
const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const TranspixForm: React.FC = () => {
    const [quotationNumber, setQuotationNumber] = useState('');
    const [nfNumber, setNfNumber] = useState('');
    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addMore, setAddMore] = useState(false);
    const [extraFretes, setExtraFretes] = useState<
        { quotationNumber: string; nfNumber: string; value: string }[]
    >([]);
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    // Limpar formulário
    const handleClear = () => {
        setQuotationNumber('');
        setNfNumber('');
        setValue('');
        setName('');
        setEmail('');
        setWhatsNumber('');
        setAddMore(false);
        setExtraFretes([]);
        setShowModal(null);
    };

    // Funções para campos dinâmicos
    const handleAddFrete = () => {
        setExtraFretes([...extraFretes, { quotationNumber: '', nfNumber: '', value: '' }]);
    };
    const handleChangeFrete = (idx: number, field: string, val: string) => {
        setExtraFretes(extraFretes.map((f, i) =>
            i === idx ? { ...f, [field]: field === 'value' ? formatCurrency(onlyNumbers(val)) : onlyNumbers(val) } : f
        ));
    };
    const handleRemoveFrete = (idx: number) => {
        setExtraFretes(extraFretes.filter((_, i) => i !== idx));
    };

    // Saudação
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Calcular valor total do frete
    const parseValue = (v: string) => Number(v.replace(/\./g, '').replace(',', '.')) || 0;
    const totalFrete = [value, ...extraFretes.map(f => f.value)]
        .map(parseValue)
        .reduce((a, b) => a + b, 0);

    // Texto principal
    const fretesTexto = [
        `- Número da Cotação: ${quotationNumber}\n- Número da NF: ${nfNumber}\n- Valor: R$ ${value}`,
        ...extraFretes.map(
            (f) =>
                `- Número da Cotação: ${f.quotationNumber}\n- Número da NF: ${f.nfNumber}\n- Valor: R$ ${f.value}`
        ),
    ].join('\n\n');

    const valorTotalTexto = `Valor total do frete: R$ ${totalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const transpixTexto = `${getGreeting()},\n
📝 Dados da Cotação - NF:\n
${fretesTexto}

${valorTotalTexto}

- Frete: À vista.

📋 Dados Bancários:

*- Chave PIX: 33.233.703/0001-19*
- Banco: Bradesco
- Agência: 2514
- C/C: 61330-4
- Favorecido: Transpix Transportes e Logística Ltda.
- CNPJ: 33.233.703/0001-19

🚚 Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

⚠️ Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

🚨*Por favor, envie o comprovante de pagamento.*

Atenciosamente,
${name}
`;

    // WhatsApp: sem emojis
    const transpixTextoWhats = `${getGreeting()},\n
Dados da Cotação - NF:\n
${fretesTexto}

${valorTotalTexto}

- Frete: À vista.

Dados Bancários:

- Chave PIX: 33.233.703/0001-19
- Banco: Bradesco
- Agência: 2514
- C/C: 61330-4
- Favorecido: Transpix Transportes e Logística Ltda.
- CNPJ: 33.233.703/0001-19

Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

Por favor, envie o comprovante de pagamento.

Atenciosamente,
${name}
`;

    // Checa se campos obrigatórios para copiar estão preenchidos
    const isCopyValid =
        quotationNumber.trim() &&
        nfNumber.trim() &&
        value.trim() &&
        name.trim() &&
        (!addMore || extraFretes.every(f => f.quotationNumber && f.nfNumber && f.value));

    // Checa se campos obrigatórios para email estão preenchidos
    const isEmailValid = isCopyValid && validateEmail(email);

    // Checa se campos obrigatórios para whatsapp estão preenchidos
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;

    // Verifica se algum campo foi preenchido para mostrar o botão de limpar
    const isAnyFieldFilled =
        quotationNumber ||
        nfNumber ||
        value ||
        name ||
        email ||
        whatsNumber ||
        extraFretes.some(f => f.quotationNumber || f.nfNumber || f.value);

    // Funções de envio (apenas executadas após confirmação)
    const doCopy = () => {
        navigator.clipboard.writeText(transpixTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };
    const doGmail = () => {
        if (!validateEmail(email)) return;
        const subject = encodeURIComponent(`Frete a vista Transpix ------ URGENTE!!!!!!`);
        const body = encodeURIComponent(transpixTexto);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
        setShowModal(null);
    };
    const doWhats = () => {
        if (whatsNumber.length < 10) return;
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) number = '55' + number;
        const text = encodeURIComponent(transpixTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Dados Bancários Transpix</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">Número da Cotação:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={quotationNumber}
                        onChange={e => setQuotationNumber(onlyNumbers(e.target.value))}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Número da NF:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={e => setNfNumber(onlyNumbers(e.target.value))}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">Valor:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={e => setValue(formatCurrency(onlyNumbers(e.target.value)))}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0,00"
                        maxLength={15}
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="addMore"
                        checked={addMore}
                        onChange={() => setAddMore(!addMore)}
                    />
                    <label className="form-check-label text-white" htmlFor="addMore">
                        Adicionar mais cotações/NFs
                    </label>
                </div>
                {addMore && (
                    <div className="mb-3">
                        <label className="form-label text-white">Outras cotações/NFs:</label>
                        {extraFretes.map((f, idx) => (
                            <div key={idx} className="border rounded p-2 mb-2 bg-secondary">
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    placeholder="Número da Cotação"
                                    value={f.quotationNumber}
                                    onChange={e => handleChangeFrete(idx, 'quotationNumber', e.target.value)}
                                    required
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    placeholder="Número da NF"
                                    value={f.nfNumber}
                                    onChange={e => handleChangeFrete(idx, 'nfNumber', e.target.value)}
                                    required
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    placeholder="Valor"
                                    value={f.value}
                                    onChange={e => handleChangeFrete(idx, 'value', e.target.value)}
                                    required
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={15}
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveFrete(idx)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={handleAddFrete}
                        >
                            + Adicionar Cotação/NF
                        </button>
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label text-white">Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={e => setName(onlyLetters(e.target.value))}
                        placeholder="Seu nome"
                        required
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Dados Bancários
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
                <div className="mt-4 d-flex justify-content-between align-items-center">
                    <div>
                        <label className="form-label text-white">Pré-visualização:</label>
                    </div>
                </div>
                <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                    {transpixTexto}
                </pre>
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
                            {showModal === 'whats' ? transpixTextoWhats : transpixTexto}
                        </pre>
                        {/* Campos de email e whatsapp no modal */}
                        {showModal === 'gmail' && (
                            <div className="mb-3">
                                <label className="form-label text-white">Email para envio:</label>
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    value={email}
                                    onChange={e => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ''))}
                                    placeholder="destinatario@exemplo.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        )}
                        {showModal === 'whats' && (
                            <div className="mb-3">
                                <label className="form-label text-white">WhatsApp para envio:</label>
                                <input
                                    type="tel"
                                    className="form-control mb-2"
                                    value={whatsNumber}
                                    onChange={e => setWhatsNumber(onlyNumbers(e.target.value))}
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
                                <button className="btn btn-primary" type="button" onClick={doCopy}>
                                    Confirmar e Copiar
                                </button>
                            )}
                            {showModal === 'gmail' && (
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={doGmail}
                                    disabled={!validateEmail(email)}
                                >
                                    Confirmar e Enviar Gmail
                                </button>
                            )}
                            {showModal === 'whats' && (
                                <button
                                    className="btn btn-success"
                                    type="button"
                                    onClick={doWhats}
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

export default TranspixForm;