import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import useStore from '../store/useStore';
import { callOpenAI } from '../utils/openai';

const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const addMessage = useStore((state) => state.addMessage);
  const updateMessage = useStore((state) => state.updateMessage);
  const messages = useStore((state) => state.messages);
  const openAIConfig = useStore((state) => state.openAIConfig);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !openAIConfig?.apiKey) return;

    const userMessageId = Date.now().toString();
    const responseMessageId = (Date.now() + 1).toString();

    // Add user message
    addMessage({
      id: userMessageId,
      role: 'user',
      content: input.trim(),
      type: 'text',
    });

    setIsLoading(true);
    setInput('');

    // Add initial AI response with typing status
    addMessage({
      id: responseMessageId,
      role: 'assistant',
      content: '',
      status: 'typing',
      parentId: userMessageId,
    });

    try {
      // Prepare conversation history
      const conversationHistory = messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add current message
      conversationHistory.push({
        role: 'user',
        content: input.trim(),
      });

      // Call OpenAI API
      const response = await callOpenAI(conversationHistory, openAIConfig);
      
      // Update with API response
      updateMessage(responseMessageId, {
        status: 'complete',
        content: response,
      });
    } catch (error) {
      console.error('Chat Error:', error);
      updateMessage(responseMessageId, {
        status: 'complete',
        content: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, addMessage, updateMessage, messages, openAIConfig, isLoading]);

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200"
    >
      <div className="max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            !openAIConfig?.apiKey
              ? "Please add your OpenAI API key in settings..."
              : isLoading
              ? "Waiting for response..."
              : "Type your message..."
          }
          disabled={isLoading || !openAIConfig?.apiKey}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !openAIConfig?.apiKey}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;