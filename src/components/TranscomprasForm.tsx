import React, { useState } from 'react';

const TranscomprasForm: React.FC = () => {
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Soma todos os valores dos fretes
    const totalFrete = [value, ...extraFretes.map(f => f.value)]
        .map(v => Number(v.replace(',', '.')) || 0)
        .reduce((a, b) => a + b, 0);

    // Texto com emojis (para cópia, email, preview)
    const fretesTexto = [
        `- Número da Cotação: ${quotationNumber}\n- Número da NF: ${nfNumber}\n- Valor: R$ ${value}`,
        ...extraFretes.map(
            (f, i) =>
                `- Número da Cotação: ${f.quotationNumber}\n- Número da NF: ${f.nfNumber}\n- Valor: R$ ${f.value}`
        ),
    ].join('\n\n');

    const valorTotalTexto = `Valor total do frete: R$ ${totalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const transcomprasTexto = `${getGreeting()},\n
📝 Dados da Cotação - NF:\n
${fretesTexto}

${valorTotalTexto}

- Frete: À vista.

📋 Dados Bancários:

- Chave PIX: faturamento02@transcompras.com.br
- Banco 382 BDK - Fiducia SCMEPP
- Agência: 0001
- C/C: 54105-2
- Favorecido: Transcompras Transportes e Compras Comerciais Ltda

🚚 Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

⚠️ Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

🚨Por favor, envie o comprovante de pagamento.

Atenciosamente,
${name}

🚚💨📦`;

    // Texto sem emojis (para WhatsApp)
    const transcomprasTextoWhats = `${getGreeting()},\n
Dados da Cotação - NF:\n
${fretesTexto}

${valorTotalTexto}

- Frete: À vista.

Dados Bancários:

- Chave PIX: faturamento02@transcompras.com.br
- Banco 382 BDK - Fiducia SCMEPP
- Agência: 0001
- C/C: 54105-2
- Favorecido: Transcompras Transportes e Compras Comerciais Ltda

Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.

Importante: Embarcaremos a mercadoria assim que o comprovante de pagamento for enviado.

Por favor, envie o comprovante de pagamento.

Atenciosamente,
${name}
`;

    const handleCopy = () => {
        navigator.clipboard.writeText(transcomprasTexto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent(`Frete a vista Transcompras ------ URGENTE!!!!!!`);
        const body = encodeURIComponent(transcomprasTexto);
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
        const text = encodeURIComponent(transcomprasTextoWhats);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    // Adiciona um novo frete extra
    const handleAddFrete = () => {
        setExtraFretes([
            ...extraFretes,
            { quotationNumber: '', nfNumber: '', value: '' },
        ]);
    };

    // Atualiza um frete extra
    const handleChangeFrete = (
        idx: number,
        field: 'quotationNumber' | 'nfNumber' | 'value',
        val: string
    ) => {
        setExtraFretes((prev) =>
            prev.map((f, i) =>
                i === idx ? { ...f, [field]: val } : f
            )
        );
    };

    // Remove um frete extra
    const handleRemoveFrete = (idx: number) => {
        setExtraFretes((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Dados Bancários Transcompras</h2>
            <form className="bg-dark p-4 rounded">
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Cotação:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={quotationNumber}
                        onChange={(e) => setQuotationNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da NF:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Valor:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                {/* CHECKBOX ABAIXO DO VALOR */}
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
                                            handleChangeFrete(idx, 'quotationNumber', e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Número da NF"
                                        value={f.nfNumber}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'nfNumber', e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Valor"
                                        value={f.value}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'value', e.target.value)
                                        }
                                    />
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
                <button type="button" className="btn btn-light me-2" onClick={handleCopy}>
                    Copiar Dados Bancários
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
                        {transcomprasTexto}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default TranscomprasForm;