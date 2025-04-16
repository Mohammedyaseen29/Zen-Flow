import WorkflowBuilder from "@/components/WorkflowBuilder";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function page({params}:{params:{FlowId:string}}) {
    const flowId = params.FlowId;
    console.log(flowId);

    return (
        <div>
            <SidebarTrigger/>
            <WorkflowBuilder flowId={flowId}/>
        </div>
    )
}
