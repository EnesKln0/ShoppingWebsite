import { useState, useEffect } from "react";

export default function ToggleDarkMode() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) return savedTheme === "true";

    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className=" absolute top-1 right-4 p-2 bg-transparent rounded-full border flex items-center justify-center"
    >
      {darkMode ? (
        <span role="img" aria-label="Moon">
          🌙
        </span>
      ) : (
        <span role="img" aria-label="Sun">
          ☀️
        </span>
      )}
    </button>
  );
}
