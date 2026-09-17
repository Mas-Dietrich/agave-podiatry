(function () {
  var root = document.querySelector('.agv');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = typeof IntersectionObserver !== 'undefined';

  /* Scroll reveals */
  var nodes = [].slice.call(root.querySelectorAll('.rv'));
  var counted = false;
  function countUp(el) {
    var span = el.firstElementChild || el;
    if (counted || reduce) return;
    counted = true;
    var t0 = performance.now(), dur = 1400;
    function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      span.textContent = (4.88 * e).toFixed(2);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (hasIO && !reduce) {
    var vh = window.innerHeight || 0;
    nodes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
    root.classList.add('m-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.hasAttribute('data-count')) countUp(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    nodes.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
  } else {
    nodes.forEach(function (el) { el.classList.add('in'); });
  }

  /* Header state, scroll progress line, hero parallax */
  var raf = 0, scrolled = false;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var d = document.documentElement;
      var st = window.pageYOffset || d.scrollTop || 0;
      var max = d.scrollHeight - d.clientHeight;
      root.style.setProperty('--sy', String(Math.min(st, 1200)));
      root.style.setProperty('--sp', String(max > 0 ? Math.min(1, st / max) : 0));
      var s = st > 48;
      if (s !== scrolled) { scrolled = s; root.classList.toggle('is-scrolled', s); }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active section in the nav */
  var navLinks = [].slice.call(document.querySelectorAll('.nav .nl'));
  if (hasIO) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var href = '#' + en.target.id;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === href;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    [].slice.call(document.querySelectorAll('section[id]')).forEach(function (s) { spy.observe(s); });
  }

  /* Mobile menu */
  var menu = document.getElementById('agv-menu');
  var menuBtn = document.querySelector('.menu-btn');
  var closeBtn = document.querySelector('.mnav-close');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus();
    else if (menuBtn.offsetParent) menuBtn.focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', function () { setMenu(true); });
  closeBtn.addEventListener('click', function () { setMenu(false); });
  menu.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  [].slice.call(menu.querySelectorAll('a')).forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* FAQ accordion */
  var qas = [].slice.call(document.querySelectorAll('.qa'));
  qas.forEach(function (qa) {
    var b = qa.querySelector('.qa-b');
    b.addEventListener('click', function () {
      var wasOpen = qa.classList.contains('open');
      qas.forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.qa-b').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        qa.classList.add('open');
        b.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Reviews carousel dots */
  var quotes = document.querySelector('.quotes');
  var dots = [].slice.call(document.querySelectorAll('.dot'));
  function stepWidth() {
    var f = quotes.firstElementChild;
    return f ? f.offsetWidth + 12 : 0;
  }
  function mark(i) {
    dots.forEach(function (d, n) {
      d.classList.toggle('on', n === i);
      d.setAttribute('aria-current', n === i ? 'true' : 'false');
    });
  }
  var qraf = 0;
  quotes.addEventListener('scroll', function () {
    if (qraf) return;
    qraf = requestAnimationFrame(function () {
      qraf = 0;
      var w = stepWidth();
      if (!w) return;
      mark(Math.max(0, Math.min(dots.length - 1, Math.round(quotes.scrollLeft / w))));
    });
  }, { passive: true });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      quotes.scrollTo({ left: i * stepWidth(), behavior: reduce ? 'auto' : 'smooth' });
      mark(i);
    });
  });
})();
