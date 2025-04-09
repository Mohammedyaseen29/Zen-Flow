import FlowPlayground from "@/components/FlowPlayground";
import { SidebarTrigger } from "@/components/ui/sidebar";


export default function page({params}:{params:{FlowId:string}}) {
    return (
        <div>
            <SidebarTrigger/>
            <FlowPlayground/>
        </div>
    )
}
