    import { Plus } from 'lucide-react';
import Image from 'next/image';

    type SidebarProps = {
    availableTriggers: Array<{ id: string; name: string; image: string }>;
    availableActions: Array<{ id: string; name: string; image: string }>;
    onSelectTrigger: (id: string) => void;
    onAddAction: (id: string) => void;
    selectedTrigger: { id: string; label: string; image: string } | null;
    };
    
    export default function Sidebar({
    availableTriggers,
    availableActions,
    onSelectTrigger,
    onAddAction,
    selectedTrigger
    }: SidebarProps) {
    return (
        <div className="w-64 bg-gray-50 border-l p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Flow Builder</h2>
        
        <div className="mb-6">
            <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Triggers</h3>
            <div className="space-y-2">
            {availableTriggers.map((trigger) => (
                <button
                key={trigger.id}
                className={`w-full flex items-center p-2 rounded-md text-sm ${
                    selectedTrigger?.id === trigger.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelectTrigger(trigger.id)}
                >
                <div className='flex items-center gap-x-1'>
                        <Image src={trigger.image} alt='trigger.png' width={20} height={20}/>
                        <p>{trigger.name}</p>
                </div>
                </button>
            ))}
            </div>
        </div>
        
        <div>
            <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Actions</h3>
            <div className="space-y-2">
            {availableActions.map((action) => (
                <button
                key={action.id}
                className={`w-full flex items-center p-2 rounded-md text-sm hover:bg-gray-100 ${
                    !selectedTrigger ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => selectedTrigger && onAddAction(action.id)}
                disabled={!selectedTrigger}
                >
                <div className='flex items-center gap-x-1'>
                        <Image src={action.image} alt='trigger.png' width={20} height={20}/>
                        <p className='text-sm font-semibold'>{action.name}</p>
                </div>
                
                </button>
            ))}
            </div>
        </div>
        
        {!selectedTrigger && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm">
            Please select a trigger first to start building your workflow.
            </div>
        )}
        </div>
    );
    }