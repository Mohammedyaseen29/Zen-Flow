import { db } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextResponse){
    try {
        const integrations = await db.integration.findMany({
            include:{
                triggers: true
            }
        });
        return NextResponse.json(integrations,{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}