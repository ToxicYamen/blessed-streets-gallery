
import { Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import { useTheme } from "@/components/theme/ThemeProvider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="border-mono-700 text-mono-100 hover:bg-mono-800"
        >
            {theme === "light" ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
} 
