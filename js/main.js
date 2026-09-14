/* Carrousel avant / après — défilement simple, une slide à la fois */
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track  = carousel.querySelector('[data-track]');
  const slides = track.children.length;
  let index = 0;

  const render = () => {
    track.style.transform = `translateX(${-index * 100}%)`;
  };

  const go = (step) => {
    index = (index + step + slides) % slides;
    render();
  };

  carousel.querySelector('[data-prev]').addEventListener('click', () => go(-1));
  carousel.querySelector('[data-next]').addEventListener('click', () => go(1));
});

/* Soins et traitements — onglets + navigation par fleches */
(() => {
  const section = document.querySelector('.care');
  if (!section) return;

  const tabs   = [...section.querySelectorAll('[data-tab]')];
  const panels = [...section.querySelectorAll('[data-panel]')];
  let current = 0;

  const show = (i) => {
    current = (i + tabs.length) % tabs.length;
    tabs.forEach((t, n)   => t.classList.toggle('is-active', n === current));
    panels.forEach((p, n) => p.classList.toggle('is-active', n === current));
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
  section.querySelector('[data-care-prev]').addEventListener('click', () => show(current - 1));
  section.querySelector('[data-care-next]').addEventListener('click', () => show(current + 1));
})();

/* FAQ — accordeon : une seule reponse ouverte a la fois */
(() => {
  const list = document.querySelector('[data-faq]');
  if (!list) return;

  const items = [...list.querySelectorAll('details')];
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.forEach((other) => { if (other !== item) other.open = false; });
    });
  });
})();

/* Menu mobile — ouverture / fermeture */
(() => {
  const burger = document.querySelector('.burger');
  const menu   = document.querySelector('.menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('is-menu-open');
    burger.setAttribute('aria-expanded', String(open));
  });

  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      document.body.classList.remove('is-menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* Annee courante dans le footer */
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* Blog — filtre par categorie */
(() => {
  const grid = document.querySelector('[data-posts]');
  if (!grid) return;

  const buttons = [...document.querySelectorAll('[data-filter]')];
  const posts   = [...grid.querySelectorAll('[data-cat]')];
  const empty   = document.querySelector('[data-empty]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));

      let visible = 0;
      posts.forEach((post) => {
        const show = cat === 'tous' || post.dataset.cat === cat;
        post.hidden = !show;
        if (show) visible++;
      });

      if (empty) empty.hidden = visible > 0;
    });
  });
})();

/* Menu "Soins" — ouverture au clic sur mobile, fermeture au clic exterieur */
(() => {
  const parents = [...document.querySelectorAll('[data-sub]')];
  if (!parents.length) return;

  const isTouch = window.matchMedia('(max-width: 1024px)').matches;

  parents.forEach((parent) => {
    const trigger = parent.querySelector('a');

    trigger.addEventListener('click', (e) => {
      // sur mobile le menu est deplie : on laisse le lien fonctionner
      if (window.matchMedia('(max-width: 1024px)').matches) return;
      if (!parent.classList.contains('is-open')) {
        e.preventDefault();
        parents.forEach((p) => p.classList.remove('is-open'));
        parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-sub]')) {
      parents.forEach((p) => {
        p.classList.remove('is-open');
        p.querySelector('a').setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      parents.forEach((p) => {
        p.classList.remove('is-open');
        p.querySelector('a').setAttribute('aria-expanded', 'false');
      });
    }
  });
})();
