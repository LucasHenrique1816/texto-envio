import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuotationForm from './components/QuotationForm';
import CollectionForm from './components/CollectionForm';
import TranspixForm from './components/TranspixForm';
import TranscomprasForm from './components/TranscomprasForm';
import TranspixCadastralForm from './components/TranspixCadastralForm';
import TranscomprasCadastralForm from './components/TranscomprasCadastralForm';
import TrackingForm from './components/TrackingForm';
import CorrectionLetterForm from './components/CorrectionLetterForm';
import FilialContatoForm from './components/FilialContatoForm';
import TermoIsencaoAvariaForm from './components/TermoIsencaoAvariaForm';
import logo from './assets/logofinal.png';

const App: React.FC = () => {
    const [screen, setScreen] = useState<
        'setor' | 'home' | 'quotation' | 'collection' | 'transpix' | 'transcompras' | 'transpixCadastral' | 'transcomprasCadastral' | 'tracking' | 'correctionLetter' | 'bankData' | 'cadastralData' | 'contatoFilial' | 'termoIsencao'
    >('setor');
    const [setor, setSetor] = useState<'comercial' | 'pendencia' | null>(null);
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

    // Sempre exibe a logo e o botão de instalar app
    const renderLogoAndInstall = () => (
        <>
            <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: 400, marginBottom: 24 }}
            />
            {showInstall && (
                <div className="mt-4">
                    <button
                        className="btn btn-dark"
                        onClick={handleInstallClick}
                    >
                        ⬇️ Instalar App
                    </button>
                </div>
            )}
        </>
    );

    // Tela de seleção de setor
    if (screen === 'setor') {
        return (
            <div className="container mt-5 text-center">
                {renderLogoAndInstall()}
                <h2 className="mb-4">Selecione o setor</h2>
                <button
                    className="btn btn-primary m-2"
                    onClick={() => {
                        setSetor('comercial');
                        setScreen('home');
                    }}
                >
                    Comercial
                </button>
                <button
                    className="btn btn-warning m-2"
                    onClick={() => {
                        setSetor('pendencia');
                        setScreen('home');
                    }}
                >
                    Pendência
                </button>
            </div>
        );
    }

    // Home com botões de cada setor
    if (screen === 'home') { 
        
        console.log('setor:', setor, 'screen:', screen);
        return (
            <div className="container mt-5 text-center">
                {renderLogoAndInstall()}
                <h2 className="mb-4">
                    {setor === 'comercial'
                        ? 'Setor Comercial'
                        : setor === 'pendencia'
                        ? 'Setor Pendência'
                        : ''}
                </h2>
                <button
                    className="btn btn-outline-secondary mb-4"
                    onClick={() => {
                        setSetor(null);
                        setScreen('setor');
                    }}
                >
                    &larr; Trocar setor
                </button>
                {/* Opções para o setor Comercial */}
                {setor === 'comercial' && (
                    <>
                        <button
                            className="btn btn-primary m-2"
                            onClick={() => setScreen('quotation')}
                        >
                            📝 Texto para envio de cotação
                        </button>
                        <button
                            className="btn btn-secondary m-2"
                            onClick={() => setScreen('collection')}
                        >
                            🚚 Texto para envio de coleta
                        </button>
                        <button
                            className="btn btn-info m-2"
                            onClick={() => setScreen('cadastralData')}
                        >
                            📦 Texto para dados cadastrais
                        </button>
                        <button
                            className="btn btn-outline-primary m-2"
                            onClick={() => setScreen('tracking')}
                        >
                            📄 Texto para rastreio de NF
                        </button>
                        <button
                            className="btn btn-outline-success m-2"
                            onClick={() => setScreen('contatoFilial')}
                        >
                            📞 Texto para contato de filial
                        </button>
                    </>
                )}
                {/* Opções para o setor Pendência */}
                {setor === 'pendencia' && (
                    <>
                        <button
                            className="btn btn-outline-warning m-2"
                            onClick={() => setScreen('correctionLetter')}
                        >
                            ✉️ Solicitação de Carta de Correção
                        </button>
                        <button
                            className="btn btn-success m-2"
                            onClick={() => setScreen('bankData')}
                        >
                            💰 Texto para dados bancários
                        </button>
                        <button
                            className="btn btn-info m-2"
                            onClick={() => setScreen('cadastralData')}
                        >
                            📦 Texto para dados cadastrais
                        </button>
                        <button
                            className="btn btn-outline-success m-2"
                            onClick={() => setScreen('contatoFilial')}
                        >
                            📞 Texto para contato de filial
                        </button>
                        <button
                            className="btn btn-outline-danger m-2"
                            onClick={() => setScreen('termoIsencao')}
                        >
                            📝 Solicitação de Termo de Isenção de Avaria
                        </button>
                    </>
                )}
            </div>
        );
    }

    // Tela para seleção de dados bancários
    if (screen === 'bankData') {
        return (
            <div className="container mt-5 text-center">
                {renderLogoAndInstall()}
                <button
                    className="btn btn-secondary mb-3"
                    onClick={() => setScreen('home')}
                >
                    &larr; Voltar
                </button>
                <h3 className="mb-4">Escolha o texto de dados bancários</h3>
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
        );
    }

    // Tela para seleção de dados cadastrais
    if (screen === 'cadastralData') {
        return (
            <div className="container mt-5 text-center">
                {renderLogoAndInstall()}
                <button
                    className="btn btn-secondary mb-3"
                    onClick={() => setScreen('home')}
                >
                    &larr; Voltar
                </button>
                <h3 className="mb-4">Escolha o texto de dados cadastrais</h3>
                <button
                    className="btn btn-info m-2"
                    onClick={() => setScreen('transpixCadastral')}
                >
                    📦 Dados cadastrais Transpix
                </button>
                <button
                    className="btn btn-danger m-2"
                    onClick={() => setScreen('transcomprasCadastral')}
                >
                    📦 Dados cadastrais Transcompras
                </button>
            </div>
        );
    }

    // Tela para contato de filial
    if (screen === 'contatoFilial') {
        return (
            <div className="container mt-5 text-center">
                {renderLogoAndInstall()}
                <button
                    className="btn btn-outline-success mb-3"
                    onClick={() => setScreen('home')}
                >
                    &larr; Voltar
                </button>
                <div className="d-flex justify-content-center">
                    <div style={{ width: "100%", maxWidth: 600 }}>
                        <FilialContatoForm />
                    </div>
                </div>
            </div>
        );
    }

    // Demais telas: sempre exibe logo, botão voltar e o formulário correspondente
    const renderScreenWithLogo = (FormComponent: React.FC, backTo: 'home' | 'bankData' | 'cadastralData', backBtnClass = "btn btn-secondary") => (
        <div className="container mt-5 text-center">
            {renderLogoAndInstall()}
            <button
                className={`${backBtnClass} mb-3`}
                onClick={() => setScreen(backTo)}
            >
                &larr; Voltar
            </button>
            <div className="d-flex justify-content-center">
                <div style={{ width: "100%", maxWidth: 600 }}>
                    <FormComponent />
                </div>
            </div>
        </div>
    );

    if (screen === 'quotation') return renderScreenWithLogo(QuotationForm, 'home', "btn btn-primary");
    if (screen === 'collection') return renderScreenWithLogo(CollectionForm, 'home', "btn btn-secondary");
    if (screen === 'transpix') return renderScreenWithLogo(TranspixForm, 'bankData', "btn btn-success");
    if (screen === 'transcompras') return renderScreenWithLogo(TranscomprasForm, 'bankData', "btn btn-warning");
    if (screen === 'transpixCadastral') return renderScreenWithLogo(TranspixCadastralForm, 'cadastralData', "btn btn-info");
    if (screen === 'transcomprasCadastral') return renderScreenWithLogo(TranscomprasCadastralForm, 'cadastralData', "btn btn-danger");
    if (screen === 'tracking') return renderScreenWithLogo(TrackingForm, 'home', "btn btn-dark");
    if (screen === 'correctionLetter') return renderScreenWithLogo(CorrectionLetterForm, 'home', "btn btn-outline-warning");
    if (screen === 'termoIsencao') return renderScreenWithLogo(TermoIsencaoAvariaForm, 'home', "btn btn-outline-danger");

    return null;
};

export default App;