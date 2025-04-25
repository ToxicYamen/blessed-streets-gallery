import { ReactNode } from 'react';
import { BackgroundGrid } from "@/components/ui/background-grid";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <BackgroundGrid />
            {children}
        </div>
    );
};

export default Layout; 