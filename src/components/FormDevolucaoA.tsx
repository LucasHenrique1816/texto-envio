// src/components/FormDevolucaoA.tsx
// FormDevolucaoA.tsx (versão reorganizada e estilizada para impressão A4)
// Mantidos: ViaCEP, complemento, documento opcional do motorista, data automática (dd/MM/yyyy)
// Removidos conforme solicitado anteriormente: manifesto, valor NF, local de entrega, rubrica
// Assinatura somente no impresso (área grande), não há input no editor

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';

interface DevolucaoFormData {
  remetente: string;
  endRem: string;
  numRem: string;
  cepRem: string;
  foneRem: string;
  respMinuta: string;
  dest: string;
  cepDest: string;
  endDest: string;
  complementoDest: string;
  numDest: string;
  bairroDest: string;
  cidadeDest: string;
  ufDest: string;
  foneDest: string;
  autorizado: string;
  nf: string;
  quantidade: string;
  peso: string;
  data: string;
  motorista: string;
  docTipo: '' | 'RG' | 'CPF' | 'CNH';
  docNumero: string;
  tipo: '' | 'frota' | 'agregado' | 'terceiro';
  descricao: string;
  justificativa: string;
  // assinatura campo lógico (não editado – usado só para compatibilidade)
  assinatura: string;
}

interface LoggedUser {
  login: string;
  nome_completo: string;
  role: string;
}

const companyData: Record<'transpix' | 'transcompras', {
  razao: string;
  endereco: string;
  numero: string;
  cep: string;
  fone: string;
  logo: string;
}> = {
  transpix: {
    razao: 'TRANSPIX - Transportes e Logística LTDA',
    endereco: 'Rua Joao Roberto 173, Cidade Industrial Satélite, Guarulhos-SP',
    numero: '173',
    cep: '07221-040',
    fone: '(11) 3927-2050',
    logo: 'public/logo/transpix.png'
  },
  transcompras: {
    razao: 'Transcompras - Transporte e Compras Comerciais LTDA',
    endereco: 'Rua Joao Roberto 173, Cidade Industrial Satélite, Guarulhos-SP',
    numero: '173',
    cep: '07221-040',
    fone: '(11) 3927-2050',
    logo: 'public/logo/transcompras.png'
  }
};

