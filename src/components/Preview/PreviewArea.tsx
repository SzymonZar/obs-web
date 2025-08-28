import React from 'react';
import { Maximize2, Grid3X3, Crosshair, RotateCcw } from 'lucide-react';

interface PreviewAreaProps {
  isRecording: boolean;
  isStreaming: boolean;
  previewMode: 'program' | 'preview' | 'multiview' | 'studio';
  onPreviewModeChange: (mode: 'program' | 'preview' | 'multiview' | 'studio') => void;
  onResetTransform: () => void;
  onTransition?: () => void;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  isRecording,
  isStreaming,
  previewMode,
  onPreviewModeChange,
  onResetTransform,
  onTransition
}) => {
  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      {/* Preview Controls */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => onPreviewModeChange('program')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'program' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Program
              </button>
              <button
                onClick={() => onPreviewModeChange('preview')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'preview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => onPreviewModeChange('multiview')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'multiview' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Multiview
              </button>
              <button
                onClick={() => onPreviewModeChange('studio')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'studio' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Studio
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetTransform}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Reset Transform"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Fullscreen Preview"
            >
              <Maximize2 size={16} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Show Grid"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Center Guides"
            >
              <Crosshair size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 bg-black relative overflow-hidden">
        {previewMode === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 p-2 h-full">
            {/* Program Output */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                PROGRAM
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <p className="text-sm">Live Output</p>
                </div>
              </div>
            </div>

            {/* Preview Output */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                PREVIEW
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    👁️
                  </div>
                  <p className="text-sm">Preview</p>
                </div>
              </div>
            </div>

            {/* Transition Controls */}
            <div className="lg:col-span-2 flex items-center justify-center p-4">
              <div className="flex items-center space-x-4">
                <select className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
                  <option>Cut</option>
                  <option>Fade</option>
                  <option>Slide</option>
                  <option>Wipe</option>
                </select>
                <button
                  onClick={onTransition}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  TRANSITION
                </button>
                <div className="text-white text-sm">
                  Duration: 300ms
                </div>
              </div>
            </div>
          </div>
        ) : previewMode === 'multiview' ? (
          <div className="grid grid-cols-2 gap-1 p-4 h-full">
            {/* Program Output */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                PROGRAM
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <p className="text-sm">Live Output</p>
                </div>
              </div>
            </div>

            {/* Preview Output */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                PREVIEW
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-lg flex items-center justify-center">
                    👁️
                  </div>
                  <p className="text-sm">Preview</p>
                </div>
              </div>
            </div>

            {/* Source 1 */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                HDMI Capture
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded flex items-center justify-center">
                    🖥️
                  </div>
                  <p className="text-xs">No Signal</p>
                </div>
              </div>
            </div>

            {/* Source 2 */}
            <div className="bg-gray-800 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium z-10">
                Webcam
              </div>
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-700 rounded flex items-center justify-center">
                    📹
                  </div>
                  <p className="text-xs">No Signal</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Status Indicators */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
              {isRecording && (
                <div className="bg-red-600 text-white text-sm px-3 py-1 rounded font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
              )}
              {isStreaming && (
                <div className="bg-blue-600 text-white text-sm px-3 py-1 rounded font-medium flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
              )}
            </div>

            {/* Mode Indicator */}
            <div className="absolute top-4 right-4 z-10">
              <div className={`text-white text-sm px-3 py-1 rounded font-medium ${
                previewMode === 'program' ? 'bg-red-600' : 
                previewMode === 'preview' ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {previewMode.toUpperCase()}
              </div>
            </div>

            {/* Main Preview */}
            <div className="aspect-video max-w-full max-h-full bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center text-4xl">
                  🎬
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Scene</h3>
                <p className="text-sm">Add sources to your scene to see preview</p>
              </div>
            </div>

            {/* Canvas Overlay (for source manipulation) */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Grid lines could be rendered here */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};