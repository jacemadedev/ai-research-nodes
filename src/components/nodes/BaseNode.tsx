import React from 'react';
import { Handle, Position } from 'reactflow';
import { Loader } from 'lucide-react';

interface BaseNodeProps {
  icon: React.ReactNode;
  title: string;
  isLoading?: boolean;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ 
  icon, 
  title, 
  isLoading, 
  children,
  headerActions 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-[500px]">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-gray-600">
              {icon}
            </div>
            <h2 className="text-lg font-medium text-gray-900">
              {title}
            </h2>
            {isLoading && (
              <Loader className="w-4 h-4 animate-spin text-blue-500 ml-2" />
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default BaseNode;