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
import AutorizacaoEmbarqueForm from './components/AutorizacaoEmbarqueForm';
import logo from './assets/logofinal.png';

type Screen =
    | 'setor'
    | 'home'
    | 'quotation'
    | 'collection'
    | 'transpix'
    | 'transcompras'
    | 'transpixCadastral'
    | 'transcomprasCadastral'
    | 'tracking'
    | 'correctionLetter'
    | 'contatoFilial'
    | 'termoIsencao'
    | 'autorizacaoEmbarque';

const comercialTabs = [
    { key: 'quotation', label: '📝 Cotação', component: QuotationForm },
    { key: 'collection', label: '🚚 Coleta', component: CollectionForm },
    { key: 'tracking', label: '📄 Rastreio NF', component: TrackingForm },
    { key: 'contatoFilial', label: '📞 Contato Filial', component: FilialContatoForm },
    { key: 'transpixCadastral', label: '📦 Cadastral Transpix', component: TranspixCadastralForm },
    { key: 'transcomprasCadastral', label: '📦 Cadastral Transcompras', component: TranscomprasCadastralForm },
];

const pendenciaTabs = [
    { key: 'correctionLetter', label: '✉️ Carta de Correção', component: CorrectionLetterForm },
    { key: 'transpix', label: '💰 Bancários Transpix', component: TranspixForm },
    { key: 'transcompras', label: '💰 Bancários Transcompras', component: TranscomprasForm },
    { key: 'transpixCadastral', label: '📦 Cadastral Transpix', component: TranspixCadastralForm },
    { key: 'transcomprasCadastral', label: '📦 Cadastral Transcompras', component: TranscomprasCadastralForm },
    { key: 'tracking', label: '📄 Rastreio NF', component: TrackingForm },
    { key: 'termoIsencao', label: '📝 Termo de Isenção', component: TermoIsencaoAvariaForm },
    { key: 'autorizacaoEmbarque', label: '🚚 Autorização Embarque', component: AutorizacaoEmbarqueForm },
];

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('setor');
    const [setor, setSetor] = useState<'comercial' | 'pendencia' | null>(null);
    const [activeTab, setActiveTab] = useState<string>('');
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

    // Logo e botão instalar
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

    // Seleção de setor
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
                        setActiveTab('quotation');
                    }}
                >
                    Comercial
                </button>
                <button
                    className="btn btn-warning m-2"
                    onClick={() => {
                        setSetor('pendencia');
                        setScreen('home');
                        setActiveTab('correctionLetter');
                    }}
                >
                    Pendência
                </button>
            </div>
        );
    }

    // Após selecionar setor, exibe barra de navegação e abas
    if (screen === 'home' && setor) {
        const tabs = setor === 'comercial' ? comercialTabs : pendenciaTabs;
        const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component;

        return (
            <div className="min-vh-100" style={{ background: '#18191a' }}>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#23272b', borderBottom: '1px solid #222' }}>
                    <div className="container-fluid">
                        <span className="navbar-brand d-flex align-items-center">
                            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 12 }} />
                            <span>
                                {setor === 'comercial' ? 'Setor Comercial' : 'Setor Pendência'}
                            </span>
                        </span>
                        <button
                            className="btn btn-outline-light"
                            onClick={() => {
                                setSetor(null);
                                setScreen('setor');
                                setActiveTab('');
                            }}
                        >
                            Trocar setor
                        </button>
                    </div>
                </nav>
                <div className="container py-4">
                    <ul className="nav nav-tabs mb-4" style={{ borderColor: '#444' }}>
                        {tabs.map(tab => (
                            <li className="nav-item" key={tab.key}>
                                <button
                                    className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                    style={{
                                        background: activeTab === tab.key ? '#23272b' : '#18191a',
                                        color: '#fff',
                                        border: '1px solid #444',
                                        borderBottom: activeTab === tab.key ? 'none' : undefined,
                                    }}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="bg-dark rounded p-3 shadow">
                        {ActiveComponent ? <ActiveComponent /> : (
                            <div className="text-center text-white">
                                <h4>Selecione uma aba acima para começar.</h4>
                            </div>
                        )}
                    </div>
                </div>
                <footer className="text-center text-secondary py-3" style={{ background: '#23272b', borderTop: '1px solid #222' }}>
                    <small>Transcompras & Transpix &copy; {new Date().getFullYear()}</small>
                </footer>
            </div>
        );
    }

    return null;
};

export default App;