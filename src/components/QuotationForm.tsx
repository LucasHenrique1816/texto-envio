import React, { useState } from 'react';

const QuotationForm: React.FC = () => {
    const [quotations, setQuotations] = useState([
        { quotationNumber: '', value: '', carrier: '', payer: '', freteAVista: true }
    ]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addMore, setAddMore] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Monta o texto das cotações (sem repetir prazo e validade)
    const cotacoesTexto = quotations.map((q, idx) => {
        const freteText = `Pago pelo ${q.payer}${q.freteAVista ? ' à vista' : ''} (sujeito a alteração se houver divergência nos dados informados).`;
        const titulo = idx === 0 ? '📝 Dados da Cotação:' : `📝 Dados da Cotação ${idx + 1}:`;
        return `${titulo}\n- Numero da Cotação: ${q.quotationNumber}\n- Valor: R$ ${q.value}\n- Transportadora: ${q.carrier}\n- Frete: ${freteText}`;
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

    const handleCopy = () => {
        navigator.clipboard.writeText(cotacaoTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Cotação ${quotations[0].quotationNumber}`);
        const body = encodeURIComponent(cotacaoTexto);
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
        const text = encodeURIComponent(cotacaoTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    // Adiciona uma nova cotação
    const handleAddQuotation = () => {
        setQuotations([
            ...quotations,
            { quotationNumber: '', value: '', carrier: '', payer: '', freteAVista: true }
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

    return (
        <div className="container mt-5">
            <h2 className="text-white">Formulário de Cotação</h2>
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                {quotations.map((q, idx) => (
                    <div key={idx} className="mb-4 border-bottom pb-3">
                        <h5 className="text-white mb-3">
                            {idx === 0 ? 'Cotação' : `Cotação ${idx + 1}`}
                        </h5>
                        <div className="mb-3">
                            <label className="form-label text-white">
                                Número da Cotação:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={q.quotationNumber}
                                onChange={(e) => handleChangeQuotation(idx, 'quotationNumber', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">
                                Valor:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={q.value}
                                onChange={(e) => handleChangeQuotation(idx, 'value', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">
                                Transportadora:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={q.carrier}
                                onChange={(e) => handleChangeQuotation(idx, 'carrier', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-white">
                                Pagador do Frete:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={q.payer}
                                onChange={(e) => handleChangeQuotation(idx, 'payer', e.target.value)}
                                placeholder="Ex: destinatário, remetente"
                            />
                            <div className="form-check mt-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`freteAVista${idx}`}
                                    checked={q.freteAVista}
                                    onChange={() => handleChangeQuotation(idx, 'freteAVista', !q.freteAVista)}
                                />
                                <label className="form-check-label text-white" htmlFor={`freteAVista${idx}`}>
                                    Frete à vista
                                </label>
                            </div>
                        </div>
                        {idx > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveQuotation(idx)}
                            >
                                Remover Cotação {idx + 1}
                            </button>
                        )}
                    </div>
                ))}
                {/* CHECKBOX PARA ADICIONAR MAIS */}
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
                {addMore && (
                    <button
                        type="button"
                        className="btn btn-sm btn-light mb-4"
                        onClick={handleAddQuotation}
                    >
                        + Adicionar Cotação
                    </button>
                )}
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
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Cotação
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
                        Enviar Cotação pelo Gmail
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
        </div>
    );
};

export default QuotationForm;