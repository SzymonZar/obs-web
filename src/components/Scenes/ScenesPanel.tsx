import React from 'react';
import { Plus, Play, Eye, Trash2, Copy, Settings } from 'lucide-react';
import { Scene } from '../../types';

interface ScenesPanelProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  onScenePreview: (sceneId: string) => void;
  onSceneAdd: () => void;
  onSceneDelete: (sceneId: string) => void;
  onSceneDuplicate: (sceneId: string) => void;
  onSceneRename: (sceneId: string, name: string) => void;
}

export const ScenesPanel: React.FC<ScenesPanelProps> = ({
  scenes,
  activeSceneId,
  onSceneSelect,
  onScenePreview,
  onSceneAdd,
  onSceneDelete,
  onSceneDuplicate,
  onSceneRename
}) => {
  const [editingScene, setEditingScene] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');

  const handleEditStart = (scene: Scene) => {
    setEditingScene(scene.id);
    setEditName(scene.name);
  };

  const handleEditSave = () => {
    if (editingScene && editName.trim()) {
      onSceneRename(editingScene, editName.trim());
    }
    setEditingScene(null);
    setEditName('');
  };

  const handleEditCancel = () => {
    setEditingScene(null);
    setEditName('');
  };

  return (
    <div className="bg-gray-800 border-r border-gray-700 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Scenes</h3>
          <button
            onClick={onSceneAdd}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            title="Add Scene"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            className={`group relative bg-gray-700 rounded-lg overflow-hidden transition-all ${
              scene.id === activeSceneId 
                ? 'ring-2 ring-blue-500 bg-gray-600' 
                : 'hover:bg-gray-600'
            }`}
          >
            <div className="aspect-video bg-gray-900 relative">
              {scene.preview ? (
                <img 
                  src={scene.preview} 
                  alt={scene.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 bg-gray-600 rounded"></div>
                    <div className="text-xs">No Preview</div>
                  </div>
                </div>
              )}
              
              {/* Overlay Controls */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSceneSelect(scene.id)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    title="Go Live"
                  >
                    <Play size={16} />
                  </button>
                  <button
                    onClick={() => onScenePreview(scene.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors"
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
              
              {/* Live Indicator */}
              {scene.id === activeSceneId && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                  LIVE
                </div>
              )}
              
              {/* Sources Count */}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {scene.sources.length} sources
              </div>
            </div>

            <div className="p-3">
              {editingScene === scene.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleEditSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave();
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                  className="w-full bg-gray-600 text-white px-2 py-1 rounded text-sm border-0 focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <div className="flex items-center justify-between">
                  <h4 
                    className="text-white font-medium text-sm cursor-pointer hover:text-blue-300 transition-colors"
                    onClick={() => handleEditStart(scene)}
                  >
                    {scene.name}
                  </h4>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onSceneDuplicate(scene.id)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={() => onSceneDelete(scene.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};