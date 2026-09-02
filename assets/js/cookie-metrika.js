/**
 * Cookie banner + Yandex.Metrika (loads only after consent).
 * Set YM_COUNTER_ID to your counter number from https://metrika.yandex.ru/
 */
(function () {
  var YM_COUNTER_ID = 0; // TODO: replace with real counter ID
  var CONSENT_KEY = 'cookieConsent';

  function loadYandexMetrika() {
    if (!YM_COUNTER_ID) return;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(YM_COUNTER_ID, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true
    });
  }

  function privacyHref() {
    // RU legal page at site root; EN pages use en/privacy-policy.html
    if (document.documentElement.lang === 'en') {
      var path = window.location.pathname || '';
      return path.indexOf('/en/') !== -1 || /\/en\/?$/.test(path)
        ? 'privacy-policy.html'
        : 'en/privacy-policy.html';
    }
    return 'privacy-policy.html';
  }

  function bannerCopy() {
    var isEn = document.documentElement.lang === 'en';
    if (isEn) {
      return {
        text: 'We use cookies and Yandex.Metrika to analyze site traffic. By continuing, you agree to the ',
        link: 'Privacy Policy',
        button: 'OK'
      };
    }
    return {
      text: 'Мы используем файлы cookie и сервис «Яндекс.Метрика» для анализа посещаемости сайта. Продолжая пользоваться сайтом, вы соглашаетесь с ',
      link: 'Политикой обработки персональных данных',
      button: 'Хорошо'
    };
  }

  function ensureStyles() {
    if (document.getElementById('cookie-banner-styles')) return;
    var style = document.createElement('style');
    style.id = 'cookie-banner-styles';
    style.textContent = [
      '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;display:none;',
      'background:#1A1A2E;color:rgba(255,255,255,.88);padding:16px 20px;font-family:Manrope,sans-serif;',
      'font-size:13px;line-height:1.5;border-top:1px solid rgba(255,255,255,.12);',
      'box-shadow:0 -8px 32px rgba(26,26,46,.25);}',
      '#cookie-banner .cookie-banner__inner{max-width:1100px;margin:0 auto;display:flex;gap:16px;',
      'align-items:center;justify-content:space-between;flex-wrap:wrap;}',
      '#cookie-banner a{color:#D4A843;text-decoration:underline;}',
      '#cookie-banner a:hover{color:#E6C56A;}',
      '#cookie-accept{background:#C84B31;color:#fff;border:none;border-radius:2px;',
      'font-family:Manrope,sans-serif;font-size:13px;font-weight:700;letter-spacing:.04em;',
      'padding:10px 20px;cursor:pointer;flex-shrink:0;}',
      '#cookie-accept:hover{background:#E86B4F;}',
      '@media (max-width:640px){#cookie-banner .cookie-banner__inner{flex-direction:column;align-items:stretch;}',
      '#cookie-accept{width:100%;}}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureBanner() {
    var existing = document.getElementById('cookie-banner');
    if (existing) return existing;
    ensureStyles();
    var copy = bannerCopy();
    var el = document.createElement('div');
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p style="margin:0;flex:1;min-width:220px;">' + copy.text +
          '<a href="' + privacyHref() + '">' + copy.link + '</a>.' +
        '</p>' +
        '<button type="button" id="cookie-accept">' + copy.button + '</button>' +
      '</div>';
    document.body.appendChild(el);
    return el;
  }

  function init() {
    var banner = ensureBanner();
    var acceptBtn = document.getElementById('cookie-accept');

    if (localStorage.getItem(CONSENT_KEY) === 'true') {
      loadYandexMetrika();
      return;
    }

    banner.style.display = 'block';
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'true');
      banner.style.display = 'none';
      loadYandexMetrika();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
