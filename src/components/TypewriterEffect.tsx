import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  content: string;
  speed?: number;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ 
  content, 
  speed = 50 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex, speed]);

  return (
    <div className="min-h-[1.5em] text-sm text-gray-600">
      {displayedContent}
      {currentIndex < content.length && (
        <span className="ml-0.5 animate-pulse">▋</span>
      )}
    </div>
  );
};

export default TypewriterEffect;