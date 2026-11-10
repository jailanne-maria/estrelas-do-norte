/* =====================================================================
   ESTRELAS DO N✦RTE — cena em canvas
   Céu procedural inspirado nos redemoinhos de Van Gogh, rio com reflexos,
   horizonte ribeirinho, bandeira do Acre e a vista de dentro do barco.
   ===================================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('cena');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const CONFIG = window.ESTRELAS_CONFIG || {};
  const CFG_CENA = CONFIG.CENA || {};
  const TAU = Math.PI * 2;

  const P_CEU = 0.1;
  const P_ESTRELA = 0.8;
  const P_CENARIO = 0.62;
  const P_AGUA = 0.8;

  let L = 640;
  let A = 360;
  let HORIZONTE = 236;
  let MUNDO = 3328;
  let escala = 3;

  let cameraX = 0;
  let cameraSuave = null;
  let tempo = 0;
  let ultimo = performance.now();
  let intro = true;
  let pausado = false;
  let arrastando = false;
  let arrastou = false;
  let ultimoPX = 0;
  let inicioPX = 0;

  let hoverId = null;
  let selecionadoId = null;
  let mostrarNomes = false;
  let reduzido = false;

  let texturaCeu = null;
  let offsetCeu = 0;
  let redemoinhosCeu = [];
  let luaCeu = null;

  let estrelas = [];
  let estrelasDecor = [];
  let estrelasTela = [];
  let cenario = [];
  let cenarioDistante = [];
  let ondas = [];
  let vagalumes = [];
  let meteoros = [];
  let proximoMeteoro = 9;

  let assets = { horizonte: null, barco: null };

  const teclas = { esq: false, dir: false };
  const mouse = { x: -999, y: -999, ativo: false };

  const elTooltip = document.getElementById('tooltip-estrela');
  const elTooltipNome = document.getElementById('tooltip-nome');
  const elTooltipInfo = document.getElementById('tooltip-info');

  /* ===== utilitários ===== */

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let h = 2166136261;
    const texto = String(str);
    for (let i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function campo(parallax) {
    return L + (MUNDO - L) * parallax;
  }

  function sxDe(s, parallax) {
    return s * campo(parallax) - cameraX * parallax;
  }

  function corDaArea(area) {
    return window.corDaArea ? window.corDaArea(area) : '#ffd21f';
  }

  function hexParaRgba(hex, alfa) {
    let h = String(hex || '#ffd21f').replace('#', '');
    if (h.length === 3) {
      h = h
        .split('')
        .map(function (c) {
          return c + c;
        })
        .join('');
    }
    const n = parseInt(h, 16);
    if (!Number.isFinite(n)) return 'rgba(255,210,31,' + alfa + ')';
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alfa + ')';
  }

  function medirTela() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const base = w < 760 ? CFG_CENA.escalaMobile || 2 : CFG_CENA.escalaDesktop || 3;
    escala = Math.max(base, w / 1000, h / 720);

    L = Math.max(180, Math.round(w / escala));
    A = Math.max(280, Math.round(h / escala));

    canvas.width = L;
    canvas.height = A;
    ctx.imageSmoothingEnabled = false;

    HORIZONTE = Math.round(A * 0.72);
    MUNDO = Math.round(L * 5.2);
    cameraX = clamp(cameraX, 0, Math.max(0, MUNDO - L));

    gerarCeu();
    gerarCenario();
    posicionarEstrelas();
    gerarOndas();
    gerarVagalumes();
  }

  /* ===== céu procedural ===== */

  function desenharRedemoinho(g, cx, cy, raio, voltas, rand) {
    const paleta = ['#1b4b8a', '#2e6db4', '#3f7fbe', '#5b9bd5', '#7fb4de', '#a8d0ee', '#dff0ff'];
    const halo = g.createRadialGradient(cx, cy, 0, cx, cy, raio * 1.18);
    halo.addColorStop(0, 'rgba(130,190,235,0.14)');
    halo.addColorStop(0.6, 'rgba(60,120,190,0.07)');
    halo.addColorStop(1, 'rgba(10,30,60,0)');
    g.fillStyle = halo;
    g.beginPath();
    g.arc(cx, cy, raio * 1.18, 0, TAU);
    g.fill();

    const giro = voltas * 1.35;
    const passos = Math.max(120, Math.round(raio * 3.2));

    for (let i = 0; i < passos; i++) {
      const t = i / passos;
      const ang = t * TAU * giro + (rand() - 0.5) * 0.22;
      const rr = raio * (0.06 + t * 0.94);
      const x = cx + Math.cos(ang) * rr;
      const y = cy + Math.sin(ang) * rr * 0.62;
      const comp = raio * (0.08 + rand() * 0.16);
      g.strokeStyle = paleta[(rand() * paleta.length) | 0];
      g.globalAlpha = 0.12 + rand() * 0.3;
      g.lineWidth = Math.max(1, raio * (0.022 + rand() * 0.022));
      g.beginPath();
      g.arc(x, y, comp, ang + 0.9, ang + 2.3);
      g.stroke();
    }

    for (let j = 0; j < 4; j++) {
      const desloc = rand() * TAU;
      g.strokeStyle = paleta[(rand() * paleta.length) | 0];
      g.globalAlpha = 0.1 + rand() * 0.16;
      g.lineWidth = Math.max(1, raio * 0.028);
      g.beginPath();
      for (let i = 0; i <= passos; i++) {
        const t = i / passos;
        const ang = t * TAU * giro + desloc;
        const rr = raio * (0.08 + t * 0.92) + j * raio * 0.025;
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang) * rr * 0.62;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  function gerarCeu() {
    const tw = Math.max(560, Math.round(L * 2.2));
    const th = Math.max(80, HORIZONTE);
    texturaCeu = document.createElement('canvas');
    texturaCeu.width = tw;
    texturaCeu.height = th;
    const g = texturaCeu.getContext('2d');
    const rand = mulberry32(hashString('ceu-' + tw + '-' + th));
    const cores = ['#1b4b8a', '#2e6db4', '#3f7fbe', '#5b9bd5', '#7fb4de', '#a8d0ee', '#dff0ff', '#123a63'];

    const grad = g.createLinearGradient(0, 0, 0, th);
    grad.addColorStop(0, '#030718');
    grad.addColorStop(0.3, '#071b3d');
    grad.addColorStop(0.58, '#0b2f5a');
    grad.addColorStop(0.82, '#144a73');
    grad.addColorStop(1, '#1d647e');
    g.fillStyle = grad;
    g.fillRect(0, 0, tw, th);

    const brilho = g.createLinearGradient(0, th * 0.5, 0, th);
    brilho.addColorStop(0, 'rgba(38,120,150,0)');
    brilho.addColorStop(1, 'rgba(45,160,170,0.26)');
    g.fillStyle = brilho;
    g.fillRect(0, th * 0.5, tw, th * 0.5);

    g.lineCap = 'round';

    const linhas = Math.max(24, Math.round(tw / 18));
    for (let i = 0; i < linhas; i++) {
      const y0 = rand() * th;
      const amp = 2 + rand() * Math.min(18, th * 0.09);
      const comp = 80 + rand() * Math.min(240, tw * 0.24);
      const x0 = rand() * tw;
      const fase = rand() * TAU;
      g.strokeStyle = cores[(rand() * cores.length) | 0];
      g.globalAlpha = 0.05 + rand() * 0.14;
      g.lineWidth = 1 + rand() * 1.5;
      g.beginPath();
      for (let x = 0; x <= comp; x += 4) {
        const y = y0 + Math.sin((x / comp) * TAU * 1.4 + fase) * amp * (1 - (x / comp) * 0.35);
        if (x === 0) g.moveTo(x0 + x, y);
        else g.lineTo(x0 + x, y);
      }
      g.stroke();
    }

    const pinceladas = Math.round((tw * th) / 850);
    for (let i = 0; i < pinceladas; i++) {
      const x = rand() * tw;
      const y = rand() * th;
      const ang = -0.5 + rand() * 1.2;
      const comp = 2.5 + rand() * 9;
      g.strokeStyle = cores[(rand() * cores.length) | 0];
      g.globalAlpha = 0.04 + rand() * 0.14;
      g.lineWidth = Math.max(1, 1 + rand() * 2);
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(
        x + Math.cos(ang) * comp * 0.5,
        y + Math.sin(ang) * comp * 0.35 - comp * 0.12,
        x + Math.cos(ang) * comp,
        y + Math.sin(ang) * comp * 0.6
      );
      g.stroke();
    }

    redemoinhosCeu = [];
    const qtd = Math.max(5, Math.round(tw / 200));
    for (let i = 0; i < qtd; i++) {
      const cx = ((i + 0.5) / qtd) * tw + (rand() - 0.5) * tw * 0.09;
      const cy = th * (0.14 + rand() * 0.6);
      const raio = th * (0.12 + rand() * 0.18);
      desenharRedemoinho(g, cx, cy, raio, 1.1 + rand() * 1.0, rand);
      redemoinhosCeu.push({ x: cx, y: cy, r: raio, fase: rand() * TAU });
    }

    const grande = {
      x: tw * 0.52,
      y: th * 0.42,
      r: th * 0.31,
    };
    desenharRedemoinho(g, grande.x, grande.y, grande.r, 1.5, rand);
    redemoinhosCeu.push({ x: grande.x, y: grande.y, r: grande.r, fase: rand() * TAU });

    luaCeu = { s: 0.5, y: th * 0.23, r: Math.min(th * 0.19, tw * 0.085) };

    const pontos = Math.round((tw * th) / 950);
    for (let i = 0; i < pontos; i++) {
      const x = rand() * tw;
      const y = rand() * th * 0.95;
      g.globalAlpha = 0.12 + rand() * 0.55;
      g.fillStyle = rand() > 0.9 ? '#ffe9a3' : '#d8ecff';
      const s = rand() > 0.94 ? 2 : 1;
      g.fillRect(x | 0, y | 0, s, s);
    }
    g.globalAlpha = 1;
  }

  function desenharLua(x, y, r) {
    const pulso = reduzido ? 0 : 0.03 * Math.sin(tempo * 0.9);
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
    halo.addColorStop(0, 'rgba(255,235,150,' + (0.4 + pulso) + ')');
    halo.addColorStop(0.3, 'rgba(255,210,31,0.18)');
    halo.addColorStop(1, 'rgba(245,180,30,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, TAU);
    ctx.fill();

    for (let i = 0; i < 40; i++) {
      const t = i / 40;
      const ang = t * TAU * 1.2 + (reduzido ? 0 : Math.sin(tempo * 0.3) * 0.2);
      const rr = r * (0.18 + t * 0.82);
      const comp = r * (0.16 + ((i * 37) % 17) / 17 * 0.16);
      ctx.strokeStyle = ['#f5b700', '#ffd21f', '#ffe9a3', '#fff8e7'][i % 4];
      ctx.globalAlpha = 0.13 + (i % 5) * 0.035 + (reduzido ? 0 : 0.02 * Math.sin(tempo + i));
      ctx.lineWidth = Math.max(1, Math.round(r * 0.042));
      ctx.beginPath();
      ctx.arc(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr * 0.85, comp, ang, ang + 0.9);
      ctx.stroke();
    }

    const core = ctx.createRadialGradient(x, y, 0, x, y, r * 0.32);
    core.addColorStop(0, 'rgba(255,248,231,0.9)');
    core.addColorStop(0.55, 'rgba(255,225,110,0.5)');
    core.addColorStop(1, 'rgba(255,210,31,0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.32, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function desenharCeu() {
    if (!texturaCeu) return;
    const tw = texturaCeu.width;
    let ox = (-cameraX * P_CEU) % tw;
    if (ox > 0) ox -= tw;
    offsetCeu = ox;

    ctx.drawImage(texturaCeu, Math.round(ox), 0);
    ctx.drawImage(texturaCeu, Math.round(ox + tw), 0);

    if (!reduzido) {
      const sh = Math.sin(tempo * 0.25) * 6;
      const sy = Math.sin(tempo * 0.15) * 2;
      ctx.globalAlpha = 0.05 + 0.03 * Math.sin(tempo * 0.6);
      ctx.drawImage(texturaCeu, Math.round(ox + sh), sy);
      ctx.drawImage(texturaCeu, Math.round(ox + tw + sh), sy);
      ctx.globalAlpha = 1;
    }

    if (!reduzido && redemoinhosCeu.length) {
      for (let k = 0; k < Math.min(3, redemoinhosCeu.length); k++) {
        const r = redemoinhosCeu[k];
        let x = r.x + ox;
        if (x < -r.r * 2) x += tw;
        if (x > L + r.r * 2) continue;
        const ang = tempo * 0.25 + r.fase;
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#b8dcf5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, r.y, r.r * 0.55, ang, ang + 1.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, r.y, r.r * 0.8, ang + Math.PI, ang + Math.PI + 0.9);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    if (luaCeu) {
      const x = sxDe(luaCeu.s, P_CEU);
      if (x > -luaCeu.r * 3 && x < L + luaCeu.r * 3) {
        desenharLua(x, luaCeu.y, luaCeu.r);
      }
    }
  }

  /* ===== estrelas ===== */

  function posicionarEstrelas() {
    const lista = Array.isArray(window.ARTISTAS) ? window.ARTISTAS : [];
    const n = Math.max(1, lista.length);

    estrelas = lista.map(function (artista, i) {
      const rand = mulberry32(hashString(artista.id || artista.nome || String(i)));
      const ceu = artista.ceu || {};
      const s = Number.isFinite(ceu.x) ? ceu.x : (i + 0.5) / n + (rand() - 0.5) * 0.02;
      const ySequencia = (i * 0.61803398875 + 0.23) % 1;
      const y = Number.isFinite(ceu.y)
        ? ceu.y * HORIZONTE
        : HORIZONTE * (0.14 + ySequencia * 0.58);
      return {
        artista: artista,
        s: clamp(s, 0.02, 0.98),
        y: clamp(y, HORIZONTE * 0.08, HORIZONTE * 0.84),
        fase: rand() * TAU,
        raio: (2.4 + rand() * 1.5) * clamp(A / 300, 0.8, 2),
      };
    });

    const rand = mulberry32(hashString('decor-' + L + '-' + HORIZONTE));
    estrelasDecor = [];
    const qtd = Math.round(L * 0.24);
    for (let i = 0; i < qtd; i++) {
      estrelasDecor.push({
        s: rand(),
        y: rand() * HORIZONTE * 0.94,
        r: rand() > 0.9 ? 2 : 1,
        cor: rand() > 0.85 ? '#ffe9a3' : '#d8ecff',
        fase: rand() * TAU,
        vel: 0.5 + rand() * 1.5,
      });
    }
  }

  function desenharEstrelasDecor() {
    for (let i = 0; i < estrelasDecor.length; i++) {
      const e = estrelasDecor[i];
      const x = sxDe(e.s, P_ESTRELA);
      if (x < -4 || x > L + 4) continue;
      const b = 0.42 + 0.58 * Math.abs(Math.sin(tempo * e.vel + e.fase));
      ctx.globalAlpha = b * 0.72;
      ctx.fillStyle = e.cor;
      ctx.fillRect(Math.round(x), Math.round(e.y), e.r, e.r);
      if (e.r > 1.4) {
        ctx.globalAlpha = b * 0.4;
        ctx.fillRect(Math.round(x - 1), Math.round(e.y + 0.5), 1, 1);
        ctx.fillRect(Math.round(x + 2), Math.round(e.y + 0.5), 1, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  function desenharRotulo(x, y, nome) {
    const fonte = Math.max(6, Math.round(A * 0.022));
    ctx.font = fonte + 'px "VT323", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const largura = ctx.measureText(nome).width + 7;
    const altura = fonte + 4;
    ctx.fillStyle = 'rgba(4,8,20,0.8)';
    ctx.fillRect(Math.round(x - largura / 2), Math.round(y - altura), Math.round(largura), Math.round(altura));
    ctx.fillStyle = '#fff3b0';
    ctx.fillText(nome, x, y - 1);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  function desenharConstelacao() {
    if (!mostrarNomes) return;
    const ordenadas = estrelas.slice().sort(function (a, b) {
      return a.s - b.s;
    });

    ctx.save();
    ctx.strokeStyle = 'rgba(255,210,31,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    let iniciou = false;
    for (let i = 0; i < ordenadas.length; i++) {
      const e = ordenadas[i];
      const x = sxDe(e.s, P_ESTRELA);
      if (x < -80 || x > L + 80) {
        iniciou = false;
        continue;
      }
      if (!iniciou) {
        ctx.moveTo(x, e.y);
        iniciou = true;
      } else {
        ctx.lineTo(x, e.y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    for (let i = 0; i < ordenadas.length; i++) {
      const e = ordenadas[i];
      const x = sxDe(e.s, P_ESTRELA);
      if (x < -60 || x > L + 60) continue;
      desenharRotulo(x, e.y - e.raio * 3 - 4, e.artista.nome);
    }
  }

  function desenharEstrelaPixel(x, y, raio, cor) {
    const alcance = Math.max(3, Math.round(raio * 2.6));
    const grossura = Math.max(1, raio * 0.55);
    const px = Math.round(x);
    const py = Math.round(y);

    for (let i = 0; i < alcance; i++) {
      const largura = Math.max(1, Math.round(grossura * (1 - (i / alcance) * 0.85)));
      const desloc = Math.floor(largura / 2);
      ctx.fillStyle = i > alcance * 0.52 ? cor : '#fffdf8';
      ctx.fillRect(px - desloc, py - i, largura, 1);
      ctx.fillRect(px - desloc, py + i, largura, 1);
      ctx.fillRect(px - i, py - desloc, 1, largura);
      ctx.fillRect(px + i, py - desloc, 1, largura);
    }

    const centro = Math.max(2, Math.round(raio * 0.9));
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(px - Math.floor(centro / 2), py - Math.floor(centro / 2), centro, centro);

    const diagonal = Math.round(raio * 1.55);
    const ponto = Math.max(1, Math.round(raio * 0.38));
    ctx.fillStyle = cor;
    ctx.fillRect(px - diagonal, py - diagonal, ponto, ponto);
    ctx.fillRect(px + diagonal - ponto, py - diagonal, ponto, ponto);
    ctx.fillRect(px - diagonal, py + diagonal - ponto, ponto, ponto);
    ctx.fillRect(px + diagonal - ponto, py + diagonal - ponto, ponto, ponto);
  }

  function desenharEstrelasArtistas() {
    estrelasTela = [];
    for (let i = 0; i < estrelas.length; i++) {
      const e = estrelas[i];
      const x = sxDe(e.s, P_ESTRELA);
      const y = e.y;
      if (x < -e.raio * 7 || x > L + e.raio * 7) continue;

      const cor = corDaArea(e.artista.area);
      const ativo = hoverId === e.artista.id || selecionadoId === e.artista.id;
      const brilho = reduzido ? 0.85 : 0.62 + 0.38 * (0.5 + 0.5 * Math.sin(tempo * 1.7 + e.fase));
      const raio = e.raio * (ativo ? 1.45 : 1) * (0.9 + 0.1 * brilho);

      const halo = ctx.createRadialGradient(x, y, 0, x, y, raio * 4.2);
      halo.addColorStop(0, hexParaRgba(cor, 0.55 * brilho));
      halo.addColorStop(0.35, hexParaRgba(cor, 0.18));
      halo.addColorStop(1, hexParaRgba(cor, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, raio * 4.2, 0, TAU);
      ctx.fill();

      if (ativo) {
        ctx.save();
        ctx.strokeStyle = hexParaRgba(cor, 0.7);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.arc(x, y, raio * 3.2, tempo * 0.4, tempo * 0.4 + TAU);
        ctx.stroke();
        ctx.restore();
      }

      desenharEstrelaPixel(x, y, raio, cor);

      estrelasTela.push({
        id: e.artista.id,
        artista: e.artista,
        x: x,
        y: y,
        raio: Math.max(raio * 3.5, 18),
      });
    }
  }

  /* ===== horizonte e cenário ===== */

  function gerarCenario() {
    const rand = mulberry32(hashString('cenario-' + L + '-' + HORIZONTE));
    cenario = [];
    const larguraCampo = campo(P_CENARIO);
    const esc = Math.max(0.55, Math.min(L / 640, A / 360));
    const passo = Math.max(22, Math.round(HORIZONTE * 0.13));

    for (let x = 0; x < larguraCampo; x += passo) {
      const s = x / larguraCampo;
      const sorte = rand();
      if (sorte < 0.38) {
        cenario.push({
          tipo: 'casa',
          s: s,
          w: (16 + rand() * 34) * esc,
          h: (8 + rand() * 20) * esc,
          janela: rand() > 0.58,
          seed: (rand() * 1e6) | 0,
        });
      } else if (sorte < 0.83) {
        cenario.push({
          tipo: 'arvore',
          s: s,
          w: (10 + rand() * 20) * esc,
          h: (14 + rand() * 30) * esc,
          seed: (rand() * 1e6) | 0,
        });
      } else {
        cenario.push({
          tipo: 'mato',
          s: s,
          w: (7 + rand() * 14) * esc,
          h: (5 + rand() * 11) * esc,
        });
      }
    }

    cenario.push({ tipo: 'bandeira', s: 0.22 });

    cenarioDistante = [];
    const randD = mulberry32(hashString('distante-' + L + '-' + HORIZONTE));
    const larguraDist = campo(P_CENARIO * 0.82);
    const passoD = Math.max(26, Math.round(HORIZONTE * 0.17));
    for (let x = 0; x < larguraDist; x += passoD) {
      cenarioDistante.push({
        s: x / larguraDist,
        w: (26 + randD() * 54) * esc,
        h: (5 + randD() * 15) * esc,
      });
    }
  }

  function desenharCasa(g, x, baseY, w, h, janela, seed) {
    const rand = mulberry32(seed);
    const topo = baseY - h;
    g.fillStyle = '#03060d';
    g.fillRect(Math.round(x), Math.round(topo), Math.round(w), Math.round(h + 2));

    g.beginPath();
    g.moveTo(x - w * 0.14, topo + 1);
    g.lineTo(x + w * 0.5, topo - h * 0.38);
    g.lineTo(x + w * 1.14, topo + 1);
    g.closePath();
    g.fill();

    if (janela) {
      g.fillStyle = 'rgba(255,210,31,0.55)';
      const jw = Math.max(1, Math.round(w * 0.12));
      g.fillRect(Math.round(x + w * 0.3), Math.round(topo + h * 0.35), jw, jw);
      if (rand() > 0.5) {
        g.fillRect(Math.round(x + w * 0.62), Math.round(topo + h * 0.35), jw, jw);
      }
    }
  }

  function desenharArvore(g, x, baseY, w, h, seed) {
    const rand = mulberry32(seed);
    g.fillStyle = '#03060d';
    g.fillRect(Math.round(x), Math.round(baseY - h), Math.max(1, Math.round(w * 0.12)), Math.round(h));
    for (let i = 0; i < 4; i++) {
      const rw = w * (0.45 + rand() * 0.55);
      const rh = h * (0.24 + rand() * 0.26);
      const rx = x + (rand() - 0.5) * w;
      const ry = baseY - h * (0.5 + rand() * 0.5);
      g.fillRect(Math.round(rx), Math.round(ry), Math.round(rw), Math.round(rh));
    }
  }

  function desenharEstrelaCheia(g, x, y, r, cor) {
    g.fillStyle = cor;
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 === 0 ? r : r * 0.45;
      const px = x + Math.cos(ang) * rr;
      const py = y + Math.sin(ang) * rr;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
  }

  function desenharBandeira(g, x, baseY) {
    const altura = HORIZONTE * 0.24;
    const topo = baseY - altura * 0.94;
    const fh = altura * 0.34;
    const fw = Math.max(5, fh * (10 / 7));
    const passos = Math.max(14, Math.round(fw * 2));

    g.fillStyle = '#05080f';
    g.fillRect(Math.round(x), Math.round(baseY - altura), Math.max(1, Math.round(altura * 0.022)), Math.round(altura));

    for (let i = 0; i < passos; i++) {
      const t = i / passos;
      const px = x + t * fw;
      const off = Math.sin(tempo * 2 + t * 5 + x * 0.01) * altura * 0.016;
      const passo = fw / passos + 0.7;
      const yTopo = topo + off;
      const limite = topo + fh * (1 - t) + off;

      g.fillStyle = '#FDEA02';
      g.fillRect(px, yTopo, passo, Math.max(0, limite - yTopo));
      g.fillStyle = '#008F4C';
      g.fillRect(px, limite, passo, Math.max(0, topo + fh + off - limite));
    }

    desenharEstrelaCheia(
      g,
      x + fw * 0.15,
      topo + fh * 0.18,
      Math.max(1.4, fh * 0.15),
      '#ED1C24'
    );
  }

  function desenharCenario() {
    if (assets.horizonte) {
      const img = assets.horizonte;
      const h = HORIZONTE * 0.55;
      const w = Math.max(1, (img.width * h) / img.height);
      let x = (-cameraX * P_CENARIO) % w;
      if (x > 0) x -= w;
      for (; x < L; x += w) {
        ctx.drawImage(img, x, HORIZONTE - h + 4, w, h);
      }
      ctx.fillStyle = '#03060d';
      ctx.fillRect(0, HORIZONTE, L, Math.max(2, Math.round(A * 0.008)));
      return;
    }

    ctx.fillStyle = '#071327';
    for (let i = 0; i < cenarioDistante.length; i++) {
      const obj = cenarioDistante[i];
      const x = sxDe(obj.s, P_CENARIO * 0.82);
      if (x < -100 || x > L + 100) continue;
      ctx.beginPath();
      ctx.moveTo(x, HORIZONTE);
      ctx.quadraticCurveTo(x + obj.w / 2, HORIZONTE - obj.h * 1.7, x + obj.w, HORIZONTE);
      ctx.closePath();
      ctx.fill();
    }

    const nevoa = ctx.createLinearGradient(0, HORIZONTE - 34, 0, HORIZONTE + 2);
    nevoa.addColorStop(0, 'rgba(35,105,120,0)');
    nevoa.addColorStop(1, 'rgba(45,130,140,0.2)');
    ctx.fillStyle = nevoa;
    ctx.fillRect(0, HORIZONTE - 34, L, 36);

    ctx.fillStyle = '#03060d';
    ctx.fillRect(0, HORIZONTE - 2, L, Math.max(3, Math.round(A * 0.012)));

    const baseY = HORIZONTE + 1;
    for (let i = 0; i < cenario.length; i++) {
      const obj = cenario[i];
      const x = sxDe(obj.s, P_CENARIO);
      if (x < -160 || x > L + 160) continue;
      if (obj.tipo === 'casa') {
        desenharCasa(ctx, x, baseY, obj.w, obj.h, obj.janela, obj.seed);
      } else if (obj.tipo === 'arvore') {
        desenharArvore(ctx, x, baseY, obj.w, obj.h, obj.seed);
      } else if (obj.tipo === 'mato') {
        ctx.fillStyle = '#03060d';
        ctx.fillRect(Math.round(x), Math.round(baseY - obj.h), Math.round(obj.w), Math.round(obj.h));
      } else if (obj.tipo === 'bandeira') {
        desenharBandeira(ctx, x, baseY);
      }
    }
  }

  /* ===== água ===== */

  function gerarOndas() {
    const rand = mulberry32(hashString('agua-' + L + '-' + A));
    const area = Math.max(20, A - HORIZONTE);
    const cores = ['#2e6db4', '#4a8ab5', '#7fb4de', '#b8dcf5', '#d8c9a0', '#ffd21f', '#1b4b8a'];
    ondas = [];
    const qtd = Math.max(28, Math.round(area * 0.95));
    for (let i = 0; i < qtd; i++) {
      ondas.push({
        y: rand(),
        comp: 6 + rand() * Math.min(60, L * 0.12),
        vel: 1 + rand() * 5,
        fase: rand() * TAU,
        cor: cores[(rand() * cores.length) | 0],
        alpha: 0.05 + rand() * 0.22,
        esp: rand() > 0.86 ? 2 : 1,
      });
    }
  }

  function desenharAgua() {
    const topo = HORIZONTE;
    const area = A - topo;
    const grad = ctx.createLinearGradient(0, topo, 0, A);
    grad.addColorStop(0, '#0a1c33');
    grad.addColorStop(0.35, '#08213a');
    grad.addColorStop(1, '#040a16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, topo, L, area);

    const quente = ctx.createLinearGradient(0, topo, 0, topo + area * 0.42);
    quente.addColorStop(0, 'rgba(120,90,45,0.16)');
    quente.addColorStop(1, 'rgba(120,90,45,0)');
    ctx.fillStyle = quente;
    ctx.fillRect(0, topo, L, area * 0.42);

    const brilho = ctx.createLinearGradient(0, topo, 0, topo + area * 0.4);
    brilho.addColorStop(0, 'rgba(60,150,160,0.22)');
    brilho.addColorStop(1, 'rgba(60,150,160,0)');
    ctx.fillStyle = brilho;
    ctx.fillRect(0, topo, L, area * 0.4);

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, topo, L, area);
    ctx.clip();

    const deslocamento = -cameraX * P_AGUA * 0.35;
    for (let i = 0; i < ondas.length; i++) {
      const onda = ondas[i];
      const y = topo + onda.y * area;
      const span = L + onda.comp * 2;
      let x = (deslocamento + tempo * onda.vel + onda.fase * 50) % span;
      if (x < 0) x += span;
      x -= onda.comp;
      const alpha = onda.alpha * (0.55 + 0.45 * Math.sin(tempo * 1.3 + onda.fase));
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = onda.cor;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(onda.comp), onda.esp);
      ctx.fillRect(Math.round(x - span), Math.round(y), Math.round(onda.comp), onda.esp);
    }

    const faixa = Math.round(L * 0.28);
    const faixaAltura = Math.max(6, Math.round(area * 0.2));
    for (let i = 0; i < faixa; i++) {
      const x = ((i * 37 + tempo * 9) % (L + 40)) - 20;
      const y = topo + 2 + ((i * 13) % faixaAltura);
      const w = 3 + (i % 5) * 3;
      ctx.globalAlpha = 0.05 + (i % 4) * 0.025;
      ctx.fillStyle = i % 3 === 0 ? '#fff3b0' : '#7fb4de';
      ctx.fillRect(Math.round(x), Math.round(y), w, 1);
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function desenharReflexos() {
    const topo = HORIZONTE;
    const area = A - topo;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, topo, L, area);
    ctx.clip();

    for (let k = 0; k < estrelas.length; k++) {
      const e = estrelas[k];
      const x = sxDe(e.s, P_ESTRELA);
      if (x < -40 || x > L + 40) continue;
      const cor = corDaArea(e.artista.area);

      const senda = ctx.createLinearGradient(x, topo, x, topo + area * 0.55);
      senda.addColorStop(0, hexParaRgba(cor, 0.2));
      senda.addColorStop(1, hexParaRgba(cor, 0));
      ctx.fillStyle = senda;
      ctx.fillRect(x - e.raio * 2.4, topo, e.raio * 4.8, area * 0.55);

      for (let i = 0; i < 12; i++) {
        const y = topo + 3 + i * (area * 0.055) + Math.sin(tempo * 1.6 + i + e.fase) * 2;
        const w = (7 + i * 3) * (0.7 + 0.3 * Math.sin(tempo * 2 + i));
        const jx = Math.sin(tempo * 1.1 + i * 1.7 + e.fase) * (1.5 + i * 0.9);
        ctx.globalAlpha =
          0.6 * (1 - i / 13) * (0.65 + 0.35 * Math.sin(tempo * 2.2 + e.fase));
        ctx.fillStyle = cor;
        ctx.fillRect(Math.round(x - w / 2 + jx), Math.round(y), Math.round(w), i > 5 ? 1 : 2);
      }
    }

    if (luaCeu) {
      const x = sxDe(luaCeu.s, P_CEU);
      if (x > -60 && x < L + 60) {
        const senda = ctx.createLinearGradient(x, topo, x, topo + area * 0.85);
        senda.addColorStop(0, 'rgba(255,210,31,0.46)');
        senda.addColorStop(1, 'rgba(255,210,31,0)');
        ctx.fillStyle = senda;
        ctx.fillRect(x - luaCeu.r * 2.4, topo, luaCeu.r * 4.8, area * 0.85);

        for (let i = 0; i < 20; i++) {
          const y = topo + 3 + i * (area * 0.043);
          const w = (15 + i * 6.5) * (0.7 + 0.3 * Math.sin(tempo * 0.9 + i));
          const jx = Math.sin(tempo * 0.8 + i * 0.9) * (2 + i * 0.9);
          ctx.globalAlpha = 0.46 * (1 - i / 22);
          ctx.fillStyle = i % 3 === 0 ? '#fff3b0' : '#ffd21f';
          ctx.fillRect(Math.round(x - w / 2 + jx), Math.round(y), Math.round(w), 1);
        }
      }
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function desenharBarcoDistante() {
    const sx = sxDe(0.62, P_AGUA);
    if (sx < -100 || sx > L + 100) return;
    const area = A - HORIZONTE;
    const y = HORIZONTE + area * 0.28 + Math.sin(tempo * 0.7) * 2;
    const esc = clamp(A * 0.02, 5, 13);

    ctx.fillStyle = '#02040a';
    ctx.beginPath();
    ctx.moveTo(sx - esc * 1.6, y);
    ctx.quadraticCurveTo(sx, y + esc * 0.55, sx + esc * 1.6, y);
    ctx.lineTo(sx + esc * 1.1, y + esc * 0.3);
    ctx.lineTo(sx - esc * 1.1, y + esc * 0.3);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(sx - esc * 0.6, y - esc * 0.8, esc * 0.3, esc * 0.8);
    ctx.fillRect(sx + esc * 0.2, y - esc * 0.7, esc * 0.28, esc * 0.7);
    ctx.fillRect(sx - esc * 1.2, y - esc * 1.4, Math.max(1, esc * 0.1), esc * 1.4);

    ctx.fillStyle = 'rgba(255,210,31,0.7)';
    ctx.fillRect(sx - esc * 0.1, y - esc * 0.5, 2, 2);

    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = 0.2 * (1 - i / 5);
      ctx.fillRect(sx - esc * 0.5 - i, y + esc * 0.4 + i * 2, esc * 1 + i * 2, 1);
    }
    ctx.globalAlpha = 1;
  }

  /* ===== primeiro plano: dentro do barco ===== */

  function desenharPessoa(x, y, esc) {
    ctx.fillStyle = '#02040a';

    ctx.beginPath();
    ctx.moveTo(x - esc * 0.7, y + esc * 0.65);
    ctx.quadraticCurveTo(x - esc * 0.55, y + esc * 0.05, x, y - esc * 0.14);
    ctx.quadraticCurveTo(x + esc * 0.55, y + esc * 0.05, x + esc * 0.7, y + esc * 0.65);
    ctx.lineTo(x + esc * 0.7, y + esc * 0.98);
    ctx.lineTo(x - esc * 0.7, y + esc * 0.98);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y - esc * 0.5, esc * 0.28, 0, TAU);
    ctx.fill();

    ctx.fillRect(x - esc * 0.58, y - esc * 0.66, esc * 1.16, Math.max(1, esc * 0.09));
    ctx.fillRect(x - esc * 0.3, y - esc * 0.94, esc * 0.6, esc * 0.3);

    ctx.strokeStyle = 'rgba(255,210,80,0.26)';
    ctx.lineWidth = Math.max(1, Math.round(esc * 0.04));
    ctx.beginPath();
    ctx.moveTo(x - esc * 0.58, y - esc * 0.66);
    ctx.lineTo(x + esc * 0.58, y - esc * 0.66);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,210,80,0.14)';
    ctx.beginPath();
    ctx.moveTo(x + esc * 0.62, y + esc * 0.02);
    ctx.quadraticCurveTo(x + esc * 0.7, y + esc * 0.4, x + esc * 0.68, y + esc * 0.78);
    ctx.stroke();
  }

  function desenharLanterna(x, y, esc) {
    const pulso = reduzido ? 0 : 0.08 * Math.sin(tempo * 3);
    const halo = ctx.createRadialGradient(x, y, 0, x, y, esc * 2.4);
    halo.addColorStop(0, 'rgba(255,210,80,' + (0.5 + pulso) + ')');
    halo.addColorStop(0.4, 'rgba(245,166,35,0.16)');
    halo.addColorStop(1, 'rgba(245,166,35,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, esc * 2.4, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#1a1008';
    ctx.fillRect(Math.round(x - esc * 0.26), Math.round(y - esc * 0.3), Math.round(esc * 0.52), Math.round(esc * 0.6));
    ctx.fillStyle = '#ffd21f';
    ctx.fillRect(Math.round(x - esc * 0.14), Math.round(y - esc * 0.18), Math.round(esc * 0.28), Math.round(esc * 0.36));

    ctx.strokeStyle = '#241610';
    ctx.lineWidth = Math.max(1, Math.round(esc * 0.06));
    ctx.beginPath();
    ctx.moveTo(x, y - esc * 0.3);
    ctx.lineTo(x, y - esc * 0.55);
    ctx.stroke();
  }

  function desenharBarco() {
    const altura = clamp(A * 0.17, 44, 84);
    const bob = reduzido ? 0 : Math.sin(tempo * 1.15) * altura * 0.035;
    const base = A - altura + bob;

    if (assets.barco) {
      const img = assets.barco;
      const h = altura * 1.6;
      const w = Math.max(1, (img.width * h) / img.height);
      ctx.drawImage(img, (L - w) / 2, A - h + bob, w, h);
      return;
    }

    ctx.fillStyle = '#04060c';
    ctx.beginPath();
    ctx.moveTo(-8, A + 8);
    ctx.lineTo(-8, base + altura * 0.35);
    ctx.quadraticCurveTo(L * 0.18, base - altura * 0.12, L * 0.5, base + altura * 0.16);
    ctx.quadraticCurveTo(L * 0.82, base - altura * 0.12, L + 8, base + altura * 0.35);
    ctx.lineTo(L + 8, A + 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#241610';
    ctx.lineWidth = Math.max(1, Math.round(altura * 0.06));
    ctx.beginPath();
    ctx.moveTo(-8, base + altura * 0.35);
    ctx.quadraticCurveTo(L * 0.18, base - altura * 0.12, L * 0.5, base + altura * 0.16);
    ctx.quadraticCurveTo(L * 0.82, base - altura * 0.12, L + 8, base + altura * 0.35);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(138,90,48,0.65)';
    ctx.lineWidth = Math.max(1, Math.round(altura * 0.022));
    ctx.beginPath();
    ctx.moveTo(-8, base + altura * 0.32);
    ctx.quadraticCurveTo(L * 0.18, base - altura * 0.14, L * 0.5, base + altura * 0.14);
    ctx.quadraticCurveTo(L * 0.82, base - altura * 0.14, L + 8, base + altura * 0.32);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(74,44,26,0.62)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = base + altura * (0.34 + i * 0.16);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(L, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(74,44,26,0.5)';
    for (let i = 1; i < 9; i++) {
      const x = (L * i) / 9;
      ctx.fillRect(Math.round(x), Math.round(base + altura * 0.35), 1, Math.round(altura * 0.55));
    }

    const luzHull = ctx.createRadialGradient(L * 0.9, base + altura * 0.12, 0, L * 0.9, base + altura * 0.12, altura * 1.5);
    luzHull.addColorStop(0, 'rgba(255,210,80,0.13)');
    luzHull.addColorStop(1, 'rgba(255,210,80,0)');
    ctx.fillStyle = luzHull;
    ctx.fillRect(L * 0.62, base - altura * 0.1, L * 0.38, altura * 1.3);

    desenharPessoa(L * 0.76, base + altura * 0.18, altura * 0.55);
    desenharLanterna(L * 0.9, base + altura * 0.01, altura * 0.32);
  }

  /* ===== vaga-lumes e meteoros ===== */

  function gerarVagalumes() {
    const rand = mulberry32(hashString('vagalumes-' + L + '-' + HORIZONTE));
    vagalumes = [];
    for (let i = 0; i < 14; i++) {
      vagalumes.push({
        s: rand(),
        y: rand(),
        fase: rand() * TAU,
        vel: 0.3 + rand() * 0.7,
        raio: rand() > 0.7 ? 2 : 1,
      });
    }
  }

  function desenharVagalumes() {
    for (let i = 0; i < vagalumes.length; i++) {
      const v = vagalumes[i];
      const x = sxDe(v.s, P_CENARIO) + Math.sin(tempo * v.vel + v.fase) * 6;
      if (x < -4 || x > L + 4) continue;
      const y = HORIZONTE - 10 - v.y * HORIZONTE * 0.4 + Math.cos(tempo * v.vel * 0.8 + v.fase) * 4;
      const a = 0.25 + 0.45 * Math.abs(Math.sin(tempo * v.vel + v.fase));
      ctx.fillStyle = 'rgba(255,235,140,' + a + ')';
      ctx.fillRect(Math.round(x), Math.round(y), v.raio, v.raio);
      ctx.globalAlpha = a * 0.4;
      ctx.fillRect(Math.round(x - 1), Math.round(y - 1), v.raio + 2, v.raio + 2);
      ctx.globalAlpha = 1;
    }
  }

  function atualizarMeteoros(dt) {
    if (reduzido) return;
    if (tempo > proximoMeteoro) {
      proximoMeteoro = tempo + 10 + Math.random() * 16;
      const x = L * (0.15 + Math.random() * 0.7);
      const y = HORIZONTE * (0.06 + Math.random() * 0.3);
      const ang = Math.PI * 0.25 + (Math.random() - 0.5) * 0.3;
      const vel = L * 0.35 + Math.random() * L * 0.2;
      meteoros.push({
        x: x,
        y: y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel,
        vida: 0,
        max: 0.6 + Math.random() * 0.4,
      });
    }
    for (let i = meteoros.length - 1; i >= 0; i--) {
      const m = meteoros[i];
      m.vida += dt;
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.vida > m.max) meteoros.splice(i, 1);
    }
  }

  function desenharMeteoros() {
    for (let i = 0; i < meteoros.length; i++) {
      const m = meteoros[i];
      const a = 1 - m.vida / m.max;
      const cauda = 0.12 + 0.1 * a;
      const x2 = m.x - m.vx * cauda * 0.5;
      const y2 = m.y - m.vy * cauda * 0.5;
      const grad = ctx.createLinearGradient(m.x, m.y, x2, y2);
      grad.addColorStop(0, 'rgba(255,248,231,' + a + ')');
      grad.addColorStop(1, 'rgba(255,210,31,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, Math.round(A * 0.006));
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,248,231,' + a + ')';
      ctx.fillRect(Math.round(m.x), Math.round(m.y), 2, 2);
    }
  }

  /* ===== interação ===== */

  function mapear(ev) {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - r.left) * L) / r.width,
      y: ((ev.clientY - r.top) * A) / r.height,
    };
  }

  function posicionarTooltip(estrela) {
    if (!elTooltip) return;
    const r = canvas.getBoundingClientRect();
    const px = r.left + (estrela.x / L) * r.width;
    const py = r.top + (estrela.y / A) * r.height;
    elTooltip.style.left = px + 'px';
    elTooltip.style.top = py - 16 + 'px';
  }

  function mostrarTooltip(estrela) {
    if (!elTooltip) return;
    elTooltipNome.textContent = estrela.artista.nome;
    elTooltipInfo.textContent = estrela.artista.area + ' · ' + estrela.artista.local;
    posicionarTooltip(estrela);
    elTooltip.hidden = false;
  }

  function esconderTooltip() {
    if (elTooltip) elTooltip.hidden = true;
  }

  function acharEstrela(ponto, margem) {
    let melhor = null;
    let melhorDist = Infinity;
    for (let i = 0; i < estrelasTela.length; i++) {
      const e = estrelasTela[i];
      const dx = e.x - ponto.x;
      const dy = e.y - ponto.y;
      const d = dx * dx + dy * dy;
      const raio = e.raio * margem;
      if (d <= raio * raio && d < melhorDist) {
        melhor = e;
        melhorDist = d;
      }
    }
    return melhor;
  }

  function atualizarHover() {
    if (!mouse.ativo || arrastando) return;
    const achado = acharEstrela(mouse, 1);
    const novo = achado ? achado.id : null;
    if (novo !== hoverId) {
      hoverId = novo;
      if (achado) mostrarTooltip(achado);
      else esconderTooltip();
    } else if (achado) {
      posicionarTooltip(achado);
    }
    canvas.style.cursor = hoverId ? 'pointer' : 'grab';
  }

  function aoPressionar(ev) {
    if (intro) return;
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    arrastando = true;
    arrastou = false;
    inicioPX = ev.clientX;
    ultimoPX = ev.clientX;
    cameraSuave = null;
    canvas.classList.add('arrastando');
    esconderTooltip();
    if (canvas.setPointerCapture) {
      try {
        canvas.setPointerCapture(ev.pointerId);
      } catch (erro) {
        /* ignora */
      }
    }
  }

  function aoMover(ev) {
    const ponto = mapear(ev);
    mouse.x = ponto.x;
    mouse.y = ponto.y;
    mouse.ativo = true;
    if (arrastando) {
      const dx = ev.clientX - ultimoPX;
      ultimoPX = ev.clientX;
      if (Math.abs(ev.clientX - inicioPX) > 6) arrastou = true;
      const fator = canvas.width / canvas.getBoundingClientRect().width;
      cameraX = clamp(cameraX - dx * fator, 0, Math.max(0, MUNDO - L));
      return;
    }
    atualizarHover();
  }

  function aoSoltar(ev) {
    if (!arrastando) return;
    arrastando = false;
    canvas.classList.remove('arrastando');
    if (canvas.releasePointerCapture) {
      try {
        canvas.releasePointerCapture(ev.pointerId);
      } catch (erro) {
        /* ignora */
      }
    }

    if (!arrastou) {
      const ponto = mapear(ev);
      const achado = acharEstrela(ponto, 1.35);
      if (achado) {
        selecionadoId = achado.id;
        esconderTooltip();
        window.dispatchEvent(
          new CustomEvent('estrela:selecionar', { detail: { id: achado.id } })
        );
      }
    }

    const ponto = mapear(ev);
    mouse.x = ponto.x;
    mouse.y = ponto.y;
    atualizarHover();
  }

  /* ===== loop ===== */

  function atualizar(dt) {
    if (cameraSuave) {
      cameraSuave.t += dt;
      const k = clamp(cameraSuave.t / cameraSuave.dur, 0, 1);
      const suave = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      cameraX = cameraSuave.de + (cameraSuave.para - cameraSuave.de) * suave;
      if (k >= 1) {
        cameraX = cameraSuave.para;
        cameraSuave = null;
      }
    } else if (!intro && !pausado && !arrastando) {
      const deriva = (CFG_CENA.derivaAutomatica || 0.022) * L;
      cameraX += deriva * dt * (reduzido ? 0.25 : 1);
    }

    if (teclas.esq) cameraX -= L * 0.5 * dt;
    if (teclas.dir) cameraX += L * 0.5 * dt;

    cameraX = clamp(cameraX, 0, Math.max(0, MUNDO - L));
    atualizarMeteoros(dt);
  }

  function desenhar() {
    ctx.fillStyle = '#02040f';
    ctx.fillRect(0, 0, L, A);

    desenharCeu();
    desenharEstrelasDecor();
    desenharConstelacao();
    desenharEstrelasArtistas();
    desenharMeteoros();
    desenharCenario();
    desenharAgua();
    desenharReflexos();
    desenharBarcoDistante();
    desenharVagalumes();
    desenharBarco();
  }

  function loop(agora) {
    const dt = Math.min(0.05, Math.max(0, (agora - ultimo) / 1000));
    ultimo = agora;
    tempo += dt;
    atualizar(dt);
    desenhar();
    requestAnimationFrame(loop);
  }

  /* ===== eventos ===== */

  window.addEventListener('keydown', function (ev) {
    const alvo = ev.target;
    if (
      alvo &&
      (alvo.tagName === 'INPUT' ||
        alvo.tagName === 'TEXTAREA' ||
        alvo.tagName === 'SELECT' ||
        alvo.isContentEditable)
    ) {
      return;
    }
    if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === 'A') {
      teclas.esq = true;
      ev.preventDefault();
    } else if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === 'D') {
      teclas.dir = true;
      ev.preventDefault();
    }
  });

  window.addEventListener('keyup', function (ev) {
    if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === 'A') teclas.esq = false;
    if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === 'D') teclas.dir = false;
  });

  window.addEventListener('blur', function () {
    teclas.esq = false;
    teclas.dir = false;
  });

  canvas.addEventListener('pointerdown', aoPressionar);
  canvas.addEventListener('pointermove', aoMover);
  canvas.addEventListener('pointerup', aoSoltar);
  canvas.addEventListener('pointercancel', aoSoltar);
  canvas.addEventListener('pointerleave', function () {
    mouse.ativo = false;
    if (!arrastando) {
      hoverId = null;
      esconderTooltip();
    }
  });

  let timerResize = null;
  window.addEventListener('resize', function () {
    clearTimeout(timerResize);
    timerResize = setTimeout(medirTela, 120);
  });

  window.addEventListener('orientationchange', function () {
    clearTimeout(timerResize);
    timerResize = setTimeout(medirTela, 200);
  });

  document.addEventListener('visibilitychange', function () {
    ultimo = performance.now();
  });

  const mediaReduzida = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduzido = mediaReduzida.matches;
  if (mediaReduzida.addEventListener) {
    mediaReduzida.addEventListener('change', function (ev) {
      reduzido = ev.matches;
    });
  }

  function carregarAssets() {
    const cfg = CONFIG.ASSETS || {};
    ['horizonte', 'barco'].forEach(function (chave) {
      const src = cfg[chave];
      if (!src) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        assets[chave] = img;
      };
      img.onerror = function () {
        assets[chave] = null;
      };
      img.src = src;
    });
  }

  function focarArtista(id) {
    const estrela = estrelas.find(function (e) {
      return e.artista.id === id;
    });
    if (!estrela) return;
    const alvo = clamp(
      (estrela.s * campo(P_ESTRELA) - L * 0.5) / P_ESTRELA,
      0,
      Math.max(0, MUNDO - L)
    );
    cameraSuave = { de: cameraX, para: alvo, t: 0, dur: 0.75 };
  }

  window.Cena = {
    entrar: function () {
      intro = false;
    },
    pausar: function (valor) {
      pausado = Boolean(valor);
    },
    focarArtista: focarArtista,
    definirSelecionado: function (id) {
      selecionadoId = id || null;
    },
    definirMostrarNomes: function (valor) {
      mostrarNomes = Boolean(valor);
    },
    redimensionar: medirTela,
    posicao: function () {
      return { cameraX: cameraX, mundo: MUNDO, largura: L };
    },
  };

  medirTela();
  carregarAssets();
  requestAnimationFrame(loop);
})();