// ---------- Utilidades ----------
const getTodayFormatted = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};
const unmask = (v: string) => v.replace(/\D/g, '');
const maskCEP = (v: string) => {
  const n = unmask(v).slice(0, 8);
  return n.length > 5 ? `${n.slice(0,5)}-${n.slice(5)}` : n;
};
const maskPhone = (v: string) => {
  const n = unmask(v).slice(0,11);
  if (n.length <= 10)
    return n.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{4})(\d)/,'$1-$2');
  return n.replace(/^(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2');
};
const onlyNumbers = (v: string) => unmask(v);
const maskPeso = (v: string) => v.replace(/[^0-9,.]/g,'').replace(',', '.');

const maskDoc = (tipo: DevolucaoFormData['docTipo'], valor: string) => {
  const n = unmask(valor);
  if (tipo === 'CPF')
    return n.slice(0,11)
      .replace(/^(\d{3})(\d)/,'$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/,'$1.$2.$3')
      .replace(/\.(\d{3})(\d{2})$/,'.$1-$2');
  if (tipo === 'RG')
    return n.slice(0,9)
      .replace(/^(\d{1,2})(\d)/,'$1.$2')
      .replace(/^(\d{1,2})\.(\d{3})(\d)/,'$1.$2.$3')
      .replace(/\.(\d{3})(\d)/,'.$1-$2');
  if (tipo === 'CNH') return n.slice(0,11);
  return valor;
};

// ---------- Estilos unificados para impressão (A4) ----------
const PRINT_STYLES = `
@page { size: A4; margin:12mm 12mm 14mm 12mm; }
body {
  margin:0;
  font-family:"Helvetica","Arial",sans-serif;
  font-size:10.2pt;
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
  color:#000;
}
.official-doc {
  width:186mm;
  margin:0 auto;
  line-height:1.25;
  box-sizing:border-box;
  background:#fff;
  position:relative;
}
.official-doc .doc-frame {
  border:1px solid #223;
  padding:9mm 9mm 7mm;
}
.official-doc h1 {
  font-size:15.5pt;
  letter-spacing:.5px;
  margin:0;
  font-weight:600;
}
.official-doc small { font-size:9pt; color:#222; }
.header-grid {
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; margin-bottom:5mm; border-bottom:2px solid #000; padding-bottom:6px;
}
.header-grid .logo-box { flex:0 0 90px; text-align:left; }
.header-grid img { max-height:68px; max-width:90px; }
.meta-box { text-align:right; font-size:8.8pt; line-height:1.2; }
.section-title {
  font-weight:600; font-size:9.8pt; letter-spacing:.4px;
  background:#f1f1f1; padding:4px 6px; border:1px solid #000;
  margin:12px 0 4px;
}
.table-block { width:100%; border-collapse:collapse; table-layout:fixed; font-size:9.9pt; background:#fff; }
.table-block th, .table-block td {
  border:1px solid #000; padding:3px 5px; vertical-align:top; word-wrap:break-word;
}
.table-block th {
  background:#f5f5f5; font-weight:600;
  -webkit-print-color-adjust:exact; print-color-adjust:exact;
}
.desc-cell { height:26mm; }
.just-cell { height:26mm; }
.signature-area {
  height:38mm; border:1px solid #000; margin-top:4px; position:relative;
}
.signature-label {
  position:absolute; left:0; bottom:4px; width:100%; text-align:center;
  font-size:8.5pt; letter-spacing:.4px;
}
@media screen {
  .official-doc { box-shadow:0 0 0 1px #ccc,0 4px 16px rgba(0,0,0,.08); margin-bottom:32px; }
}
@media print {
  .no-print { display:none !important; }
  .card, .card-body, .card-header, .btn, .form-control, .form-select { box-shadow:none !important; }
}
`;

// -------- Função que monta o HTML do documento (única fonte para impressão e PDF) --------
const buildDocumentHTML = (data: DevolucaoFormData, empresa: 'transpix' | 'transcompras') => {
  const blank = (v: string, p = '_______________') => (v ? v : p);
  return `
<div class="official-doc">
  <div class="doc-frame">
    <div class="header-grid">
      <div class="logo-box">
        <img src="${companyData[empresa].logo}" alt="${empresa}" />
      </div>
      <div style="text-align:center; flex:1">
        <h1>DEVOLUÇÃO DE MATERIAL</h1>
        <small>${companyData[empresa].razao}</small>
      </div>
      <div class="meta-box">
        <div><strong>Data:</strong> ${blank(data.data)}</div>
        <div><strong>Documento:</strong> DM-${new Date().getFullYear()}</div>
      </div>
    </div>

    <div class="section-title">REMETENTE</div>
    <table class="table-block">
      <tbody>
        <tr>
          <th style="width:55%">Razão Social</th>
          <th style="width:30%">Fone</th>
          <th style="width:15%">CEP</th>
        </tr>
        <tr>
          <td>${blank(data.remetente)}</td>
          <td>${blank(data.foneRem)}</td>
          <td>${blank(data.cepRem)}</td>
        </tr>
        <tr>
          <th colspan="3">Endereço</th>
        </tr>
        <tr>
          <td colspan="3">${blank(data.endRem)}</td>
        </tr>
         <tr>
          <th colspan="3">Responsável</th>
        </tr>
        <tr>
          <td colspan="3">${blank(data.respMinuta)}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">DESTINATÁRIO</div>
    <table class="table-block">
      <tbody>
        <tr>
          <th colspan="2">Nome</th>
          <th colspan="1">CEP</th>
        </tr>
        <tr>
          <td colspan="2">${blank(data.dest)}</td>
          <td colspan="1">${blank(data.cepDest)}</td>
        </tr>
        <tr>
          <th colspan="2">Logradouro</th>
          <th colspan="1">Nº</th>
        </tr>
        <tr>
          <td colspan="2">${blank(data.endDest)}</td>
          <td colspan="1">${blank(data.numDest,'__')}</td>
        </tr>
         <tr>
          <th colspan="2">Complemento</th>
          <th colspan="1">Bairro</th>
        </tr>
        <tr>
          <td colspan="2">${blank(data.complementoDest)}</td>
          <td colspan="1">${blank(data.bairroDest)}</td>
        </tr>
        <tr>
          <th colspan="2">Cidade</th>
          <th colspan="1">UF</th>
        </tr>
        <tr>
          <td colspan="2">${blank(data.cidadeDest)}</td>
          <td colspan="1">${blank(data.ufDest)}</td>
        </tr>
        <tr>
          <th colspan="2">Devolução autorizada por:</th>
          <th colspan="1">Contato</th>
        </tr>
        <tr>
          <td colspan="2">${blank(data.autorizado)}</td>
          <td colspan="1">${blank(data.foneDest)}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">DADOS DA OPERAÇÃO</div>
    <table class="table-block">
      <tbody>
        <tr>
          <th style="width:10%">Nº NF</th>
          <th style="width:10%">Qtd</th>
          <th style="width:10%">Peso (kg)</th>
          <th style="width:14%">Tipo Veículo</th>
          <th style="width:20%">Motorista</th>
          <th style="width:20%">Doc Motorista</th>
        </tr>
        <tr>
          <td>${blank(data.nf)}</td>
            <td>${blank(data.quantidade)}</td>
          <td>${blank(data.peso)}</td>
          <td>${blank(data.tipo)}</td>
          <td>${blank(data.motorista)}</td>
          <td>${data.docTipo ? data.docTipo + ': ' + blank(data.docNumero) : '—'}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">DESCRIÇÃO DO(S) MATERIAL(AIS)</div>
    <table class="table-block">
      <tbody>
        <tr>
          <td>${data.descricao ? data.descricao : ' '}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">JUSTIFICATIVA DA DEVOLUÇÃO</div>
    <table class="table-block">
      <tbody>
        <tr>
          <td>${data.justificativa ? data.justificativa : ' '}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">ASSINATURA / CARIMBO DO RESPONSÁVEL PELO RECEBIMENTO</div>
    <div class="signature-area">
      <div class="signature-label">Assinatura / Carimbo</div>
    </div>
  </div>
</div>
`;
};

// -------- Editor (ajustes: removido campo Motorista duplicado; agora fica em Operação) --------
interface EditorProps {
  data: DevolucaoFormData;
  setData: React.Dispatch<React.SetStateAction<DevolucaoFormData>>;
  onClear: () => void;
  empresa: 'transpix' | 'transcompras';
  setEmpresa: React.Dispatch<React.SetStateAction<'transpix' | 'transcompras'>>;
  respReadOnly: boolean;
}
const FormDevolucaoEditor: React.FC<EditorProps> = ({
  data, setData, onClear, empresa, setEmpresa, respReadOnly
}) => {
  const [showDoc, setShowDoc] = useState(false);
  const update = (f: keyof DevolucaoFormData, v: string) => setData(d => ({ ...d, [f]: v }));

  const handleCepDest = async (value: string) => {
    const masked = maskCEP(value);
    update('cepDest', masked);
    const numeric = unmask(masked);
    if (numeric.length === 8) {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${numeric}/json/`);
        const j = await r.json();
        if (!j.erro) {
          update('endDest', j.logradouro || '');
          update('bairroDest', j.bairro || '');
          update('cidadeDest', j.localidade || '');
          update('ufDest', (j.uf || '').toUpperCase());
        }
      } catch {}
    }
  };

  return (
  
      <div className="card-body bg-dark text-white">
        <form className="row g-3" onSubmit={e => e.preventDefault()}>
          {/* Remetente */}
          <div className="col-md-4">
            <label className="form-label">Empresa (Remetente)</label>
            <select
              className="form-select"
              value={empresa}
              onChange={e => setEmpresa(e.target.value as any)}
            >
              <option value="transpix">Transpix</option>
              <option value="transcompras">Transcompras</option>
            </select>
          </div>
          <div className="col-md-8">
            <label className="form-label">Razão Social</label>
            <input className="form-control" value={data.remetente} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label">Endereço</label>
            <input className="form-control" value={data.endRem} readOnly />
          </div>
          <div className="col-md-2">
            <label className="form-label">Nº</label>
            <input className="form-control" value={data.numRem} readOnly />
          </div>
          <div className="col-md-2">
            <label className="form-label">CEP</label>
            <input className="form-control" value={data.cepRem} readOnly />
          </div>
          <div className="col-md-2">
            <label className="form-label">Fone</label>
            <input className="form-control" value={data.foneRem} readOnly />
          </div>
          <div className="col-12">
            <label className="form-label">Responsavel pelo Documento</label>
            <input
              className="form-control"
              value={data.respMinuta}
              onChange={e => update('respMinuta', e.target.value)}
              readOnly={respReadOnly}
              style={respReadOnly ? { background: '#444' } : undefined}
            />
          </div>

          <hr className="text-secondary mt-4 mb-1" />

            {/* Destinatário */}
          <div className="col-md-6">
            <label className="form-label">Destinatário</label>
            <input
              className="form-control"
              value={data.dest}
              onChange={e => update('dest', e.target.value)}

            />
          </div>
          <div className="col-md-3">
            <label className="form-label">CEP</label>
            <input
              className="form-control"
              value={data.cepDest}
              onChange={e => handleCepDest(e.target.value)}
              maxLength={9}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Telefone</label>
            <input
              className="form-control"
              value={data.foneDest}
              onChange={e => update('foneDest', maskPhone(e.target.value))}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">Logradouro</label>
            <input
              className="form-control"
              value={data.endDest}
              onChange={e => update('endDest', e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Nº</label>
            <input
              className="form-control"
              value={data.numDest}
              onChange={e => update('numDest', onlyNumbers(e.target.value))}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">Complemento</label>
            <input
              className="form-control"
              value={data.complementoDest}
              onChange={e => update('complementoDest', e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Bairro</label>
            <input
              className="form-control"
              value={data.bairroDest}
              onChange={e => update('bairroDest', e.target.value)}
            />
          </div>
          <div className="col-md-5">
            <label className="form-label">Cidade</label>
            <input
              className="form-control"
              value={data.cidadeDest}
              onChange={e => update('cidadeDest', e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">UF</label>
            <input
              className="form-control text-uppercase"
              value={data.ufDest}
              maxLength={2}
              onChange={e => update('ufDest', e.target.value.toUpperCase())}
            />
          </div>

          <hr className="text-secondary mt-4 mb-1" />

          {/* Operação (Motorista + Doc aqui) */}
          <div className="col-md-3">
            <label className="form-label">Autorizado</label>
            <input
              className="form-control"
              value={data.autorizado}
              onChange={e => update('autorizado', e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Nº NF</label>
            <input
              className="form-control"
              value={data.nf}
              onChange={e => update('nf', onlyNumbers(e.target.value))}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Quantidade</label>
            <input
              className="form-control"
              value={data.quantidade}
              onChange={e => update('quantidade', onlyNumbers(e.target.value))}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Peso (kg)</label>
            <input
              className="form-control"
              value={data.peso}
              onChange={e => update('peso', maskPeso(e.target.value))}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Data</label>
            <input className="form-control" value={data.data} readOnly style={{ background:'#444' }} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Motorista</label>
            <input
              className="form-control"
              value={data.motorista}
              onChange={e => update('motorista', e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-info"
              onClick={() => setShowDoc(s => !s)}
            >
              {showDoc ? 'Remover Documento' : 'Adicionar Documento do Motorista'}
            </button>
          </div>

          {showDoc && (
            <>
              <div className="col-md-3">
                <label className="form-label">Tipo Doc.</label>
                <select
                  className="form-select"
                  value={data.docTipo}
                  onChange={e => update('docTipo', e.target.value as any)}
                >
                  <option value="">Selecione</option>
                  <option value="RG">RG</option>
                  <option value="CPF">CPF</option>
                  <option value="CNH">CNH</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Número Doc.</label>
                <input
                  className="form-control"
                  value={data.docNumero}
                  onChange={e => update('docNumero', maskDoc(data.docTipo, e.target.value))}
                  disabled={!data.docTipo}
                />
              </div>
            </>
          )}

          <div className="col-12">
            <label className="form-label d-block">Tipo (Veículo)</label>
            {(['frota','agregado','terceiro'] as const).map(t => (
              <div className="form-check form-check-inline" key={t}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="tipo"
                  id={`tipo-${t}`}
                  value={t}
                  checked={data.tipo === t}
                  onChange={() => update('tipo', t)}
                />
                <label className="form-check-label" htmlFor={`tipo-${t}`}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Descrição / Justificativa (menor altura no doc final) */}
          <div className="col-12">
            <label className="form-label">Descrição do(s) Material(is)</label>
            <textarea
              className="form-control"
              rows={3}
              value={data.descricao}
              onChange={e => update('descricao', e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Justificativa da Devolução</label>
            <textarea
              className="form-control"
              rows={3}
              value={data.justificativa}
              onChange={e => update('justificativa', e.target.value)}
            />
          </div>
        </form>

        {/* Botões abaixo do formulário */}
        <div className="d-flex gap-2 mt-4">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClear}>
            Limpar
          </button>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => window.dispatchEvent(new CustomEvent('PRINT_DOC'))}>
            Imprimir
          </button>
        </div>
      </div>
  );
};

// -------- Principal (sem Preview) --------
const FormDevolucaoA: React.FC<{ loggedUser?: LoggedUser | null }> = ({ loggedUser }) => {
  const initialFormState: DevolucaoFormData = {
    remetente: '', endRem: '', numRem: '', cepRem: '', foneRem: '',
    respMinuta: '', dest: '', cepDest: '', endDest: '', complementoDest: '',
    numDest: '', bairroDest: '', cidadeDest: '', ufDest: '', foneDest: '',
    autorizado: '', nf: '', quantidade: '', peso: '', data: getTodayFormatted(),
    motorista: '', docTipo: '', docNumero: '', tipo: '', descricao: '',
    justificativa: '', assinatura: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [empresa, setEmpresa] = useState<'transpix' | 'transcompras'>('transpix');

  // Preenche remetente
  useEffect(() => {
    const c = companyData[empresa];
    setForm(f => ({ ...f,
      remetente: c.razao, endRem: c.endereco, numRem: c.numero,
      cepRem: c.cep, foneRem: c.fone
    }));
  }, [empresa]);

  // Responsável
  useEffect(() => {
    if (loggedUser?.nome_completo && !form.respMinuta.trim()) {
      setForm(f => ({ ...f, respMinuta: loggedUser.nome_completo }));
    }
  }, [loggedUser, form.respMinuta]);

  // Data automática
  useEffect(() => {
    const id = setInterval(() =>
      setForm(f => ({ ...f, data: getTodayFormatted() })), 60_000);
    return () => clearInterval(id);
  }, []);

  const clearAll = () => {
    if (!window.confirm('Limpar todos os campos?')) return;
    const c = companyData[empresa];
    setForm({
      ...initialFormState,
      remetente: c.razao,
      endRem: c.endereco,
      numRem: c.numero,
      cepRem: c.cep,
      foneRem: c.fone,
      respMinuta: loggedUser?.nome_completo || '',
      data: getTodayFormatted()
    });
  };

  // Imprimir (usa HTML gerado)
  const imprimir = () => {
    const html = buildDocumentHTML(form, empresa);
    const win = window.open('', '_blank', 'width=1024,height=1400');
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Devolução de Material - Impressão</title>
          <style>${PRINT_STYLES}</style>
        </head>
        <body>${html}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    const imgs = win.document.images;
    if (imgs.length) {
      let loaded = 0;
      const done = () => { if (loaded === imgs.length) win.print(); };
      for (let i = 0; i < imgs.length; i++) {
        const im = imgs[i];
        if (im.complete) { loaded++; done(); }
        else {
          im.onload = () => { loaded++; done(); };
          im.onerror = () => { loaded++; done(); };
        }
      }
    } else {
      win.print();
    }
  };


  // Eventos globais para botões dentro do editor
  useEffect(() => {
    const pHandler = () => imprimir();
    window.addEventListener('PRINT_DOC', pHandler as EventListener);
    return () => {
      window.removeEventListener('PRINT_DOC', pHandler as EventListener);
    };
  });

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 no-print">
        <div className="d-flex align-items-center gap-3">
          <img
            src={companyData[empresa].logo}
            alt={empresa}
            style={{ maxHeight: 56 }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <h4 className="m-0">Devolução de Material</h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={clearAll}>Limpar</button>
        </div>
      </div>

      <FormDevolucaoEditor
        data={form}
        setData={setForm}
        onClear={clearAll}
        empresa={empresa}
        setEmpresa={setEmpresa}
        respReadOnly={!!loggedUser?.nome_completo}
      />
    </div>
  );
};

export default FormDevolucaoA;