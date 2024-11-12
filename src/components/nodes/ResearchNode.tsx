import React, { useState } from 'react';
import { Search, ExternalLink, Download, Star, StarOff, ArrowRight, Copy, Check } from 'lucide-react';
import { NodeData } from '../../types';
import useStore from '../../store/useStore';
import { callOpenAI } from '../../utils/openai';
import { motion, AnimatePresence } from 'framer-motion';
import BaseNode from './BaseNode';

interface ResearchNodeProps {
  data: NodeData;
}

interface ResearchResult {
  title: string;
  url: string;
  summary: string;
  keyPoints: string[];
  relevance: number;
  date?: string;
  starred?: boolean;
}

const ResearchNode: React.FC<ResearchNodeProps> = ({ data }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedResults, setExpandedResults] = useState<string[]>([]);
  const [filterStarred, setFilterStarred] = useState(false);
  const { openAIConfig } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading || !openAIConfig?.apiKey) return;

    setIsLoading(true);
    try {
      const prompt = `Research the topic: "${query}"
      Provide a comprehensive analysis with 5-7 key findings.
      Format the response as JSON with this structure:
      {
        "results": [{
          "title": "Main Finding Title",
          "url": "Relevant URL from a reputable source",
          "summary": "2-3 sentence summary",
          "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
          "relevance": 0-100 score,
          "date": "YYYY-MM-DD"
        }]
      }`;

      const response = await callOpenAI(
        [{ role: 'user', content: prompt }],
        openAIConfig
      );

      const parsedResponse = JSON.parse(response);
      if (Array.isArray(parsedResponse.results)) {
        setResults(parsedResponse.results.map(r => ({ ...r, starred: false })));
        if (parsedResponse.results.length > 0) {
          setExpandedResults([parsedResponse.results[0].title]);
        }
      }
    } catch (error) {
      console.error('Research Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStar = (index: number) => {
    setResults(prev => prev.map((r, i) => 
      i === index ? { ...r, starred: !r.starred } : r
    ));
  };

  const exportResults = () => {
    const markdown = results
      .map(r => (
        `# ${r.title}${r.starred ? ' ⭐' : ''}\n\n` +
        `${r.summary}\n\n` +
        `## Key Points\n\n${r.keyPoints.map(p => `- ${p}`).join('\n')}\n\n` +
        `**Source:** ${r.url}\n` +
        `**Date:** ${r.date || 'N/A'}\n` +
        `**Relevance:** ${r.relevance}%\n\n---\n\n`
      ))
      .join('');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-${query}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => !filterStarred || r.starred);

  return (
    <BaseNode
      icon={<Search className="w-6 h-6" />}
      title="Research"
      isLoading={isLoading}
      headerActions={
        results.length > 0 ? (
          <>
            <button
              onClick={() => setFilterStarred(!filterStarred)}
              className={`p-2 rounded-lg transition-colors ${
                filterStarred 
                  ? 'bg-yellow-50 text-yellow-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {filterStarred ? <Star className="w-5 h-5" /> : <StarOff className="w-5 h-5" />}
            </button>
            <button
              onClick={exportResults}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600"
            >
              <Download className="w-5 h-5" />
            </button>
          </>
        ) : null
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={!openAIConfig?.apiKey ? "Add API key in settings..." : "Enter research topic..."}
            disabled={isLoading || !openAIConfig?.apiKey}
            className="flex-1 h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim() || !openAIConfig?.apiKey}
            className="h-12 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <AnimatePresence>
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 first:mt-0"
          >
            <div className="p-6 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {result.title}
                    </h3>
                    <button
                      onClick={() => toggleStar(index)}
                      className={`p-1 rounded-lg transition-colors ${
                        result.starred 
                          ? 'text-yellow-500' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Relevance: {result.relevance}%</span>
                    {result.date && (
                      <>
                        <span>•</span>
                        <span>{new Date(result.date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {result.summary}
                  </p>

                  <div className="space-y-2 mt-4">
                    {result.keyPoints.map((point, pointIndex) => (
                      <div
                        key={pointIndex}
                        className="flex items-start gap-3 group"
                      >
                        <ArrowRight className="w-4 h-4 mt-1 text-gray-400" />
                        <span className="flex-1 text-gray-600">{point}</span>
                        <button
                          onClick={() => handleCopy(point, `${index}-${pointIndex}`)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 transition-all"
                        >
                          {copiedId === `${index}-${pointIndex}` ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-blue-500 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </BaseNode>
  );
};

export default ResearchNode;