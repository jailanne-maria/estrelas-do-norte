/* =====================================================================
   ESTRELAS DO N✦RTE — configuração do Firebase
   ---------------------------------------------------------------------
   Cole aqui a configuração do app Web criado no Firebase:
   Console do Firebase → Configurações do projeto → Seus apps → Web.

   A configuração é pública (aparece no navegador). A proteção dos dados
   fica nas regras do Firestore (firestore.rules): o público só pode
   CRIAR uma indicação; ninguém lê, edita ou apaga pelo site.
   ===================================================================== */

window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCUcsN7rL8XftSSU9JVA6lnCyymyTv8q74',
  authDomain: 'estrelas-do-norte.firebaseapp.com',
  projectId: 'estrelas-do-norte',
  storageBucket: 'estrelas-do-norte.firebasestorage.app',
  messagingSenderId: '544966446678',
  appId: '1:544966446678:web:c71ec0a8d0930712bef5f7',
  measurementId: 'G-C5SBL92R9E',
};

(function () {
  'use strict';

  function configurado() {
    const config = window.FIREBASE_CONFIG || {};
    return Boolean(config.apiKey && config.projectId && config.appId);
  }

  async function salvar(registro) {
    if (typeof firebase === 'undefined') {
      throw new Error('O SDK do Firebase não carregou.');
    }
    if (!configurado()) {
      throw new Error('O Firebase ainda não foi configurado.');
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(window.FIREBASE_CONFIG);
    }

    const db = firebase.firestore();
    const dados = {
      nome: registro.nome,
      local: registro.local,
      area: registro.area,
      link: registro.link,
      motivo: registro.motivo,
      indicador: registro.indicador,
      contato: registro.contato,
      consentimento: registro.consentimento,
      origem: registro.origem,
      status: 'pendente',
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      criadoEmIso: registro.criadoEm,
    };

    await db.collection('indicacoes').add(dados);
    return dados;
  }

  window.FirebaseIndicacoes = {
    configurado: configurado,
    salvar: salvar,
  };
})();
