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

interface ExtraFrete {
    quotationNumber: string;
    nfNumber: string;
    value: string;
    freightPayer: string;
    freightType?: 'avista' | 'faturado';
}

const AutorizacaoEmbarqueForm: React.FC = () => {
    const [nfNumber, setNfNumber] = useState('');
    const [quotationNumber, setQuotationNumber] = useState('');
    const [freightValue, setFreightValue] = useState('');
    const [freightPayer, setFreightPayer] = useState('');
    const [carrier, setCarrier] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsNumber, setWhatsNumber] = useState('');
    const [addMore, setAddMore] = useState(false);
    const [extraFretes, setExtraFretes] = useState<ExtraFrete[]>([]);
    const [showModal, setShowModal] = useState<null | 'copy' | 'gmail' | 'whats'>(null);
    const [freightType, setFreightType] = useState<'avista' | 'faturado' | ''>('');

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Soma todos os valores dos fretes
    const totalFrete = [freightValue, ...extraFretes.map(f => f.value)]
        .map(v => Number(v.replace(/\./g, '').replace(',', '.')) || 0)
        .reduce((a, b) => a + b, 0);

    // Texto das cotações/NFs
    const cotacoesTexto = [
        `Número da NF: ${nfNumber}
Número da Cotação: ${quotationNumber}
Valor do Frete: R$ ${freightValue}
Pagador do Frete: ${freightPayer}
Tipo de Frete: ${freightType === 'avista' ? 'À vista' : freightType === 'faturado' ? 'Faturado' : ''}
Transportadora: ${
            carrier
                ? `${transportadoras.find(t => t.nome === carrier)?.razao} (${transportadoras.find(t => t.nome === carrier)?.cnpj})`
                : ''
        }`,
        ...extraFretes.map(
            (f, i) =>
                `Número da NF: ${f.nfNumber}
Número da Cotação: ${f.quotationNumber}
Valor do Frete: R$ ${f.value}
Pagador do Frete: ${f.freightPayer}
Tipo de Frete: ${
                    f.freightType === 'avista'
                        ? 'À vista'
                        : f.freightType === 'faturado'
                        ? 'Faturado'
                        : ''
                }
Transportadora: ${
                    carrier
                        ? `${transportadoras.find(t => t.nome === carrier)?.razao} (${transportadoras.find(t => t.nome === carrier)?.cnpj})`
                        : ''
                }`
        ),
    ].join('\n\n');

    const valorTotalTexto = `Valor total do frete: R$ ${totalFrete.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    const textoComEmojis = `${getGreeting()}, tudo bem? 📩
✉️ Por gentileza, confirmar o recebimento desta mensagem.

🚨 Solicitamos a Autorização para Embarque do(s) frete(s) abaixo:

🧾 Dados do Frete:

${cotacoesTexto}

${valorTotalTexto}

📌 Observação Importante:
A mercadoria só será embarcada mediante autorização da empresa contratante.

⏳ Urgência:
Solicitamos a autorização com brevidade para emissão do CT-e e liberação do embarque.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,
${name}

🚚💨📦`;

    const textoSemEmojis = `${getGreeting()}, tudo bem?
Por gentileza, confirmar o recebimento desta mensagem.

Solicitamos a Autorização para Embarque do(s) frete(s) abaixo:

Dados do Frete:

${cotacoesTexto}

${valorTotalTexto}

Observação Importante:
A mercadoria só será embarcada mediante autorização da empresa contratante.

Urgência:
Solicitamos a autorização com brevidade para emissão do CT-e e liberação do embarque.

Desde já, agradecemos pela atenção e agilidade!

