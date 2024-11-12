import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store/useStore';
import ResearchNode from './nodes/ResearchNode';
import SummaryNode from './nodes/SummaryNode';
import MindMapNode from './nodes/MindMapNode';
import ImageNode from './nodes/ImageNode';
import NodeMenu from './NodeMenu';
import Settings from './Settings';
import WelcomeOverlay from './WelcomeOverlay';
import EmptyState from './EmptyState';

const nodeTypes = {
  research: ResearchNode,
  summary: SummaryNode,
  mindmap: MindMapNode,
  image: ImageNode,
};

const FlowWrapper: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();

  const handleAddNode = useCallback((type: 'research' | 'summary' | 'mindmap' | 'image') => {
    const position = {
      x: window.innerWidth / 2 - 250,
      y: window.innerHeight / 2 - 200,
    };
    addNode(type, position);
  }, [addNode]);

  return (
    <div className="w-full h-full relative">
      <img 
        src="https://framerusercontent.com/images/0RN1wCu7YrXQsMjeyC9eejsXwg.png"
        alt="Logo"
        className="fixed top-4 left-4 w-8 h-8 z-50"
      />
      <Settings />
      <WelcomeOverlay />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
        {nodes.length === 0 && <EmptyState />}
        <NodeMenu onAddNode={handleAddNode} />
      </ReactFlow>
    </div>
  );
};

export default FlowWrapper;