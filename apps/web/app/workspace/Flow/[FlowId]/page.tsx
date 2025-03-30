import FlowPlayground from "@/components/FlowPlayground";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function page({params}:{params:{FlowId:string}}) {
    const flowId = params.FlowId;
    return (
        <div>
            <SidebarTrigger/>
            <FlowPlayground/>
        </div>
    )
}
