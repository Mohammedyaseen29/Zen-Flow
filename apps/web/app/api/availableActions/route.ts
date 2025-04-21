import { db } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        const availableActions = await db.integration.findMany({
            include:{
                actions:true
            }
        });
        return NextResponse.json(availableActions,{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}