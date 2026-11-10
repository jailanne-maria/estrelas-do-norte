/* =====================================================================
   ESTRELAS DO N✦RTE — indicações do público
   ---------------------------------------------------------------------
   As indicações passam por curadoria antes de virarem estrelas.
   No modo 'local' elas ficam neste navegador (ótimo para demonstrar).
   Em produção, configure MODO_ENVIO: 'endpoint' no config.js e aponte
   ENDPOINT_INDICACOES para um serviço que grave com status "pendente".
   ===================================================================== */

(function () {
  'use strict';

  const CHAVE = 'estrelas-do-norte:indicacoes';
  const LIMITE = 200;

  function ler() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      return [];
    }
  }

  function salvar(lista) {
    const recorte = lista.slice(0, LIMITE);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(recorte));
    } catch (erro) {
      /* Armazenamento cheio ou bloqueado: o envio local não é essencial. */
    }
    return recorte;
  }

  function gerarId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'ind-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function limparTexto(valor, tamanho) {
    return String(valor == null ? '' : valor).trim().slice(0, tamanho);
  }

  function normalizar(dados) {
    return {
      id: gerarId(),
      nome: limparTexto(dados.nome, 120),
      local: limparTexto(dados.local, 120),
      area: limparTexto(dados.area, 60),
      link: limparTexto(dados.link, 300),
      motivo: limparTexto(dados.motivo, 1200),
      indicador: limparTexto(dados.indicador, 120),
      contato: limparTexto(dados.contato, 160),
      consentimento: Boolean(dados.consentimento),
      origem: limparTexto(dados.origem, 500),
      status: 'pendente',
      criadoEm: new Date().toISOString(),
    };
  }

  async function enviar(dados) {
    const config = window.ESTRELAS_CONFIG || {};
    const registro = normalizar(dados);
    const firebaseDisponivel =
      config.MODO_ENVIO === 'firebase' &&
      typeof firebase !== 'undefined' &&
      window.FirebaseIndicacoes &&
      window.FirebaseIndicacoes.configurado();

    if (firebaseDisponivel) {
      await window.FirebaseIndicacoes.salvar(registro);
      return { ok: true, modo: 'firebase', registro };
    }

    const host = String(location.hostname || '').toLowerCase();
    const netlifyDisponivel =
      config.MODO_ENVIO === 'netlify' &&
      typeof fetch === 'function' &&
      /^https?:$/.test(location.protocol) &&
      host !== 'localhost' &&
      host !== '127.0.0.1' &&
      host !== '0.0.0.0';

    if (netlifyDisponivel) {
      const corpo = new URLSearchParams();
      corpo.append('form-name', 'indicacoes');
      corpo.append('nome', registro.nome);
      corpo.append('local', registro.local);
      corpo.append('area', registro.area);
      corpo.append('link', registro.link);
      corpo.append('motivo', registro.motivo);
      corpo.append('indicador', registro.indicador);
      corpo.append('contato', registro.contato);
      corpo.append('consentimento', registro.consentimento ? 'sim' : 'nao');
      corpo.append('origem', registro.origem);

      const resposta = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: corpo.toString(),
      });
      if (!resposta.ok) {
        throw new Error('O Netlify Forms respondeu com erro.');
      }
      return { ok: true, modo: 'netlify', registro };
    }

    if (config.MODO_ENVIO === 'endpoint') {
      if (!config.ENDPOINT_INDICACOES) {
        throw new Error('O endpoint de indicações ainda não foi configurado.');
      }
      const resposta = await fetch(config.ENDPOINT_INDICACOES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro),
      });
      if (!resposta.ok) {
        throw new Error('O serviço de indicações respondeu com erro.');
      }
      return { ok: true, modo: 'endpoint', registro };
    }

    const lista = ler();
    lista.unshift(registro);
    salvar(lista);
    return { ok: true, modo: 'local', registro };
  }

  function listar() {
    return ler().slice().sort(function (a, b) {
      return String(b.criadoEm).localeCompare(String(a.criadoEm));
    });
  }

  function atualizarStatus(id, status) {
    const lista = ler();
    const item = lista.find(function (registro) {
      return registro.id === id;
    });
    if (!item) return null;
    item.status = status;
    item.analisadoEm = new Date().toISOString();
    salvar(lista);
    return item;
  }

  function remover(id) {
    const lista = ler().filter(function (registro) {
      return registro.id !== id;
    });
    salvar(lista);
    return lista;
  }

  function limpar() {
    try {
      localStorage.removeItem(CHAVE);
    } catch (erro) {
      /* ignora */
    }
  }

  function exportar() {
    return JSON.stringify(
      {
        projeto: 'Estrelas do N✦RTE',
        versao: 1,
        exportadoEm: new Date().toISOString(),
        indicacoes: listar(),
      },
      null,
      2
    );
  }

  window.Indicacoes = {
    enviar: enviar,
    listar: listar,
    atualizarStatus: atualizarStatus,
    remover: remover,
    limpar: limpar,
    exportar: exportar,
  };
})();
