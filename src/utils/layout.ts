import { Message } from '../types';

export function generateNodePosition(message: Message, index: number, messages: Message[]) {
  const VERTICAL_SPACING = 150;
  const HORIZONTAL_SPACING = 300;
  
  // For the first message
  if (!message.parentId) {
    return { x: 0, y: 0 };
  }

  // Find the parent message
  const parentMessage = messages.find(m => m.id === message.parentId);
  if (!parentMessage) {
    return { x: 0, y: 0 };
  }

  // Find parent's position
  const parentIndex = messages.indexOf(parentMessage);
  const parentPos = parentIndex === -1 ? { x: 0, y: 0 } : 
    generateNodePosition(parentMessage, parentIndex, messages);

  // Calculate child position relative to parent
  return {
    x: parentPos.x + HORIZONTAL_SPACING,
    y: parentPos.y,
  };
}