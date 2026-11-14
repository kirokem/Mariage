/**
 * Charlène & Julien — interactions du site (JavaScript sans dépendance).
 *
 * Le site fonctionne aussi sans JavaScript ; ce fichier ajoute :
 *  1. le menu burger sur mobile et la mise en évidence de la section active ;
 *  2. l'apparition en fondu au défilement (désactivée si l'utilisateur
 *     préfère réduire les animations) ;
 *  3. l'affichage conditionnel des questions du RSVP et l'envoi du
 *     formulaire sans rechargement de la page.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initRsvp();
  });

  /* ------------------------------------------------------------------ */
  /*  1. Navigation                                                      */
  /* ------------------------------------------------------------------ */
  function initNav() {
    var nav = document.querySelector('[data-nav]');
    if (!nav) return;
    var toggle = nav.querySelector('[data-nav-toggle]');
    var menu = nav.querySelector('#menu');
    var links = Array.prototype.slice.call(nav.querySelectorAll('.nav__menu a'));
    var mobile = window.matchMedia('(max-width: 63.99em)');

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      // Hors du menu ouvert, les liens ne doivent pas être atteignables au clavier
      if (mobile.matches) {
        if (open) { menu.removeAttribute('inert'); } else { menu.setAttribute('inert', ''); }
      }
      if (open && links[0]) links[0].focus();
    }

    function syncMode() {
      if (mobile.matches) {
        if (!nav.classList.contains('is-open')) menu.setAttribute('inert', '');
      } else {
        menu.removeAttribute('inert');
        setOpen(false);
      }
    }
    syncMode();
    if (mobile.addEventListener) mobile.addEventListener('change', syncMode);

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) setOpen(false);
      });
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Filet sous le menu dès qu'on a défilé
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Section active dans le menu
    if (!('IntersectionObserver' in window)) return;
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ------------------------------------------------------------------ */
  /*  2. Apparition en fondu                                             */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ */
  /*  3. Formulaire RSVP                                                 */
  /* ------------------------------------------------------------------ */
  function initRsvp() {
    var form = document.querySelector('[data-rsvp-form]');
    if (!form) return;
    var status = document.querySelector('[data-rsvp-status]');
    var submit = form.querySelector('[data-rsvp-submit]');
    var submitLabel = submit.textContent;

    // Les erreurs sont vérifiées par le serveur et affichées en français
    // à côté de chaque champ : on désactive les bulles du navigateur.
    form.setAttribute('novalidate', '');

    /* --- Affichage conditionnel --- */
    var groupPresent = form.querySelector('[data-if-present]');
    var subTransport = form.querySelectorAll('[data-if-transport]');
    var subCovoit = form.querySelectorAll('[data-if-covoit]');
    var arrivee = form.querySelector('#arrivee');
    var depart = form.querySelector('#depart');

    function value(name) {
      var checked = form.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }

    function isInsideHidden(el) {
      for (var n = el.parentElement; n && n !== form; n = n.parentElement) {
        if (n.hidden) return true;
      }
      return false;
    }

    function update() {
      groupPresent.hidden = value('presence') !== 'oui';
      subTransport.forEach(function (el) {
        el.hidden = el.getAttribute('data-if-transport') !== value('transport');
      });
      subCovoit.forEach(function (el) {
        el.hidden = el.getAttribute('data-if-covoit').split(' ').indexOf(value('covoiturage')) === -1;
      });
      // Un champ masqué est désactivé : il n'est ni validé ni envoyé.
      form.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(function (field) {
        if (field.name !== 'site_web') field.disabled = isInsideHidden(field);
      });
      // Le départ ne peut pas précéder l'arrivée
      if (arrivee && depart) {
        Array.prototype.forEach.call(depart.options, function (opt) {
          opt.disabled = opt.value !== '' && arrivee.value !== '' && opt.value < arrivee.value;
        });
        if (depart.value && arrivee.value && depart.value < arrivee.value) depart.value = '';
      }
    }
    form.addEventListener('change', update);
    update();

    /* --- Erreurs --- */
    function clearErrors() {
      form.querySelectorAll('.field__error').forEach(function (p) { p.hidden = true; p.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
    }
    function showErrors(errors) {
      var first = null;
      Object.keys(errors).forEach(function (name) {
        var p = form.querySelector('#err-' + name);
        if (p) { p.textContent = errors[name]; p.hidden = false; }
        var field = form.querySelector('[name="' + name + '"]');
        if (field) {
          var target = field.type === 'radio' ? field.closest('fieldset') : field;
          target.setAttribute('aria-invalid', 'true');
          if (!first) first = field;
        }
      });
      if (first) first.focus();
    }
    function setStatus(message, type) {
      status.textContent = message;
      status.className = 'rsvp__status' + (type ? ' is-' + type : '');
      status.hidden = !message;
    }

    /* --- Envoi sans rechargement --- */
    form.addEventListener('submit', function (ev) {
      if (!window.fetch || !window.FormData) return; // envoi classique
      ev.preventDefault();
      clearErrors();
      setStatus('', '');
      submit.disabled = true;
      submit.textContent = form.getAttribute('data-msg-sending') || submitLabel;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        credentials: 'same-origin'
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: false }; });
        })
        .then(function (data) {
          if (data.ok) {
            form.hidden = true;
            setStatus(data.message, 'success');
            status.focus();
            status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
            return;
          }
          setStatus(data.message || fallbackError(), 'error');
          if (data.errors && Object.keys(data.errors).length) {
            showErrors(data.errors);
          } else {
            status.focus();
          }
        })
        .catch(function () {
          setStatus(fallbackError(), 'error');
          status.focus();
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = submitLabel;
        });
    });

    function fallbackError() {
      return 'Nous sommes désolés, votre réponse n’a pas pu être envoyée. Vérifiez votre connexion internet et réessayez.';
    }
  }
})();
