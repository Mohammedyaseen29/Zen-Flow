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
    MarkerType
    } from '@xyflow/react';
    import '@xyflow/react/dist/style.css';
    import TriggerNode from '@/components/node/TriggerNode';
    import ActionNode from '@/components/node/ActionNode';
    import Sidebar from '@/components/Sidebar';
    import axios from 'axios';
    import logo from "@/public/logo.svg"
    import Image from 'next/image';

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

    // Define node types for React Flow
    const nodeTypes = {
    triggerNode: TriggerNode,
    actionNode: ActionNode,
    };

    export default function FlowBuilder() {
    // State for nodes and edges
    const [availableTriggers, setAvailableTriggers] = useState<Trigger[]>();
    const [availableActions, setAvailableActions] = useState<Action[]>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedTrigger, setSelectedTrigger] = useState();
    const [loading,setLoading] = useState(false);
    const nextNodeId = useRef(1);

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
    },[]);

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
                    ...node.data,
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
            selectedTrigger={selectedTrigger || null}
        />
        </div>
    );
    }