"use client"
    import { MoveHorizontal, Plus, Loader2 } from 'lucide-react';
    import Image from 'next/image';
    import { useEffect, useState } from 'react';
    import logo from "../public/logo.svg"
    import axios from 'axios';
import ActionConfig from './ActionConfig';
import TriggerConfig from './TriggerConfig';

    type SidebarProps = {
    availableTriggers: Array<{ 
        id: string; 
        name: string; 
        image: string;
        triggers: {
        id: string,
        name: string,
        integrationId: string,
        fields: any[]
        }[]
    }>;
    availableActions: Array<{ 
        id: string; 
        name: string; 
        image: string;
        actions: {
        id: string,
        name: string,
        integrationId: string,
        fields: any[]
        }[]
    }>;
    onSelectTrigger: (id: string) => void;
    onAddAction: (id: string) => void;
    selectedNode: { id: string, type: string, data: any } | null;
    onUpdateActionMetadata: (NodeId: string, actionId: string, metadata: Record<string, any>) => void;
    onUpdateTriggerMetadata: (NodeId: string, triggerId: string, metadata: Record<string, any>) => void;
    selectedTrigger: { id: string; label: string; image: string } | null;
    actionMetaData: Record<string, Record<string, any>>;
    triggerMetaData: Record<string, Record<string, any>>;
    };

    export default function Sidebar({
    availableTriggers,
    availableActions,
    onSelectTrigger,
    onAddAction,
    selectedNode,
    onUpdateActionMetadata,
    onUpdateTriggerMetadata,
    selectedTrigger,
    actionMetaData,
    triggerMetaData
    }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<"components" | "configure">("components");
    const [loading, setLoading] = useState(false);
    const [connectingIntegration, setConnectingIntegration] = useState<string | null>(null);
    const [connectedIntegrationIds, setConnectedIntegrationIds] = useState<string[]>([]);
    const [expiredIntegrationIds, setExpiredIntegrationIds] = useState<string[]>([]);
    
    // Switch to configure tab when a node is selected
    useEffect(() => {
        if (selectedNode) {
        setActiveTab("configure");
        }
    }, [selectedNode]);

    // Check which integrations are connected on component mount
    useEffect(() => {
        const checkConnectedIntegrations = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integrations/connected`);
            
            if (res.data.connectedIntegrationIds) {
            setConnectedIntegrationIds(res.data.connectedIntegrationIds);
            }

            // Check for expired tokens
            if (res.data.expiredIntegrationIds) {
                setExpiredIntegrationIds(res.data.expiredIntegrationIds);
                console.log("Expired integration IDs:", res.data.expiredIntegrationIds);
            }
            
            // For debugging
            console.log("Connected integration IDs:", res.data.connectedIntegrationIds);
            console.log("Connected providers:", res.data.connectedProviders);
            console.log("Integration map:", res.data.integrationMap);
        } catch (error) {
            console.error("Failed to fetch connected integrations:", error);
        }
        };
        
        checkConnectedIntegrations();
    }, []);

    const handleConnect = async(integrationId: string) => {
        try {
        setLoading(true);
        setConnectingIntegration(integrationId);
        const currentUrl = window.location.href;
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integrations/${integrationId}?state=${encodeURIComponent(currentUrl)}`)
        const authUrl = res.data;
        console.log(authUrl);
        window.location.href = authUrl;
        } catch (error) {
        console.log(error);
        setConnectingIntegration(null);
        } finally {
        setLoading(false);
        }
    };

    const isIntegrationConnected = (integrationId: string) => {
        return connectedIntegrationIds.includes(integrationId);
    };

    const getIntegrationStatus = (integrationId: string) => {
        const isConnected = connectedIntegrationIds.includes(integrationId);
        const needsReconnect = expiredIntegrationIds.includes(integrationId);
        
        return {
            isConnected,
            needsReconnect
        };
    };

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
                {availableTriggers.map((integration) => (
                    <button
                    key={integration.id}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-sm ${
                        selectedTrigger?.id === integration.triggers[0]?.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => onSelectTrigger(integration.triggers[0]?.id)}
                    >
                    <div className='flex items-center gap-x-1'>
                        <Image src={integration.image} alt='trigger.png' width={20} height={20} />
                        <p>{integration.name}</p>
                    </div>
                    {isIntegrationConnected(integration.id) && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getIntegrationStatus(integration.id).needsReconnect ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {getIntegrationStatus(integration.id).needsReconnect ? 'Reconnect' : 'Connected'}
                        </span>
                    )}
                    </button>
                ))}
                </div>
            </div>
            
            <div>
                <h3 className="font-medium text-sm text-gray-500 uppercase mb-2">Actions</h3>
                <div className="space-y-2">
                {availableActions.map((integration) => (
                    <button
                    key={integration.id}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-sm hover:bg-gray-100 ${
                        !selectedTrigger ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => selectedTrigger && onAddAction(integration.actions[0]?.id)}
                    disabled={!selectedTrigger}
                    >
                    <div className='flex items-center gap-x-1'>
                        <Image src={integration.image} alt='trigger.png' width={20} height={20} />
                        <p className='text-sm font-semibold'>{integration.name}</p>
                    </div>
                    {isIntegrationConnected(integration.id) && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getIntegrationStatus(integration.id).needsReconnect ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {getIntegrationStatus(integration.id).needsReconnect ? 'Reconnect' : 'Connected'}
                        </span>
                    )}
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
        
        {activeTab === "configure" && selectedNode && (
            <div className="p-4">
            {selectedNode ? (
                <>  
                {(selectedNode.type === "trigger") ? (
                    (() => {
                    const triggerId = selectedNode.data.triggerId;
                    const integration = availableTriggers.find(integration => 
                        integration.triggers.some(trigger => trigger.id === triggerId)
                    );
                    
                    if(!integration) {
                        return null;
                    }
                    
                    const connected = isIntegrationConnected(integration.id);
                    const isConnecting = connectingIntegration === integration.id && loading;
                    
                    return(
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className='flex justify-center space-x-3 items-center'>
                            <Image src={integration.image} alt='trigger.png' width={30} height={30} />
                            <MoveHorizontal className='w-8 h-8'/>
                            <Image src={logo} alt='logo.svg' className='w-8 h-8'/>
                        </div>
                        <p className='text-xs my-2 text-center'>
                            {connected 
                            ? 'Account connected with ZenFlow' 
                            : 'Connect account with ZenFlow'}
                        </p>
                        <div className='flex justify-center'>
                            {connected ? (
                                getIntegrationStatus(integration.id).needsReconnect ? (
                                    <button 
                                        onClick={() => handleConnect(integration.id)}
                                        className='bg-yellow-500 px-4 py-2 rounded-lg font-bold hover:scale-95 text-white'
                                    >
                                        Token Expired - Reconnect
                                    </button>
                                ) : (
                                    <TriggerConfig triggerId={triggerId} existingMetadata={triggerMetaData[selectedNode.id] || {}} onSaveConfig={(triggerId, metadata)=>onUpdateTriggerMetadata(selectedNode.id, triggerId, metadata)}/>
                                )
                            ) : (
                            <button 
                                onClick={() => handleConnect(integration.id)} 
                                className='bg-blue-500 px-4 py-2 rounded-lg font-bold hover:scale-95 text-white flex items-center' 
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                                ) : (
                                'Connect'
                                )}
                            </button>
                            )}
                        </div>  
                        </div>
                    )
                    })()
                ) : (selectedNode.type === "action") ? (
                    (() => {
                    const actionId = selectedNode.data.actionId;
                    const integration = availableActions.find(integration => 
                        integration.actions.some(action => action.id === actionId)
                    );
                    
                    if(!integration) {
                        return null;
                    }
                    
                    const connected = isIntegrationConnected(integration.id);
                    const isConnecting = connectingIntegration === integration.id && loading;
                    
                    return(
                        <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <div className='flex justify-center space-x-3 items-center'>
                            <Image src={integration.image} alt='trigger.png' width={30} height={30} />
                            <MoveHorizontal className='w-8 h-8'/>
                            <Image src={logo} alt='logo.svg' className='w-8 h-8'/>
                        </div>
                        <p className='text-xs my-2 text-center'>
                            {connected 
                            ? 'Account connected with ZenFlow' 
                            : 'Connect account with ZenFlow'}
                        </p>
                        <div className='flex justify-center'>
                            {connected ? (
                                getIntegrationStatus(integration.id).needsReconnect ? (
                                    <button 
                                        onClick={() => handleConnect(integration.id)}
                                        className='bg-yellow-500 px-4 py-2 rounded-lg font-bold hover:scale-95 text-white'
                                    >
                                        Token Expired - Reconnect
                                    </button>
                                ) : (
                                    <ActionConfig actionId={actionId} existingMetadata={actionMetaData[selectedNode.id] || {}} onSaveConfig={(actionId, metadata)=>onUpdateActionMetadata(selectedNode.id,actionId,metadata)}/>
                                )
                            ) : (
                            <button 
                                onClick={() => handleConnect(integration.id)} 
                                className='bg-green-500 px-4 py-2 rounded-lg font-bold hover:scale-95 text-white flex items-center' 
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                                ) : (
                                'Connect'
                                )}
                            </button>
                            )}
                        </div>
                        </div>
                    )
                    })()
                ) : (
                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                    Unknown node type: {selectedNode.type}
                    </div>
                )}
                </>
            ) : (
                <div className="p-4 bg-white rounded-lg shadow">
                <p className="text-gray-600">Select a node to configure.</p>
                </div>
            )}
            </div>
        )}
        </div>
    );
    }