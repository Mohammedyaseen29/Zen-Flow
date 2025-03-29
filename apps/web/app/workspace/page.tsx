import FlowBox from "@/components/FlowBox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Design from "@/public/Design inspiration-bro.svg"
import FlowCreateButton from "@/components/ui/FlowCreateButton";



export default function page() {
    const flowBox = [
        {
            id:"1",
            name:"Content creation"
        },
        {
            id:"2",
            name:"Code submission"
        },
        {
            id:"3",
            name:"Mark uploads"
        }
    ]
    return (
        <div>
            <SidebarTrigger/>
            <div className="p-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-semibold text-3xl">All Workspaces</h1>
                </div>
                <div>
                    <FlowCreateButton/>
                </div>
            </div>
            <div className="mt-3">
                <p className="text-gray-400">Created Flows</p>
            </div>
                <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
                        {flowBox && flowBox.length > 0 ? (
                            flowBox.map((flow)=>(
                            <FlowBox key={flow.id} id={flow.id}  name={flow.name}/>
                        ))
                        ) :(
                            <div className="flex justify-center items-center">
                                <div>
                                    <Image src={Design} alt="empty"/>
                                    <p className="text-gray-400 ml-2 text-center">No Flows created yet</p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}
