import React from 'react';
import { useTheme } from '../Context/ThemeContext';

/**
 * Composant de test pour vérifier le fonctionnement du dark mode
 * À supprimer une fois le debug terminé
 */
const ThemeDebug: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50">
      <div className="space-y-2">
        <div className="text-sm font-bold text-gray-900 dark:text-white">
          🐛 Theme Debug
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-300">
          Current Theme: <span className="font-mono font-bold">{theme}</span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="w-full px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Toggle Theme
        </button>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          localStorage: {localStorage.getItem('theme')}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          HTML classes: {document.documentElement.className}
        </div>
      </div>
    </div>
  );
};

export default ThemeDebug;
