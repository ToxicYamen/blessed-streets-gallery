import { useEffect } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const PageTransition = () => {
    const location = useLocation();
    const { theme } = useTheme();

    useEffect(() => {
        // Timeline für die Seitenübergangs-Animation
        const tl = gsap.timeline();

        // Eingangs-Animation
        tl.to('.page-transition', {
            scaleY: 1,
            duration: 0.5,
            ease: 'power4.inOut',
            backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
        })
            .to('.page-transition', {
                scaleY: 0,
                duration: 0.5,
                ease: 'power4.inOut',
                delay: 0.2,
                backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
            });
    }, [location.pathname, theme]); // Führe Animation bei Routenwechsel oder Theme-Änderung aus

    return (
        <div
            className="page-transition fixed top-0 left-0 w-full h-screen origin-top z-[9999] pointer-events-none"
            style={{
                transform: 'scaleY(0)',
                backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
            }}
        ></div>
    );
};

export default PageTransition;