Atenciosamente,
${name}
`;

    // Limpar formulário
    const handleClear = () => {
        setNfNumber('');
        setQuotationNumber('');
        setFreightValue('');
        setFreightPayer('');
        setCarrier('');
        setName('');
        setEmail('');
        setWhatsNumber('');
        setAddMore(false);
        setExtraFretes([]);
        setFreightType('');
        setShowModal(null);
    };

    // Funções de envio
    const isCopyValid =
        nfNumber && quotationNumber && freightValue && freightPayer && carrier && name && freightType;

    const isEmailValid = isCopyValid && validateEmail(email);
    const isWhatsValid = isCopyValid && whatsNumber.length >= 10;
    const isAnyFieldFilled =
        nfNumber ||
        quotationNumber ||
        freightValue ||
        freightPayer ||
        carrier ||
        name ||
        email ||
        whatsNumber ||
        extraFretes.length > 0 ||
        freightType;

    const handleCopy = () => {
        if (!isCopyValid) return;
        navigator.clipboard.writeText(textoComEmojis).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
        setShowModal(null);
    };

    const handleSendGmail = () => {
        if (!isEmailValid) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent('Solicitação de Autorização para Embarque');
        const body = encodeURIComponent(textoComEmojis);
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
        const text = encodeURIComponent(textoSemEmojis);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
        setShowModal(null);
    };

    // Adiciona um novo frete extra
    const handleAddFrete = () => {
        setExtraFretes([
            ...extraFretes,
            { quotationNumber: '', nfNumber: '', value: '', freightPayer: '', freightType: undefined },
        ]);
    };

    // Atualiza um frete extra (campos comuns)
    const handleChangeFrete = (
        idx: number,
        field: 'quotationNumber' | 'nfNumber' | 'value' | 'freightPayer',
        val: string
    ) => {
        setExtraFretes((prev) =>
            prev.map((f, i) =>
                i === idx ? { ...f, [field]: val } : f
            )
        );
    };

    // Atualiza o valor formatado para um frete extra
    const handleExtraFreteValueChange = (idx: number, rawValue: string) => {
        const raw = rawValue.replace(/\D/g, '');
        setExtraFretes((prev) =>
            prev.map((f, i) =>
                i === idx ? { ...f, value: formatCurrency(raw) } : f
            )
        );
    };

    // Atualiza o tipo de frete para um frete extra
    const handleExtraFreightTypeChange = (idx: number, type: 'avista' | 'faturado') => {
        setExtraFretes((prev) =>
            prev.map((item, i) =>
                i === idx ? { ...item, freightType: type } : item
            )
        );
    };

    // Remove um frete extra
    const handleRemoveFrete = (idx: number) => {
        setExtraFretes((prev) => prev.filter((_, i) => i !== idx));
    };

    // Handler para campo de valor formatado principal
    const handleFreightValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        setFreightValue(formatCurrency(raw));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Autorização de Embarque</h2>
            {isAnyFieldFilled && (
                <button className="btn btn-warning mb-3" type="button" onClick={handleClear}>
                    Limpar formulário
                </button>
            )}
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Nota Fiscal:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(onlyNumbers(e.target.value))}
                        placeholder="Digite o número da NF"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Cotação:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={quotationNumber}
                        onChange={(e) => setQuotationNumber(onlyNumbers(e.target.value))}
                        placeholder="Digite o número da cotação"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label text-white">
                        Valor do Frete:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={freightValue}
                        onChange={handleFreightValueChange}
                        placeholder="Ex: 1.234,56"
                        inputMode="decimal"
                    />
                    <div className="d-flex gap-4 mt-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="freteAVista"
                                name="freteTipo"
                                checked={freightType === 'avista'}
                                onChange={() => setFreightType('avista')}
                            />
                            <label className="form-check-label text-white" htmlFor="freteAVista">
                                Frete à vista
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="freteFaturado"
                                name="freteTipo"
                                checked={freightType === 'faturado'}
                                onChange={() => setFreightType('faturado')}
                            />
                            <label className="form-check-label text-white" htmlFor="freteFaturado">
                                Frete faturado
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label text-white">
                        Pagador do Frete:
                    </label>
                    <select
                        className="form-select"
                        value={freightPayer}
                        onChange={(e) => setFreightPayer(e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="Remetente">Remetente</option>
                        <option value="Destinatario">Destinatário</option>
                        <option value="Terceiro">Terceiro</option>
                    </select>
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
                        <label className="form-label text-white">
                            Outras cotações/NFs:
                        </label>
                        {extraFretes.map((f, idx) => (
                            <div key={idx} className="border rounded p-2 mb-2 bg-secondary">
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Número da Cotação"
                                        value={f.quotationNumber}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'quotationNumber', onlyNumbers(e.target.value))
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Número da NF"
                                        value={f.nfNumber}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'nfNumber', onlyNumbers(e.target.value))
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Valor do Frete (Ex: 1.234,56)"
                                        value={f.value}
                                        onChange={e =>
                                            handleExtraFreteValueChange(idx, e.target.value)
                                        }
                                        inputMode="decimal"
                                    />
                                    <select
                                        className="form-select mb-1"
                                        value={f.freightPayer}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'freightPayer', e.target.value)
                                        }
                                    >
                                        <option value="">Pagador do Frete</option>
                                        <option value="Remetente">Remetente</option>
                                        <option value="Destinatario">Destinatário</option>
                                        <option value="Terceiro">Terceiro</option>
                                    </select>
                                    {/* Checks de tipo de frete para cada extraFrete */}
                                    <div className="d-flex gap-4 mt-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id={`freteAVistaExtra${idx}`}
                                                name={`freteTipoExtra${idx}`}
                                                checked={f.freightType === 'avista'}
                                                onChange={() =>
                                                    handleExtraFreightTypeChange(idx, 'avista')
                                                }
                                            />
                                            <label
                                                className="form-check-label text-white"
                                                htmlFor={`freteAVistaExtra${idx}`}
                                            >
                                                Frete à vista
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id={`freteFaturadoExtra${idx}`}
                                                name={`freteTipoExtra${idx}`}
                                                checked={f.freightType === 'faturado'}
                                                onChange={() =>
                                                    handleExtraFreightTypeChange(idx, 'faturado')
                                                }
                                            />
                                            <label
                                                className="form-check-label text-white"
                                                htmlFor={`freteFaturadoExtra${idx}`}
                                            >
                                                Frete faturado
                                            </label>
                                        </div>
                                    </div>
                                </div>
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
                    <label className="form-label text-white">
                        Transportadora:
                    </label>
                    <select
                        className="form-select"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
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
                    />
                </div>
                <div className="mb-3 d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal('copy')}
                        disabled={!isCopyValid}
                    >
                        Copiar Texto
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
                        {textoComEmojis}
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
                            {textoComEmojis}
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

export default AutorizacaoEmbarqueForm;