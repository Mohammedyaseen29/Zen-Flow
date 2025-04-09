import { db } from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextResponse){
    try {
        const availableTriggers = await db.availableTriggers.findMany();
        return NextResponse.json(availableTriggers,{status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}