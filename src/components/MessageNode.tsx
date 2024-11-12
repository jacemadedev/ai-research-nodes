import React from 'react';
import { Handle, Position } from 'reactflow';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface MessageNodeProps {
  data: {
    message: Message;
  };
}

const MessageNode: React.FC<MessageNodeProps> = ({ data }) => {
  const { message } = data;
  const isUser = message.role === 'user';

  return (
    <div className={`
      relative p-4 rounded-lg shadow-lg max-w-md
      ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}
      ${message.status === 'typing' ? 'animate-pulse' : ''}
    `}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-full
          ${isUser ? 'bg-blue-700' : 'bg-gray-100'}
        `}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-blue-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="font-medium mb-1">
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          <div className={`
            text-sm
            ${isUser ? 'text-blue-50' : 'text-gray-600'}
          `}>
            {message.content || (
              message.status === 'typing' ? (
                <span className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              ) : ''
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageNode;