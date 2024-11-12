import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Network, Image } from 'lucide-react';

interface NodeMenuProps {
  onAddNode: (type: 'research' | 'summary' | 'mindmap' | 'image') => void;
}

const NODE_TYPES = [
  { type: 'research', label: 'Research', icon: Search, color: 'blue' },
  { type: 'mindmap', label: 'Mind Map', icon: Network, color: 'orange' },
  { type: 'summary', label: 'Summary', icon: FileText, color: 'emerald' },
  { type: 'image', label: 'Image', icon: Image, color: 'pink' },
] as const;

const NodeMenu: React.FC<NodeMenuProps> = ({ onAddNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonStyles = (color: string) => {
    const styles = {
      blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
      pink: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    };
    return styles[color as keyof typeof styles];
  };

  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 flex gap-2"
          >
            {NODE_TYPES.map(({ type, label, icon: Icon, color }) => (
              <motion.button
                key={type}
                onClick={() => {
                  onAddNode(type);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all ${getButtonStyles(color)}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { rotate: 45 } : { rotate: 0 }}
      >
        <Plus className="w-6 h-6 text-gray-700" />
      </motion.button>
    </div>
  );
};

export default NodeMenu;