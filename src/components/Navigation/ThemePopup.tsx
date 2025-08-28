import React from 'react';
import { Palette, Check } from 'lucide-react';

interface ThemePopupProps {
  onClose: () => void;
}

export const ThemePopup: React.FC<ThemePopupProps> = ({ onClose }) => {
  const themes = [
    { id: 'dark', name: 'Ciemny (Domyślny)', active: true, color: '#1F2937' },
    { id: 'blue', name: 'Niebieski', active: false, color: '#1E3A8A' },
    { id: 'purple', name: 'Fioletowy', active: false, color: '#581C87' },
    { id: 'green', name: 'Zielony', active: false, color: '#14532D' },
    { id: 'red', name: 'Czerwony', active: false, color: '#7F1D1D' }
  ];

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 w-64">
      <div className="p-4">
        <h3 className="text-white font-semibold flex items-center space-x-2 mb-3">
          <Palette size={16} />
          <span>Motywy</span>
        </h3>

        <div className="space-y-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className="w-full flex items-center justify-between p-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded border border-gray-500"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-white text-sm">{theme.name}</span>
              </div>
              {theme.active && <Check size={14} className="text-green-400" />}
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-600">
          <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
            Importuj motyw
          </button>
        </div>
      </div>
    </div>
  );
};