import React, { useState, useEffect } from 'react';

// Tipo para as props que o formulário irá receber
type FormProps = {
  loggedUser?: {
    login: string;
    nome_completo: string;
    role: string;
  } | null;
  readOnlyName?: boolean;
  discountPercent?: number;
  promoName?: string;
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

// Função para formatar valor monetário no padrão brasileiro
function formatCurrency(value: string) {
    let v = value.replace(/\D/g, '');
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace('.', ',');
    v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return v;
}

// Converte string formatada "1.234,56" em número 1234.56
function parseCurrency(formattedValue: string): number {
    if (!formattedValue) return 0;
    const clean = formattedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
}

// Formata número arredondado para "1.234,00"
function formatNumberToCurrency(num: number): string {
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

type Quotation = {
    quotationNumber: string;
    value: string;
    carrier: string;
    payer: string;
    freteAVista: boolean;
    freteFaturado: boolean;
    hasDiscount: boolean;
    discountedValue: string;
};

const QuotationForm: React.FC<FormProps> = ({
    loggedUser,
    readOnlyName = false,
    discountPercent = 5,
    promoName = 'MES BLACK',
}) => {
    const [quotations, setQuotations] = useState<Quotation[]>([
        {
            quotationNumber: '',
            value: '',
            carrier: '',
            payer: '',
            freteAVista: false,
            freteFaturado: false,
            hasDiscount: false,
            discountedValue: '',
        }
    ]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addMore, setAddMore] = useState(false);
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats' | 'dados'>(null);

    // Texto padrão solicitando dados para cotação (inclui saudação e nome no final)
    const greeting = (() => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    })();

    const dadosCotacaoTexto = `${greeting},\n\n🚚 Para agilizar sua cotação de frete, por favor, envie todos os dados abaixo, digitados por completo:\n\n✅ Nome e telefone do responsável;\n\n✅ CNPJ do remetente;\n\n✅ Cidade do remetente;\n\n✅ CNPJ do destinatário;\n\n✅ Cidade do destinatário;\n\n✅ CNPJ pagador do frete;\n\n✅ Nome, telefone ou WhatsApp do comprador;\n\n✅ Tipo de material;\n\n✅ Valor da nota fiscal (R$);\n\n✅ Quantidade de volumes;\n\n✅ Peso total (kg);\n\n✅ Dimensões dos volumes (altura x largura x comprimento).\n\n🚨 IMPORTANTE: Só com todos os dados digitados corretamente conseguiremos gerar a cotação de forma rápida!\n\nAtenciosamente,\n${name}`;
    // Texto alternativo simplificado para WhatsApp (mantido caso queira usar futuramente)
    const dadosCotacaoTextoWhats = `${greeting},\n\nPara agilizar sua cotação de frete, envie (todos completos): Nome e telefone do responsável; CNPJ remetente; Cidade remetente; CNPJ destinatário; Cidade destinatário; CNPJ pagador; Nome/telefone comprador; Tipo de material; Valor NF; Qtd volumes; Peso total; Dimensões (A x L x C). IMPORTANTE: todos os dados são necessários para agilidade.\n\nAtenciosamente,\n${name}`;

    // Ações para modal de dados (sem abas)
    const handleDadosCopy = () => {
        navigator.clipboard.writeText(dadosCotacaoTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };
    const handleDadosGmail = () => {
        const dest = email && validateEmail(email) ? email : '';
        if (!dest || !validateEmail(dest)) {
            alert('Digite um email válido no campo acima para enviar.');
            return;
        }
        const subject = encodeURIComponent('Dados necessários para cotação');
        const body = encodeURIComponent(dadosCotacaoTexto);
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${dest}&su=${subject}&body=${body}`, '_blank');
        setShowModal(null);
    };
    const handleDadosWhats = () => {
        let number = whatsNumber.replace(/\D/g, '');
        if (number.length < 10) {
            alert('Digite um número de WhatsApp válido no campo acima.');
            return;
        }
        if (number.length === 11) number = '55' + number;
        const text = encodeURIComponent(dadosCotacaoTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    // Preenche automaticamente o nome com o nome completo do usuário logado
    useEffect(() => {
        if (loggedUser?.nome_completo && !name) {
            setName(loggedUser.nome_completo);
        }
    }, [loggedUser, name]);

    // Função para atualizar o campo valor formatado
    const handleValueChange = (idx: number, value: string) => {
        const raw = value.replace(/\D/g, '');
        const formatted = formatCurrency(raw);
        setQuotations(prev =>
            prev.map((q, i) => {
                if (i !== idx) return q;
                let updatedDiscounted = q.discountedValue;
                if (q.hasDiscount && q.discountedValue) {
                    const numeric = parseCurrency(formatted);
                    if (numeric > 0) {
                        const discounted = Math.floor(numeric * (1 - discountPercent / 100));
                        updatedDiscounted = formatNumberToCurrency(discounted);
                    } else {
                        updatedDiscounted = '';
                    }
                }
                return { ...q, value: formatted, discountedValue: updatedDiscounted };
            })
        );
    };

    // Alterna checkbox de desconto
    const handleToggleDiscount = (idx: number) => {
        setQuotations(prev =>
            prev.map((q, i) => {
                if (i !== idx) return q;
                const nextHasDiscount = !q.hasDiscount;
                return {
                    ...q,
                    hasDiscount: nextHasDiscount,
                    discountedValue: nextHasDiscount ? q.discountedValue : '',
                };
            })
        );
    };

    // Calcula o valor com desconto arredondado para baixo (ex: 55,50 -> 55,00)
    const handleCalculateDiscount = (idx: number) => {
        setQuotations(prev =>
            prev.map((q, i) => {
                if (i !== idx) return q;
                const numeric = parseCurrency(q.value);
                if (numeric <= 0) {
                    alert('Digite o valor do frete antes de calcular o desconto.');
                    return q;
                }
                const discounted = Math.floor(numeric * (1 - discountPercent / 100));
                return {
                    ...q,
                    discountedValue: formatNumberToCurrency(discounted),
                };
            })
        );
    };

    // Função para alternar frete à vista/faturado (obrigatório selecionar um)
    const handleFreteOption = (idx: number, option: 'avista' | 'faturado') => {
        setQuotations(prev =>
            prev.map((q, i) =>
                i === idx
                    ? {
                        ...q,
                        freteAVista: option === 'avista',
                        freteFaturado: option === 'faturado'
                    }
                    : q
            )
        );
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Monta o texto das cotações (versão limpa para Gmail)
    const cotacoesTextoEmail = quotations.map((q, idx) => {
        const transp = transportadoras.find(t => t.nome === q.carrier);
        let freteTipo = '';
        if (q.freteAVista) freteTipo = 'A vista';
        else if (q.freteFaturado) freteTipo = 'Faturado';
        const freteText = `${freteTipo ? ` ${freteTipo}` : ''}, pago ${q.payer} (sujeito a alteração se houver divergência nos dados informados).`;
        const titulo = idx === 0 ? '📝 Dados da Cotação:' : `📝 Dados da Cotação ${idx + 1}:`;

        const valorLinha = q.hasDiscount && q.discountedValue
            ? `- Valor: R$ ${q.value}\n\n- Valor com desconto ${promoName}: R$ ${q.discountedValue}`
            : `- Valor: R$ ${q.value}`;

        return `${titulo}
- Numero da Cotação: ${q.quotationNumber}

${valorLinha}

- Transportadora: ${transp ? `${transp.razao} (${transp.cnpj})` : ''}

- Frete: ${freteText}`;

    }).join('\n\n');

    // Monta o texto das cotações com formatação de risco e destaque (para Copiar e WhatsApp)
    const cotacoesTextoDestaque = quotations.map((q, idx) => {
        const transp = transportadoras.find(t => t.nome === q.carrier);
        let freteTipo = '';
        if (q.freteAVista) freteTipo = 'A vista';
        else if (q.freteFaturado) freteTipo = 'Faturado';
        const freteText = `${freteTipo ? ` ${freteTipo}` : ''}, pago ${q.payer} (sujeito a alteração se houver divergência nos dados informados).`;
        const titulo = idx === 0 ? '📝 Dados da Cotação:' : `📝 Dados da Cotação ${idx + 1}:`;

        const valorLinhaDestaque = q.hasDiscount && q.discountedValue
            ? `~- Valor: R$ ${q.value}~\n\n*- Valor com desconto ${promoName}: R$ ${q.discountedValue}*`
            : `- Valor: R$ ${q.value}`;

        return `${titulo}
- Numero da Cotação: ${q.quotationNumber}

${valorLinhaDestaque}

- Transportadora: ${transp ? `${transp.razao} (${transp.cnpj})` : ''}

- Frete: ${freteText}`;

    }).join('\n\n');

    const infoFinal = `\n\n- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.\n\n- Validade da cotação: 30 dias.`;

    // Texto para Gmail (limpo)
    const cotacaoTextoEmail = `${getGreeting()},

${cotacoesTextoEmail}${infoFinal}


🔔 Dúvidas ou negociações? Estamos à disposição!

Obrigado por aguardar.

Atenciosamente,
${name}

🚚💨📦`;

    // Texto para Copiar e Pré-visualização (com risco e destaque + emojis)
    const cotacaoTextoCopy = `${getGreeting()},

${cotacoesTextoDestaque}${infoFinal}


🔔 Dúvidas ou negociações? Estamos à disposição!

Obrigado por aguardar.

Atenciosamente,
${name}

🚚💨📦`;

    // WhatsApp: com risco e destaque, sem emoji no final
    const cotacaoTextoWhats = `${getGreeting()},

${cotacoesTextoDestaque}${infoFinal}


Dúvidas ou negociações? Estamos à disposição!

Obrigado por aguardar.

Atenciosamente,
${name}
`;

    // Limpar formulário
    const handleClear = () => {
        setQuotations([{
            quotationNumber: '',
            value: '',
            carrier: '',
            payer: '',
            freteAVista: false,
            freteFaturado: false,
            hasDiscount: false,
            discountedValue: '',
        }]);
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
            {
                quotationNumber: '',
                value: '',
                carrier: '',
                payer: '',
                freteAVista: false,
                freteFaturado: false,
                hasDiscount: false,
                discountedValue: '',
            }
        ]);
    };

    // Atualiza uma cotação específica
    const handleChangeQuotation = (
        idx: number,
        field: keyof Quotation,
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
        q.quotationNumber.trim() &&
        q.value.trim() &&
        q.carrier &&
        q.payer &&
        (q.freteAVista || q.freteFaturado) &&
        (!q.hasDiscount || q.discountedValue.trim())
    ) && name.trim();

    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled =
        quotations.some(q => q.quotationNumber || q.value || q.carrier || q.payer) ||
        name || email || whatsNumber;

    // Funções de envio
    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(cotacaoTextoCopy).then(() => {
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
        const body = encodeURIComponent(cotacaoTextoEmail);
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
            <button
                type="button"
                className="btn btn-info mb-3 me-2"
                onClick={() => setShowModal('dados')}
            >
                Dados para Cotação
            </button>
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
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                value={quotations[0].value}
                                onChange={(e) => handleValueChange(0, e.target.value)}
                                placeholder="Ex: 1.234,56"
                                inputMode="decimal"
                            />
                            {quotations[0].hasDiscount && (
                                <button
                                    type="button"
                                    className="btn btn-info text-nowrap"
                                    onClick={() => handleCalculateDiscount(0)}
                                >
                                    Calcular desconto
                                </button>
                            )}
                        </div>
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="hasDiscount0"
                                checked={quotations[0].hasDiscount}
                                onChange={() => handleToggleDiscount(0)}
                            />
                            <label className="form-check-label text-white" htmlFor="hasDiscount0">
                                Aplicar desconto ({promoName} - {discountPercent}%)
                            </label>
                        </div>
                        {quotations[0].hasDiscount && quotations[0].discountedValue && (
                            <div className="alert alert-success py-2 px-3 mt-2 mb-0">
                                Valor com desconto {promoName} ({discountPercent}%):{' '}
                                <strong>R$ {quotations[0].discountedValue}</strong>
                            </div>
                        )}
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
                            <option value="pelo Remetente">Remetente</option>
                            <option value="pelo Destinatario">Destinatário</option>
                            <option value="por Terceiro">Terceiro</option>
                        </select>
                        <div className="d-flex gap-4 mt-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`freteAVista0`}
                                    checked={quotations[0].freteAVista}
                                    onChange={() => handleFreteOption(0, 'avista')}
                                    name="freteTipo0"
                                    required
                                />
                                <label className="form-check-label text-white" htmlFor={`freteAVista0`}>
                                    Frete à vista
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={`freteFaturado0`}
                                    checked={quotations[0].freteFaturado}
                                    onChange={() => handleFreteOption(0, 'faturado')}
                                    name="freteTipo0"
                                    required
                                />
                                <label className="form-check-label text-white" htmlFor={`freteFaturado0`}>
                                    Frete faturado
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Checkbox de adicionar mais cotações abaixo do frete à vista/faturado */}
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
                                    <div className="d-flex gap-2 mb-1">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Valor (Ex: 1.234,56)"
                                            value={q.value}
                                            onChange={e =>
                                                handleValueChange(idx + 1, e.target.value)
                                            }
                                            inputMode="decimal"
                                        />
                                        {q.hasDiscount && (
                                            <button
                                                type="button"
                                                className="btn btn-info text-nowrap"
                                                onClick={() => handleCalculateDiscount(idx + 1)}
                                            >
                                                Calcular desconto
                                            </button>
                                        )}
                                    </div>
                                    <div className="form-check mb-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`hasDiscount${idx + 1}`}
                                            checked={q.hasDiscount}
                                            onChange={() => handleToggleDiscount(idx + 1)}
                                        />
                                        <label className="form-check-label text-white" htmlFor={`hasDiscount${idx + 1}`}>
                                            Aplicar desconto ({promoName} - {discountPercent}%)
                                        </label>
                                    </div>
                                    {q.hasDiscount && q.discountedValue && (
                                        <div className="alert alert-success py-1 px-2 mb-1">
                                            Valor com desconto {promoName} ({discountPercent}%):{' '}
                                            <strong>R$ {q.discountedValue}</strong>
                                        </div>
                                    )}
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
                                        <option value="pelo Remetente">Remetente</option>
                                        <option value="pelo Destinatario">Destinatário</option>
                                        <option value="por Terceiro">Terceiro</option>
                                    </select>
                                    <div className="d-flex gap-4 mt-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id={`freteAVista${idx + 1}`}
                                                checked={q.freteAVista}
                                                onChange={() => handleFreteOption(idx + 1, 'avista')}
                                                name={`freteTipo${idx + 1}`}
                                                required
                                            />
                                            <label className="form-check-label text-white" htmlFor={`freteAVista${idx + 1}`}>
                                                Frete à vista
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id={`freteFaturado${idx + 1}`}
                                                checked={q.freteFaturado}
                                                onChange={() => handleFreteOption(idx + 1, 'faturado')}
                                                name={`freteTipo${idx + 1}`}
                                                required
                                            />
                                            <label className="form-check-label text-white" htmlFor={`freteFaturado${idx + 1}`}>
                                                Frete faturado
                                            </label>
                                        </div>
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
                        {cotacaoTextoCopy}
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
                            {showModal === 'dados'
                                ? dadosCotacaoTexto
                                : showModal === 'whats'
                                ? cotacaoTextoWhats
                                : showModal === 'gmail'
                                ? cotacaoTextoEmail
                                : cotacaoTextoCopy}
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
                                    <button className="btn btn-light" type="button" onClick={handleDadosCopy}>
                                        Copiar Dados
                                    </button>
                                    <button className="btn btn-danger" type="button" onClick={handleDadosGmail} disabled={email ? !validateEmail(email) : false}>
                                        Enviar Gmail
                                    </button>
                                    <button className="btn btn-success" type="button" onClick={handleDadosWhats} disabled={whatsNumber !== '' && whatsNumber.replace(/\D/g,'').length < 10}>
                                        Enviar WhatsApp
                                    </button>
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

export default QuotationForm;
