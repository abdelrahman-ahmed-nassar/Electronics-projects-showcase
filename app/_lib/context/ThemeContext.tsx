"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

interface ThemeContextProps {
  colorTheme: string | null;
  changeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = typeof window !== "undefined" ? localStorage.getItem("data-theme") : null;
    setColorTheme(storedTheme || "light");
  }, []);

  useEffect(() => {
    if (!isMounted || colorTheme === null) return;

    if (colorTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme, isMounted]);

  const changeTheme = () => {
    if (!isMounted) return;

    const newTheme = colorTheme === "light" ? "dark" : "light";
    setColorTheme(newTheme);

    if (typeof window !== "undefined") {
      localStorage.setItem("data-theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ colorTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};