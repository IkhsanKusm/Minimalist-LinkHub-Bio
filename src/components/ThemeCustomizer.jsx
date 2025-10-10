import React from 'react';

const ThemeCustomizer = ({ currentTheme, onThemeChange, isPro }) => {
  const themes = [
    {
      id: 'default',
      name: 'Ocean Blue',
      gradient: 'from-blue-500 to-purple-600',
      preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      gradient: 'from-orange-500 to-pink-600',
      preview: 'bg-gradient-to-br from-orange-500 to-pink-600',
      pro: true
    },
    {
      id: 'forest',
      name: 'Forest Green', 
      gradient: 'from-green-500 to-teal-600',
      preview: 'bg-gradient-to-br from-green-500 to-teal-600',
      pro: true
    },
    {
      id: 'midnight',
      name: 'Midnight Dark',
      gradient: 'from-gray-800 to-gray-900',
      preview: 'bg-gradient-to-br from-gray-800 to-gray-900',
      pro: true
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => {
            if (theme.pro && !isPro) {
              // Show upgrade modal
              alert('Upgrade to Pro to unlock this theme!');
              return;
            }
            onThemeChange(theme.id);
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            currentTheme === theme.id
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          } ${theme.pro && !isPro ? 'opacity-50' : ''}`}
        >
          <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`}></div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{theme.name}</span>
            {theme.pro && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                PRO
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ThemeCustomizer;