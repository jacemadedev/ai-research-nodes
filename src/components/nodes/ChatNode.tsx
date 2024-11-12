import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageCircle, Send, Loader } from 'lucide-react';
import { Message } from '../../types';
import { callOpenAI } from '../../utils/openai';
import useStore from '../../store/useStore';

interface ChatNodeProps {
  data: {
    nodeId: string;
    messages: Message[];
  };
}

const ChatNode: React.FC<ChatNodeProps> = ({ data }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateMessage, openAIConfig } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !openAIConfig?.apiKey) return;

    setIsLoading(true);
    const userMessageId = `${data.nodeId}-${Date.now()}`;
    const aiMessageId = `${data.nodeId}-${Date.now() + 1}`;

    try {
      // Add user message
      updateMessage(userMessageId, {
        id: userMessageId,
        content: input.trim(),
        role: 'user',
        type: 'chat',
      });

      // Add initial AI message
      updateMessage(aiMessageId, {
        id: aiMessageId,
        content: '',
        role: 'assistant',
        type: 'chat',
        status: 'typing',
      });

      setInput('');

      // Prepare conversation history
      const messages = data.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add current message
      messages.push({
        role: 'user',
        content: input.trim(),
      });

      let accumulatedResponse = '';
      await callOpenAI(
        messages,
        openAIConfig,
        (chunk) => {
          accumulatedResponse += chunk;
          updateMessage(aiMessageId, {
            id: aiMessageId,
            content: accumulatedResponse,
            role: 'assistant',
            type: 'chat',
            status: 'typing',
          });
        }
      );

      // Mark message as complete
      updateMessage(aiMessageId, {
        id: aiMessageId,
        content: accumulatedResponse,
        role: 'assistant',
        type: 'chat',
        status: 'complete',
      });
    } catch (error) {
      console.error('Chat Error:', error);
      updateMessage(aiMessageId, {
        id: aiMessageId,
        content: error instanceof Error ? error.message : 'An error occurred',
        role: 'assistant',
        type: 'chat',
        status: 'complete',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="node-base rounded-lg p-4 min-w-[300px] max-w-[400px]">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="node-header">
        <MessageCircle className="w-5 h-5" />
        <span>Chat Node</span>
      </div>

      <div className="max-h-[300px] overflow-y-auto mb-4 space-y-3 pr-2">
        {data.messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-white/10 ml-4'
                : 'bg-white/5 mr-4'
            }`}
          >
            <div className="text-sm">
              {message.content}
              {message.status === 'typing' && (
                <span className="inline-flex gap-1 ml-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={!openAIConfig?.apiKey ? "Add API key in settings..." : "Type message..."}
          disabled={isLoading || !openAIConfig?.apiKey}
          className="flex-1 px-3 py-2 rounded-lg border node-input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !openAIConfig?.apiKey}
          className="p-2 rounded-lg node-button"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatNode;