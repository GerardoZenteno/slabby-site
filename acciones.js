/**
 * acciones.js - Lógica interactiva y navegación suave para Slabby
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. Navegación interna con desplazamiento suave (smooth scroll)
    // =========================================================================
    const navButtons = document.querySelectorAll('.nav-btn, [data-target]');
    const mobileMenu = document.getElementById('mobile-menu');

    navButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Desplazamiento fluido hacia la sección destino
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Si el menú móvil está abierto, cerrarlo automáticamente
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            } else {
                // Si estamos en una subpágina (/terms, /privacypolicy, etc.), redirigir al home
                window.location.href = `/#${targetId}`;
            }
        });
    });

    // =========================================================================
    // 2. Control del menú móvil (hamburguesa)
    // =========================================================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // =========================================================================
    // 3. Animaciones de entrada Hero y Scroll Reveal en cascada
    // =========================================================================
    const heroElements = document.querySelectorAll('.hero-reveal');
    requestAnimationFrame(() => {
        setTimeout(() => {
            heroElements.forEach((el) => el.classList.add('is-visible'));
        }, 60);
    });

    const scrollSections = document.querySelectorAll('.scroll-reveal');
    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        scrollSections.forEach((section) => scrollObserver.observe(section));
    } else {
        scrollSections.forEach((section) => section.classList.add('is-visible'));
    }

    // =========================================================================
    // 4. Scroll Spy para la barra de navegación inferior en móviles (Solo Home)
    // =========================================================================
    const mobileBottomNav = document.getElementById('mobile-bottom-nav');
    if (mobileBottomNav) {
        const navItems = {
            features: document.getElementById('nav-item-features'),
            chests: document.getElementById('nav-item-chests'),
            boost: document.getElementById('nav-item-boost')
        };

        const trackedSections = [
            { id: 'features', el: document.getElementById('features') },
            { id: 'chests', el: document.getElementById('chests') },
            { id: 'boost', el: document.getElementById('boost') }
        ];

        function setActiveBottomNav(activeId) {
            Object.entries(navItems).forEach(([id, item]) => {
                if (!item) return;
                const textSpan = item.querySelector('span');
                if (id === activeId) {
                    item.classList.remove('text-[#374151]');
                    item.classList.add('text-[#4583E2]');
                    if (textSpan) {
                        textSpan.classList.remove('font-medium');
                        textSpan.classList.add('font-bold');
                    }
                } else {
                    item.classList.remove('text-[#4583E2]');
                    item.classList.add('text-[#374151]');
                    if (textSpan) {
                        textSpan.classList.remove('font-bold');
                        textSpan.classList.add('font-medium');
                    }
                }
            });
        }

        function updateScrollSpy() {
            const scrollPos = window.scrollY + window.innerHeight * 0.35;
            let activeId = null;

            trackedSections.forEach((sec) => {
                if (sec.el) {
                    const top = sec.el.offsetTop;
                    const height = sec.el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        activeId = sec.id;
                    }
                }
            });

            // Al llegar al final de la página resaltar la última sección (Gym)
            if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
                activeId = 'boost';
            }

            setActiveBottomNav(activeId);
        }

        window.addEventListener('scroll', updateScrollSpy, { passive: true });
        updateScrollSpy();
    }

    // =========================================================================
    // 5. Selector de idioma (si está habilitado)
    // =========================================================================
    const langBtns = [document.getElementById('lang-btn'), document.getElementById('lang-btn-mobile')];
    langBtns.forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', () => {
                const textSpan = btn.querySelector('span:nth-child(2)');
                if (textSpan) {
                    textSpan.innerText = textSpan.innerText === 'English' ? 'Español' : 'English';
                }
            });
        }
    });
});
