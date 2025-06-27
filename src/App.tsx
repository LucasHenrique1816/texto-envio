import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationForm from './components/QuotationForm';
import CollectionForm from './components/CollectionForm';

const App: React.FC = () => {
    const [screen, setScreen] = useState<'home' | 'quotation' | 'collection'>('home');

    return (
        <div className="container mt-5">
            {screen === 'home' && (
                <div className="text-center">
                    <h2 className="mb-4">Bem-vindo ao App de Cotação</h2>
                    <button
                        className="btn btn-primary m-2"
                        onClick={() => setScreen('quotation')}
                    >
                        Selecionar texto de cotação
                    </button>
                    <button
                        className="btn btn-secondary m-2"
                        onClick={() => setScreen('collection')}
                    >
                        Selecionar texto de coleta
                    </button>
                </div>
            )}
            {screen === 'quotation' && (
                <>
                    <button
                        className="btn btn-link mb-3"
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
                        className="btn btn-link mb-3"
                        onClick={() => setScreen('home')}
                    >
                        &larr; Voltar
                    </button>
                    <CollectionForm />
                </>
            )}
        </div>
    );
};

export default App;