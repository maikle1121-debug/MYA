/* ============================================================
   MYA PDF — main.js
   موارد مشتركة: هيدر، حركات ظهور، زر صعود، زر واتساب عائم،
   والمربع الحواري لإرسال البريد الإلكتروني إلى واتساب المطور
   ============================================================ */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = '201015191915'; // 01015191915 بصيغة دولية
  var INSTAPAY_NUMBER = '01281328304';
  var TELEGRAM_LINK = 'https://t.me/+aH69YpqPNIxkNjlk';
  var EMAIL = 'maikle1121@gmail.com';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- WhatsApp open (mobile app / desktop app / web) ---------- */
  function openWhatsApp(message) {
    var text = encodeURIComponent(message || '');
    var webUrl = 'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + text : '');
    var isMobile = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|webOS/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = webUrl;
      return;
    }

    var a = document.createElement('a');
    a.href = webUrl;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showWhatsAppHelp();
  }

  function buildWhatsAppHelp() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'waHelpModal';
    overlay.innerHTML =
      '<div class="modal-box" style="position:relative">' +
        '<button class="modal-close" id="waHelpClose" aria-label="إغلاق">✕</button>' +
        '<h3><span class="ico">📱</span> افتح واتساب ويب واربط هاتفك</h3>' +
        '<p>لو ظهر رمز QR على الشاشة، اربطه من داخل تطبيق واتساب على موبايلك:</p>' +
        '<ol class="wa-help-steps">' +
          '<li>تابع تبويب واتساب الذي فُتح وسيظهر رمز QR على الشاشة.</li>' +
          '<li>من تطبيق واتساب على موبايلك: اضغط <strong>القائمة (⋮)</strong> ثم <strong>الأجهزة المرتبطة</strong>.</li>' +
          '<li>اضغط <strong>ربط جهاز جديد</strong> وامسح رمز QR الظاهر على شاشة الكمبيوتر.</li>' +
          '<li>بعد الربط تظهر محادثتك وتكتب رسالتك جاهزة للإرسال.</li>' +
        '</ol>' +
        '<button type="button" id="waHelpGo" class="modal-cta">فتح واتساب ويب</button>' +
      '</div>';
    document.body.appendChild(overlay);

    var closeBtn = document.getElementById('waHelpClose');
    var goBtn = document.getElementById('waHelpGo');
    closeBtn.addEventListener('click', function () { overlay.classList.remove('open'); document.body.style.overflow = ''; });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
    });
    goBtn.addEventListener('click', function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      var a = document.createElement('a');
      a.href = 'https://web.whatsapp.com/';
      a.target = '_blank';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  function showWhatsAppHelp() {
    var overlay = document.getElementById('waHelpModal');
    if (!overlay) buildWhatsAppHelp();
    overlay = document.getElementById('waHelpModal');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function wireWhatsAppLinks() {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="https://wa.me/"]'), function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var m = a.href.match(/[?&]text=([^&]*)/);
        var text = m ? decodeURIComponent(m[1]) : '';
        openWhatsApp(text);
      });
    });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('navLinks');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var btn = document.createElement('button');
    btn.className = 'to-top';
    btn.setAttribute('aria-label', 'العودة للأعلى');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
    function onScroll() {
      btn.classList.toggle('show', window.scrollY > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Floating Telegram + WhatsApp buttons ---------- */
  function initFab() {
    var stack = document.createElement('div');
    stack.className = 'fab-stack';

    var tg = document.createElement('a');
    tg.className = 'fab fab-telegram';
    tg.setAttribute('aria-label', 'انضم لجروب التليجرام');
    tg.setAttribute('target', '_blank');
    tg.setAttribute('rel', 'noopener');
    tg.href = TELEGRAM_LINK;
    tg.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
    stack.appendChild(tg);

    var fab = document.createElement('a');
    fab.className = 'fab fab-whatsapp';
    fab.setAttribute('aria-label', 'تواصل عبر واتساب');
    fab.setAttribute('rel', 'noopener');
    fab.href = '#';
    fab.addEventListener('click', function (e) {
      e.preventDefault();
      openWhatsApp('مرحباً، أريد الاستفسار عن MYA PDF');
    });
    fab.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    stack.appendChild(fab);

    document.body.appendChild(stack);
  }

  /* ---------- Contact modal (email -> WhatsApp) ---------- */
  function buildModal() {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'contactModal';
    overlay.innerHTML =
      '<div class="modal-box" style="position:relative">' +
        '<button class="modal-close" id="modalClose" aria-label="إغلاق">✕</button>' +
        '<h3><span class="ico">💬</span> تواصل معنا عبر واتساب</h3>' +
        '<p>اكتب بريدك الإلكتروني ورسالتك، وسيتم فتح واتساب برسالة جاهزة تُرسل إلينا مباشرة.</p>' +
        '<form id="contactForm" novalidate>' +
          '<div class="form-field">' +
            '<label for="cf-name">الاسم (اختياري)</label>' +
            '<input type="text" id="cf-name" placeholder="اكتب اسمك">' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="cf-email">البريد الإلكتروني *</label>' +
            '<input type="email" id="cf-email" placeholder="example@email.com" required dir="ltr" style="text-align:left">' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="cf-topic">الموضوع</label>' +
            '<select id="cf-topic">' +
              '<option>استفسار عن الاشتراك</option>' +
              '<option>الاشتراك الاحترافي</option>' +
              '<option>اشتراك الأعمال</option>' +
              '<option>دعم فني</option>' +
              '<option>أخرى</option>' +
            '</select>' +
          '</div>' +
          '<div class="form-field">' +
            '<label for="cf-msg">رسالتك *</label>' +
            '<textarea id="cf-msg" placeholder="اكتب رسالتك هنا..." required></textarea>' +
          '</div>' +
          '<div class="modal-note">بعد الضغط على الزر، سيُفتح واتساب برسالة جاهزة تتضمن بريدك ورسالتك — فقط اضغط إرسال في واتساب.</div>' +
          '<button type="submit" class="modal-cta">إرسال عبر واتساب</button>' +
        '</form>' +
      '</div>';
    document.body.appendChild(overlay);

    var form = document.getElementById('contactForm');
    var overlayEl = document.getElementById('contactModal');
    var closeBtn = document.getElementById('modalClose');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      var topic = document.getElementById('cf-topic').value;
      var msg = document.getElementById('cf-msg').value.trim();

      if (!email || !msg) return;
      var text = 'مرحباً MYA PDF 👋\n' +
        (name ? 'الاسم: ' + name + '\n' : '') +
        'البريد الإلكتروني: ' + email + '\n' +
        'الموضوع: ' + topic + '\n' +
        'الرسالة: ' + msg;
      closeModal();
      openWhatsApp(text);
    });

    overlayEl.addEventListener('click', function (e) {
      if (e.target === overlayEl) closeModal();
    });
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal() {
    var m = document.getElementById('contactModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }
  window.openContactModal = function () {
    var m = document.getElementById('contactModal');
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = document.getElementById('cf-name');
    if (first) setTimeout(function () { first.focus(); }, 120);
  };

  function wireModalTriggers() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-open-contact]'), function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var topic = el.getAttribute('data-topic');
        if (topic) {
          var sel = document.getElementById('cf-topic');
          if (sel) {
            Array.prototype.forEach.call(sel.options, function (opt) {
              if (opt.text === topic) sel.value = opt.value;
            });
          }
        }
        window.openContactModal();
      });
    });
  }

  /* ---------- Hero gallery (auto-rotating showcase) ---------- */
  function initGallery() {
    var track = document.querySelector('.gallery-track');
    if (!track) return;
    var slides = track.querySelectorAll('.gallery-slide');
    var dots = document.querySelectorAll('.gallery-dots .dot');
    if (!slides.length) return;

    var index = 0;
    var timer = null;

    function go(i) {
      index = (i + slides.length) % slides.length;
      var rtl = getComputedStyle(document.documentElement).direction === 'rtl';
      var offset = rtl ? index : -index;
      Array.prototype.forEach.call(slides, function (s) {
        s.style.transform = 'translateX(' + offset * 100 + '%)';
      });
      Array.prototype.forEach.call(dots, function (d, k) {
        d.classList.toggle('active', k === index);
      });
    }

    function play() {
      stop();
      timer = setInterval(function () { go(index + 1); }, 4000);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    Array.prototype.forEach.call(dots, function (d, k) {
      d.addEventListener('click', function () {
        go(k);
        play();
      });
    });

    go(0);
    play();
  }

  /* ---------- Init ---------- */
  function init() {
    initMenu();
    initHeaderScroll();
    initReveal();
    initToTop();
    initFab();
    initGallery();
    buildModal();
    buildWhatsAppHelp();
    wireModalTriggers();
    wireWhatsAppLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
