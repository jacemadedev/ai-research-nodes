import React, { useState } from 'react';
import { FileText, Send, AlertCircle } from 'lucide-react';
import { NodeData } from '../../types';
import useStore from '../../store/useStore';
import { callOpenAI } from '../../utils/openai';
import BaseNode from './BaseNode';

interface SummaryNodeProps {
  data: NodeData;
}

const SummaryNode: React.FC<SummaryNodeProps> = ({ data }) => {
  const [input, setInput] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openAIConfig } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !openAIConfig?.apiKey) return;

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const prompt = `Analyze and summarize the following text:

"${input.trim()}"

Provide a structured summary that includes:
1. Main points and key ideas
2. Important details and supporting information
3. Key takeaways or conclusions

Format the response as a JSON object with this structure:
{
  "summary": {
    "mainPoints": "Clear, concise overview of the main points",
    "details": "Important supporting details and context",
    "takeaways": "Key conclusions or insights"
  }
}`;

      const response = await callOpenAI(
        [{ role: 'user', content: prompt }],
        openAIConfig
      );

      const parsedResponse = JSON.parse(response);
      const formattedSummary = [
        parsedResponse.summary.mainPoints,
        parsedResponse.summary.details,
        parsedResponse.summary.takeaways
      ].join('\n\n');
      setSummary(formattedSummary);
    } catch (error) {
      console.error('Summary Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseNode
      icon={<FileText className="w-6 h-6" />}
      title="Summary"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={!openAIConfig?.apiKey ? "Add API key in settings..." : "Enter text to summarize..."}
          disabled={isLoading || !openAIConfig?.apiKey}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-60 resize-none"
        />
        
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !openAIConfig?.apiKey}
            className="h-12 px-6 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Summarize</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {summary && !error && (
        <div className="mt-6 p-6 rounded-xl bg-emerald-50 border border-emerald-100">
          <h3 className="text-base font-medium text-emerald-900 mb-4">Summary</h3>
          <div className="prose prose-sm max-w-none text-emerald-800">
            {summary.split('\n\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4 last:mb-0 leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};

export default SummaryNode;