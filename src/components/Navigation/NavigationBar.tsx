import React, { useState } from 'react';
import { File, Settings, Palette, Puzzle, Mic, Monitor, Eye, EyeOff, Wifi, Users, Database, HelpCircle, Info } from 'lucide-react';
import { FilesPopup } from './FilesPopup';
import { PluginsPopup } from './PluginsPopup';
import { ThemePopup } from './ThemePopup';
import { MicrophonePopup } from './MicrophonePopup';
import { WebSocketPopup } from './WebSocketPopup';
import { SessionsPopup } from './SessionsPopup';
import { ProfilesPopup } from './ProfilesPopup';
import { HelpPopup } from './HelpPopup';
import { DockPanel, Profile, SceneCollection, WebSocketConnection, SessionInfo } from '../../types';

interface NavigationBarProps {
  onToggleDock: (dockId: string) => void;
  dockPanels: DockPanel[];
  onOpenSettings: () => void;
  profiles: Profile[];
  sceneCollections: SceneCollection[];
  webSocketConnections: WebSocketConnection[];
  activeSessions: SessionInfo[];
  onProfileChange: (profileId: string) => void;
  onSceneCollectionChange: (collectionId: string) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onToggleDock,
  dockPanels,
  onOpenSettings,
  profiles,
  sceneCollections,
  webSocketConnections,
  activeSessions,
  onProfileChange,
  onSceneCollectionChange
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

            {/* WebSocket Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('websocket')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'websocket' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                WebSocket
              </button>
              {activePopup === 'websocket' && (
                <WebSocketPopup 
                  connections={webSocketConnections}
                  onClose={() => setActivePopup(null)} 
                />
              )}
            </div>

            {/* Display Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('display')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'display' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Wyświetlacze
              </button>
              {activePopup === 'display' && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 min-w-64">
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-3">Konfiguracja HDMI</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">HDMI-1</span>
                          <span className="text-green-400 text-sm">Aktywny</span>
                        </div>
                        <p className="text-gray-300 text-sm">Konsola serwera (Primary)</p>
                        <p className="text-gray-400 text-xs">1920x1080@60Hz</p>
                      </div>
                      <div className="p-3 bg-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">HDMI-2</span>
                          <span className="text-blue-400 text-sm">Passthrough</span>
                        </div>
                        <p className="text-gray-300 text-sm">Wejście wideo (Secondary)</p>
                        <p className="text-gray-400 text-xs">3840x2160@60Hz</p>
                      </div>
                    </div>
                    <button className="w-full mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors">
                      Konfiguruj wyświetlacze
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profiles Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('profiles')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'profiles' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Profile
              </button>
              {activePopup === 'profiles' && (
                <ProfilesPopup 
                  profiles={profiles}
                  sceneCollections={sceneCollections}
                  onProfileChange={onProfileChange}
                  onSceneCollectionChange={onSceneCollectionChange}
                  onClose={() => setActivePopup(null)} 
                />
              )}
            </div>

            {/* Sessions Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('sessions')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'sessions' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Sesje ({activeSessions.length})
              </button>
              {activePopup === 'sessions' && (
                <SessionsPopup 
                  sessions={activeSessions}
                  onClose={() => setActivePopup(null)} 
                />
              )}
            </div>

            {/* Help Menu */}
            <div className="relative">
              <button
                onClick={() => togglePopup('help')}
                className={`px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors ${
                  activePopup === 'help' ? 'bg-gray-700 text-white' : ''
                }`}
              >
                Pomoc
              </button>
              {activePopup === 'help' && (
                <HelpPopup onClose={() => setActivePopup(null)} />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                webSocketConnections.some(c => c.connected) ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="text-gray-400">
                {webSocketConnections.filter(c => c.connected).length}/{webSocketConnections.length} WS
              </span>
            </div>

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