import { db } from "@repo/db/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest,{params}:{params:{flowId:string}}) {
    try {
        const flowId = params.flowId
        const data = await db.flow.findUnique({
            where: {
                id: flowId
            },
            select:{
                trigger:true,
                action:true,
            }
        })
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error", { status: 500 })
    }
}

export async function PUT(request: NextRequest,{params}:{params:{flowId:string}}) {
    try {
        const flowId = params.flowId
        const {name,trigger,actions} = await request.json()
        if(!name || !trigger || !actions){
            return NextResponse.json("Missing fields", { status: 400 }) 
        }
        await db.$transaction(async(tx)=>{
            await tx.flow.update({
                where:{
                    id:flowId
                },
                data:{
                    name,
                }
            })
            await tx.trigger.update({
                where:{
                    flowId
                },
                data:{
                    id:trigger.id,
                    metadata:trigger.metadata,
                }
            })
            await tx.actions.deleteMany({
                where:{
                    flowId
                }
            })
            for(let action of actions){
                await tx.actions.create({
                    data:{
                        flowId,
                        actionId:action.id,
                        metaData:action.metaData,
                    } 
                })
            }
        })
        return NextResponse.json("Success", { status: 200 })
    }
    catch (error) {
        console.log(error)
        return NextResponse.json("Error", { status: 500 }) 
    } 

}