/**
 * acciones.js - Lógica interactiva, navegación suave y detección de tienda para Slabby
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 0. Detección de OS móvil/tablet para redirección directa a la tienda
    // =========================================================================
    function getMobileStoreUrl() {
        const ua = navigator.userAgent || navigator.vendor || window.opera || '';
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isAndroid = /android/i.test(ua);

        if (isIOS) {
            return 'https://apps.apple.com/us/app/slabby-climbing-terms-gear/id6818288177';
        } else if (isAndroid) {
            return 'https://play.google.com/store/apps/details?id=com.zega.sloper';
        } else {
            // Predeterminado en caso de dispositivo móvil no identificado
            return 'https://apps.apple.com/us/app/slabby-climbing-terms-gear/id6818288177';
        }
    }

    const storeRedirectButtons = document.querySelectorAll('.mobile-store-redirect-btn');
    storeRedirectButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = getMobileStoreUrl();
        });
    });

    // Detección de página Home
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    const isHomePage = cleanPath === '' || cleanPath === '/' || cleanPath === '/index.html';

    // Animación de rebote (bounce) y zoom para los botones de las tiendas (App Store y Google Play)
    function triggerStoreBadgesBounce() {
        const badges = document.querySelectorAll('.store-badge, a[href*="apple.com"], a[href*="google.com"]');
        badges.forEach((badge) => {
            badge.classList.remove('store-badge-bounce');
            void badge.offsetWidth; // Forzar reflow para reiniciar la animación CSS
            badge.classList.add('store-badge-bounce');
            setTimeout(() => {
                badge.classList.remove('store-badge-bounce');
            }, 900);
        });
    }

    // =========================================================================
    // 1. Navegación interna con desplazamiento suave (smooth scroll)
    // =========================================================================
    const navButtons = document.querySelectorAll('.nav-btn, [data-target]');
    const mobileMenu = document.getElementById('mobile-menu');

    navButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = btn.getAttribute('data-target');
            const isGetStarted = btn.id === 'desktop-cta-btn' || targetId === 'download';

            // Caso A: Fuera del Home (en cualquier subpágina como /terms, /blog/..., etc.)
            if (!isHomePage) {
                if (isGetStarted) {
                    // En laptop o cualquier vista, "Get Started" va a "/" limpio (sin #download)
                    window.location.href = '/';
                    return;
                }
                // Si es otro botón con ancla
                if (targetId) {
                    window.location.href = `/#${targetId}`;
                } else {
                    window.location.href = '/';
                }
                return;
            }

            // Caso B: Dentro del Home
            if (isGetStarted) {
                // Scroll fluido hacia la parte superior (hero / download)
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Reacción visual con animación bounce y zoom en los botones de App Store y Google Play
                triggerStoreBadgesBounce();
                if (window.scrollY > 40) {
                    setTimeout(triggerStoreBadgesBounce, 420);
                }

                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                return;
            }

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
            }
        });
    });

    // =========================================================================
    // 2. Control del menú móvil (hamburguesa) y submenú Resources móvil
    // =========================================================================
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const mobileResToggle = document.getElementById('mobile-resources-toggle');
    const mobileResMenu = document.getElementById('mobile-resources-menu');
    const mobileResChevron = document.getElementById('mobile-resources-chevron');
    if (mobileResToggle && mobileResMenu) {
        mobileResToggle.addEventListener('click', () => {
            const isNowHidden = mobileResMenu.classList.toggle('hidden');
            mobileResToggle.setAttribute('aria-expanded', (!isNowHidden).toString());
            if (mobileResChevron) {
                if (isNowHidden) {
                    // Contraída: chevron hacia abajo (sin rotar)
                    mobileResChevron.classList.remove('rotate-180');
                } else {
                    // Expandida: chevron hacia arriba (rotado 180deg)
                    mobileResChevron.classList.add('rotate-180');
                }
            }
        });
    }

    // =========================================================================
    // 3. Regla: "Board, Route y Gym" solo visibles en la pantalla Home
    // =========================================================================
    if (!isHomePage) {
        document.querySelectorAll('.home-only-nav, [data-home-only]').forEach((el) => el.remove());
    }

    // =========================================================================
    // 4. Animaciones de entrada Hero y Scroll Reveal en cascada
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
    // 5. Scroll Spy para la barra de navegación inferior en móviles (Solo Home)
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
    // 7. Interactive 3D Flip Cards (Slabby Flashcards)
    // =========================================================================
    const flipCards = document.querySelectorAll('.slabby-card-container, .slabby-card-wrapper');
    flipCards.forEach((cardEl) => {
        if (cardEl.dataset.flipInit) return;
        cardEl.dataset.flipInit = 'true';

        const toggleCard = (e) => {
            // Ignore click if user clicked audio button or link
            if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.slabby-speaker-btn') || e.target.closest('.speaker-btn')) {
                return;
            }
            const inner = cardEl.querySelector('.slabby-card') || cardEl.querySelector('.slabby-card-inner');
            if (inner) {
                inner.classList.toggle('is-flipped');
            }
        };

        cardEl.addEventListener('click', toggleCard);
        cardEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard(e);
            }
        });
    });
});

