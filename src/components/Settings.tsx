import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Eye, EyeOff } from 'lucide-react';
import useStore from '../store/useStore';

const AVAILABLE_MODELS = [
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
];

const Settings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { openAIConfig, setOpenAIConfig } = useStore();
  const [formData, setFormData] = useState({
    apiKey: openAIConfig?.apiKey || '',
    model: openAIConfig?.model || 'gpt-4-turbo-preview',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenAIConfig({
      apiKey: formData.apiKey,
      model: formData.model,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setOpenAIConfig(null);
    setFormData({ apiKey: '', model: 'gpt-4-turbo-preview' });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 z-10 p-3 rounded-lg ${
          !openAIConfig?.apiKey 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-white/90'
        } transition-colors`}
      >
        <SettingsIcon className={`w-5 h-5 ${!openAIConfig?.apiKey ? 'text-white' : 'text-gray-600'}`} />
      </button>

      {!openAIConfig?.apiKey && (
        <div className="fixed top-4 right-16 z-10">
          <div className="px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm text-gray-600">
            Connect your OpenAI API key to get started →
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Version
                </label>
                <select
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {AVAILABLE_MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;