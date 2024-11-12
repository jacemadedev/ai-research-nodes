import React from 'react';
import FlowWrapper from './components/FlowWrapper';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <div className="w-screen h-screen relative">
      <ReactFlowProvider>
        <FlowWrapper />
      </ReactFlowProvider>
    </div>
  );
}

export default App;