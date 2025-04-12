    // components/nodes/TriggerNode.tsx
    import { Handle, Position } from '@xyflow/react';
    import { useState } from 'react';
    import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

    type TriggerNodeProps = {
    data: {
        label: string;
        icon: string;
        options: Array<{ id: string; name: string; image: string }>;
        onSelectTrigger: (id: string) => void;
        selected?: boolean;
        triggerId?: string;
    };
    isConnectable: boolean;
    };

    export default function TriggerNode({ data, isConnectable }: TriggerNodeProps) {

    return (
        <div className="border-2 border-blue-500 bg-white rounded-lg shadow-md p-4 w-64">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                {data.icon === 'play' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                ) : (
                <span className="text-sm font-bold">{data.label[0].toUpperCase()}</span>
                )}
            </div>
            <div>
                <h3 className="font-semibold text-gray-800">Trigger</h3>
                <p className="text-sm text-gray-600">{data.label}</p>
            </div>
            </div>
        </div>
        <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="w-3 h-3 bg-blue-500"
        />
        </div>
    );
    }
