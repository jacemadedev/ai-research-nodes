export type NodeType = 'research' | 'image' | 'summary' | 'mindmap';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  type: NodeType;
  parentId?: string;
  status?: 'typing' | 'complete';
}

export interface OpenAIConfig {
  apiKey: string;
  model: string;
}

export interface FlowState {
  nodes: Node[];
  edges: Edge[];
  messages: Message[];
  openAIConfig: OpenAIConfig | null;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setOpenAIConfig: (config: OpenAIConfig | null) => void;
}

export interface NodeData {
  id: string;
  type: NodeType;
  messages: Message[];
  status?: 'typing' | 'complete';
}