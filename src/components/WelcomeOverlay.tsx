import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, FileText, Network, Image, ArrowRight } from 'lucide-react';

const WelcomeOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  const features = [
    {
      icon: Search,
      title: 'Research',
      description: 'Deep dive into topics with AI-powered research assistance'
    },
    {
      icon: Network,
      title: 'Mind Maps',
      description: 'Visualize concepts and their relationships'
    },
    {
      icon: FileText,
      title: 'Summaries',
      description: 'Get concise summaries of complex texts'
    },
    {
      icon: Image,
      title: 'Image Generation',
      description: 'Create visuals for your research'
    }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <img
              src="https://framerusercontent.com/images/0RN1wCu7YrXQsMjeyC9eejsXwg.png"
              alt="Research Nodes"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to Research Nodes
            </h1>
            <p className="text-gray-600">
              Transform your research process with AI-powered tools
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50"
              >
                <feature.icon className="w-6 h-6 text-blue-500 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
            <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
            <ol className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Click the <Plus className="w-4 h-4 inline mx-1" /> button to add your first node
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Connect your OpenAI API key in settings
              </li>
              <li className="flex items-start gap-2 text-sm text-blue-800">
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Start exploring and connecting ideas!
              </li>
            </ol>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="w-full h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeOverlay;