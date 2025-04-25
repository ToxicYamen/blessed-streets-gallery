
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

export const pageTransition = (onComplete?: () => void) => {
    return new Promise<void>((resolve) => {
        // Get current theme and set color
        const isDarkMode = document.documentElement.classList.contains('dark');
        const transitionColor = isDarkMode ? '#455B57' : '#000000';

        // Erstelle einen Container für die Transition
        const transitionContainer = document.createElement('div');
        transitionContainer.style.position = 'fixed';
        transitionContainer.style.top = '0';
        transitionContainer.style.left = '0';
        transitionContainer.style.width = '100%';
        transitionContainer.style.height = '100%';
        transitionContainer.style.zIndex = '9999';
        transitionContainer.style.overflow = 'hidden';
        document.body.appendChild(transitionContainer);

        // Blende den Hauptinhalt aus
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.1s ease-in-out';
        }

        // Erstelle drei Panels, die den Bildschirm abdecken
        const panels = Array.from({ length: 3 }, (_, i) => {
            const panel = document.createElement('div');
            panel.style.position = 'absolute';
            panel.style.top = '0';
            panel.style.left = `${(i * 100) / 3}%`;
            panel.style.width = `${100 / 3}%`;
            panel.style.height = '100%';
            panel.style.backgroundColor = transitionColor;
            panel.style.transform = 'translateY(-100%)';
            transitionContainer.appendChild(panel);
            return panel;
        });

        // Fade-In Animation (von oben nach unten)
        panels.forEach((panel, index) => {
            setTimeout(() => {
                panel.style.transition = 'transform 0.2s ease-in-out';
                panel.style.transform = 'translateY(0)';
            }, index * 50);
        });

        // Fade-Out Animation (nach unten)
        setTimeout(() => {
            panels.forEach((panel, index) => {
                setTimeout(() => {
                    panel.style.transform = 'translateY(100%)';
                }, index * 50);
            });

            // Entferne den Container nach der Fade-Out Animation
            setTimeout(() => {
                document.body.removeChild(transitionContainer);
                if (mainContent) {
                    mainContent.style.opacity = '1';
                }
                resolve();
                onComplete?.();
            }, 300);
        }, 300);
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
