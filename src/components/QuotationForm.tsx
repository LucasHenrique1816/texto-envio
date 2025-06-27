import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuotationForm: React.FC = () => {
    const [quotationNumber, setQuotationNumber] = useState('');
    const [value, setValue] = useState('');
    const [carrier, setCarrier] = useState('');
    const [payer, setPayer] = useState('');
    const [name, setName] = useState('');
    const [freteAVista, setFreteAVista] = useState(true); // novo estado

    // Saudação baseada no horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    // Monta o texto do frete conforme a seleção
    const freteText = `Pago pelo ${payer}${freteAVista ? ' à vista' : ''} (sujeito a alteração se houver divergência nos dados informados).`;

    const handleCopy = () => {
        const textToCopy = `${getGreeting()},\n\n📝 Dados da Cotação:\n\n- Numero da Cotação: ${quotationNumber}\n- Valor: R$ ${value}\n- Transportadora: ${carrier}\n- Frete: ${freteText}\n- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.\n- Validade da cotação: 30 dias.\n\n🔔 Dúvidas ou negociações? Estamos à disposição!\n\nDesculpe pela demora e obrigado pela paciência.\n\nAtenciosamente,\n${name}\n\n🚚💨📦`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Cotação</h2>
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
                        Valor:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Transportadora:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-white">
                        Pagador do Frete:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={payer}
                        onChange={(e) => setPayer(e.target.value)}
                        placeholder="Ex: destinatário, remetente"
                    />
                    <div className="form-check mt-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="freteAVista"
                            checked={freteAVista}
                            onChange={() => setFreteAVista(!freteAVista)}
                        />
                        <label className="form-check-label text-white" htmlFor="freteAVista">
                            Frete à vista
                        </label>
                    </div>
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
                <button type="button" className="btn btn-light" onClick={handleCopy}>
                    Copiar Cotação
                </button>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
{`${getGreeting()},\n
📝 Dados da Cotação:\n
- Numero da Cotação: ${quotationNumber}
- Valor: R$ ${value}
- Transportadora: ${carrier}
- Frete: ${freteText}
- Prazo de entrega: 6 a 10 dias corridos a partir da data de embarque.
- Validade da cotação: 30 dias.

🔔 Dúvidas ou negociações? Estamos à disposição!

Desculpe pela demora e obrigado pela paciência.

Atenciosamente,
${name}

🚚💨📦`}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default QuotationForm;