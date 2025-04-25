import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

export function PageHeader({ title, description, children, className = '' }: PageHeaderProps) {
    return (
        <section className="relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/20 dark:from-background dark:to-accent/10" />

            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.07]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                    backgroundSize: '32px 32px'
                }} />
            </div>

            {/* Content */}
            <div className={`relative blesssed-container py-20 ${className}`}>
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-lg text-muted-foreground">
                            {description}
                        </p>
                    )}
                    {children}
                </div>
            </div>
        </section>
    );
} 