    import { Handle, Position } from '@xyflow/react';
    import { useState } from 'react';
    import { ChevronDown, ChevronUp, X } from 'lucide-react';
import Image from 'next/image';

    type ActionNodeProps = {
    data: {
        label: string;
        icon: string;
        actionId: string;
        onDelete: () => void;
        options: Array<{ id: string; name: string; image: string }>;
        onSelectAction: (id: string) => void;
    };
    isConnectable: boolean;
    };

    export default function ActionNode({ data, isConnectable }: ActionNodeProps) {

    return (
        <div className="border-2 border-green-500 bg-white rounded-lg shadow-md p-4 w-64">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold">{data.label[0].toUpperCase()}</span>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Action</h3>
                <p className="text-sm text-gray-600">{data.label}</p>
            </div>
            </div>
            <div className="flex items-center">
            <button 
                onClick={data.onDelete}
                className="text-gray-500 hover:text-red-500"
            >
                <X size={20} />
            </button>
            </div>
        </div>

        <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-green-500"
        />
        
        <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-green-500"
        />
        </div>
    );
    }