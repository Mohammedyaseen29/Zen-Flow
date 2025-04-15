import { db } from "@repo/db/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest,{params}:{params:{actionId:string}}) {
    try {
        const actionId = params.actionId
        const {searchParams} = new URL(request.url);
        const flowId = searchParams.get("flowId")
        if(!actionId){
            return NextResponse.json("Missing actionId", { status: 400 })
        }
        if(!flowId){
            return NextResponse.json("Missing FlowId", { status: 400 })
        }
        const actionMetadata = await db.actions.findUnique({
            where:{
                id:actionId,
                flowId,
            },
            select:{
                metaData:true
            }
        })
        return NextResponse.json(actionMetadata, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
    


}