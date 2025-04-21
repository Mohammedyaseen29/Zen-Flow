import { db } from "@repo/db/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest,{params}:{params:{flowId:string}}) {
    try {
        const flowId = params.flowId
        const data = await db.flow.findUnique({
            where: {
                id: flowId
            },
            include:{
                trigger: true,
                action: true,
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
        console.log(flowId);
        const body = await request.json()
        const name = body.name
        const trigger = body.trigger || {}
        const actions = body.actions || []
        
        if(!flowId){
            return NextResponse.json("Missing flowId", { status: 400 })
        }
        if(!name){
            return NextResponse.json("Missing name field", { status: 400 }) 
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
            // Check if trigger exists, if not create it, otherwise update it
            const existingTrigger = await tx.trigger.findUnique({
                where: {
                    flowId
                }
            })
            
            if (existingTrigger) {
                await tx.trigger.update({
                    where: {
                        flowId
                    },
                    data: {
                        // Remove the id field from update as it's a unique identifier and shouldn't be changed
                        // This prevents the unique constraint violation
                        metadata: trigger.metaData || trigger.metadata || {}
                    }
                })
            } else {
                // Verify that the triggerId exists in the AvailableTriggers table
                if (!trigger.triggerId) {
                    throw new Error("Missing triggerId. A valid triggerId is required to create a trigger.")
                }
                
                // Check if the triggerId exists in AvailableTriggers
                const availableTrigger = await tx.availableTriggers.findUnique({
                    where: {
                        id: trigger.triggerId
                    }
                })
                
                if (!availableTrigger) {
                    throw new Error(`Invalid triggerId: ${trigger.triggerId}. The triggerId must reference a valid entry in the AvailableTriggers table.`)
                }
                
                await tx.trigger.create({
                    data: {
                        id: trigger.id || undefined,
                        flowId,
                        triggerId: trigger.triggerId,
                        metadata: trigger.metaData || trigger.metadata || {},
                    }
                })
            }
            await tx.actions.deleteMany({
                where:{
                    flowId
                }
            })
            for(let action of actions){
                // Verify that the actionId exists - check both action.id and action.actionId
                const actionId = action.actionId || action.id;
                if (!actionId) {
                    throw new Error("Missing actionId. A valid actionId is required to create an action.")
                }
                
                // Check if the actionId exists in AvailableActions
                const availableAction = await tx.availableActions.findUnique({
                    where: {
                        id: actionId
                    }
                })
                
                if (!availableAction) {
                    throw new Error(`Invalid actionId: ${actionId}. The actionId must reference a valid entry in the AvailableActions table.`)
                }
                
                await tx.actions.create({
                    data:{
                        flowId,
                        actionId: actionId,
                        metaData: action.metaData || {},
                    } 
                })
            }
        })
        return NextResponse.json("Success", { status: 200 })
    }
    catch (error) {
        console.log(error)
        // Provide more descriptive error messages for specific errors
        if (error instanceof Error) {
            // Check if it's a foreign key constraint error
            if (error.message.includes('triggerId') || error.message.includes('actionId')) {
                return NextResponse.json({ error: error.message }, { status: 400 })
            }
            // Check if it's a Prisma foreign key constraint error
            if (error.name === 'PrismaClientKnownRequestError' && 'code' in error && error.code === 'P2003') {
                return NextResponse.json({ error: 'Foreign key constraint violation. Please ensure all referenced IDs exist.' }, { status: 400 })
            }
        }
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 }) 
    } 

}