/* RentaNet — site behaviour. No dependencies, no inline code (strict CSP). */
(() => {
  'use strict';
  const root = document.documentElement;
  window.rentanetReady = true;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- header, progress bar, mobile menu ---------- */
  const head = $('.site-head');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = root.scrollHeight - innerHeight;
      root.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
      head.classList.toggle('scrolled', scrollY > 12);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('.menu-btn');
  if (menuBtn) {
    const setMenu = (open) => {
      root.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open);
    };
    menuBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }

  /* ---------- light / dark toggle ---------- */
  const toggle = $('.theme-toggle');
  if (toggle) {
    const label = () => toggle.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    label();
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      const apply = () => {
        root.dataset.theme = next;
        try { localStorage.setItem('rentanet-theme', next); } catch (e) { /* private mode */ }
        label();
        dispatchEvent(new Event('themechange'));
      };
      if (!document.startViewTransition || reduce) { apply(); return; }
      const r = toggle.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      root.classList.add('theme-switch');
      const vt = document.startViewTransition(apply);
      vt.ready.then(() => root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
      ));
      vt.finished.finally(() => root.classList.remove('theme-switch'));
    });
  }

  /* ---------- scroll reveal ---------- */
  $$('[data-stagger]').forEach((group) => [...group.children].forEach((el, i) => {
    el.dataset.reveal = el.dataset.reveal || '';
    el.style.setProperty('--stagger', Math.min(i, 7));
  }));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- counters ---------- */
  const tween = (el, from, to, dur = 1500) => {
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(from + (to - from) * k);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      tween(e.target, +(e.target.dataset.from || 0), +e.target.dataset.count);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  /* ---------- card tilt, spotlight, magnetic buttons ---------- */
  if (fine && !reduce) {
    $$('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.setProperty('--ry', `${(px - 0.5) * 9}deg`);
        card.style.setProperty('--rx', `${(0.5 - py) * 9}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- care board: tick the checklist one item at a time ---------- */
  const care = $$('.care li');
  if (care.length) {
    if (reduce) care.forEach((li) => li.classList.add('done'));
    else care.forEach((li, i) => setTimeout(() => li.classList.add('done'), 1700 + i * 620));
  }

  /* ---------- capacity calculator ---------- */
  const calc = $('.calc');
  if (calc) {
    const cpu = $('#c-cpu', calc), ram = $('#c-ram', calc), disk = $('#c-disk', calc);
    const out = { cpu: $('#o-cpu', calc), ram: $('#o-ram', calc), disk: $('#o-disk', calc), total: $('#o-total', calc), month: $('#o-month', calc), units: $('#o-units', calc), viz: $('.units', calc), mail: $('#o-mail', calc) };
    const presets = $$('.presets button', calc);
    let shown = 0;
    const fill = (el) => el.style.setProperty('--fill', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
    const update = (animate) => {
      const c = +cpu.value, r = +ram.value, d = +disk.value;
      const units = c + r + d / 10, price = 19 + 20 * units;
      out.cpu.textContent = `${c} vCPU`;
      out.ram.textContent = `${r} GB`;
      out.disk.textContent = `${d} GB`;
      out.units.textContent = units;
      out.month.textContent = (price / 12).toFixed(2);
      if (animate && !reduce) tween(out.total, shown, price, 450); else out.total.textContent = price;
      shown = price;
      [cpu, ram, disk].forEach(fill);
      const have = out.viz.children.length;
      const kinds = [...Array(c).fill('c'), ...Array(r).fill('r'), ...Array(d / 10).fill('d')];
      out.viz.replaceChildren(...kinds.map((k, i) => {
        const el = document.createElement('i');
        el.className = k;
        if (i < have) el.style.animation = 'none';
        return el;
      }));
      presets.forEach((b) => b.setAttribute('aria-pressed', b.dataset.set === `${c},${r},${d}`));
      const subject = `Hosting enquiry: ${c} vCPU / ${r} GB RAM / ${d} GB NVMe ($${price}/year)`;
      out.mail.href = `mailto:admin@renta.net?subject=${encodeURIComponent(subject)}`;
    };
    [cpu, ram, disk].forEach((el) => el.addEventListener('input', () => update(true)));
    presets.forEach((b) => b.addEventListener('click', () => {
      const [c, r, d] = b.dataset.set.split(',');
      cpu.value = c; ram.value = r; disk.value = d;
      update(true);
    }));
    update(false);
  }

  /* ---------- the network ---------- */
  const rng = (seed) => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };

  function Mesh(canvas) {
    const ctx = canvas.getContext('2d');
    const mode = canvas.dataset.mesh || 'hero';
    let W = 0, H = 0, nodes = [], edges = [], packets = [];
    let thread = '', net = '', accent = '', born = 0, raf = 0, visible = false;
    const ptr = { x: -9999, y: -9999 };

    const colours = () => {
      const s = getComputedStyle(root);
      thread = canvas.dataset.thread || s.getPropertyValue('--thread').trim();
      net = canvas.dataset.net || s.getPropertyValue('--net').trim();
      accent = s.getPropertyValue('--accent').trim();
    };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rand = rng(1998);
      const gap = W < 700 ? 74 : 92;
      const hub = mode === 'corner' ? [W * 0.9, H * 0.15] : mode === 'band' ? [W * 0.8, H * 0.5] : [W * 0.76, H * 0.42];
      nodes = [];
      for (let gy = -1; gy * gap < H + gap; gy++) for (let gx = -1; gx * gap < W + gap; gx++) {
        const fx = (gx * gap) / W;
        const keep = mode === 'band' ? 0.7 : 0.18 + 0.8 * Math.pow(Math.max(0, Math.min(1, fx)), 1.25);
        const j1 = rand(), j2 = rand(), k = rand(), big = rand();
        if (k > keep) continue;
        const x = gx * gap + (j1 - 0.5) * gap * 0.8, y = gy * gap + (j2 - 0.5) * gap * 0.8;
        nodes.push({ x, y, px: x, py: y, ph: j1 * 6.28, big: big < 0.14, wait: Math.hypot(x - hub[0], y - hub[1]), links: [] });
      }
      const far = Math.max(1, ...nodes.map((n) => n.wait));
      nodes.forEach((n) => { n.wait = (n.wait / far) * 1500; });
      edges = [];
      const seen = new Set();
      nodes.forEach((a, i) => {
        nodes.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)])
          .filter(([j, d]) => j !== i && d < gap * 1.75)
          .sort((p, q) => p[1] - q[1]).slice(0, 3)
          .forEach(([j]) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`;
            if (seen.has(key)) return;
            seen.add(key);
            edges.push([i, j]);
            a.links.push(j); nodes[j].links.push(i);
          });
      });
      packets = [];
      const want = Math.min(16, Math.max(4, Math.round(nodes.length / 7)));
      const linked = nodes.map((n, i) => i).filter((i) => nodes[i].links.length);
      for (let p = 0; p < want && linked.length; p++) {
        const a = linked[Math.floor(rand() * linked.length)];
        packets.push({ a, b: nodes[a].links[0], t0: -rand() * 2000, dur: 1300 + rand() * 1500, hot: rand() < 0.25 });
      }
    };

    const draw = (t) => {
      const age = reduce ? 1e6 : t - born;
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((n) => {
        n.px = n.x + (reduce ? 0 : Math.sin(t * 0.0005 + n.ph) * 6);
        n.py = n.y + (reduce ? 0 : Math.cos(t * 0.0004 + n.ph * 1.7) * 6);
      });
      const shown = (n) => Math.max(0, Math.min(1, (age - n.wait) / 700));

      ctx.lineWidth = 1; ctx.strokeStyle = thread;
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j], al = Math.min(shown(a), shown(b));
        if (al <= 0) continue;
        ctx.globalAlpha = al;
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
      }

      /* links to the pointer */
      if (ptr.x > -999) {
        ctx.strokeStyle = net;
        for (const n of nodes) {
          const d = Math.hypot(n.px - ptr.x, n.py - ptr.y);
          if (d > 170) continue;
          ctx.globalAlpha = Math.pow(1 - d / 170, 1.4) * shown(n);
          ctx.beginPath(); ctx.moveTo(n.px, n.py); ctx.lineTo(ptr.x, ptr.y); ctx.stroke();
        }
      }

      for (const n of nodes) {
        const al = shown(n);
        if (al <= 0) continue;
        const near = ptr.x > -999 ? Math.max(0, 1 - Math.hypot(n.px - ptr.x, n.py - ptr.y) / 170) : 0;
        ctx.globalAlpha = al * (n.big ? 1 : 0.75);
        ctx.fillStyle = n.big || near > 0.2 ? net : thread;
        ctx.beginPath(); ctx.arc(n.px, n.py, (n.big ? 3 : 1.8) + near * 2.5, 0, 6.2832); ctx.fill();
        if (n.big) {
          const pulse = reduce ? 0.5 : (t * 0.0006 + n.ph) % 1;
          ctx.globalAlpha = al * (1 - pulse) * 0.5;
          ctx.strokeStyle = net;
          ctx.beginPath(); ctx.arc(n.px, n.py, 4 + pulse * 14, 0, 6.2832); ctx.stroke();
          ctx.strokeStyle = thread;
        }
      }

      /* packets hop from node to node */
      if (!reduce && age > 1200) {
        for (const p of packets) {
          let q = (t - p.t0) / p.dur;
          if (q >= 1) {
            const from = p.a;
            p.a = p.b;
            const opts = nodes[p.a].links.filter((l) => l !== from);
            p.b = opts.length ? opts[Math.floor(Math.random() * opts.length)] : from;
            p.t0 = t; q = 0;
          }
          if (q < 0) continue;
          const a = nodes[p.a], b = nodes[p.b];
          const e = q * q * (3 - 2 * q);
          const x = a.px + (b.px - a.px) * e, y = a.py + (b.py - a.py) * e;
          const tx = a.px + (b.px - a.px) * Math.max(0, e - 0.22), ty = a.py + (b.py - a.py) * Math.max(0, e - 0.22);
          const col = p.hot ? accent : net;
          const g = ctx.createLinearGradient(tx, ty, x, y);
          g.addColorStop(0, 'transparent'); g.addColorStop(1, col);
          ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
          ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12;
          ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.2832); ctx.fill();
          ctx.shadowBlur = 0; ctx.lineWidth = 1; ctx.strokeStyle = thread;
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t) => {
      if (!born) born = t;
      draw(t);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const once = () => { colours(); build(); draw(performance.now()); };

    colours(); build();
    if (reduce) draw(0);
    else {
      new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(frame);
      }).observe(canvas);
      const host = canvas.parentElement;
      host.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
      });
      host.addEventListener('pointerleave', () => { ptr.x = ptr.y = -9999; });
    }
    let rt = 0;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(reduce ? once : build, 150); });
    addEventListener('themechange', reduce ? once : colours);
  }
  $$('canvas.mesh').forEach((c) => Mesh(c));
})();
