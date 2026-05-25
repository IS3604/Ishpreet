// ===========================
// BACKGROUND VIDEO — pause when out of viewport to save GPU/battery
// ===========================
const heroVideo = document.getElementById('hero-bg-video');
const heroSection = document.getElementById('hero');

// Pause video when hero section is not visible (saves resources)
if (heroVideo && heroSection) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(() => { }); // auto-play may be blocked
            } else {
                heroVideo.pause();
            }
        });
    }, { threshold: 0.1 });

    videoObserver.observe(heroSection);

    // Pause on mobile when tab is hidden (battery saving)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            heroVideo.pause();
        } else if (heroSection.getBoundingClientRect().top < window.innerHeight) {
            heroVideo.play().catch(() => { });
        }
    });
}

// ===========================
// SCROLL REVEAL — single observer, batch processing
// ===========================
const revealElements = document.querySelectorAll(
    '.about-grid > *, .timeline-item, .skill-group, .edu-card, .contact-card, .section-heading, .section-label, .about-body, .contact-sub, .competencies-marquee'
);

revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

// ===========================
// ACTIVE NAV HIGHLIGHT
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ===========================
// NAV CAPSULE SCALE ON SCROLL — throttled with rAF
// ===========================
const navCapsule = document.getElementById('nav-capsule');
let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY > lastScrollY + 20) {
                navCapsule.style.transform = 'translateX(-50%) translateY(8px)';
                navCapsule.style.opacity = '0.7';
            } else if (scrollY < lastScrollY - 5 || scrollY < 100) {
                navCapsule.style.transform = 'translateX(-50%) translateY(0)';
                navCapsule.style.opacity = '1';
            }
            lastScrollY = scrollY;
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true }); // Passive listener for smoother scrolling

// ===========================
// MOBILE MENU
// ===========================
const menuBtn = document.getElementById('nav-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
});

document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
    }
});

// ===========================
// SMOOTH SCROLL FOR ANCHORS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===========================
// HERO VIDEO PARALLAX TILT — only on desktop, throttled
// ===========================
if (heroVideo && window.matchMedia('(min-width: 768px)').matches) {
    let mouseTicking = false;

    window.addEventListener('mousemove', (e) => {
        if (mouseTicking) return;
        mouseTicking = true;

        requestAnimationFrame(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            heroVideo.style.transform = `translate(${dx * -6}px, ${dy * -6}px) scale(1.04)`;
            mouseTicking = false;
        });
    }, { passive: true });
}

// ===========================
// CURSOR GLOW EFFECT — desktop only
// ===========================
if (window.matchMedia('(min-width: 768px) and (hover: hover)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
      will-change: left, top;
    `;
    document.body.appendChild(cursorGlow);

    let glowTicking = false;

    document.addEventListener('mousemove', (e) => {
        if (glowTicking) return;
        glowTicking = true;

        requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
            glowTicking = false;
        });
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
}
