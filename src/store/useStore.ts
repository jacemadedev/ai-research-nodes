import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Connection, Edge, EdgeChange, Node, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { Message, NodeType, OpenAIConfig, FlowState } from '../types';
import { v4 as uuidv4 } from 'uuid';

const useStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      messages: [],
      openAIConfig: null,
      
      setOpenAIConfig: (config) => set({ openAIConfig: config }),
      
      addNode: (type: NodeType, position) => {
        const nodeId = uuidv4();
        const newNode: Node = {
          id: nodeId,
          type,
          position,
          data: {
            nodeId,
            messages: [],
          },
        };

        set((state) => ({
          nodes: [...state.nodes, newNode],
        }));

        return nodeId;
      },

      addMessage: (message) => {
        set((state) => {
          const nodeId = message.id.split('-')[0];
          const nodes = state.nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  messages: [...(node.data.messages || []), message],
                },
              };
            }
            return node;
          });

          return { nodes };
        });
      },

      updateMessage: (id, updates) => {
        set((state) => {
          const nodeId = id.split('-')[0];
          const nodes = state.nodes.map((node) => {
            if (node.id === nodeId) {
              const messages = [...(node.data.messages || [])];
              const existingIndex = messages.findIndex((m) => m.id === id);
              
              if (existingIndex >= 0) {
                messages[existingIndex] = { ...messages[existingIndex], ...updates };
              } else {
                messages.push({ ...updates, id });
              }

              return {
                ...node,
                data: {
                  ...node.data,
                  messages,
                },
              };
            }
            return node;
          });

          return { nodes };
        });
      },

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
    }),
    {
      name: 'flow-chat-storage',
      partialize: (state) => ({
        openAIConfig: state.openAIConfig,
      }),
    }
  )
);

export default useStore;