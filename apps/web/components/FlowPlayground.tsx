"use client"
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    MiniMap,
    Background,
} from '@xyflow/react';
import  '@xyflow/react/dist/style.css';
import { useCallback } from 'react';

const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 },
        data: { label: 'Select Trigger' },
    },
    {
        id: '2',
        position: { x: 100, y: 0 },
        data: { label: 'Select Actions' },
    },
    {
        id: '3',
        position: { x: 200, y: 0 },
        data: { label: 'Select Actions' },
    }
]

const initialEdges = [
    {id: 'e1-2', source: '1', target: '2'},
    {id: 'e2-3',source: '2',target:'3'}
]

export default function FlowPlayground() {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback((params:any)=>{
        setEdges((eds)=>addEdge(params,eds));
    },[setEdges])

    return (
        <div className='h-screen w-full p-4'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
            <Controls/>
            <MiniMap/>
            <Background gap={12} size={1}/>
            </ReactFlow>
        </div>
    )
}
