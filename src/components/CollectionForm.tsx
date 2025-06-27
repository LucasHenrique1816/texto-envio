import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CollectionForm: React.FC = () => {
    const [collectionNumber, setCollectionNumber] = useState('');
    const [carrier, setCarrier] = useState('');
    const [name, setName] = useState('');

    // Saudação baseada no horário
    const getGreeting = () => {
        const hour = new Date().getHours();
        return hour < 12 ? 'Bom dia' : 'Boa tarde';
    };

    const handleCopy = () => {
        const textToCopy = `${getGreeting()},\n\nSegue abaixo dados da coleta:\n\nColeta: ${collectionNumber}\nTransportadora: ${carrier}\n\nPrazo de retirada de 24 a 48 horas a partir do dia seguinte da solicitação.\n\nDúvidas, estamos à disposição.\n\nDesculpe pela demora.\n\nAtenciosamente,\n${name}\n\n🚚💨💨📦`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white">Texto para envio de Coleta</h2>
            <form className="bg-dark p-4 rounded">
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
                    <input
                        type="text"
                        className="form-control"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
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
                <button type="button" className="btn btn-light" onClick={handleCopy}>
                    Copiar Texto de Coleta
                </button>
                <div className="mt-4">
                    <label className="form-label text-white">Pré-visualização:</label>
                    <pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
{`${getGreeting()},\n
Segue abaixo dados da coleta:\n
Coleta: ${collectionNumber}
Transportadora: ${carrier}

Prazo de retirada de 24 a 48 horas a partir do dia seguinte da solicitação.

Dúvidas, estamos à disposição.

Desculpe pela demora.

Atenciosamente,
${name}

🚚💨💨📦`}
                    </pre>
                </div>
            </form>
        </div>
    );
};

export default CollectionForm;