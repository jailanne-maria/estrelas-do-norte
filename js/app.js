/* =====================================================================
   ESTRELAS DO N✦RTE — interface
   Liga a cena às estrelas, painéis, constelação, formulário e curadoria.
   ===================================================================== */

(function () {
  'use strict';

  const CONFIG = window.ESTRELAS_CONFIG || {};
  const ARTISTAS = Array.isArray(window.ARTISTAS) ? window.ARTISTAS : [];
  function textoDrawer() {
    return ARTISTAS.length + ' estrelas confirmadas até agora. Toque em uma para navegar até ela.';
  }

  const estado = {
    indice: -1,
    ultimoFoco: null,
    iniciado: false,
    audioAtivo: false,
    formularioAbertoEm: 0,
  };

  const el = {
    intro: document.getElementById('intro'),
    btnEntrar: document.getElementById('btn-entrar'),
    btnConstelacao: document.getElementById('btn-constelacao'),
    btnIndicar: document.getElementById('btn-indicar'),
    btnIndicar2: document.getElementById('btn-indicar-2'),
    btnIndicar3: document.getElementById('btn-indicar-3'),
    btnSom: document.getElementById('btn-som'),
    dicaRemar: document.getElementById('dica-remar'),

    painel: document.getElementById('painel-artista'),
    foto: document.getElementById('artista-foto'),
    fotoPlaceholder: document.getElementById('artista-foto-placeholder'),
    iniciais: document.getElementById('artista-iniciais'),
    area: document.getElementById('artista-area'),
    demo: document.getElementById('artista-demo'),
    nome: document.getElementById('artista-nome'),
    local: document.getElementById('artista-local'),
    links: document.getElementById('artista-links'),
    bio: document.getElementById('artista-bio'),
    curadoriaArtista: document.getElementById('artista-curadoria'),
    obras: document.getElementById('artista-obras'),
    anterior: document.getElementById('artista-anterior'),
    proximo: document.getElementById('artista-proximo'),
    contador: document.getElementById('artista-contador'),

    drawer: document.getElementById('drawer-constelacao'),
    drawerSugestoes: document.getElementById('drawer-sugestoes'),
    busca: document.getElementById('busca-artista'),
    mostrarNomes: document.getElementById('mostrar-nomes'),
    lista: document.getElementById('lista-artistas'),

    modal: document.getElementById('modal-indicacao'),
    form: document.getElementById('form-indicacao'),
    status: document.getElementById('form-status'),
    btnEnviar: document.getElementById('btn-enviar-indicacao'),
    sucesso: document.getElementById('indicacao-sucesso'),
    notaLocal: document.getElementById('nota-local'),
    btnIndicarOutra: document.getElementById('btn-indicar-outra'),
    btnFecharSucesso: document.getElementById('btn-fechar-sucesso'),

    lightbox: document.getElementById('lightbox'),
    lightboxImagem: document.getElementById('lightbox-imagem'),
    lightboxTitulo: document.getElementById('lightbox-titulo'),
    lightboxMeta: document.getElementById('lightbox-meta'),
    lightboxDescricao: document.getElementById('lightbox-descricao'),

    curadoria: document.getElementById('curadoria'),
    listaCuradoria: document.getElementById('lista-curadoria'),
    btnExportar: document.getElementById('btn-exportar-indicacoes'),
    btnLimpar: document.getElementById('btn-limpar-indicacoes'),
    btnFecharCuradoria: document.getElementById('btn-fechar-curadoria'),

    toast: document.getElementById('toast'),
  };

  /* ===== utilidades ===== */

  function normalizar(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function corDaArea(area) {
    return window.corDaArea ? window.corDaArea(area) : '#ffd21f';
  }

  function iniciais(nome) {
    const partes = String(nome || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const uteis = partes.filter(function (parte) {
      return !/^(de|da|do|das|dos|e)$/i.test(parte);
    });
    const base = uteis.length ? uteis : partes;
    const primeira = base[0] ? base[0][0] : '?';
    const segunda = base[1] ? base[1][0] : '';
    return (primeira + segunda).toUpperCase();
  }

  function slug(texto) {
    return normalizar(texto)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'artista';
  }

  function escaparJs(texto) {
    return String(texto || '')
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, ' ');
  }

  function aplicarCoresObra(elemento, obra, artista) {
    const cores = Array.isArray(obra.cores) ? obra.cores : [];
    elemento.style.setProperty('--obra-a', cores[0] || corDaArea(artista.area));
    elemento.style.setProperty('--obra-b', cores[1] || '#071126');
  }

  function atualizarHash(hash) {
    const base = location.pathname + location.search;
    history.replaceState(null, '', hash ? base + '#' + hash : base);
  }

  function limparHash(prefixo) {
    if (!location.hash) return;
    const atual = location.hash.slice(1);
    if (!prefixo || atual.indexOf(prefixo) === 0) atualizarHash('');
  }

  function baixarArquivo(nome, conteudo, tipo) {
    const blob = new Blob([conteudo], { type: tipo || 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1500);
  }

  async function copiarTexto(texto) {
    try {
      await navigator.clipboard.writeText(texto);
      return true;
    } catch (erro) {
      const area = document.createElement('textarea');
      area.value = texto;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {
        ok = false;
      }
      area.remove();
      return ok;
    }
  }

  let timerToast = null;
  function mostrarToast(mensagem, duracao) {
    if (!el.toast) return;
    el.toast.textContent = mensagem;
    el.toast.classList.add('visivel');
    clearTimeout(timerToast);
    timerToast = setTimeout(function () {
      el.toast.classList.remove('visivel');
    }, duracao || 3600);
  }

  function focarRetorno() {
    const alvo = estado.ultimoFoco;
    if (alvo && alvo.isConnected && alvo.offsetParent !== null) {
      try {
        alvo.focus({ preventScroll: true });
        return;
      } catch (erro) {
        /* ignora */
      }
    }
    if (el.btnConstelacao) {
      try {
        el.btnConstelacao.focus({ preventScroll: true });
      } catch (erro) {
        /* ignora */
      }
    }
  }

  function atualizarPausa() {
    const aberto =
      !el.painel.hidden ||
      !el.drawer.hidden ||
      (el.drawerSugestoes && !el.drawerSugestoes.hidden) ||
      !el.modal.hidden ||
      !el.lightbox.hidden;
    if (window.Cena) window.Cena.pausar(aberto);
  }

  function prenderFoco(ev, container) {
    if (ev.key !== 'Tab' || !container) return;
    const focaveis = Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (item) {
      return item.offsetParent !== null;
    });
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (ev.shiftKey && document.activeElement === primeiro) {
      ev.preventDefault();
      ultimo.focus();
    } else if (!ev.shiftKey && document.activeElement === ultimo) {
      ev.preventDefault();
      primeiro.focus();
    }
  }

  /* ===== entrada ===== */

  function entrar(opcoes) {
    const silencioso = opcoes && opcoes.silencioso;
    if (estado.iniciado) return;
    estado.iniciado = true;

    el.intro.classList.add('saindo');
    setTimeout(function () {
      el.intro.hidden = true;
    }, 620);

    if (window.Cena) window.Cena.entrar();

    if (!silencioso) {
      if (localStorage.getItem('estrelas:som') === '1') {
        ligarAudio(true);
      }

      setTimeout(function () {
        if (el.dicaRemar) {
          el.dicaRemar.hidden = false;
          setTimeout(function () {
            if (el.dicaRemar) el.dicaRemar.hidden = true;
          }, 9000);
        }
      }, 1100);

      setTimeout(function () {
        if (!localStorage.getItem('estrelas:dica-estrelas')) {
          mostrarToast('Toque nas estrelas para conhecer os artistas');
          localStorage.setItem('estrelas:dica-estrelas', '1');
        }
      }, 5200);
    }
  }

  /* ===== painel do artista ===== */

  function preencherPainel(artista) {
    const cor = corDaArea(artista.area);

    el.area.textContent = artista.area;
    el.area.style.setProperty('--cor-area', cor);
    el.demo.hidden = !artista.demo;

    el.nome.textContent = artista.nome;
    el.local.textContent = artista.local;
    el.bio.textContent = artista.bio || 'Biografia em curadoria.';

    if (el.curadoriaArtista) {
      if (artista.curador) {
        el.curadoriaArtista.textContent = 'Curadoria: ' + artista.curador;
        el.curadoriaArtista.hidden = false;
      } else {
        el.curadoriaArtista.hidden = true;
      }
    }

    el.iniciais.textContent = iniciais(artista.nome);
    el.fotoPlaceholder.style.setProperty('--cor-a', cor);
    el.fotoPlaceholder.style.setProperty('--cor-b', '#071126');

    el.foto.hidden = true;
    el.foto.onload = null;
    el.foto.onerror = null;
    el.foto.removeAttribute('src');
    el.foto.alt = 'Retrato de ' + artista.nome;
    if (artista.foto) {
      el.foto.onload = function () {
        el.foto.hidden = false;
      };
      el.foto.onerror = function () {
        el.foto.hidden = true;
      };
      el.foto.src = artista.foto;
    }

    el.links.innerHTML = '';
    if (Array.isArray(artista.links)) {
      artista.links.forEach(function (link) {
        if (!link || !link.url) return;
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.rotulo || 'link';
        el.links.appendChild(a);
      });
    }

    el.obras.innerHTML = '';
    if (!Array.isArray(artista.obras) || !artista.obras.length) {
      const vazio = document.createElement('p');
      vazio.className = 'vazio';
      vazio.textContent = 'Obras em breve.';
      el.obras.appendChild(vazio);
    } else {
      artista.obras.forEach(function (obra) {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'obra';
        botao.setAttribute('aria-label', 'Ver obra ' + (obra.titulo || ''));

        const imagem = document.createElement('span');
        imagem.className = 'obra-img';
        aplicarCoresObra(imagem, obra, artista);

        const placeholder = document.createElement('span');
        placeholder.className = 'obra-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        placeholder.textContent = '✦';
        imagem.appendChild(placeholder);

        if (obra.imagem) {
          const img = document.createElement('img');
          img.alt = '';
          img.loading = 'lazy';
          img.onload = function () {
            img.hidden = false;
          };
          img.onerror = function () {
            img.remove();
          };
          img.src = obra.imagem;
          imagem.appendChild(img);
        }

        const info = document.createElement('span');
        info.className = 'obra-info';
        const titulo = document.createElement('span');
        titulo.className = 'obra-titulo';
        titulo.textContent = obra.titulo || 'Obra sem título';
        const meta = document.createElement('span');
        meta.className = 'obra-meta';
        const partes = [obra.ano, obra.tecnica].filter(Boolean);
        meta.textContent = partes.join(' · ') || 'obra';
        info.append(titulo, meta);

        botao.append(imagem, info);
        botao.addEventListener('click', function () {
          abrirLightbox(artista, obra);
        });
        el.obras.appendChild(botao);
      });
    }

    el.contador.textContent = estado.indice + 1 + ' / ' + ARTISTAS.length;
    el.anterior.disabled = ARTISTAS.length <= 1;
    el.proximo.disabled = ARTISTAS.length <= 1;
  }

  function abrirArtista(id, opcoes) {
    const indice = ARTISTAS.findIndex(function (artista) {
      return artista.id === id;
    });
    if (indice < 0) return;

    if (el.drawerSugestoes && !el.drawerSugestoes.hidden) fecharSugestoes(false);
    if (el.drawer) el.drawer.hidden = true;
    limparHash('constelacao');

    estado.indice = indice;
    estado.ultimoFoco = document.activeElement;
    const artista = ARTISTAS[indice];

    preencherPainel(artista);
    el.painel.hidden = false;
    atualizarHash('artista=' + encodeURIComponent(artista.id));

    if (window.Cena) {
      window.Cena.pausar(true);
      window.Cena.definirSelecionado(artista.id);
      window.Cena.focarArtista(artista.id);
    }

    atualizarPausa();

    if (!opcoes || !opcoes.semFoco) {
      requestAnimationFrame(function () {
        const fechar = el.painel.querySelector('.fechar');
        if (fechar) {
          try {
            fechar.focus({ preventScroll: true });
          } catch (erro) {
            /* ignora */
          }
        }
      });
    }
  }

  function fecharPainel(restaurarFoco) {
    el.painel.hidden = true;
    limparHash('artista=');
    if (window.Cena) window.Cena.definirSelecionado(null);
    atualizarPausa();
    if (restaurarFoco !== false) focarRetorno();
  }

  function navegarArtista(passo) {
    if (!ARTISTAS.length) return;
    const indice = (estado.indice + passo + ARTISTAS.length) % ARTISTAS.length;
    abrirArtista(ARTISTAS[indice].id, { semFoco: true });
  }

  /* ===== lightbox ===== */

  function abrirLightbox(artista, obra) {
    el.lightboxTitulo.textContent = obra.titulo || 'Obra sem título';
    const partes = [obra.ano, obra.tecnica, artista.nome].filter(Boolean);
    el.lightboxMeta.textContent = partes.join(' · ');
    el.lightboxDescricao.textContent = obra.descricao || '';
    el.lightboxImagem.innerHTML = '';

    const placeholder = function () {
      const caixa = document.createElement('div');
      caixa.className = 'lightbox-placeholder';
      caixa.setAttribute('aria-hidden', 'true');
      caixa.textContent = '✦';
      caixa.style.setProperty('--obra-a', (obra.cores && obra.cores[0]) || corDaArea(artista.area));
      caixa.style.setProperty('--obra-b', (obra.cores && obra.cores[1]) || '#071126');
      return caixa;
    };

    let mostrouImagem = false;
    if (obra.imagem) {
      const img = document.createElement('img');
      img.alt = 'Obra ' + (obra.titulo || 'sem título');
      img.onload = function () {
        mostrouImagem = true;
      };
      img.onerror = function () {
        img.remove();
        el.lightboxImagem.appendChild(placeholder());
      };
      img.src = obra.imagem;
      el.lightboxImagem.appendChild(img);
    }

    if (!obra.imagem) {
      el.lightboxImagem.appendChild(placeholder());
    }

    el.lightbox.hidden = false;
    atualizarPausa();

    requestAnimationFrame(function () {
      const fechar = el.lightbox.querySelector('.fechar');
      if (fechar) {
        try {
          fechar.focus({ preventScroll: true });
        } catch (erro) {
          /* ignora */
        }
      }
    });
  }

  function fecharLightbox() {
    el.lightbox.hidden = true;
    atualizarPausa();
    const fechar = el.painel.querySelector('.fechar');
    if (!el.painel.hidden && fechar) fechar.focus({ preventScroll: true });
  }

  /* ===== constelação ===== */

  function criarItemLista(artista) {
    const li = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'item-artista';

    const estrela = document.createElement('span');
    estrela.className = 'item-estrela';
    estrela.setAttribute('aria-hidden', 'true');
    estrela.textContent = '✦';
    estrela.style.setProperty('--cor-item', corDaArea(artista.area));

    const texto = document.createElement('span');
    texto.className = 'item-texto';
    const nome = document.createElement('strong');
    nome.className = 'item-nome';
    nome.textContent = artista.nome;
    const meta = document.createElement('span');
    meta.className = 'item-meta';
    meta.textContent = artista.area + ' · ' + artista.local;
    texto.append(nome, meta);

    botao.append(estrela, texto);

    if (artista.demo) {
      const demo = document.createElement('span');
      demo.className = 'item-demo';
      demo.textContent = 'exemplo';
      botao.append(demo);
    }

    botao.addEventListener('click', function () {
      abrirArtista(artista.id);
    });

    li.appendChild(botao);
    return li;
  }

  function renderizarLista(filtro) {
    const termo = normalizar(filtro || '');
    const encontrados = ARTISTAS.filter(function (artista) {
      if (!termo) return true;
      return normalizar(artista.nome + ' ' + artista.local + ' ' + artista.area).indexOf(termo) !== -1;
    }).sort(function (a, b) {
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });

    el.lista.innerHTML = '';
    if (!encontrados.length) {
      const vazio = document.createElement('li');
      vazio.className = 'lista-vazia';
      vazio.textContent = 'Nenhuma estrela encontrada por aqui.';
      el.lista.appendChild(vazio);
      return;
    }

    encontrados.forEach(function (artista) {
      el.lista.appendChild(criarItemLista(artista));
    });
  }

  function abrirDrawer(opcoes) {
    if (el.drawerSugestoes && !el.drawerSugestoes.hidden) fecharSugestoes(false);
    if (!el.painel.hidden) fecharPainel(false);
    el.drawer.hidden = false;
    el.busca.value = '';
    renderizarLista('');
    atualizarHash('constelacao');
    atualizarPausa();

    const subtitulo = el.drawer.querySelector('.drawer-sub');
    if (subtitulo) {
      const texto = textoDrawer();
      subtitulo.textContent = CONFIG.MODO_DEMO
        ? texto + ' Prévia com dados de exemplo; as estrelas reais entram após a curadoria.'
        : texto;
    }

    if (!opcoes || !opcoes.semFoco) {
      requestAnimationFrame(function () {
        try {
          el.busca.focus({ preventScroll: true });
        } catch (erro) {
          /* ignora */
        }
      });
    }
  }

  function fecharDrawer(restaurarFoco) {
    el.drawer.hidden = true;
    limparHash('constelacao');
    atualizarPausa();
    if (restaurarFoco !== false) focarRetorno();
  }

  function abrirSugestoes(opcoes) {
    if (!el.painel.hidden) fecharPainel(false);
    if (!el.drawer.hidden) fecharDrawer(false);
    estado.ultimoFoco = document.activeElement;
    el.drawerSugestoes.hidden = false;
    atualizarHash('sugestoes');
    atualizarPausa();

    if (!opcoes || !opcoes.semFoco) {
      requestAnimationFrame(function () {
        const foco = el.btnIndicar3 || el.drawerSugestoes.querySelector('.fechar');
        if (foco) {
          try {
            foco.focus({ preventScroll: true });
          } catch (erro) {
            /* ignora */
          }
        }
      });
    }
  }

  function fecharSugestoes(restaurarFoco) {
    el.drawerSugestoes.hidden = true;
    limparHash('sugestoes');
    atualizarPausa();
    if (restaurarFoco !== false) focarRetorno();
  }

  /* ===== indicações ===== */

  function resetFormulario() {
    el.form.reset();
    el.form.hidden = false;
    el.sucesso.hidden = true;
    el.status.textContent = '';
    el.notaLocal.hidden = true;
    el.btnEnviar.disabled = false;
    el.btnEnviar.textContent = 'Enviar indicação';
  }

  function abrirIndicacao(opcoes) {
    if (!el.drawer.hidden) fecharDrawer(false);
    if (!el.painel.hidden) fecharPainel(false);
    resetFormulario();
    el.modal.hidden = false;
    estado.formularioAbertoEm = Date.now();
    atualizarHash('indicar');
    atualizarPausa();

    if (!opcoes || !opcoes.semFoco) {
      requestAnimationFrame(function () {
        const campo = el.form.querySelector('input[name="nome"]');
        if (campo) {
          try {
            campo.focus({ preventScroll: true });
          } catch (erro) {
            /* ignora */
          }
        }
      });
    }
  }

  function fecharIndicacao(restaurarFoco) {
    el.modal.hidden = true;
    limparHash('indicar');
    atualizarPausa();
    if (restaurarFoco !== false) focarRetorno();
  }

  function mensagemStatus(texto) {
    el.status.textContent = texto;
  }

  async function enviarIndicacao(ev) {
    ev.preventDefault();

    const dados = new FormData(el.form);
    const website = dados.get('website');
    if (website) {
      el.form.hidden = true;
      el.sucesso.hidden = false;
      el.notaLocal.hidden = true;
      return;
    }

    if (Date.now() - estado.formularioAbertoEm < 1200) {
      mensagemStatus('Calma, o rio tem tempo. Revise a indicação e envie de novo.');
      return;
    }

    const nome = String(dados.get('nome') || '').trim();
    const local = String(dados.get('local') || '').trim();
    const area = String(dados.get('area') || '').trim();
    const link = String(dados.get('link') || '').trim();
    const motivo = String(dados.get('motivo') || '').trim();
    const indicador = String(dados.get('indicador') || '').trim();
    const contato = String(dados.get('contato') || '').trim();
    const consentimento = Boolean(dados.get('consentimento'));

    const faltando = [];
    if (!nome) faltando.push(['nome', 'Informe o nome do artista.']);
    if (!local) faltando.push(['local', 'Informe a cidade e o estado.']);
    if (!area) faltando.push(['area', 'Escolha a linguagem artística.']);
    if (!motivo) faltando.push(['motivo', 'Conte por que essa pessoa merece brilhar.']);
    if (!consentimento) faltando.push(['consentimento', 'É preciso autorizar a análise da indicação.']);

    if (link && !/^https?:\/\//i.test(link)) {
      mensagemStatus('O link deve começar com http:// ou https://');
      return;
    }

    if (faltando.length) {
      mensagemStatus(faltando[0][1]);
      const campo = el.form.querySelector('[name="' + faltando[0][0] + '"]');
      if (campo) campo.focus();
      return;
    }

    el.btnEnviar.disabled = true;
    el.btnEnviar.textContent = 'Enviando...';
    mensagemStatus('');

    try {
      if (!window.Indicacoes) throw new Error('Módulo de indicações indisponível.');
      const resultado = await window.Indicacoes.enviar({
        nome: nome,
        local: local,
        area: area,
        link: link,
        motivo: motivo,
        indicador: indicador,
        contato: contato,
        consentimento: consentimento,
        origem: location.href,
      });

      el.form.hidden = true;
      el.sucesso.hidden = false;
      el.notaLocal.hidden = resultado.modo !== 'local';
      el.btnEnviar.disabled = false;
      el.btnEnviar.textContent = 'Enviar indicação';
      renderCuradoria();
      mostrarToast('Indicação guardada para a curadoria.');
      requestAnimationFrame(function () {
        if (el.btnFecharSucesso) el.btnFecharSucesso.focus({ preventScroll: true });
      });
    } catch (erro) {
      el.btnEnviar.disabled = false;
      el.btnEnviar.textContent = 'Enviar indicação';
      mensagemStatus('Não foi possível enviar agora. Tente de novo em instantes.');
    }
  }

  /* ===== curadoria local ===== */

  function templateArtista(item) {
    const id = slug(item.nome);
    const link = item.link
      ? "    links: [{ rotulo: 'Link', url: '" + escaparJs(item.link) + "' }],"
      : '    links: [],';
    return [
      '  {',
      "    id: '" + id + "',",
      "    nome: '" + escaparJs(item.nome) + "',",
      "    local: '" + escaparJs(item.local) + "',",
      "    area: '" + escaparJs(item.area) + "',",
      "    bio: '" + escaparJs(item.motivo) + "',",
      "    foto: '',",
      link,
      '    obras: [],',
      '    demo: false,',
      '  },',
    ].join('\n');
  }

  function renderCuradoria() {
    if (!el.curadoria || el.curadoria.hidden) return;
    const lista = window.Indicacoes ? window.Indicacoes.listar() : [];
    el.listaCuradoria.innerHTML = '';

    if (!lista.length) {
      const vazio = document.createElement('li');
      vazio.className = 'item-curadoria';
      const p = document.createElement('p');
      p.className = 'motivo';
      p.textContent = 'Nenhuma indicação salva neste navegador ainda.';
      vazio.appendChild(p);
      el.listaCuradoria.appendChild(vazio);
      return;
    }

    lista.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'item-curadoria';

      const nome = document.createElement('strong');
      nome.textContent = item.nome || 'Sem nome';
      li.appendChild(nome);

      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = [item.area, item.local, item.contato || item.indicador].filter(Boolean).join(' · ');
      li.appendChild(meta);

      const motivo = document.createElement('p');
      motivo.className = 'motivo';
      motivo.textContent = item.motivo || '';
      li.appendChild(motivo);

      const status = document.createElement('span');
      status.className = 'status';
      status.textContent = item.status || 'pendente';
      li.appendChild(status);

      const acoes = document.createElement('div');
      acoes.className = 'acoes';

      const btnAprovar = document.createElement('button');
      btnAprovar.type = 'button';
      btnAprovar.className = 'botao-mini';
      btnAprovar.textContent = 'Aprovar';
      btnAprovar.addEventListener('click', function () {
        window.Indicacoes.atualizarStatus(item.id, 'aprovado');
        renderCuradoria();
        mostrarToast('Indicação aprovada.');
      });

      const btnRecusar = document.createElement('button');
      btnRecusar.type = 'button';
      btnRecusar.className = 'botao-mini';
      btnRecusar.textContent = 'Recusar';
      btnRecusar.addEventListener('click', function () {
        window.Indicacoes.atualizarStatus(item.id, 'recusado');
        renderCuradoria();
        mostrarToast('Indicação recusada.');
      });

      const btnCopiar = document.createElement('button');
      btnCopiar.type = 'button';
      btnCopiar.className = 'botao-mini';
      btnCopiar.textContent = 'Copiar item';
      btnCopiar.addEventListener('click', async function () {
        const ok = await copiarTexto(templateArtista(item));
        mostrarToast(ok ? 'Item copiado para artistas.js' : 'Não foi possível copiar.');
      });

      const btnExcluir = document.createElement('button');
      btnExcluir.type = 'button';
      btnExcluir.className = 'botao-mini';
      btnExcluir.textContent = 'Excluir';
      btnExcluir.addEventListener('click', function () {
        window.Indicacoes.remover(item.id);
        renderCuradoria();
        mostrarToast('Indicação excluída.');
      });

      acoes.append(btnAprovar, btnRecusar, btnCopiar, btnExcluir);
      li.appendChild(acoes);
      el.listaCuradoria.appendChild(li);
    });
  }

  function iniciarCuradoria() {
    const params = new URLSearchParams(location.search);
    if (!params.has('curadoria')) return;
    if (!estado.iniciado) entrar({ silencioso: true });
    el.curadoria.hidden = false;
    renderCuradoria();
  }

  /* ===== som do rio ===== */

  let audioCtx = null;
  let audioGanho = null;
  let audioFonte = null;

  function ligarAudio(silencioso) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      if (!silencioso) mostrarToast('Seu navegador não tem suporte a áudio.');
      return;
    }

    try {
      if (!audioCtx) {
        audioCtx = new AudioCtx();
        const duracao = 3;
        const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duracao, audioCtx.sampleRate);
        const dados = buffer.getChannelData(0);
        let ultimo = 0;
        for (let i = 0; i < dados.length; i++) {
          const branco = Math.random() * 2 - 1;
          ultimo = (ultimo + 0.02 * branco) / 1.02;
          dados[i] = ultimo * 3.2;
        }

        audioFonte = audioCtx.createBufferSource();
        audioFonte.buffer = buffer;
        audioFonte.loop = true;

        const filtro = audioCtx.createBiquadFilter();
        filtro.type = 'lowpass';
        filtro.frequency.value = 900;
        filtro.Q.value = 0.6;

        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.12;
        const lfoGanho = audioCtx.createGain();
        lfoGanho.gain.value = 240;
        lfo.connect(lfoGanho).connect(filtro.frequency);
        lfo.start();

        audioGanho = audioCtx.createGain();
        audioGanho.gain.value = 0;
        audioFonte.connect(filtro).connect(audioGanho).connect(audioCtx.destination);
        audioFonte.start();
      }

      audioCtx.resume();
      audioGanho.gain.cancelScheduledValues(audioCtx.currentTime);
      audioGanho.gain.setTargetAtTime(0.13, audioCtx.currentTime, 0.8);
      estado.audioAtivo = true;
      atualizarBotaoSom();
      localStorage.setItem('estrelas:som', '1');
    } catch (erro) {
      if (!silencioso) mostrarToast('Não foi possível ligar o som do rio.');
    }
  }

  function desligarAudio() {
    if (audioCtx && audioGanho) {
      audioGanho.gain.cancelScheduledValues(audioCtx.currentTime);
      audioGanho.gain.setTargetAtTime(0, audioCtx.currentTime, 0.4);
    }
    estado.audioAtivo = false;
    atualizarBotaoSom();
    localStorage.setItem('estrelas:som', '0');
  }

  function atualizarBotaoSom() {
    if (!el.btnSom) return;
    el.btnSom.classList.toggle('ligado', estado.audioAtivo);
    el.btnSom.setAttribute('aria-pressed', estado.audioAtivo ? 'true' : 'false');
    el.btnSom.setAttribute(
      'aria-label',
      estado.audioAtivo ? 'Desligar som do rio' : 'Ligar som do rio'
    );
    el.btnSom.title = estado.audioAtivo ? 'Desligar som do rio' : 'Ligar som do rio';
  }

  /* ===== hash e inicialização ===== */

  function aplicarHash() {
    const hash = location.hash.slice(1);
    if (!hash) return;
    if (hash.indexOf('artista=') === 0) {
      abrirArtista(decodeURIComponent(hash.slice(8)), { semFoco: false });
    } else if (hash === 'indicar') {
      abrirIndicacao({ semFoco: false });
    } else if (hash === 'constelacao') {
      abrirDrawer({ semFoco: false });
    } else if (hash === 'sugestoes') {
      abrirSugestoes({ semFoco: false });
    }
  }

  /* ===== eventos ===== */

  if (el.btnEntrar) {
    el.btnEntrar.addEventListener('click', function () {
      entrar();
    });
  }

  document.querySelectorAll('[data-entrar-barco]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      entrar();
    });
  });

  if (el.btnConstelacao) el.btnConstelacao.addEventListener('click', function () { abrirDrawer(); });
  if (el.btnIndicar) el.btnIndicar.addEventListener('click', function () { abrirSugestoes(); });
  if (el.btnIndicar2) el.btnIndicar2.addEventListener('click', function () { abrirIndicacao(); });
  if (el.btnIndicar3) el.btnIndicar3.addEventListener('click', function () { abrirIndicacao(); });

  if (el.btnSom) {
    el.btnSom.addEventListener('click', function () {
      if (estado.audioAtivo) desligarAudio();
      else ligarAudio(false);
    });
  }

  document.querySelectorAll('[data-fechar-painel]').forEach(function (botao) {
    botao.addEventListener('click', function () { fecharPainel(); });
  });
  document.querySelectorAll('[data-fechar-drawer]').forEach(function (botao) {
    botao.addEventListener('click', function () { fecharDrawer(); });
  });
  document.querySelectorAll('[data-fechar-sugestoes]').forEach(function (botao) {
    botao.addEventListener('click', function () { fecharSugestoes(); });
  });
  document.querySelectorAll('[data-fechar-modal]').forEach(function (botao) {
    botao.addEventListener('click', function () { fecharIndicacao(); });
  });
  document.querySelectorAll('[data-fechar-lightbox]').forEach(function (botao) {
    botao.addEventListener('click', function () { fecharLightbox(); });
  });

  if (el.anterior) el.anterior.addEventListener('click', function () { navegarArtista(-1); });
  if (el.proximo) el.proximo.addEventListener('click', function () { navegarArtista(1); });

  if (el.busca) {
    el.busca.addEventListener('input', function () {
      renderizarLista(el.busca.value);
    });
  }

  if (el.mostrarNomes) {
    el.mostrarNomes.addEventListener('change', function () {
      if (window.Cena) window.Cena.definirMostrarNomes(el.mostrarNomes.checked);
    });
  }

  if (el.form) el.form.addEventListener('submit', enviarIndicacao);

  if (el.btnIndicarOutra) {
    el.btnIndicarOutra.addEventListener('click', function () {
      resetFormulario();
      estado.formularioAbertoEm = Date.now();
      const campo = el.form.querySelector('input[name="nome"]');
      if (campo) campo.focus();
    });
  }

  if (el.btnFecharSucesso) {
    el.btnFecharSucesso.addEventListener('click', function () {
      fecharIndicacao();
    });
  }

  if (el.lightbox) {
    el.lightbox.addEventListener('click', function (ev) {
      if (ev.target === el.lightbox) fecharLightbox();
    });
  }

  if (el.modal) {
    el.modal.addEventListener('keydown', function (ev) {
      prenderFoco(ev, el.modal);
    });
  }

  if (el.lightbox) {
    el.lightbox.addEventListener('keydown', function (ev) {
      prenderFoco(ev, el.lightbox);
    });
  }

  if (el.btnFecharCuradoria) {
    el.btnFecharCuradoria.addEventListener('click', function () {
      el.curadoria.hidden = true;
    });
  }

  if (el.btnExportar) {
    el.btnExportar.addEventListener('click', function () {
      if (!window.Indicacoes) return;
      baixarArquivo(
        'estrelas-do-norte-indicacoes.json',
        window.Indicacoes.exportar(),
        'application/json;charset=utf-8'
      );
      mostrarToast('Indicações exportadas.');
    });
  }

  if (el.btnLimpar) {
    el.btnLimpar.addEventListener('click', function () {
      if (!window.Indicacoes) return;
      const ok = window.confirm('Apagar todas as indicações salvas neste navegador?');
      if (!ok) return;
      window.Indicacoes.limpar();
      renderCuradoria();
      mostrarToast('Indicações apagadas.');
    });
  }

  window.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape') return;
    if (!el.lightbox.hidden) {
      fecharLightbox();
    } else if (!el.modal.hidden) {
      fecharIndicacao();
    } else if (!el.drawer.hidden) {
      fecharDrawer();
    } else if (el.drawerSugestoes && !el.drawerSugestoes.hidden) {
      fecharSugestoes();
    } else if (!el.painel.hidden) {
      fecharPainel();
    } else if (el.curadoria && !el.curadoria.hidden) {
      el.curadoria.hidden = true;
    }
  });

  window.addEventListener('estrela:selecionar', function (ev) {
    if (ev.detail && ev.detail.id) abrirArtista(ev.detail.id);
  });

  /* ===== start ===== */

  function iniciar() {
    renderizarLista('');
    atualizarBotaoSom();

    const params = new URLSearchParams(location.search);
    const temHash = Boolean(location.hash);
    const atalho = params.get('direto') === '1';

    if (atalho || temHash) {
      entrar({ silencioso: true });
      aplicarHash();
    }

    iniciarCuradoria();

    if (CONFIG.MODO_DEMO) {
      const subtitulo = el.drawer.querySelector('.drawer-sub');
      if (subtitulo) {
        subtitulo.textContent =
          textoDrawer() + ' Prévia com dados de exemplo; as estrelas reais entram após a curadoria.';
      }
    }
  }

  iniciar();
})();
