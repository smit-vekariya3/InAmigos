/* ================================================================
   InAmigos Foundation — Awareness Webpage
   script.js  |  External JavaScript
   ================================================================ */

/* ──────────────────────────────────────────
   1. FLOATING DOTS — Hero Background
   ────────────────────────────────────────── */
(function spawnDots() {
    const field = document.getElementById('dotsField');
    if (!field) return;
    for (let i = 0; i < 38; i++) {
        const d = document.createElement('div');
        d.className = 'dot';
        const size = 2 + Math.random() * 4;
        d.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${8 + Math.random() * 14}s;
      animation-delay:    ${Math.random() * 10}s;
    `;
        field.appendChild(d);
    }
})();

/* ──────────────────────────────────────────
   2. MOBILE NAV TOGGLE
   ────────────────────────────────────────── */
function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
}

// Close menu when any link is clicked
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
    });
});

/* ──────────────────────────────────────────
   3. NAVBAR SHRINK ON SCROLL
   ────────────────────────────────────────── */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 60) {
        nav.style.height = '56px';
        nav.style.boxShadow = '0 4px 24px rgba(0,0,0,.3)';
    } else {
        nav.style.height = '68px';
        nav.style.boxShadow = 'none';
    }
});

/* ──────────────────────────────────────────
   4. SCROLL REVEAL (sections + timeline)
   ────────────────────────────────────────── */
const revealObs = new IntersectionObserver(
    (entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    },
    { threshold: 0.14 }
);

document.querySelectorAll('.reveal, .tl-item').forEach(el => revealObs.observe(el));

/* ──────────────────────────────────────────
   5. COUNTER ANIMATION UTILITY
   ────────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

/* ──────────────────────────────────────────
   6. HERO COUNTERS (trigger once on view)
   ────────────────────────────────────────── */
const heroStatsEl = document.querySelector('.hero-stats');
let heroCountersDone = false;

if (heroStatsEl) {
    const heroObs = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !heroCountersDone) {
                heroCountersDone = true;
                document.querySelectorAll('.hero-stat-num[data-count]').forEach(el => {
                    animateCounter(el, parseInt(el.dataset.count), '+');
                });
            }
        },
        { threshold: 0.3 }
    );
    heroObs.observe(heroStatsEl);
}

/* ──────────────────────────────────────────
   7. IMPACT SECTION COUNTERS
   ────────────────────────────────────────── */
const impactTargets = { c1: 50, c2: 30, c3: 20, c4: 900 };
let impactDone = false;
const statsRow = document.querySelector('.stats-row');

if (statsRow) {
    const impactObs = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !impactDone) {
                impactDone = true;
                Object.entries(impactTargets).forEach(([id, val]) => {
                    const el = document.getElementById(id);
                    if (el) animateCounter(el, val, '');
                });
            }
        },
        { threshold: 0.3 }
    );
    impactObs.observe(statsRow);
}

/* ──────────────────────────────────────────
   8. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
   ────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObs = new IntersectionObserver(
    (entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
                if (match) match.classList.add('active');
            }
        });
    },
    { threshold: 0.4 }
);

sections.forEach(s => sectionObs.observe(s));

/* ──────────────────────────────────────────
   9. SMOOTH BACK-TO-TOP ON LOGO CLICK
   ────────────────────────────────────────── */
const logo = document.querySelector('.nav-logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ──────────────────────────────────────────
   10. PROJECT CARD — subtle tilt on hover
   ────────────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        card.style.transform = `translateY(-9px) rotateX(${y}deg) rotateY(${x}deg)`;
        card.style.transition = 'transform .1s';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform .32s, box-shadow .32s, border-color .32s';
    });
});

/* ──────────────────────────────────────────
   11. CTA CARD — ripple click effect
   ────────────────────────────────────────── */
document.querySelectorAll('.cta-card').forEach(card => {
    card.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top - size / 2}px;
      background: rgba(255,255,255,.18);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple .55s ease-out forwards;
      pointer-events: none;
    `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);

/* ──────────────────────────────────────────
   12. ACTIVE NAV LINK STYLE (CSS injection)
   ────────────────────────────────────────── */
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-links a.active { color: var(--amber) !important; }`;
document.head.appendChild(activeStyle);