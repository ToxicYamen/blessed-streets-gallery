import { cn } from "@/lib/utils";

export const BackgroundGrid = ({ className }: { className?: string }) => {
    // Das Marken-Raster liegt fix hinter ALLEN Seiten (Betreiber-Wunsch:
    // "Grid auf der ganzen Seite"). Seiten-Container dürfen deshalb keine
    // opaken Vollflächen-Hintergründe setzen, sonst decken sie es ab.
    return (
        <div
            className={cn(
                "fixed inset-0 -z-10 h-full w-full",
                "bg-[linear-gradient(to_right,#80808022_1px,transparent_1px),linear-gradient(to_bottom,#80808022_1px,transparent_1px)]",
                "bg-[size:32px_32px]",
                // Vignette: Raster läuft zu den Rändern sanft aus, Mitte bleibt präsent
                "[mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_55%,transparent_100%)]",
                className
            )}
        />
    );
}; 