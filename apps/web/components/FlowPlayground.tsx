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
    import {debounce, set} from 'lodash';


    interface Trigger{
        id:string,
        name:string,
        image:string
    }
    interface Action{
        id:string,
        name:string,
        image:string
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

    useOnSelectionChange({
        onChange:async ({node}:any)=>{
            if(node.length == 1){
                setSelectedNode(node[0]);
                if(selectedNode?.type === 'action'){
                    const actionId = selectedNode.data?.actionId;
                    if(actionId && !actionMetaData.actionId){
                        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/actions/${actionId}/metadata`,{params:{flowId}});
                        setActionMetaData((prev)=>({
                            ...prev,
                            [actionId as string]:res.data,
                        }))
                    }
                }
            }

            else{
                setSelectedNode(null);
            }
        }
    })
    
    const saveFlowToDatabase = async ()=>{
        try {
            setSaving(true);

            const triggerNode = nodes.find(node=>node.id === 'trigger-1');
            const triggerData = {
                triggerId: triggerNode?.data?.triggerId,
                metaData: {},
            }
            const actionData = nodes.filter(node=>node.id.startsWith('action-1'))
            .map((node)=>(
                {
                    actionId: node.data.actionId,
                    metaData: actionMetaData[node.data.actionId as string] || {},
                }
            ))
            const position = {};

            nodes.forEach(node=>{
                (position as Record<string, { x: number; y: number }>)[node.id] = node.position;
            })
            localStorage.setItem(`flow-position-${flowId}`,JSON.stringify(position));
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flows/${flowId}`,{
                name:flowName,
                trigger:triggerData,
                actions:actionData,
            })
            setHasChanges(false);


        } catch (error) {
            console.log(error);
        }
        finally{
            setSaving(false);
        }
    }
    

    const debouncedSaveFlow = useRef(
        debounce(async function(){
            console.log("Auto saving...");
            await saveFlowToDatabase();
        },3000)
    ).current;

    const fetchData = async ()=>{
        try {
            setLoading(true);
            const availableTriggersData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/availableTriggers`)
            const availableActionsData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/availableActions`);
            setAvailableTriggers(availableTriggersData.data);
            setAvailableActions(availableActionsData.data);
            setNodes([
                {
                    id:"trigger-1",
                    type: 'triggerNode',
                    position: { x: 250, y: 50 },
                    data:{
                        label: 'Select a trigger',
                        icon: 'play',
                        options: availableTriggersData.data,
                        onSelectTrigger,
                    }
                }
            ])
        } catch (error) {
            console.log(error);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchData();
        return ()=>{
            debouncedSaveFlow.flush();
        }
    },[]);

    const loadFlowFromDatabase = async ()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flows/${flowId}`);
            const flowData = response.data;
            setFlowName(flowData.name);
            let nodePositions = {};
            try {
                const savedPositions = localStorage.getItem(`flow-positions-${flowId}`);
                if (savedPositions) {
                    nodePositions = JSON.parse(savedPositions);
                }
            } catch (error) {
                console.error("Error loading positions from localStorage:", error);
            }
            const newNodes = [];
            if(flowData.trigger){
                const trigger = availableTriggers?.find(t=>t.id === flowData.trigger.triggerId)
                if(trigger){
                    setSelectedTrigger(trigger as any);
                    newNodes.push({
                        id: 'trigger-1',
                        type: 'triggerNode',
                        position: (nodePositions as Record<string, { x: number; y: number }>)['trigger-1'] || { x: 250, y: 50 },
                        data: {
                            label: trigger.name,
                            icon: trigger.image,
                            selected: true,
                            triggerId: trigger.id,
                            options: availableTriggers,
                            onSelectTrigger,
                        },
                    });
                }
            }else{
                newNodes.push({
                    id: 'trigger-1',
                    type: 'triggerNode',
                    position: (nodePositions as Record<string,{x:number,y:number}>)['trigger-1'] || { x: 250, y: 50 },
                    data: {
                        label: 'Select a trigger',
                        icon: 'play',
                        options: availableTriggers,
                        onSelectTrigger,
                    }
                });
            }
            const newEdges: Edge[] = [];
            let lastNodeId = 'trigger-1';
            
            if (flowData.actions && flowData.actions.length > 0) {
                // Sort actions by their ID or other criteria if needed
                // This assumes actions are returned in the correct order
                flowData.actions.forEach((action:any, index:number) => {
                    const actionData = availableActions?.find(a => a.id === action.actionId);
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
                                icon: actionData.image, 
                                actionId: actionData.id,
                                onDelete: () => deleteNode(nodeId),
                                options: availableActions,
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
                        if(action.metaData){
                            setActionMetaData((prev)=>({
                                ...prev,
                                [nodeId]:action.metaData,
                            }))
                        }
                    }
                });
            }
            setNodes(newNodes);
            setEdges(newEdges);
            setInitialLoadCompleted(true);
        } catch (error) {
            console.log(error);
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
        const trigger = availableTriggers.find(t => t.id === triggerId);
        if (trigger) {
        setSelectedTrigger(trigger as any);
        
        // Update trigger node with selected trigger
        setNodes((nds) =>
            nds.map((node) => {
            if (node.id === 'trigger-1') {
                return {
                ...node,
                data: {
                    label: trigger.name,
                    icon: trigger.image,
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

        const action = availableActions.find(a => a.id === actionId);
        if (!action) return;

        const newNodeId = `action-${nextNodeId.current}`;
        nextNodeId.current += 1;

        // Calculate position based on existing nodes
        const yOffset = 150 + (nodes.length - 1) * 150;

        // Add the node
        const newNode = {
        id: newNodeId,
        type: 'actionNode',
        position: { x: 250, y: yOffset },
        data: { 
            label: action.name, 
            icon: action.image, 
            actionId: action.id,
            onDelete: () => deleteNode(newNodeId),
            options: availableActions,
            onSelectAction: (id: string) => updateActionNode(newNodeId, id)
        },
        };

        setNodes((nds) => [...nds, newNode]);

        // Connect with previous node
        const sourceId = nodes.length === 1 ? 'trigger-1' : `action-${nextNodeId.current - 2}`;
        
        setEdges((eds) => [
        ...eds,
        {
            id: `e-${sourceId}-${newNodeId}`,
            source: sourceId,
            target: newNodeId,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
        },
        ]);
    }, [nodes, selectedTrigger]);

    // Update an action node
    const updateActionNode = useCallback((nodeId: string, actionId: string) => {
        if(!availableActions){
            return;
        }
        const action = availableActions.find(a => a.id === actionId);
        if (!action) return;

        setNodes((nds) =>
        nds.map((node) => {
            if (node.id === nodeId) {
            return {
                ...node,
                data: {
                ...node.data,
                label: action.name,
                icon: action.image,
                actionId: action.id,
                },
            };
            }
            return node;
        })
        );
    }, []);

    // Delete a node
    const deleteNode = useCallback((nodeId: string) => {
        // Prevent deleting trigger node
        if (nodeId === 'trigger-1') return;

        // Remove the node
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        
        // Remove associated edges
        setEdges((eds) => eds.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
        ));

        // Re-connect nodes if needed
        const remainingNodes = nodes.filter(node => node.id !== nodeId);
        if (remainingNodes.length > 1) {
        // Find index of deleted node
        const nodeIndex = nodes.findIndex(node => node.id === nodeId);
        console.log(nodeIndex)
        
        // If it's not the last node and first, reconnect the gap
        if (nodeIndex > 0 && nodeIndex < nodes.length - 1) {
            const prevNodeId = nodeIndex === 1 ? 'trigger-1' : nodes[nodeIndex - 1].id;
            const nextNodeId = nodes[nodeIndex + 1].id;
            
            setEdges(eds => [
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
            ]);
        }
        }
    }, [nodes]);

    // Handle node changes
    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
        // Filter out remove changes for trigger node
        const filteredChanges = changes.filter(
            change => !(change.type === 'remove' && change.id === 'trigger-1')
        );
        setNodes((nds) => applyNodeChanges(filteredChanges, nds));
        },
        []
    );

    // Handle edge changes
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
        },
        []
    );

    // Handle connecting nodes
    const onConnect = useCallback(
        (connection: Connection) => {
        setEdges((eds) => addEdge({
            ...connection,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
        }, eds));
        },
        []
    );
    const onUpdateActionMetadata = useCallback((nodeId:string,actionId:string,metaData:Record<string,any>)=>{
        setActionMetaData(prev=>({
            ...prev,
            [actionId]:metaData,
        }))
        setHasChanges(true);
        debouncedSaveFlow();
    },[])
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