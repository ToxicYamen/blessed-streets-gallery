
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registriere ScrollTrigger Plugin
gsap.registerPlugin(ScrollTrigger);

export const fadeIn = (element: HTMLElement, duration = 0.2) => {
    gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration }
    );
};

export const fadeOut = (element: HTMLElement, duration = 0.2) => {
    gsap.to(element, {
        opacity: 0,
        y: -20,
        duration,
        onComplete: () => {
            element.style.display = 'none';
        }
    });
};

export const scaleIn = (element: HTMLElement, duration = 0.2) => {
    gsap.fromTo(
        element,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration }
    );
};

export const scaleOut = (element: HTMLElement, duration = 0.2) => {
    gsap.to(element, {
        scale: 0.8,
        opacity: 0,
        duration,
        onComplete: () => {
            element.style.display = 'none';
        }
    });
};

export const lineTransition = (element: HTMLElement, duration = 0.3) => {
    // Erstelle eine schwarze Linie
    const line = document.createElement('div');
    line.style.position = 'fixed';
    line.style.top = '0';
    line.style.left = '0';
    line.style.width = '100%';
    line.style.height = '2px';
    line.style.backgroundColor = 'black';
    line.style.transform = 'scaleX(0)';
    line.style.transformOrigin = 'left';
    line.style.zIndex = '9999';
    document.body.appendChild(line);

    // Animation
    gsap.to(line, {
        scaleX: 1,
        duration: duration / 2,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(line, {
                scaleX: 0,
                duration: duration / 2,
                ease: 'power2.inOut',
                onComplete: () => {
                    document.body.removeChild(line);
                }
            });
        }
    });
};

// Timings. The old values ran the *whole* animation (600ms) before calling
// onComplete — i.e. before React Router even navigated — so every click cost 600ms
// plus the new page's data fetch before anything moved. Now the navigation happens
// the moment the panels cover the screen (~STAGGER*2 + COVER_MS), which is also when
// the lazily-loaded route chunk is fetched. The exit animation then plays over the
// already-rendered new page.
const STAGGER_MS = 40;
const COVER_MS = 180;
const REVEAL_MS = 180;

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const pageTransition = (onComplete?: () => void) => {
    // Respect reduced-motion, and never animate in a non-DOM context.
    if (typeof document === 'undefined' || prefersReducedMotion()) {
        onComplete?.();
        return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const transitionColor = isDarkMode ? '#455B57' : '#000000';

        const transitionContainer = document.createElement('div');
        transitionContainer.style.position = 'fixed';
        transitionContainer.style.inset = '0';
        transitionContainer.style.zIndex = '9999';
        transitionContainer.style.overflow = 'hidden';
        transitionContainer.style.pointerEvents = 'none';
        document.body.appendChild(transitionContainer);

        const mainContent = document.querySelector('main');

        // Runs exactly once, no matter which path we take out of here. If this were
        // ever skipped, <main> would stay at opacity 0 and the overlay would sit on
        // top of the app forever — a dead UI until a hard refresh.
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            try {
                transitionContainer.remove();
                if (mainContent) mainContent.style.opacity = '1';
            } finally {
                resolve();
            }
        };

        // Safety net: if a timer is ever dropped (backgrounded tab, thrown handler),
        // still tear the overlay down rather than stranding the app behind it.
        const guard = setTimeout(finish, 3000);

        const panels = Array.from({ length: 3 }, (_, i) => {
            const panel = document.createElement('div');
            panel.style.position = 'absolute';
            panel.style.top = '0';
            panel.style.left = `${(i * 100) / 3}%`;
            panel.style.width = `${100 / 3 + 0.2}%`; // slight overlap — no seams
            panel.style.height = '100%';
            panel.style.backgroundColor = transitionColor;
            panel.style.transform = 'translateY(-100%)';
            panel.style.transition = `transform ${COVER_MS}ms ease-in-out`;
            transitionContainer.appendChild(panel);
            return panel;
        });

        // Cover the screen.
        requestAnimationFrame(() => {
            panels.forEach((panel, index) => {
                setTimeout(() => {
                    panel.style.transform = 'translateY(0)';
                }, index * STAGGER_MS);
            });
        });

        const coveredAt = STAGGER_MS * (panels.length - 1) + COVER_MS;

        setTimeout(() => {
            // Screen is covered → swap the route now. The new page (and its lazy chunk)
            // renders behind the panels instead of the user staring at the old one.
            try {
                onComplete?.();
            } catch (err) {
                console.error('[pageTransition] navigation callback threw', err);
            }

            if (mainContent) {
                mainContent.style.transition = 'opacity 0.1s ease-in-out';
                mainContent.style.opacity = '1';
            }

            // Reveal the new page.
            panels.forEach((panel, index) => {
                setTimeout(() => {
                    panel.style.transition = `transform ${REVEAL_MS}ms ease-in-out`;
                    panel.style.transform = 'translateY(100%)';
                }, index * STAGGER_MS);
            });

            setTimeout(() => {
                clearTimeout(guard);
                finish();
            }, STAGGER_MS * (panels.length - 1) + REVEAL_MS);
        }, coveredAt);
    });
};

interface ScrollRevealOptions {
    y?: number;
    opacity?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
}

export const scrollReveal = (element: HTMLElement, options: ScrollRevealOptions = {}) => {
    gsap.fromTo(
        element,
        {
            y: options.y || 60,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: options.duration || 1,
            delay: options.delay || 0,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            }
        }
    );
};

export const scrollRevealStagger = (elements: HTMLElement[], options: ScrollRevealOptions = {}) => {
    gsap.from(elements, {
        y: options.y || 60,
        opacity: 0,
        duration: options.duration || 1,
        delay: options.delay || 0,
        stagger: options.stagger || 0.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: elements[0],
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        }
    });
};

export const cartIconAnimation = (element: HTMLElement) => {
    gsap.to(element, {
        scale: 1.2,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(element, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.in'
            });
        }
    });
}; 
