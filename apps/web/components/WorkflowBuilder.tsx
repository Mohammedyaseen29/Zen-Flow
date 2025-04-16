"use client"
import FlowPlayground from "@/components/FlowPlayground";
import { ReactFlowProvider } from "@xyflow/react";

export default function WorkflowBuilder({flowId}:{flowId:string}) {
    return (
        <ReactFlowProvider>
            <FlowPlayground flowId={flowId}/>
        </ReactFlowProvider>
    )
}
