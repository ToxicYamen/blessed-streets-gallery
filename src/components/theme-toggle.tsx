import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme/ThemeProvider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors duration-300"
        >
            {theme === "light" ? (
                <Moon className="h-5 w-5 text-mono-900 hover:text-mono-600 transition-colors duration-300" />
            ) : (
                <Sun className="h-5 w-5 text-mono-100 hover:text-mono-200 transition-colors duration-300" />
            )}
        </button>
    )
} 