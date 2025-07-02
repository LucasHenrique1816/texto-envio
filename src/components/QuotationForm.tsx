import React, { useState } from 'react';

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

// Função para formatar valor monetário no padrão brasileiro
function formatCurrency(value: string) {
    let v = value.replace(/\D/g, '');
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace('.', ',');
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
}

const QuotationForm: React.FC = () => {
    const [quotations, setQuotations] = useState([
        { quotationNumber: '', value: '', carrier: '', payer: '', freteAVista: false }
    ]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addMore, setAddMore] = useState(false);
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);

    // Função para atualizar o campo valor formatado
    const handleValueChange = (idx: number, value: string) => {
        const raw = value.replace(/\D/g, '');
        setQuotations(prev =>
            prev.map((q, i) =>
                i === idx ? { ...q, value: formatCurrency(raw) } : q
            )
        );
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Monta o texto das cotações (sem repetir prazo e validade)
    const cotacoesTexto = quotations.map((q, idx) => {
        const transp = transportadoras.find(t => t.nome === q.carrier);
        const freteText = `Pago pelo ${q.payer}${q.freteAVista ? ' à vista' : ''} (sujeito a alteração se houver divergência nos dados informados).`;
        const titulo = idx === 0 ? '📝 Dados da Cotação:' : `📝 Dados da Cotação ${idx + 1}:`;
        return `${titulo}
- Numero da Cotação: ${q.quotationNumber}
- Valor: R$ ${q.value}
- Transportadora: ${transp ? `${transp.razao} (${transp.cnpj})` : ''}
- Frete: ${freteText}`;
    }).join('\n\n');

    const infoFinal = `\n- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.\n- Validade da cotação: 30 dias.`;

    const cotacaoTexto = `${getGreeting()},\n
${cotacoesTexto}
${infoFinal}

🔔 Dúvidas ou negociações? Estamos à disposição!

Desculpe pela demora e obrigado pela paciência.

Atenciosamente,
${name}

🚚💨📦`;

    const cotacaoTextoWhats = `${getGreeting()},\n
${cotacoesTexto}
${infoFinal}

Dúvidas ou negociações? Estamos à disposição!

Desculpe pela demora e obrigado pela paciência.

Atenciosamente,
${name}
`;

    // Limpar formulário
    const handleClear = () => {
        setQuotations([{ quotationNumber: '', value: '', carrier: '', payer: '', freteAVista: false }]);
        setName('');
        setEmail('');
        setWhatsNumber('');
        setAddMore(false);
        setShowModal(null);
    };

    // Adiciona uma nova cotação
    const handleAddQuotation = () => {
        setQuotations([
            ...quotations,
            { quotationNumber: '', value: '', carrier: '', payer: '', freteAVista: false }
        ]);
    };

    // Atualiza uma cotação específica
    const handleChangeQuotation = (
        idx: number,
        field: 'quotationNumber' | 'value' | 'carrier' | 'payer' | 'freteAVista',
        val: string | boolean
    ) => {
        setQuotations((prev) =>
            prev.map((q, i) =>
                i === idx ? { ...q, [field]: val } : q
            )
        );
    };

    // Remove uma cotação extra (não remove a primeira)
    const handleRemoveQuotation = (idx: number) => {
        setQuotations((prev) => prev.filter((_, i) => i !== idx));
    };

    // Validação dos campos obrigatórios
    const isCopyValid = quotations.every(q =>
        q.quotationNumber.trim() && q.value.trim() && q.carrier && q.payer
    ) && name.trim();

    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled =
        quotations.some(q => q.quotationNumber || q.value || q.carrier || q.payer) ||
        name || email || whatsNumber;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(cotacaoTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Cotação ${quotations[0].quotationNumber}`);
        const body = encodeURIComponent(cotacaoTexto);
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
            '_blank'
        );
        setShowModal(null);
    };

    const handleSendWhatsApp = () => {
        if (!isWhatsValid) {
            alert('Digite o número do WhatsApp.');
            return;
        }
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length === 11) {
            number = '55' + number;
        }
        const text = encodeURIComponent(cotacaoTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Formulário de Cotação</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                {/* Formulário padrão para a primeira cotação */}
                <div className="mb-4 border-bottom pb-3">
                    <h5 className="text-white mb-3">Cotação</h5>
                    <div className="mb-3">
                        <label className="form-label text-white">
                            Número da Cotação:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={quotations[0].quotationNumber}
                            onChange={(e) => handleChangeQuotation(0, 'quotationNumber', onlyNumbers(e.target.value))}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white">
                            Valor:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={quotations[0].value}
                            onChange={(e) => handleValueChange(0, e.target.value)}
                            placeholder="Ex: 1.234,56"
                            inputMode="decimal"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-white">
                            Transportadora:
                        </label>
                        <select
                            className="form-select"
                            value={quotations[0].carrier}
                            onChange={(e) => handleChangeQuotation(0, 'carrier', e.target.value)}
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
                            Pagador do Frete:
                        </label>
                        <select
                            className="form-select"
                            value={quotations[0].payer}
                            onChange={(e) => handleChangeQuotation(0, 'payer', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            <option value="Remetente">Remetente</option>
                            <option value="Destinatario">Destinatário</option>
                            <option value="Terceiro">Terceiro</option>
                        </select>
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`freteAVista0`}
                                checked={quotations[0].freteAVista}
                                onChange={() => handleChangeQuotation(0, 'freteAVista', !quotations[0].freteAVista)}
                            />
                            <label className="form-check-label text-white" htmlFor={`freteAVista0`}>
                                Frete à vista
                            </label>
                        </div>
                    </div>
                    {/* Checkbox de adicionar mais cotações abaixo do frete à vista */}
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="addMore"
                            checked={addMore}
                            onChange={() => setAddMore(!addMore)}
                        />
                        <label className="form-check-label text-white" htmlFor="addMore">
                            Adicionar mais cotações
                        </label>
                    </div>
                </div>
                {/* Adicionar mais cotações no estilo do AutorizacaoEmbarqueForm */}
                {addMore && (
                    <div className="mb-3">
                        <label className="form-label text-white">
                            Outras cotações:
                        </label>
                        {quotations.slice(1).map((q, idx) => (
                            <div key={idx + 1} className="border rounded p-2 mb-2 bg-secondary">
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Número da Cotação"
                                        value={q.quotationNumber}
                                        onChange={e =>
                                            handleChangeQuotation(idx + 1, 'quotationNumber', onlyNumbers(e.target.value))
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Valor (Ex: 1.234,56)"
                                        value={q.value}
                                        onChange={e =>
                                            handleValueChange(idx + 1, e.target.value)
                                        }
                                        inputMode="decimal"
                                    />
                                    <select
                                        className="form-select mb-1"
                                        value={q.carrier}
                                        onChange={e =>
                                            handleChangeQuotation(idx + 1, 'carrier', e.target.value)
                                        }
                                    >
                                        <option value="">Transportadora</option>
                                        {transportadoras.map(t => (
                                            <option key={t.nome} value={t.nome}>
                                                {t.nome}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="form-select mb-1"
                                        value={q.payer}
                                        onChange={e =>
                                            handleChangeQuotation(idx + 1, 'payer', e.target.value)
                                        }
                                    >
                                        <option value="">Pagador do Frete</option>
                                        <option value="Remetente">Remetente</option>
                                        <option value="Destinatario">Destinatário</option>
                                        <option value="Terceiro">Terceiro</option>
                                    </select>
                                    <div className="form-check mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`freteAVista${idx + 1}`}
                                            checked={q.freteAVista}
                                            onChange={() => handleChangeQuotation(idx + 1, 'freteAVista', !q.freteAVista)}
                                        />
                                        <label className="form-check-label text-white" htmlFor={`freteAVista${idx + 1}`}>
                                            Frete à vista
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleRemoveQuotation(idx + 1)}
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={handleAddQuotation}
                        >
                            + Adicionar Cotação
                        </button>
                    </div>
                )}
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
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Cotação
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal('gmail')}
                        disabled={!isCopyValid}
                    >
                        Enviar Cotação pelo Gmail
                    </button>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setShowModal('whats')}
                        disabled={!isCopyValid}
                    >
                        Enviar Cotação pelo WhatsApp
                    </button>
                </div>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                        {cotacaoTexto}
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
                            {cotacaoTexto}
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

export default QuotationForm;