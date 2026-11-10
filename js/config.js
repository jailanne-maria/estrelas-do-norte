/* =====================================================================
   ESTRELAS DO N✦RTE — configuração do projeto
   Edite este arquivo para ligar o cenário, o envio de indicações etc.
   ===================================================================== */

window.ESTRELAS_CONFIG = {
  /* Enquanto MODO_DEMO for true, a gaveta mostra uma faixa discreta de
     "prévia" e o formulário avisa que as indicações ficaram no navegador.
     Troque para false quando os dados reais estiverem no ar. */
  MODO_DEMO: false,

  /* Como as indicações do público são enviadas:
     - 'firebase' → grava no Firestore (grátis no plano Spark); a curadoria
                    lê no console do Firebase. É o modo recomendado aqui.
     - 'local'    → salva no localStorage deste navegador (demonstração)
     - 'netlify'  → alternativa com Netlify Forms; grátis até 100/mês
     - 'endpoint' → faz POST JSON para ENDPOINT_INDICACOES
     Configure a chave do Firebase em js/firebase-config.js. Enquanto ela
     estiver vazia, o formulário cai no modo local para você testar. */
  MODO_ENVIO: 'firebase',
  ENDPOINT_INDICACOES: '',

  /* Cena em canvas. A resolução interna é calculada dividindo a tela por
     estes valores: quanto menor o número, menores os pixels.
     Desktop 2 = pixels de 2px; mobile 2 = pixels de 2px. */
  CENA: {
    escalaDesktop: 2,
    escalaMobile: 2,
    derivaAutomatica: 0.022,
  },

  /* Assets opcionais no estilo "misto": céu procedural + arte no horizonte
     e no barco. Deixe vazio para usar as silhuetas desenhadas em código.
     Exemplos:
       horizonte: 'assets/cenario/horizonte.png'  (PNG largo/transparente)
       barco:     'assets/cenario/barco.png'      (PNG transparente)
     Se os arquivos não existirem, a cena segue com o desenho procedural. */
  ASSETS: {
    horizonte: '',
    barco: '',
  },
};
