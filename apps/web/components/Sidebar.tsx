    import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ActionConfig from './ActionConfig';
import { metadata } from '@/app/layout';

    type SidebarProps = {
    availableTriggers: Array<{ id: string; name: string; image: string }>;
    availableActions: Array<{ id: string; name: string; image: string }>;
    onSelectTrigger: (id: string) => void;
    onAddAction: (id: string) => void;
    selectedNode: {id:string,type:'trigger' | 'action',data:any} | null;
    onUpdateActionMetadata:(NodeId:string,actionId:string,metadata:Record<string,any>) => void;
    selectedTrigger: { id: string; label: string; image: string } | null;
    actionMetaData:Record<string,Record<string,any>>
    };
    
    export default function Sidebar({
    availableTriggers,
    availableActions,
    onSelectTrigger,
    onAddAction,
    selectedNode,
    onUpdateActionMetadata,
    selectedTrigger,
    actionMetaData
    }: SidebarProps) {
        
    const [activeTab,setActiveTab] = useState<"components" | "configure">("components");

    return (
        <div className="w-64 bg-gray-50 border-l p-4 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Flow Builder</h2>
            <div className="flex border-b mb-4">
                <button
                className={`py-2 px-4 font-medium ${activeTab === 'components' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('components')}
                >
                Components
                </button>
                <button
                className={`py-2 px-4 font-medium ${activeTab === 'configure' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('configure')}
                disabled={!selectedNode}
                >
                Configure
                </button>
            </div>
            {activeTab === "components" && (
                <>
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
                </>
            )}
            {activeTab === "configure" && selectedNode &&(
                <>
                    {selectedNode.type === "trigger" ?(
                        <div className="p-4 bg-white rounded-lg shadow">
                            <h3 className="font-semibold text-lg mb-4">Configure Trigger</h3>
                            <p className="text-gray-600">Trigger configuration coming soon...</p>
                            {/* Trigger configuration would go here */}
                        </div>
                    ):selectedNode.type === "action" ? (
                        <ActionConfig
                        actionId={selectedNode.data.actionId}
                        onSaveConfig={(actionId,metadata)=>onUpdateActionMetadata(selectedNode.id,actionId,metadata)}
                        existingMetadata={actionMetaData[selectedNode.id]}
                        />
                    ):(
                        <div className="p-4 bg-white rounded-lg shadow">
                            <p className="text-gray-600">Select a node to configure.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}