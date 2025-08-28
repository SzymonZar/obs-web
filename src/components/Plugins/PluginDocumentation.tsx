import React, { useState } from 'react';
import { X, Book, Code, Zap, Settings, Mic, Eye, Volume2 } from 'lucide-react';

interface PluginDocumentationProps {
  onClose: () => void;
}

export const PluginDocumentation: React.FC<PluginDocumentationProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', name: 'Przegląd', icon: Book },
    { id: 'api', name: 'API Reference', icon: Code },
    { id: 'events', name: 'Eventy', icon: Zap },
    { id: 'sources', name: 'Źródła', icon: Eye },
    { id: 'audio', name: 'Audio', icon: Volume2 },
    { id: 'tts', name: 'TTS', icon: Mic },
    { id: 'examples', name: 'Przykłady', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">OBS Web Plugin System</h2>
            <p className="text-gray-300">
              System wtyczek OBS Web umożliwia tworzenie zaawansowanych rozszerzeń używając JavaScript/TypeScript.
            </p>
            
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-2">Podstawowa struktura wtyczki</h3>
              <pre className="text-blue-200 text-sm overflow-x-auto">
{`// plugin.js
class MyPlugin extends OBSPlugin {
  constructor() {
    super({
      name: 'Moja Wtyczka',
      version: '1.0.0',
      author: 'Twoje Imię'
    });
  }

  onLoad() {
    console.log('Wtyczka załadowana!');
  }

  onUnload() {
    console.log('Wtyczka wyładowana!');
  }
}`}
              </pre>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">API Reference</h2>
            
            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">OBS.scenes</h3>
                <p className="text-gray-300 text-sm mb-2">Zarządzanie scenami</p>
                <pre className="text-green-400 text-sm">
{`OBS.scenes.getActive()           // Pobierz aktywną scenę
OBS.scenes.setActive(sceneId)     // Ustaw aktywną scenę
OBS.scenes.create(name)           // Utwórz nową scenę
OBS.scenes.delete(sceneId)        // Usuń scenę`}
                </pre>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">OBS.sources</h3>
                <p className="text-gray-300 text-sm mb-2">Zarządzanie źródłami</p>
                <pre className="text-green-400 text-sm">
{`OBS.sources.add(type, name, settings)  // Dodaj źródło
OBS.sources.remove(sourceId)            // Usuń źródło
OBS.sources.setVisible(id, visible)     // Pokaż/ukryj źródło
OBS.sources.setProperties(id, props)    // Ustaw właściwości`}
                </pre>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">OBS.audio</h3>
                <p className="text-gray-300 text-sm mb-2">Kontrola audio</p>
                <pre className="text-green-400 text-sm">
{`OBS.audio.setVolume(sourceId, volume)  // Ustaw głośność
OBS.audio.mute(sourceId)                // Wycisz źródło
OBS.audio.unmute(sourceId)              // Wyłącz wyciszenie`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'tts':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Text-to-Speech API</h2>
            
            <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold mb-2">Podstawowe użycie TTS</h3>
              <pre className="text-purple-200 text-sm overflow-x-auto">
{`// Podstawowa synteza mowy
OBS.tts.speak('Witaj w streamie!');

// Z ustawieniami
OBS.tts.speak('Tekst do przeczytania', {
  voice: 'pl-PL-Standard-A',
  rate: 1.0,
  pitch: 0.0,
  volume: 0.8
});

// Asynchroniczne użycie
await OBS.tts.speakAsync('Długi tekst...');`}
              </pre>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Dostępne głosy</h3>
                <pre className="text-green-400 text-sm">
{`OBS.tts.getVoices()              // Lista dostępnych głosów
OBS.tts.setDefaultVoice(voice)    // Ustaw domyślny głos
OBS.tts.getDefaultVoice()         // Pobierz domyślny głos`}
                </pre>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Eventy TTS</h3>
                <pre className="text-green-400 text-sm">
{`OBS.tts.on('start', () => {
  console.log('TTS rozpoczęte');
});

OBS.tts.on('end', () => {
  console.log('TTS zakończone');
});

OBS.tts.on('error', (error) => {
  console.error('Błąd TTS:', error);
});`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Przykłady wtyczek</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Chat Reader (TTS)</h3>
                <pre className="text-blue-400 text-sm overflow-x-auto">
{`class ChatReaderPlugin extends OBSPlugin {
  constructor() {
    super({
      name: 'Chat Reader',
      version: '1.0.0',
      author: 'OBS Web'
    });
  }

  onLoad() {
    // Nasłuchuj wiadomości z chatu
    OBS.chat.on('message', (message) => {
      if (message.text.startsWith('!tts')) {
        const text = message.text.substring(4);
        OBS.tts.speak(\`\${message.username} mówi: \${text}\`);
      }
    });
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Auto Scene Switcher</h3>
                <pre className="text-blue-400 text-sm overflow-x-auto">
{`class AutoSceneSwitcherPlugin extends OBSPlugin {
  constructor() {
    super({
      name: 'Auto Scene Switcher',
      version: '1.0.0'
    });
  }

  onLoad() {
    // Przełącz scenę gdy gra się uruchomi
    OBS.system.on('windowFocus', (window) => {
      if (window.title.includes('Game')) {
        OBS.scenes.setActive('Gaming Scene');
      } else {
        OBS.scenes.setActive('Just Chatting');
      }
    });
  }
}`}
                </pre>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Stream Alerts</h3>
                <pre className="text-blue-400 text-sm overflow-x-auto">
{`class StreamAlertsPlugin extends OBSPlugin {
  onLoad() {
    // Alert dla nowych followersów
    OBS.stream.on('follow', (follower) => {
      OBS.tts.speak(\`Dziękuję \${follower.name} za follow!\`);
      
      // Pokaż alert na 5 sekund
      OBS.sources.add('text', 'Follow Alert', {
        text: \`Nowy follower: \${follower.name}\`,
        color: '#00FF00'
      });
      
      setTimeout(() => {
        OBS.sources.remove('Follow Alert');
      }, 5000);
    });
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-300">Wybierz sekcję z menu po lewej</div>;
    }
  };

  return (
    <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-[800px] h-[600px] flex">
      {/* Sidebar */}
      <div className="w-48 bg-gray-900 border-r border-gray-700 p-2">
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-left transition-colors ${
                  activeSection === section.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={14} />
                <span className="text-sm">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Dokumentacja Wtyczek</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};