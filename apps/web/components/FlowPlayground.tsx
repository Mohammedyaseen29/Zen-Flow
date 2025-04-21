    "use client";
        
    import { useState, useCallback, useRef, useEffect } from 'react';
    import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    applyEdgeChanges,
    applyNodeChanges,
    NodeChange,
    EdgeChange,
    Connection,
    addEdge,
    MarkerType,
    useOnSelectionChange,
    } from '@xyflow/react';
    import '@xyflow/react/dist/style.css';
    import TriggerNode from '@/components/node/TriggerNode';
    import ActionNode from '@/components/node/ActionNode';
    import Sidebar from '@/components/Sidebar';
    import axios from 'axios';
    import logo from "@/public/logo.svg"
    import Image from 'next/image';
    import {debounce} from 'lodash';


    interface Trigger{
        id:string,
        name:string,
        image:string,
        triggers:{
            id:string,
            name:string,
            integrationId:string,
            fields:any[]
        }[]
    }
    interface Action{
        id:string,
        name:string,
        image:string,
        actions:{
            id:string,
            name:string,
            integrationId:string,
            fields:any[]
        }[]
    }
    interface selectedNode{
        id: string;
        type: "action" | "trigger";
        data: any; 
    }

    // Define node types for React Flow
    const nodeTypes = {
    triggerNode: TriggerNode,
    actionNode: ActionNode,
    };

    export default function FlowBuilder({flowId}:{flowId:string}) {
    // State for nodes and edges
    const [availableTriggers, setAvailableTriggers] = useState<Trigger[]>();
    const [availableActions, setAvailableActions] = useState<Action[]>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedTrigger, setSelectedTrigger] = useState();
    const [actionMetaData,setActionMetaData] = useState<Record<string,Record<string,any>>>({});
    const [flowName,setFlowName] = useState<string>("Untittled Flow");
    const [selectedNode,setSelectedNode] = useState<selectedNode|null>(null);
    const [saving,setSaving] = useState(false); 
    const [hasChanges,setHasChanges] = useState<boolean>(false);
    const [loading,setLoading] = useState(false);
    const [initialLoadCompleted,setInitialLoadCompleted] = useState<boolean>(false);
    const nextNodeId = useRef(1);
    // Keep a ref to the current state for access in callbacks
    const nodesRef = useRef<Node[]>([]);
    const edgesRef = useRef<Edge[]>([]);
    const actionMetaDataRef = useRef<Record<string,Record<string,any>>>({});
    
    // Update refs when state changes
    useEffect(() => {
        nodesRef.current = nodes;
        edgesRef.current = edges;
        actionMetaDataRef.current = actionMetaData;
    }, [nodes, edges, actionMetaData]);

    useOnSelectionChange({
        onChange:async ({nodes}:any)=>{
            if(nodes.length == 1){
                const currentNode = nodes[0];
                setSelectedNode(currentNode);
                
                if(currentNode.type === 'action'){
                    const actionId = currentNode.data?.actionId;
                    const nodeId = currentNode.id;
                    if(actionId && !actionMetaData[nodeId]){
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/actions/${actionId}/metadata`,{params:{flowId}});
                        setActionMetaData((prev)=>({
                            ...prev,
                            [nodeId]:res.data,
                        }))
                        setHasChanges(true);
                    }
                }
            }
            else{
                setSelectedNode(null);
            }
        }
    })
    
    const saveFlowToDatabase = useCallback(async () => {
        try {
            setSaving(true);
            // Use current values from refs instead of closures
            const currentNodes = nodesRef.current;
            const currentMetaData = actionMetaDataRef.current;
            const triggerNode = currentNodes.find(node => node.id === 'trigger-1');
            // Check if trigger is selected before proceeding
            if (!triggerNode?.data?.triggerId) {
                console.log("No trigger selected, skipping save");
                setSaving(false);
                return;
            }
            
            const triggerData = {
                triggerId: triggerNode.data.triggerId,
                metadata: {},
            }
            
            // Include all action nodes (both by type and ID pattern)
            const actionData = currentNodes
                .filter(node => node.type === 'actionNode' || node.id.startsWith('action-'))
                .map((node) => {
                    // Ensure node.id exists in metadata, even if empty
                    return {
                        actionId: node.data.actionId,
                        metaData: currentMetaData[node.id] || {},
                        nodeId: node.id, // Include node ID for debugging
                    };
                });
            
            // Debug logs
            console.log("All nodes for save:", currentNodes);
            console.log("Action data for save:", actionData);
            
            // Save positions to localStorage
            const position = {};
            currentNodes.forEach(node => {
                (position as Record<string, { x: number; y: number }>)[node.id] = node.position;
            });
            localStorage.setItem(`flow-positions-${flowId}`, JSON.stringify(position));
            
            // Prepare request data
            const requestData = {
                name: flowName || "Untitled Flow",
                trigger: triggerData,
                actions: actionData,
            };
            
            console.log("Sending save request with data:", requestData);
            
            // Make API call with current state
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flow/${flowId}`, 
                requestData
            );
            
            if (response.status >= 200 && response.status < 300) {
                console.log("Flow saved successfully", response.data);
                setHasChanges(false);
            } else {
                console.error("Error saving flow: Unexpected response", response);
            }
        } catch (error) {
            console.error("Error saving flow:", error);
        } finally {
            setSaving(false);
        }
    }, [flowId, flowName]);

    const debouncedSaveFlow = useRef(
        debounce(async function(){
            console.log("Auto saving...");
            try {
                await saveFlowToDatabase();
            } catch (error) {
                console.error("Auto-save failed, will retry on next change", error);
                setHasChanges(true);
            }
        }, 1000) // Reduced debounce time for faster saving
    ).current;

    const fetchData = async ()=>{
        try {
            setLoading(true);
            const availableTriggersData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/availableTriggers`)
            const availableActionsData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/availableActions`);
            setAvailableTriggers(availableTriggersData.data);
            setAvailableActions(availableActionsData.data);
            return {
                triggers: availableTriggersData.data,
                actions: availableActionsData.data
            };
        } catch (error) {
            console.log(error);
            setLoading(false);
            return { triggers: [], actions: [] };
        }
    };

    useEffect(()=>{
        const loadFlow = async () => {
            try {
                const { triggers, actions } = await fetchData();
                await loadFlowFromDatabase(triggers, actions);
            } catch (error) {
                console.error("Error loading flow:", error);
                setLoading(false);
            }
        };
        
        loadFlow();
        
        return ()=>{
            debouncedSaveFlow.flush();
        }
    },[flowId]); // Add flowId as dependency to reload when it changes
    
    useEffect(() => {
        if (hasChanges && initialLoadCompleted) {
            debouncedSaveFlow();
        }
    }, [hasChanges, debouncedSaveFlow, initialLoadCompleted]);

    const loadFlowFromDatabase = async (triggers: Trigger[] = [], actions: Action[] = [])=>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flow/${flowId}`);
            const flowData = response.data;
            setFlowName(flowData.name || "Untitled Flow"); // Ensure name is never empty
            
            // Load node positions from localStorage
            let nodePositions = {};
            try {
                const savedPositions = localStorage.getItem(`flow-positions-${flowId}`);
                if (savedPositions) {
                    nodePositions = JSON.parse(savedPositions);
                }
            } catch (error) {
                console.error("Error loading positions from localStorage:", error);
            }
            
            
            const newNodes: Node[] = [];
            const newEdges: Edge[] = [];
            const newActionMetadata: Record<string, Record<string, any>> = {};
            
            
            if(flowData.trigger && flowData.trigger.triggerId){
                // Find the trigger in available triggers
                const trigger = triggers.flatMap((integration)=>integration.triggers).find(t=>t.id === flowData.trigger.triggerId);
                if(trigger){
                    // Set selected trigger and create trigger node
                    setSelectedTrigger(trigger as any);
                    newNodes.push({
                        id: 'trigger-1',
                        type: 'triggerNode',
                        position: (nodePositions as Record<string, { x: number; y: number }>)['trigger-1'] || { x: 250, y: 50 },
                        data: {
                            label: trigger.name,
                            selected: true,
                            triggerId: trigger.id,
                            options: triggers,
                            onSelectTrigger,
                        },
                    });
                } else {
                    // Fallback if trigger not found but should exist
                    newNodes.push({
                        id: 'trigger-1',
                        type: 'triggerNode',
                        position: (nodePositions as Record<string, { x: number; y: number }>)['trigger-1'] || { x: 250, y: 50 },
                        data: {
                            label: 'Select a trigger',
                            icon: 'play',
                            options: triggers,
                            onSelectTrigger,
                        }
                    });
                }
            } else {
                // No trigger in flow data
                newNodes.push({
                    id: 'trigger-1',
                    type: 'triggerNode',
                    position: (nodePositions as Record<string, { x: number; y: number }>)['trigger-1'] || { x: 250, y: 50 },
                    data: {
                        label: 'Select a trigger',
                        icon: 'play',
                        options: triggers,
                        onSelectTrigger,
                    }
                });
            }
            
            let lastNodeId = 'trigger-1';
            
            // Process actions if they exist
            if (flowData.action && flowData.action.length > 0) {
                flowData.action.forEach((action:any, index:number) => {
                    const actionData = actions.flatMap((integration)=>integration.actions).find(a=>a.id === action.actionId);
                    if (actionData) {
                        const nodeId = `action-${index + 1}`;
                        
                        // Update nextNodeId ref to ensure new nodes get correct IDs
                        if (index + 1 >= nextNodeId.current) {
                            nextNodeId.current = index + 2;
                        }
                        
                        // Create action node
                        newNodes.push({
                            id: nodeId,
                            type: 'actionNode',
                            position: (nodePositions as Record<string,{x:number,y:number}>)[nodeId] || { x: 250, y: 150 + index * 150 },
                            data: { 
                                label: actionData.name, 
                                actionId: actionData.id,
                                onDelete: () => deleteNode(nodeId),
                                options: actions,
                                onSelectAction: (id: string) => updateActionNode(nodeId, id)
                            },
                        });
                        
                        // Create edge connecting to previous node
                        newEdges.push({
                            id: `e-${lastNodeId}-${nodeId}`,
                            source: lastNodeId,
                            target: nodeId,
                            type: 'smoothstep',
                            markerEnd: { type: MarkerType.ArrowClosed },
                            style: { strokeWidth: 2 }
                        });
                        
                        lastNodeId = nodeId;
                        
                        // Store action metadata
                        if(action.metaData){
                            newActionMetadata[nodeId] = action.metaData;
                        }
                    }
                });
            }
            
            // Update state with all the loaded data
            setNodes(newNodes);
            setEdges(newEdges);
            setActionMetaData(newActionMetadata);
            
            // Mark loading as complete
            setInitialLoadCompleted(true);
        } catch (error) {
            console.log(error);
            // If there's an error, at least set up a default trigger node
            setNodes([{
                id: 'trigger-1',
                type: 'triggerNode',
                position: { x: 250, y: 50 },
                data: {
                    label: 'Select a trigger',
                    icon: 'play',
                    options: availableTriggers || [],
                    onSelectTrigger,
                }
            }]);
            setInitialLoadCompleted(true);
        }
        finally{
            setLoading(false);
        }
    }

    // Handle trigger selection
    function onSelectTrigger(triggerId: string) {
        if(!availableTriggers){
            return;
        }
        const trigger = availableTriggers.flatMap((integration)=>integration.triggers).find((t)=>t.id === triggerId);
        if (trigger) {
            console.log("Trigger selected:", trigger.id, trigger.name);
            setSelectedTrigger(trigger as any);
            
            // Update trigger node with selected trigger
            setNodes((nds) =>
                nds.map((node) => {
                if (node.id === 'trigger-1') {
                    return {
                    ...node,
                    data: {
                        label: trigger.name,
                        selected: true,
                        triggerId: trigger.id,
                        options: availableTriggers,
                        onSelectTrigger,
                    },
                    };
                }
                return node;
                })
            );
            
            // Mark that we have changes to save
            setHasChanges(true);
            
            
            if (initialLoadCompleted) {
                console.log("Triggering immediate save after trigger selection");
                setTimeout(() => saveFlowToDatabase(), 0);
            }
        }
    }

    // Add a new action node
    const addActionNode = useCallback((actionId: string) => {
        if (!selectedTrigger) {
        alert('Please select a trigger first');
        return;
        }
        if(!availableActions){
            return;
        }

        const action = availableActions.flatMap((integration)=>integration.actions).find((a)=>a.id === actionId);
        if (!action) return;

        const newNodeId = `action-${nextNodeId.current}`;
        nextNodeId.current += 1;

        // Calculate position based on existing nodes
        const yOffset = 50 + (nodes.length - 1) * 50;

        // Add the node
        const newNode = {
        id: newNodeId,
        type: 'actionNode',
        position: { x: 250, y: yOffset },
        data: { 
            label: action.name,
            actionId: action.id,
            onDelete: () => deleteNode(newNodeId),
            options: availableActions,
            onSelectAction: (id: string) => updateActionNode(newNodeId, id)
        },
        };

        // Use functional update to ensure latest state
        setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        // Update ref immediately 
        nodesRef.current = updatedNodes;
        return updatedNodes;
        });

        // Connect with previous node
        const sourceId = nodes.length === 1 ? 'trigger-1' : `action-${nextNodeId.current - 2}`;
        
        setEdges((eds) => {
        const updatedEdges = [
            ...eds,
            {
            id: `e-${sourceId}-${newNodeId}`,
            source: sourceId,
            target: newNodeId,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
            }
        ];
        // Update ref immediately
        edgesRef.current = updatedEdges;
        return updatedEdges;
        });
        
        setHasChanges(true);
        
        if (initialLoadCompleted) {
        setTimeout(() => saveFlowToDatabase(), 0);
        }
    }, [nodes, selectedTrigger, initialLoadCompleted, saveFlowToDatabase, availableActions]);

    // Update an action node
    const updateActionNode = useCallback((nodeId: string, actionId: string) => {
        if(!availableActions){
            return;
        }
        const action = availableActions.flatMap((integration)=>integration.actions).find((a)=>a.id === actionId);
        if (!action) return;

        setNodes((nds) => {
        const updatedNodes = nds.map((node) => {
            if (node.id === nodeId) {
            return {
                ...node,
                data: {
                ...node.data,
                label: action.name,
                actionId: action.id,
                },
            };
            }
            return node;
        });
        
        // Update ref immediately
        nodesRef.current = updatedNodes;
        return updatedNodes;
        });
        
        // Mark that we have changes to save
        setHasChanges(true);
        
        if (initialLoadCompleted) {
        // Force immediate save instead of waiting for debounce
        setTimeout(() => saveFlowToDatabase(), 0);
        }
    }, [initialLoadCompleted, saveFlowToDatabase, availableActions]);

    // Delete a node
    const deleteNode = useCallback((nodeId: string) => {
        // Prevent deleting trigger node
        if (nodeId === 'trigger-1') return;

        // Remove the node
        setNodes((nds) => {
        const updatedNodes = nds.filter((node) => node.id !== nodeId);
        // Update ref immediately
        nodesRef.current = updatedNodes;
        return updatedNodes;
        });
        
        // Remove associated edges
        setEdges((eds) => {
        const updatedEdges = eds.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
        );
        // Update ref immediately
        edgesRef.current = updatedEdges;
        return updatedEdges;
        });
        
        // Also remove any metadata for this node
        setActionMetaData((prev) => {
        const updated = {...prev};
        delete updated[nodeId];
        // Update ref immediately
        actionMetaDataRef.current = updated;
        return updated;
        });
        
        // Mark that we have changes to save
        setHasChanges(true);
        
        if (initialLoadCompleted) {
        // Re-connect nodes if needed before saving
        setTimeout(() => {
            const remainingNodes = nodesRef.current;
            
            if (remainingNodes.length > 1) {
            // Find index of deleted node in the previous nodes array
            const nodeIndex = nodes.findIndex(node => node.id === nodeId);
            
            // If it's not the last node and not the first, reconnect the gap
            if (nodeIndex > 0 && nodeIndex < nodes.length - 1) {
                const prevNodeId = nodeIndex === 1 ? 'trigger-1' : nodes[nodeIndex - 1].id;
                const nextNodeId = nodes[nodeIndex + 1].id;
                
                setEdges(eds => {
                const updatedEdges = [
                    ...eds.filter(edge => 
                    edge.source !== prevNodeId || edge.target !== nodeId
                    ),
                    {
                    id: `e-${prevNodeId}-${nextNodeId}`,
                    source: prevNodeId,
                    target: nextNodeId,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { strokeWidth: 2 }
                    }
                ];
                // Update ref immediately
                edgesRef.current = updatedEdges;
                return updatedEdges;
                });
            }
            }
            
            // Now save after reconnecting
            saveFlowToDatabase();
        }, 0);
        }
    }, [nodes, initialLoadCompleted, saveFlowToDatabase]);

    // Handle node changes
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
        // Filter out remove changes for trigger node
        const filteredChanges = changes.filter(
            change => !(change.type === 'remove' && change.id === 'trigger-1')
        );
        
        setNodes((nds) => {
            const updatedNodes = applyNodeChanges(filteredChanges, nds);
            // Update ref immediately
            nodesRef.current = updatedNodes;
            return updatedNodes;
        });
        
        if (initialLoadCompleted) {
            setHasChanges(true);
        }
        },
        [initialLoadCompleted]
    );

    // Handle edge changes
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
        setEdges((eds) => {
            const updatedEdges = applyEdgeChanges(changes, eds);
            // Update ref immediately
            edgesRef.current = updatedEdges;
            return updatedEdges;
        });
        
        if (initialLoadCompleted) {
            setHasChanges(true);
        }
        },
        [initialLoadCompleted]
    );

    // Handle connecting nodes
    const onConnect = useCallback(
        (connection: Connection) => {
        setEdges((eds) => {
            const updatedEdges = addEdge({
            ...connection,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
            }, eds);
            // Update ref immediately
            edgesRef.current = updatedEdges;
            return updatedEdges;
        });
        
        if (initialLoadCompleted) {
            setHasChanges(true);
        }
        },
        [initialLoadCompleted]
    );

    const onUpdateActionMetadata = useCallback((nodeId:string, actionId:string, metaData:Record<string,any>) => {
        setActionMetaData(prev => {
        const updated = {
            ...prev,
            [nodeId]: metaData,
        };
        // Update ref immediately
        actionMetaDataRef.current = updated;
        return updated;
        });
        
        // Mark that we have changes to save
        setHasChanges(true);
        
        // Force immediate save instead of waiting for debounce when metadata changes
        if (initialLoadCompleted) {
        setTimeout(() => saveFlowToDatabase(), 0);
        }
    }, [initialLoadCompleted, saveFlowToDatabase]);
    if(loading){
        return(
        <div className='flex justify-center items-center h-screen'>
            <Image src={logo} alt='logo.svg' className='w-10 h-10 animate-bounce'/>
        </div>
        )
    }

    return (
        <div className="flex h-screen">
        <div className="flex-grow h-full">
            {saving && (
            <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                Saving...
            </div>
            )}
            <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            >
            <Background gap={12} size={1} />
            <Controls />
            </ReactFlow>
        </div>
        <Sidebar 
            availableTriggers={availableTriggers || []}
            availableActions={availableActions || []}
            onSelectTrigger={onSelectTrigger}
            onAddAction={addActionNode}
            selectedNode={selectedNode || null}
            onUpdateActionMetadata={onUpdateActionMetadata}
            selectedTrigger={selectedTrigger || null}
            actionMetaData={actionMetaData}
        />
        </div>
    );
    }