import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md transition-colors ${
        theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
