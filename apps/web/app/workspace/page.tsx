import FlowBox from "@/components/FlowBox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Design from "@/public/Design inspiration-bro.svg"
import FlowCreateButton from "@/components/ui/FlowCreateButton";
import axios from "axios";
import { getServerSession } from "next-auth";
import { nextAuth } from "@/lib/auth";
import { db } from "@repo/db/client";



export default async function page() {
    const session = await getServerSession(nextAuth);
    const userId = session?.user?.id;
    const flowBox = await db.flow.findMany({
        where:{
            userId:userId
        }
    })
    return (
        <div>
            <SidebarTrigger/>
            <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <div>
                    <h1 className="font-semibold text-2xl sm:text-3xl text-center sm:text-left">All Workspaces</h1>
                </div>
                <div>
                    <FlowCreateButton/>
                </div>
            </div>
            <div className="mt-3">
                <p className="text-gray-400 text-center sm:text-left">Created Flows</p>
            </div>
                <div className="grid mt-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto">
                        {flowBox && flowBox.length > 0 ? (
                            flowBox.map((flow:any)=>(
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
