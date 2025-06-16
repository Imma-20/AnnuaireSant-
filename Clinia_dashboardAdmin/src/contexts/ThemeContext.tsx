// src/contexts/ThemeContext.tsx (créez ce nouveau fichier)

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Définit la forme de la valeur de notre contexte
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Crée le contexte avec une valeur par défaut (null)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Définit les props pour le ThemeProvider
interface ThemeProviderProps {
  children: ReactNode; // La prop 'children' pour envelopper votre application
}

// Crée le composant ThemeProvider
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Récupère le thème initial depuis localStorage ou utilise 'light' par défaut
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  // Effet pour appliquer la classe de thème au corps HTML et sauvegarder dans localStorage
  useEffect(() => {
    const root = window.document.documentElement; // Ceci cible l'élément <html>
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]); // Ré-exécute l'effet lorsque le thème change

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Fournit le thème et la fonction de bascule aux enfants
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
};