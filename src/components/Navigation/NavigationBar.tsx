import React, { useState } from 'react';
import { File, Settings, Palette, Puzzle, Mic, Monitor, Eye, EyeOff } from 'lucide-react';
import { FilesPopup } from './FilesPopup';
import { PluginsPopup } from './PluginsPopup';
import { ThemePopup } from './ThemePopup';
import { MicrophonePopup } from './MicrophonePopup';
import { DockPanel } from '../../types';

interface NavigationBarProps {
  onToggleDock: (dockId: string) => void;
  dockPanels: DockPanel[];
  onOpenSettings: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onToggleDock,
  dockPanels,
  onOpenSettings
}) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const togglePopup = (popupId: string) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-600 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('files')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'files' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Pliki
              </button>
              {activePopup === 'files' && (
                <FilesPopup onClose={() => setActivePopup(null)} />
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('edit')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'edit' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Edycja
              </button>
              {activePopup === 'edit' && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 min-w-48">
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
                      Cofnij
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
                      Ponów
                    </button>
                    <hr className="border-gray-600 my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
                      Kopiuj
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors">
                      Wklej
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('view')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'view' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Widok
              </button>
              {activePopup === 'view' && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 min-w-48">
                  <div className="py-1">
                    {dockPanels.map((dock) => (
                      <button
                        key={dock.id}
                        onClick={() => onToggleDock(dock.id)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-600 transition-colors flex items-center justify-between"
                      >
                        <span>{dock.name}</span>
                        {dock.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Plugins Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('plugins')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'plugins' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Wtyczki
              </button>
              {activePopup === 'plugins' && (
                <PluginsPopup onClose={() => setActivePopup(null)} />
              )}
            </div>

            {/* Microphones Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('microphones')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'microphones' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Mikrofony
              </button>
              {activePopup === 'microphones' && (
                <MicrophonePopup onClose={() => setActivePopup(null)} />
              )}
            </div>

            {/* Theme Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('theme')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'theme' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Motyw
              </button>
              {activePopup === 'theme' && (
                <ThemePopup onClose={() => setActivePopup(null)} />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Ustawienia"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay to close popups */}
      {activePopup && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActivePopup(null)}
        />
      )}
    </>
  );
};