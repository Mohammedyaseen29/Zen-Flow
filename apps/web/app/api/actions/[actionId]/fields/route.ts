import { db } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{actionId:string}}){
    try {
        const {actionId} = params;
        const field = await db.availableActions.findUnique({
            where:{
                id:actionId
            },
            select:{
                fields:true
            }
        })
        if(!field) return NextResponse.json({error:"Action not found"},{status:404})
        return NextResponse.json(field,{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}