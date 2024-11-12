import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-gray-400 mb-2">
          <span>Click</span>
          <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <span>to add your first node</span>
        </div>
        <p className="text-sm text-gray-500">
          Start exploring with Research, Mind Maps, Summaries, or Images
        </p>
      </div>
    </motion.div>
  );
};

export default EmptyState;