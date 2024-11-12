import React, { useState } from 'react';
import { Network, Send, AlertCircle, Download } from 'lucide-react';
import { NodeData } from '../../types';
import useStore from '../../store/useStore';
import { callOpenAI } from '../../utils/openai';
import { motion, AnimatePresence } from 'framer-motion';
import BaseNode from './BaseNode';

interface MindMapNodeProps {
  data: NodeData;
}

interface MindMapTopic {
  id: string;
  title: string;
  color: string;
  subtopics: Array<{
    id: string;
    title: string;
    concepts: Array<{
      id: string;
      text: string;
      notes?: string;
    }>;
  }>;
}

const COLORS = {
  red: '#F87171',
  blue: '#60A5FA',
  green: '#34D399',
  purple: '#A78BFA',
  yellow: '#FBBF24',
};

const MindMapNode: React.FC<MindMapNodeProps> = ({ data }) => {
  const [topic, setTopic] = useState('');
  const [mindMap, setMindMap] = useState<MindMapTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openAIConfig } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading || !openAIConfig?.apiKey) return;

    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Create a hierarchical mind map for: "${topic}".
      Return a JSON object with this structure:
      {
        "mindMap": [{
          "id": "unique-id",
          "title": "Main Topic Area",
          "subtopics": [{
            "id": "unique-id",
            "title": "Subtopic",
            "concepts": [{
              "id": "unique-id",
              "text": "Key concept or idea",
              "notes": "Optional additional context"
            }]
          }]
        }]
      }
      
      Guidelines:
      - Create 4-5 main topic areas
      - Each topic should have 2-3 subtopics
      - Each subtopic should have 2-3 key concepts
      - Keep concept text concise (3-5 words)
      - Add brief, insightful notes where helpful`;

      const response = await callOpenAI(
        [{ role: 'user', content: prompt }],
        openAIConfig
      );

      const parsedResponse = JSON.parse(response);
      if (Array.isArray(parsedResponse.mindMap)) {
        setMindMap(parsedResponse.mindMap.map((topic, i) => ({
          ...topic,
          color: Object.values(COLORS)[i % Object.values(COLORS).length],
        })));
      }
    } catch (error) {
      console.error('Mind Map Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate mind map');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToMarkdown = () => {
    const markdown = mindMap.map(topic => {
      let md = `# ${topic.title}\n\n`;
      
      topic.subtopics.forEach(subtopic => {
        md += `## ${subtopic.title}\n\n`;
        subtopic.concepts.forEach(concept => {
          md += `### ${concept.text}\n`;
          if (concept.notes) {
            md += `${concept.notes}\n`;
          }
          md += '\n';
        });
      });
      
      return md;
    }).join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmap-${topic}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <BaseNode
      icon={<Network className="w-6 h-6" />}
      title="Mind Map"
      isLoading={isLoading}
      headerActions={
        mindMap.length > 0 ? (
          <button
            onClick={exportToMarkdown}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600"
            title="Export to Markdown"
          >
            <Download className="w-5 h-5" />
          </button>
        ) : null
      }
    >
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={!openAIConfig?.apiKey ? "Add API key in settings..." : "Enter topic to map..."}
            disabled={isLoading || !openAIConfig?.apiKey}
            className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || !openAIConfig?.apiKey}
            className="h-12 px-6 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Generate</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence>
        {mindMap.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            {/* Center Topic */}
            <div className="flex justify-center mb-12">
              <div className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-lg">
                {topic}
              </div>
            </div>

            {/* Mind Map Structure */}
            <div className="space-y-12">
              {mindMap.map((mainTopic, i) => (
                <motion.div
                  key={mainTopic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Main Topic */}
                  <div className="relative pl-8">
                    {/* Vertical connecting line */}
                    <div 
                      className="absolute left-4 top-6 bottom-0 w-px"
                      style={{ backgroundColor: `${mainTopic.color}30` }}
                    />
                    
                    {/* Horizontal connecting line */}
                    <div 
                      className="absolute left-4 top-6 w-4 h-px"
                      style={{ backgroundColor: mainTopic.color }}
                    />
                    
                    {/* Topic content */}
                    <div 
                      className="p-4 rounded-xl shadow-sm border"
                      style={{ 
                        backgroundColor: `${mainTopic.color}08`,
                        borderColor: `${mainTopic.color}30`
                      }}
                    >
                      <h3 
                        className="text-lg font-medium mb-6"
                        style={{ color: mainTopic.color }}
                      >
                        {mainTopic.title}
                      </h3>
                      
                      <div className="space-y-6">
                        {mainTopic.subtopics.map((subtopic, j) => (
                          <motion.div 
                            key={subtopic.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (i * 0.1) + (j * 0.05) }}
                            className="relative pl-6"
                          >
                            {/* Subtopic connecting line */}
                            <div 
                              className="absolute left-0 top-3 w-4 h-px"
                              style={{ backgroundColor: `${mainTopic.color}50` }}
                            />
                            
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              {subtopic.title}
                            </h4>
                            
                            <div className="space-y-2">
                              {subtopic.concepts.map((concept, k) => (
                                <motion.div
                                  key={concept.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: (i * 0.1) + (j * 0.05) + (k * 0.02) }}
                                  className="relative group pl-4 flex items-center gap-2"
                                >
                                  <div 
                                    className="absolute left-0 top-[0.6rem] w-2 h-px"
                                    style={{ backgroundColor: `${mainTopic.color}30` }}
                                  />
                                  <div className="text-sm text-gray-600">
                                    {concept.text}
                                  </div>
                                  
                                  {concept.notes && (
                                    <div className="absolute left-full ml-2 top-0 w-48 p-2 rounded-md bg-white shadow-lg border border-gray-100 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                      {concept.notes}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BaseNode>
  );
};

export default MindMapNode;