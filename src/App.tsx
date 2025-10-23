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
import FormDevolucaoA from './components/FormDevolucaoA';
import logo from './assets/logofinal.png';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

// Tipo para as props que os formulários irão receber
export type FormProps = {
  loggedUser?: {
    login: string;
    nome_completo: string;
    role: string;
  } | null;
  readOnlyName?: boolean;
};

type Screen =
  | 'cadastro'
  | 'login'
  | 'setor'
  | 'home'
  | 'changePassword'
  | 'adminUsers'
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
  | 'autorizacaoEmbarque'
  | 'devolucao';

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
  { key: 'devolucao', label: '↩️ Devolução', component: FormDevolucaoA }
];

const App: React.FC = () => {
  // Tela inicial agora é login (antes era 'cadastro')
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
  const [loggedUser, setLoggedUser] = useState<{login: string, nome_completo: string, role: string} | null>(null);

  // Cadastro state
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cadastroError, setCadastroError] = useState('');
  const [roleSelected, setRoleSelected] = useState('');
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null);
  const [mustChangePassword, setMustChangePassword] = useState(false); // flag recebida do banco
  // const [tempCredential, setTempCredential] = useState<{login: string; password: string} | null>(null); // não utilizado mais
  // Tela de troca de senha
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [changePassError, setChangePassError] = useState('');
  const passwordPolicy = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  // Admin Users screen
  const [adminUsers, setAdminUsers] = useState<Array<{login: string; nome_completo: string; role: string; must_change_password: boolean}>>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [adminUsersError, setAdminUsersError] = useState('');
  const [pwdModalUser, setPwdModalUser] = useState<string | null>(null);
  const [pwdModalValue, setPwdModalValue] = useState('');
  const [pwdModalError, setPwdModalError] = useState('');

  // Mapeamento de setores permitidos por role (requisito: comercial acessa comercial e pendencia; admin todos)
  const roleSectorAccess: Record<string, Array<'comercial' | 'pendencia'>> = {
    admin: ['comercial', 'pendencia'],
    comercial: ['comercial', 'pendencia'],
    // Outras roles ainda não definidas: ajuste conforme necessidade
  };

  const permittedSectors = React.useMemo(() => {
    if (!loggedUser) return [] as Array<'comercial' | 'pendencia'>;
    return roleSectorAccess[loggedUser.role] || [];
  }, [loggedUser]);

  function generateTempPassword() {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const all = upper + lower + digits;
    const rand = (set: string) => set[Math.floor(Math.random() * set.length)];
    let pwd = rand(upper) + rand(lower) + rand(digits);
    while (pwd.length < 8) pwd += rand(all);
    // embaralhar
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
  }

  const cadastrar = async () => {
    setCadastroError('');
    
    if (!login.trim() || !nomeCompleto.trim() || !roleSelected) {
      setCadastroError('Todos os campos (incluindo setor) são obrigatórios');
      return;
    }
    if (!senha.trim()) {
      setCadastroError('Informe a senha temporária');
      return;
    }
    if (!passwordPolicy.test(senha)) {
      setCadastroError('Senha temporária inválida: mínimo 6, 1 letra maiúscula e 1 número');
      return;
    }

    try {
      const senhaHash = await bcrypt.hash(senha, 10);
      const { error } = await supabase.from('usuarios').insert([
        {
          login: login.trim(),
          senha_hash: senhaHash,
          nome_completo: nomeCompleto.trim(),
          role: roleSelected,
          must_change_password: true,
        },
      ]);

      if (error) {
        setCadastroError('Erro ao cadastrar: ' + error.message);
        return;
      }
      // Sucesso
      setLogin('');
      setNomeCompleto('');
      setSenha('');
      setRoleSelected('');
      setScreen('login');
    } catch (e: any) {
      setCadastroError('Erro interno ao cadastrar usuário');
    }
  };

  // Funções auxiliares da área administrativa
  const openPwdModal = (userLogin: string) => {
    if(!loggedUser) return;
    if(userLogin === loggedUser.login) { alert('Use a tela de alteração de senha para sua própria conta.'); return; }
    setPwdModalUser(userLogin);
    setPwdModalValue('');
    setPwdModalError('');
  };

  const submitPwdModal = async () => {
    if(!pwdModalUser) return;
    setPwdModalError('');
    if(!pwdModalValue.trim()) { setPwdModalError('Informe a nova senha temporária'); return; }
    if(!passwordPolicy.test(pwdModalValue)) { setPwdModalError('Requisitos: mín 6, 1 maiúscula, 1 número'); return; }
    try {
      const hash = await bcrypt.hash(pwdModalValue,10);
      const { error } = await supabase.from('usuarios').update({ senha_hash: hash, must_change_password: true }).eq('login', pwdModalUser);
      if(error){ setPwdModalError('Erro ao salvar: '+error.message); return; }
      setPwdModalUser(null);
      setPwdModalValue('');
      await loadUsers();
      alert('Senha temporária definida com sucesso.');
    } catch(e){ setPwdModalError('Erro interno ao definir senha.'); }
  };

  const handleRoleChange = async (loginTarget: string, newRole: string) => {
    if(!newRole) return;
    const { error } = await supabase.from('usuarios').update({ role: newRole }).eq('login', loginTarget);
    if(error){ alert('Erro ao atualizar setor: '+error.message); return; }
    setAdminUsers(prev => prev.map(u => u.login === loginTarget ? { ...u, role: newRole } : u));
  };

  const loadUsers = async () => {
    setAdminUsersError(''); setAdminUsersLoading(true);
    const { data, error } = await supabase.from('usuarios').select('login, nome_completo, role, must_change_password').order('login');
    if(error) setAdminUsersError(error.message); else setAdminUsers(data || []);
    setAdminUsersLoading(false);
  };

  // Efeito para carregar usuários quando entrar na tela adminUsers
  useEffect(() => {
    if (screen === 'adminUsers' && loggedUser?.role === 'admin') {
      if(!adminUsersLoading && adminUsers.length === 0 && !adminUsersError) {
        loadUsers();
      }
    }
  }, [screen, loggedUser, adminUsersLoading, adminUsers.length, adminUsersError]);

  // Guarda para impedir acesso a setor não permitido
  useEffect(() => {
    if (screen === 'home' && setor && !permittedSectors.includes(setor)) {
      setSetor(null);
      setActiveTab('');
      setIsFormOpen(false);
      setScreen('setor');
    }
  }, [screen, setor, permittedSectors]);

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

  // Tela de mudança obrigatória de senha
  if (screen === 'changePassword' && loggedUser) {
    return (
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{background:'rgba(30,30,30,0.97)',borderRadius:24,boxShadow:'0 4px 32px #0008',padding:'2.5rem',border:'2px solid #ffb300',minWidth:340,maxWidth:420,width:'100%'}}>
          <img src={logo} alt="Logo" style={{maxWidth:260,marginBottom:24,filter:'drop-shadow(0 2px 8px #0008)'}} />
          <h3 className="text-white text-center mb-3" style={{letterSpacing:1}}>Defina uma nova senha</h3>
          <p className="text-white-50 mb-4" style={{fontSize:14,lineHeight:1.4}}>Sua senha temporária deve ser alterada. Requisitos: mínimo 6 caracteres, 1 letra maiúscula e 1 número.</p>
          <input className="form-control mb-3" type="password" placeholder="Nova senha" value={newPass} onChange={e=>setNewPass(e.target.value)} />
          <input className="form-control mb-3" type="password" placeholder="Confirmar nova senha" value={newPassConfirm} onChange={e=>setNewPassConfirm(e.target.value)} />
          {changePassError && <div className="mb-3" style={{color:'#ff1744',fontWeight:600}}>{changePassError}</div>}
          <button className="btn btn-lg w-100 mb-2" style={{background:'linear-gradient(90deg,#4caf50,#81c784)',color:'#fff',fontWeight:600,borderRadius:8,boxShadow:'0 2px 8px #0005',fontSize:18,letterSpacing:1}} onClick={async ()=>{
            setChangePassError('');
            if(!passwordPolicy.test(newPass)) { setChangePassError('Senha não atende aos requisitos.'); return; }
            if(newPass !== newPassConfirm) { setChangePassError('As senhas não coincidem.'); return; }
            try {
              const hash = await bcrypt.hash(newPass,10);
              const { error } = await supabase.from('usuarios').update({ senha_hash: hash, must_change_password: false }).eq('login', loggedUser.login);
              if(error){ setChangePassError('Erro ao atualizar senha: '+error.message); return; }
              setMustChangePassword(false);
              setNewPass(''); setNewPassConfirm('');
              setScreen('setor');
            } catch(err){ setChangePassError('Erro interno ao salvar nova senha'); }
          }}>Salvar nova senha</button>
          <button className="btn btn-sm w-100" style={{background:'transparent',color:'#ffb300',fontWeight:600,border:'2px solid #ffb300',borderRadius:8}} onClick={()=>{ setLoggedUser(null); setScreen('login'); }}>Cancelar</button>
        </div>
          {/* Modal de senha não exibido nesta tela */}
      </div>
    );
  }

  // Tela administração de usuários (somente admin)
  if (screen === 'adminUsers') {
  if (!loggedUser || loggedUser.role !== 'admin') { setScreen('login'); return null; }
    const handleReset = async (loginTarget: string) => {
      if(loginTarget === loggedUser.login) { alert('Use a tela de alteração de senha para alterar a sua.'); return; }
      const tempPwd = generateTempPassword();
      const hash = await bcrypt.hash(tempPwd,10);
      const { error } = await supabase.from('usuarios').update({ senha_hash: hash, must_change_password: true }).eq('login', loginTarget);
      if(error){ alert('Erro ao resetar senha: '+error.message); return; }
      alert(`Nova senha temporária de ${loginTarget}: ${tempPwd}`);
      loadUsers();
    };
    const handleDelete = async (loginTarget: string) => {
      if(loginTarget === loggedUser.login) { alert('Não é possível excluir a si mesmo.'); return; }
      if(!window.confirm(`Excluir usuário ${loginTarget}?`)) return;
      const { error } = await supabase.from('usuarios').delete().eq('login', loginTarget);
      if(error){ alert('Erro ao excluir: '+error.message); return; }
      loadUsers();
    };
    return (
      <div className="container py-4">
        <h3 className="text-white mb-3">Usuários Cadastrados</h3>
        <div className="mb-3 d-flex gap-2">
          <button className="btn btn-sm btn-secondary" onClick={()=>setScreen('setor')}>Voltar</button>
          <button className="btn btn-sm btn-outline-light" onClick={()=>{ setAdminUsers([]); }}>Recarregar</button>
          <button className="btn btn-sm btn-success" onClick={()=>{ setPrevScreen('adminUsers'); setScreen('cadastro'); }}>Novo Usuário</button>
        </div>
        {adminUsersError && <div className="alert alert-danger py-2 px-3">{adminUsersError}</div>}
        {adminUsersLoading && <div className="text-white">Carregando...</div>}
        {!adminUsersLoading && (
          <div className="table-responsive" style={{maxHeight: '60vh'}}>
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Login</th>
                  <th>Nome</th>
                  <th>Setor</th>
                  <th>Troca Pendente</th>
                  <th style={{width:260}}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map(u => (
                  <tr key={u.login}>
                    <td>{u.login}</td>
                    <td>{u.nome_completo}</td>
                    <td>
                      <select
                        className="form-select form-select-sm bg-dark text-white border-secondary"
                        value={u.role}
                        onChange={e => handleRoleChange(u.login, e.target.value)}
                        style={{minWidth:140}}
                      >
                        <option value="admin">admin</option>
                        <option value="comercial">comercial</option>
                        <option value="expedicao">expedicao</option>
                        <option value="financeiro">financeiro</option>
                        <option value="gerencia">gerencia</option>
                        <option value="coleta">coleta</option>
                        <option value="dp">dp</option>
                        <option value="ti">ti</option>
                      </select>
                    </td>
                    <td>{u.must_change_password ? 'Sim' : 'Não'}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-info" onClick={()=>openPwdModal(u.login)}>Alterar Senha</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(u.login)}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {adminUsers.length === 0 && <tr><td colSpan={5} className="text-center text-white-50">Nenhum usuário</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        {pwdModalUser && (
          <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="bg-dark p-4 rounded" style={{width:'100%',maxWidth:420,border:'2px solid #ffb300'}}>
              <h5 className="text-white mb-3">Definir nova senha temporária</h5>
              <p className="text-white-50" style={{fontSize:12}}>Usuário: <strong>{pwdModalUser}</strong></p>
              <input
                className="form-control mb-2"
                type="password"
                placeholder="Senha temporária (mín. 6, 1 maiúscula, 1 número)"
                value={pwdModalValue}
                onChange={e=>setPwdModalValue(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter') submitPwdModal(); }}
              />
              {pwdModalError && <div className="mb-2" style={{color:'#ff1744',fontSize:13,fontWeight:600}}>{pwdModalError}</div>}
              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-sm btn-outline-light" type="button" onClick={()=>setPwdModalValue(generateTempPassword())}>Gerar</button>
                <button className="btn btn-sm btn-success flex-grow-1" type="button" onClick={submitPwdModal}>Salvar</button>
                <button className="btn btn-sm btn-secondary" type="button" onClick={()=>setPwdModalUser(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Cadastro screen (somente admins logados)
  if (screen === 'cadastro') {
    if (!loggedUser || loggedUser.role !== 'admin') {
      // Proteção extra: se não for admin volta para login
      setScreen('login');
      return null;
    }

    const isFormEmpty = !nomeCompleto.trim() && !login.trim() && !senha.trim() && !roleSelected;
    const handleClearCadastro = () => {
      setNomeCompleto('');
      setLogin('');
      setSenha('');
      setRoleSelected('');
      setCadastroError('');
    };
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
            Cadastro de Usuário
          </h3>
          <input
            className="form-control mb-3"
            placeholder="Nome completo"
            value={nomeCompleto}
            onChange={e => setNomeCompleto(e.target.value)}
            autoFocus
            style={{ fontSize: 18, padding: '0.75rem' }}
          />
          <input
            className="form-control mb-3"
            placeholder="Login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            style={{ fontSize: 18, padding: '0.75rem' }}
          />
          <input
            className="form-control mb-3"
            placeholder="Senha temporária (mín. 6, 1 maiúscula, 1 número)"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{ fontSize: 16, padding: '0.65rem' }}
            onKeyDown={e => { if (e.key === 'Enter') cadastrar(); }}
          />
          <select
            className="form-select mb-3"
            value={roleSelected}
            onChange={e => setRoleSelected(e.target.value)}
            style={{ fontSize: 18, padding: '0.75rem', fontWeight: 500 }}
          >
            <option value="">Selecione o setor / perfil</option>
            <option value="admin">Administrador</option>
            <option value="comercial">Comercial</option>
            <option value="expedicao">Expedição</option>
            <option value="financeiro">Financeiro</option>
            <option value="gerencia">Gerência</option>
            <option value="coleta">Coleta</option>
            <option value="dp">Departamento Pessoal</option>
            <option value="ti">T.I</option>
          </select>
          {cadastroError && (
            <div className="mb-3" style={{ color: '#ff1744', fontWeight: 600 }}>
              {cadastroError}
            </div>
          )}
          <button
            className="btn btn-lg w-100 mb-3"
            style={{
              background: 'linear-gradient(90deg,#4caf50,#81c784)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: '0 2px 8px #0005',
              fontSize: 20,
              letterSpacing: 1,
            }}
            onClick={cadastrar}
          >
            Cadastrar
          </button>
          <div className="d-flex w-100 gap-2">
            <button
              className="btn flex-grow-1"
              style={{
                background: 'linear-gradient(90deg,#1976d2,#64b5f6)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 2px 8px #0005',
                fontSize: 16,
                letterSpacing: 1,
              }}
              onClick={() => {
                if (!isFormEmpty) {
                  const msg = document.createElement('div');
                  msg.innerHTML = `<div style="background:#23272b;color:#fff;border:2px solid #ff1744;border-radius:10px;padding:14px 26px;font-size:1rem;font-weight:600;box-shadow:0 2px 16px #0007;position:fixed;top:30px;left:50%;transform:translateX(-50%);z-index:9999;text-align:center;">Limpe o formulário antes de voltar</div>`;
                  document.body.appendChild(msg);
                  setTimeout(()=>msg.remove(),1800);
                  return;
                }
                setCadastroError('');
                setScreen(prevScreen || 'login');
                setPrevScreen(null);
              }}
            >
              Voltar
            </button>
            <button
              className="btn flex-grow-1"
              style={{
                background: 'linear-gradient(90deg,#555,#777)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 2px 8px #0005',
                fontSize: 16,
                letterSpacing: 1,
              }}
              type="button"
              onClick={handleClearCadastro}
              disabled={isFormEmpty}
            >
              Limpar
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
        </div>
      </div>
    );
  }

  // Login screen (remoção do botão de auto cadastro público) + exibe senha temp quando gerada
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
          {/* Botão de criar conta removido do login para impedir auto-registro */}
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
    
    if (!loginUser.trim() || !loginPass.trim()) {
      setLoginError('Usuário e senha são obrigatórios');
      return;
    }

    try {
      // Primeiro tenta buscar no banco de dados Supabase
      const { data: usuarios, error } = await supabase
        .from('usuarios')
  .select('login, senha_hash, nome_completo, role, must_change_password')
        .eq('login', loginUser.trim())
        .limit(1);

      if (error) {
        console.error('Erro ao buscar usuário:', error);
        // Se der erro no Supabase, tenta os usuários padrão
        return;
      }

      if (usuarios && usuarios.length > 0) {
        // Usuário encontrado no banco, verifica a senha
        const usuario = usuarios[0];
        const senhaValida = await bcrypt.compare(loginPass, usuario.senha_hash);
        
        if (senhaValida) {
          setLoggedUser({ login: usuario.login, nome_completo: usuario.nome_completo, role: usuario.role });
          setMustChangePassword(!!(usuario as any).must_change_password);
          setLoginUser('');
          setLoginPass('');
          if ((usuario as any).must_change_password) setScreen('changePassword'); else setScreen('setor');
          return;
        } else {
          setLoginError('Usuário ou senha inválidos');
          return;
        }
      } 
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setLoginError('Erro interno. Tente novamente.');
    }
  }


  // Setor selection screen
  if (screen === 'setor') {
    const sectorButtons: Array<{key: 'comercial' | 'pendencia'; label: string; gradient: string; textColor?: string}> = [
      { key: 'comercial', label: 'Comercial', gradient: 'linear-gradient(90deg,#1976d2,#64b5f6)', textColor: '#fff' },
      { key: 'pendencia', label: 'Pendência', gradient: 'linear-gradient(90deg,#ffb300,#ff6f00)', textColor: '#23272b' },
    ];
    const visibleSectors = loggedUser ? (permittedSectors.length > 0 ? sectorButtons.filter(b => permittedSectors.includes(b.key)) : []) : [];
    const showAdminActions = loggedUser?.role === 'admin';
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
            {visibleSectors.map(btn => (
              <button
                key={btn.key}
                className="btn btn-lg"
                style={{
                  background: btn.gradient,
                  color: btn.textColor || '#fff',
                  fontWeight: 600,
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0005',
                  fontSize: 20,
                  letterSpacing: 1,
                }}
                onClick={() => {
                  setSetor(btn.key);
                  setScreen('home');
                  setActiveTab('');
                }}
              >
                {btn.label}
              </button>
            ))}
            {(!loggedUser || visibleSectors.length === 0) && (
              <div className="text-center text-white-50" style={{fontSize:14}}>
                Nenhum setor disponível para seu perfil.
              </div>
            )}
          </div>
          {showAdminActions && (
            <button
              className="btn w-100 mt-4"
              style={{
                background: 'linear-gradient(90deg,#4caf50,#81c784)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 8,
                border: '2px solid #4caf50',
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: '0 2px 8px #0005',
              }}
              onClick={() => {
                setPrevScreen('setor');
                setScreen('cadastro');
                setActiveTab('');
                setIsFormOpen(false);
              }}
            >
              Cadastrar usuário
            </button>
          )}
          {showAdminActions && (
            <button
              className="btn w-100 mt-2"
              style={{
                background: 'linear-gradient(90deg,#1976d2,#64b5f6)',
                color: '#fff',
                fontWeight: 700,
                borderRadius: 8,
                border: '2px solid #1976d2',
                fontSize: 16,
                letterSpacing: 1,
                boxShadow: '0 2px 8px #0005',
              }}
              onClick={() => {
                setScreen('adminUsers');
              }}
            >
              Gerenciar usuários
            </button>
          )}
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
              setLogin('');
              setSenha('');
              setNomeCompleto('');
              setCadastroError('');
              setLoggedUser(null);
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

    // Função para renderizar o componente ativo com as props do usuário
    const renderActiveComponent = () => {
      if (!ActiveComponent) return null;
      
      // Passa as informações do usuário como props para todos os componentes
      return React.createElement(ActiveComponent, {
        key: formKey + activeTab,
        loggedUser: loggedUser,
        readOnlyName: true
      });
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
            {loggedUser && (
              <div className="text-white mb-3" style={{ 
                fontSize: 14, 
                opacity: 0.8, 
                textAlign: 'center',
                borderTop: '1px solid #ffb300',
                paddingTop: 8,
                marginTop: 8
              }}>
                👤 {loggedUser.nome_completo}
              </div>
            )}
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
              setLogin('');
              setSenha('');
              setNomeCompleto('');
              setCadastroError('');
              setLoggedUser(null);
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
              {renderActiveComponent()}
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
