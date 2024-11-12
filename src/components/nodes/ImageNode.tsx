import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Image as ImageIcon, Send, Loader, Download, AlertCircle } from 'lucide-react';
import { NodeData } from '../../types';
import useStore from '../../store/useStore';

interface ImageNodeProps {
  data: NodeData;
}

const ImageNode: React.FC<ImageNodeProps> = ({ data }) => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openAIConfig } = useStore();

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || !openAIConfig?.apiKey) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAIConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt.trim(),
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      setImageUrl(data.data[0].url);
    } catch (error) {
      console.error('Image Generation Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download by simulating click
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download Error:', error);
      // Fallback: Open image in new tab if direct download fails
      window.open(imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="flex items-center gap-2 mb-4 text-pink-600">
        <ImageIcon className="w-5 h-5" />
        <span className="font-semibold">Image Generator</span>
      </div>

      <form onSubmit={generateImage} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={!openAIConfig?.apiKey ? "Add API key in settings..." : "Describe the image you want to generate..."}
          disabled={isLoading || !openAIConfig?.apiKey}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 resize-none"
        />
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !prompt.trim() || !openAIConfig?.apiKey}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-pink-400 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4 space-y-3">
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-auto rounded-lg border border-gray-200"
            />
            <button
              onClick={handleDownload}
              className="absolute top-2 right-2 p-2 bg-black/75 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
              title="Download or open in new tab"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageNode;