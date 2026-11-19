// Aviso de cookies y Pixel de Meta de Coplario (agregado el 19 nov 2026).
// El pixel NO se carga hasta que la persona toca "Aceptar"; si toca "Rechazar" no se carga nunca.
// La respuesta se guarda en este navegador (localStorage "coplario:cookies" = "si" o "no").
// En privacidad.html se puede cambiar: botones con data-cookies="si" / "no" y un #estadoCookies.
// 1483054440455392,1629189299010696 lo completa construir_demo_coplario.mjs (constante PIXEL_META). Si queda vacío,
// no se muestra el aviso ni se carga nada.
(function () {
  // uno o varios pixeles separados por coma (Coplario y Tikismikis)
  var PIXELES = '1483054440455392,1629189299010696'.split(',').filter(Boolean);
  var CLAVE = 'coplario:cookies';
  if (!PIXELES.length) return;

  function leer() { try { return localStorage.getItem(CLAVE); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(CLAVE, v); } catch (e) { /* sin almacenamiento: se vuelve a preguntar */ } }

  var cargado = false;
  function cargarPixel() {
    if (cargado) return;
    cargado = true;
    // código base del Pixel de Meta (el que da el Administrador de eventos)
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('consent', 'grant');
    PIXELES.forEach(function (id) { window.fbq('init', id); });
    window.fbq('track', 'PageView');   // se manda a todos los pixeles iniciados
  }

  // _fbp y _fbc son las cookies que el pixel deja en este dominio: se borran al rechazar
  function borrarCookiesMeta() {
    var dom = location.hostname.replace(/^www\./, '');
    ['_fbp', '_fbc'].forEach(function (n) {
      document.cookie = n + '=; Max-Age=0; path=/';
      document.cookie = n + '=; Max-Age=0; path=/; domain=.' + dom;
    });
  }

  var aviso = null;
  function quitarAviso() { if (aviso) { aviso.remove(); aviso = null; } }

  function mostrarEstado() {
    var el = document.getElementById('estadoCookies');
    if (!el) return;
    var v = leer();
    el.textContent = 'Estado actual: ' + (v === 'si' ? 'aceptadas.' : v === 'no' ? 'rechazadas.' : 'sin respuesta.');
  }

  function elegir(v) {
    guardar(v);
    quitarAviso();
    if (v === 'si') cargarPixel();
    else { if (window.fbq) window.fbq('consent', 'revoke'); borrarCookiesMeta(); }
    mostrarEstado();
  }

  function mostrarAviso() {
    aviso = document.createElement('div');
    aviso.className = 'cookies';
    aviso.setAttribute('role', 'region');
    aviso.setAttribute('aria-label', 'Aviso de cookies');
    aviso.innerHTML =
      '<p>Este sitio utiliza cookies de terceros para personalizar contenidos. <a href="privacidad.html">Más información</a></p>' +
      '<div class="cookies-botones"><button type="button" class="btn" data-cookies="no">Rechazar</button><button type="button" class="btn" data-cookies="si">Aceptar</button></div>';
    document.body.appendChild(aviso);
  }

  function arrancar() {
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-cookies]');
      if (b) elegir(b.getAttribute('data-cookies'));
    });
    var v = leer();
    if (v === 'si') cargarPixel();
    else if (v !== 'no' && !document.getElementById('estadoCookies')) mostrarAviso();   // en privacidad.html ya están los botones
    mostrarEstado();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar); else arrancar();
})();
