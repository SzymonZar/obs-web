import React from 'react';
import { X, Monitor, Mic, Wifi, HardDrive, Cpu, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('output');

  if (!isOpen) return null;

  const tabs = [
    { id: 'output', name: 'Output', icon: Monitor },
    { id: 'audio', name: 'Audio', icon: Mic },
    { id: 'stream', name: 'Stream', icon: Wifi },
    { id: 'recording', name: 'Recording', icon: HardDrive },
    { id: 'hardware', name: 'Hardware', icon: Cpu },
    { id: 'advanced', name: 'Advanced', icon: SettingsIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-3/4 max-h-[800px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-48 bg-gray-900 border-r border-gray-700">
            <nav className="p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'output' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Output Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Output Resolution
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>1920x1080</option>
                      <option>1280x720</option>
                      <option>3840x2160</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      FPS
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>60</option>
                      <option>30</option>
                      <option>25</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stream' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Streaming Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Service
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Twitch</option>
                      <option>YouTube</option>
                      <option>Facebook Live</option>
                      <option>Custom RTMP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stream Key
                    </label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Enter your stream key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bitrate (kbps)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      defaultValue="3500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hardware' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Hardware Acceleration</h3>
                <div className="space-y-4">
                  <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-blue-300 font-semibold mb-2">Orange Pi 5+ Configuration</h4>
                    <p className="text-blue-200 text-sm">
                      Mali G610 GPU detected. Hardware acceleration is available for H.264/H.265 encoding.
                    </p>
                  </div>
                  
                  <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                    <h4 className="text-green-300 font-semibold mb-2">HDMI Output Configuration</h4>
                    <div className="space-y-2 text-sm text-green-200">
                      <p><strong>HDMI-1:</strong> Server Console (Primary Display)</p>
                      <p><strong>HDMI-2:</strong> Input Passthrough (Secondary Display)</p>
                      <p>Maximum resolution and refresh rate automatically detected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        GPU Acceleration
                      </label>
                      <p className="text-xs text-gray-400">Use Mali G610 for video encoding</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        VPU Hardware Encoding
                      </label>
                      <p className="text-xs text-gray-400">Enable RK3588 VPU for better performance</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        HDMI Passthrough
                      </label>
                      <p className="text-xs text-gray-400">Direct input to HDMI-2 with minimal latency</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Encoder
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Hardware H.264 (RK3588 VPU)</option>
                      <option>Hardware H.265 (RK3588 VPU)</option>
                      <option>Software x264</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      HDMI-2 Resolution
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Auto (Maximum Available)</option>
                      <option>3840x2160@60Hz</option>
                      <option>3840x2160@30Hz</option>
                      <option>1920x1080@120Hz</option>
                      <option>1920x1080@60Hz</option>
                      <option>1280x720@60Hz</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Latency Mode
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Ultra Low Latency (&lt;1ms)</option>
                      <option>Low Latency (&lt;5ms)</option>
                      <option>Normal (&lt;16ms)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Audio Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sample Rate
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>48000 Hz</option>
                      <option>44100 Hz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Channels
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                      <option>Stereo</option>
                      <option>Mono</option>
                      <option>5.1 Surround</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};