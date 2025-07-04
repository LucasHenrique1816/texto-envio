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
import bcrypt from 'bcryptjs';

type Screen =
  | 'login'
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

const USERS = [
  {
    username: 'pendencia',
    hash: '$2a$10$tw5jYUEuXr7TW8rIVBQSkuHxNtICQPvqi5lMRK6nN9KrpNHdY31JK',
  },
  {
    username: 'admin',
    hash: '$2a$10$uRhtWIiMdJyRl/3CvxoRj.46vZjyJ959DQsHm7pD36f2urAOi1/q6',
  },
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [setor, setSetor] = useState<'comercial' | 'pendencia' | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Login state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

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

  // Login screen
  if (screen === 'login') {
    return (
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            background: 'rgba(30,30,30,0.97)',
            borderRadius: 24,
            boxShadow: '0 4px 32px #0008',
            padding: '2.5rem 2.5rem 2.5rem 2.5rem',
            border: '2px solid #ffb300',
            minWidth: 340,
            maxWidth: 420,
            width: '100%',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: 340,
              marginBottom: 32,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              filter: 'drop-shadow(0 2px 8px #0008)',
            }}
          />
          <h3 className="text-white text-center mb-4" style={{ letterSpacing: 1 }}>
            Login
          </h3>
          <input
            className="form-control mb-3"
            placeholder="Usuário"
            value={loginUser}
            onChange={e => setLoginUser(e.target.value)}
            autoFocus
            style={{ fontSize: 18, padding: '0.75rem' }}
          />
          <input
            className="form-control mb-3"
            placeholder="Senha"
            type="password"
            value={loginPass}
            onChange={e => setLoginPass(e.target.value)}
            style={{ fontSize: 18, padding: '0.75rem' }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
          {loginError && (
            <div className="mb-3" style={{ color: '#ff1744', fontWeight: 600 }}>
              {loginError}
            </div>
          )}
          <button
            className="btn btn-lg w-100"
            style={{
              background: 'linear-gradient(90deg,#1976d2,#64b5f6)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: '0 2px 8px #0005',
              fontSize: 20,
              letterSpacing: 1,
            }}
            onClick={handleLogin}
          >
            Entrar
          </button>
          {showInstall && (
            <div className="mt-4">
              <button
                className="btn"
                style={{
                  background: 'transparent',
                  color: '#ffb300',
                  fontWeight: 700,
                  borderRadius: 8,
                  border: '2px solid #ffb300',
                  boxShadow: 'none',
                  padding: '0.75rem 2rem',
                  fontSize: 18,
                  transition: 'background .2s, color .2s',
                }}
                onClick={handleInstallClick}
              >
                ⬇️ Instalar App
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  async function handleLogin() {
    setLoginError('');
    const user = USERS.find(u => u.username === loginUser.trim());
    if (!user) {
      setLoginError('Usuário ou senha inválidos');
      return;
    }
    const ok = await bcrypt.compare(loginPass, user.hash);
    if (!ok) {
      setLoginError('Usuário ou senha inválidos');
      return;
    }
    setLoginUser('');
    setLoginPass('');
    setScreen('setor');
  }

  // Setor selection screen
  if (screen === 'setor') {
    return (
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            background: 'rgba(30,30,30,0.97)',
            borderRadius: 24,
            boxShadow: '0 4px 32px #0008',
            padding: '2.5rem 2.5rem 2.5rem 2.5rem',
            border: '2px solid #ffb300',
            minWidth: 340,
            maxWidth: 420,
            width: '100%',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: 340,
              marginBottom: 32,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              filter: 'drop-shadow(0 2px 8px #0008)',
            }}
          />
          <h3 className="text-white text-center mb-4" style={{ letterSpacing: 1 }}>
            Selecione o setor
          </h3>
          <div className="d-flex flex-column gap-3 w-100">
            <button
              className="btn btn-lg"
              style={{
                background: 'linear-gradient(90deg,#1976d2,#64b5f6)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 2px 8px #0005',
                fontSize: 20,
                letterSpacing: 1,
              }}
              onClick={() => {
                setSetor('comercial');
                setScreen('home');
                setActiveTab('');
              }}
            >
              Comercial
            </button>
            <button
              className="btn btn-lg"
              style={{
                background: 'linear-gradient(90deg,#ffb300,#ff6f00)',
                color: '#23272b',
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 2px 8px #0005',
                fontSize: 20,
                letterSpacing: 1,
              }}
              onClick={() => {
                setSetor('pendencia');
                setScreen('home');
                setActiveTab('');
              }}
            >
              Pendência
            </button>
          </div>
          {showInstall && (
            <div className="mt-4">
              <button
                className="btn"
                style={{
                  background: 'transparent',
                  color: '#ffb300',
                  fontWeight: 700,
                  borderRadius: 8,
                  border: '2px solid #ffb300',
                  boxShadow: 'none',
                  padding: '0.75rem 2rem',
                  fontSize: 18,
                  transition: 'background .2s, color .2s',
                }}
                onClick={handleInstallClick}
              >
                ⬇️ Instalar App
              </button>
            </div>
          )}
          <button
            className="btn w-100 mt-4"
            style={{
              background: 'linear-gradient(90deg,#23272b,#18191a)',
              color: '#ff1744',
              fontWeight: 700,
              borderRadius: 8,
              border: '2px solid #ff1744',
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: '0 2px 8px #0005',
            }}
            onClick={() => {
              setScreen('login');
              setSetor(null);
              setActiveTab('');
              setIsFormOpen(false);
              setLoginUser('');
              setLoginPass('');
              setLoginError('');
            }}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  // Após selecionar setor, exibe menu lateral e conteúdo
  if (screen === 'home' && setor) {
    const tabs = setor === 'comercial' ? comercialTabs : pendenciaTabs;
    const ActiveComponent = tabs.find(tab => tab.key === activeTab)?.component;

    const handleOpenForm = (tabKey: string) => {
      if (isFormOpen && activeTab !== tabKey) {
        // Mensagem estilizada
        const msg = document.createElement('div');
        msg.innerHTML = `<div style="
          background: #23272b;
          color: #fff;
          border: 2px solid #ff1744;
          border-radius: 10px;
          padding: 18px 32px;
          font-size: 1.2rem;
          font-weight: 600;
          box-shadow: 0 2px 16px #0007;
          position: fixed;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          text-align: center;
        ">
          <span style="color:#ff1744;font-size:1.5rem;font-weight:bold;margin-right:8px;">&#9888;</span>
          feche o formulario antes de continuar
        </div>`;
        document.body.appendChild(msg);
        setTimeout(() => {
          msg.remove();
        }, 2200);
        return;
      }
      setActiveTab(tabKey);
      setFormKey(prev => prev + 1);
      setIsFormOpen(true);
    };

    const handleCloseForm = () => {
      setActiveTab('');
      setFormKey(prev => prev + 1);
      setIsFormOpen(false);
    };

    return (
      <div className="d-flex min-vh-100" style={{ background: 'linear-gradient(120deg,#18191a 70%,#23272b 100%)' }}>
        {/* Menu lateral */}
        <div
          style={{
            width: '240px',
            background: 'rgba(35,39,43,0.98)',
            borderRight: '2px solid #ffb300',
            padding: '1.5rem 1rem',
            minHeight: '100vh',
            boxShadow: '2px 0 16px #0006',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                height: 80,
                marginBottom: 10,
                marginTop: 4,
                filter: 'drop-shadow(0 2px 8px #0008)',
                maxWidth: '90%',
                objectFit: 'contain',
              }}
            />
            <div className="text-white mb-2" style={{ fontWeight: 600, letterSpacing: 1, textAlign: 'center' }}>
              {setor === 'comercial' ? 'Setor Comercial' : 'Setor Pendência'}
            </div>
          </div>
          <ul className="nav flex-column w-100 mt-2">
            {tabs.map(tab => (
              <li className="nav-item mb-2" key={tab.key}>
                <button
                  className={`nav-link w-100 text-start ${activeTab === tab.key ? 'active' : ''}`}
                  style={{
                    background: activeTab === tab.key
                      ? 'linear-gradient(90deg,#ffb300,#ff6f00)'
                      : 'transparent',
                    color: activeTab === tab.key ? '#23272b' : '#fff',
                    fontWeight: 600,
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: activeTab === tab.key ? '0 2px 8px #0005' : undefined,
                    fontSize: 17,
                    letterSpacing: 1,
                    padding: '0.75rem 1.2rem',
                    transition: 'all .2s',
                  }}
                  onClick={() => handleOpenForm(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn w-100 mt-auto"
            style={{
              background: 'linear-gradient(90deg,#23272b,#18191a)',
              color: '#ffb300',
              fontWeight: 700,
              borderRadius: 8,
              border: '2px solid #ffb300',
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: '0 2px 8px #0005',
              marginTop: '2rem',
            }}
            onClick={() => {
              setSetor(null);
              setScreen('setor');
              setActiveTab('');
              setIsFormOpen(false);
            }}
          >
            Trocar setor
          </button>
          <button
            className="btn w-100 mt-3"
            style={{
              background: 'linear-gradient(90deg,#23272b,#18191a)',
              color: '#ff1744',
              fontWeight: 700,
              borderRadius: 8,
              border: '2px solid #ff1744',
              fontSize: 16,
              letterSpacing: 1,
              boxShadow: '0 2px 8px #0005',
            }}
            onClick={() => {
              setScreen('login');
              setSetor(null);
              setActiveTab('');
              setIsFormOpen(false);
              setLoginUser('');
              setLoginPass('');
              setLoginError('');
            }}
          >
            Sair
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4" style={{ minHeight: '100vh' }}>
          {ActiveComponent ? (
            <div
              className="position-relative"
              style={{
                background: 'rgba(35,39,43,0.98)',
                borderRadius: 18,
                boxShadow: '0 4px 32px #0008',
                minHeight: '420px',
                minWidth: '340px',
                maxWidth: 700,
                width: '100%',
                padding: '2.5rem 2rem 2rem 2rem',
                border: '2px solid #ffb300',
                overflow: 'visible',
              }}
            >
              {/* Botão de fechar formulário */}
              <button
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  top: '18px',
                  right: '18px',
                  background: 'linear-gradient(90deg,#ff1744,#ff5252)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  width: '38px',
                  height: '38px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  boxShadow: '0 2px 8px #0007',
                  zIndex: 10,
                  transition: 'background .2s',
                }}
                title="Fechar formulário"
                onClick={handleCloseForm}
              >
                <span style={{ marginTop: -2, marginLeft: 1 }}>×</span>
              </button>
              <ActiveComponent key={formKey + activeTab} />
            </div>
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                minHeight: 320,
                background: 'rgba(35,39,43,0.97)',
                borderRadius: 18,
                boxShadow: '0 4px 32px #0008',
                border: '2px solid #ffb300',
                padding: '3rem 2rem',
                maxWidth: 500,
                margin: 'auto',
              }}
            >
              <span style={{ fontSize: 48, color: '#ffb300', marginBottom: 16 }}>💡</span>
              <h4 className="text-white text-center mb-0" style={{ letterSpacing: 1 }}>
                Selecione uma das opções do menu lateral.
              </h4>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default App;