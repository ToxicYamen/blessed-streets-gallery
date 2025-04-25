import { cn } from "@/lib/utils";

export const BackgroundGrid = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 h-full w-full",
                "bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)]",
                "bg-[size:32px_32px]",
                "before:absolute before:inset-0 before:bg-gradient-to-b before:from-background before:to-transparent before:opacity-50",
                className
            )}
        />
    );
}; 