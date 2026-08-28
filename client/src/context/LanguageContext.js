'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Simple mock dictionary for demo purposes
  const dictionary = {
    en: {
      'nav.dashboard': 'Dashboard',
      'nav.complaints': 'Complaints',
      'nav.map': 'Live Map',
      'nav.compliance': 'Compliance',
      'nav.ai': 'AI Detection',
      'nav.settings': 'Settings',
      'nav.calculator': 'Impact Calculator',
      'nav.education': 'Education Hub',
      'nav.leaderboard': 'Leaderboard',
    },
    es: {
      'nav.dashboard': 'Panel',
      'nav.complaints': 'Quejas',
      'nav.map': 'Mapa en vivo',
      'nav.compliance': 'Cumplimiento',
      'nav.ai': 'Detección de IA',
      'nav.settings': 'Ajustes',
      'nav.calculator': 'Calculadora de Impacto',
      'nav.education': 'Centro Educativo',
      'nav.leaderboard': 'Tabla de Líderes',
    }
  };

  const t = (key) => {
    return dictionary[language]?.[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
