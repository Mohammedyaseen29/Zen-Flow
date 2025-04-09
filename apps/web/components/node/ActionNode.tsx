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
    const [isOpen, setIsOpen] = useState(false);

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
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-500 hover:text-green-500 mr-2"
            >
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <button 
                onClick={data.onDelete}
                className="text-gray-500 hover:text-red-500"
            >
                <X size={20} />
            </button>
            </div>
        </div>
        
        {isOpen && (
            <div className="mt-2 border-t pt-2">
            <p className="text-sm text-gray-600 mb-2">Choose an action:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
                {data.options.map((option) => (
                <button
                    key={option.id}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-green-50 rounded-md flex items-center ${
                    option.id === data.actionId ? 'bg-green-50 font-medium' : ''
                    }`}
                    onClick={() => {
                    data.onSelectAction(option.id);
                    setIsOpen(false);
                    }}
                >
                    <div className='flex items-center gap-x-1'>
                        <Image src={option.image} alt='trigger.png' width={20} height={20}/>
                        <p>{option.name}</p>
                    </div>
                </button>
                ))}
            </div>
            </div>
        )}

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