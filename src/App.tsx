import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationForm from './components/QuotationForm';
import CollectionForm from './components/CollectionForm';
import TranspixForm from './components/TranspixForm';
import TranscomprasForm from './components/TranscomprasForm';
import logo from './assets/logofinal.png'; // Importe sua logo aqui

const App: React.FC = () => {
    const [screen, setScreen] = useState<'home' | 'quotation' | 'collection' | 'transpix' | 'transcompras'>('home');

    return (
        <div className="container mt-5">
            {screen === 'home' && (
                <div className="text-center">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ maxWidth: 400, marginBottom: 24 }}
                    />
                    <h2 className="mb-4">Selecione uma opção</h2>
                    <button
                        className="btn btn-primary m-2"
                        onClick={() => setScreen('quotation')}
                    >
                        📝 Texto de cotação
                    </button>
                    <button
                        className="btn btn-secondary m-2"
                        onClick={() => setScreen('collection')}
                    >
                        🚚 Texto de coleta
                    </button>
                    <button
                        className="btn btn-success m-2"
                        onClick={() => setScreen('transpix')}
                    >
                        💰 Texto para dados bancários Transpix
                    </button>
                    <button
                        className="btn btn-warning m-2"
                        onClick={() => setScreen('transcompras')}
                    >
                        💰 Texto para dados bancários Transcompras
                    </button>
                </div>
            )}
            {screen === 'quotation' && (
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setScreen('home')}
                    >
                        &larr; Voltar
                    </button>
                    <QuotationForm />
                </>
            )}
            {screen === 'collection' && (
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setScreen('home')}
                    >
                        &larr; Voltar
                    </button>
                    <CollectionForm />
                </>
            )}
            {screen === 'transpix' && (
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setScreen('home')}
                    >
                        &larr; Voltar
                    </button>
                    <TranspixForm />
                </>
            )}
            {screen === 'transcompras' && (
                <>
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setScreen('home')}
                    >
                        &larr; Voltar
                    </button>
                    <TranscomprasForm />
                </>
            )}
        </div>
    );
};

export default App;