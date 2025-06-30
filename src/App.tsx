import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationForm from './components/QuotationForm';
import CollectionForm from './components/CollectionForm';
import TranspixForm from './components/TranspixForm';
import TranscomprasForm from './components/TranscomprasForm';
import logo from './assets/logofinal.png'; // Importe sua logo aqui

const App: React.FC = () => {
    const [screen, setScreen] = useState<'home' | 'quotation' | 'collection' | 'transpix' | 'transcompras'>('home');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(() => {
                setDeferredPrompt(null);
                setShowInstall(false);
            });
        }
    };

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
                    {/* Botão de instalar app em uma linha separada */}
                    {showInstall && (
                        <div className="mt-4">
                            <button
                                className="btn btn-info"
                                onClick={handleInstallClick}
                            >
                                ⬇️ Instalar App
                            </button>
                        </div>
                    )}
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