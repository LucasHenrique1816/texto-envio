import React, { useState } from 'react';

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
    const [extraFretes, setExtraFretes] = useState<
        { quotationNumber: string; nfNumber: string; value: string; freightPayer: string }[]
    >([]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Soma todos os valores dos fretes
    const totalFrete = [freightValue, ...extraFretes.map(f => f.value)]
        .map(v => Number(v.replace(',', '.')) || 0)
        .reduce((a, b) => a + b, 0);

    // Texto das cotações/NFs
    const cotacoesTexto = [
        `Número da NF: ${nfNumber}
Número da Cotação: ${quotationNumber}
Valor do Frete: R$ ${freightValue}
Pagador do Frete: ${freightPayer}
Transportadora: ${carrier}`,
        ...extraFretes.map(
            (f, i) =>
                `Número da NF: ${f.nfNumber}
Número da Cotação: ${f.quotationNumber}
Valor do Frete: R$ ${f.value}
Pagador do Frete: ${f.freightPayer}
Transportadora: ${carrier}`
        ),
    ].join('\n\n');

    const valorTotalTexto = `Valor total do frete: R$ ${totalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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

    const handleCopy = () => {
        navigator.clipboard.writeText(textoComEmojis).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    const handleSendGmail = () => {
        if (!email) {
            alert('Digite o email de destino.');
            return;
        }
        const subject = encodeURIComponent('Solicitação de Autorização para Embarque');
        const body = encodeURIComponent(textoComEmojis);
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
        const text = encodeURIComponent(textoSemEmojis);
        window.open(`https://wa.me/${number}?text=${text}`, '_blank');
    };

    // Adiciona um novo frete extra
    const handleAddFrete = () => {
        setExtraFretes([
            ...extraFretes,
            { quotationNumber: '', nfNumber: '', value: '', freightPayer: '' },
        ]);
    };

    // Atualiza um frete extra
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

    // Remove um frete extra
    const handleRemoveFrete = (idx: number) => {
        setExtraFretes((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Autorização de Embarque</h2>
            <form className="bg-dark p-4 rounded" onSubmit={e => e.preventDefault()}>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Número da Nota Fiscal:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={nfNumber}
                        onChange={(e) => setNfNumber(e.target.value)}
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
                        onChange={(e) => setQuotationNumber(e.target.value)}
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
                        onChange={(e) => setFreightValue(e.target.value)}
                        placeholder="Digite o valor do frete"
                    />
                </div>
                {/* Pagador do Frete */}
                <div className="mb-3">
                    <label className="form-label text-white">
                        Pagador do Frete:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={freightPayer}
                        onChange={(e) => setFreightPayer(e.target.value)}
                        placeholder="Ex: remetente, destinatário, etc."
                    />
                </div>
                {/* CHECKBOX ABAIXO DO PAGADOR */}
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
                                        placeholder="Valor do Frete"
                                        value={f.value}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'value', e.target.value)
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="Pagador do Frete"
                                        value={f.freightPayer}
                                        onChange={e =>
                                            handleChangeFrete(idx, 'freightPayer', e.target.value)
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
                        Transportadora:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        placeholder="Digite o nome da transportadora"
                    />
                </div>
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
                <div className="mb-3">
                    <strong className="text-white">
                        Valor total do frete: R$ {totalFrete.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                </div>
                <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={handleCopy}
                >
                    Copiar Texto
                </button>
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
                        {textoComEmojis}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default AutorizacaoEmbarqueForm;