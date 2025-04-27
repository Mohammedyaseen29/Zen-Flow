import { nextAuth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db/client";




export async function POST(req:NextRequest){
    try {
        const session = await getServerSession(nextAuth);
        if(!session.user){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }
        const userId = session.user.id;

        const newFlow = await db.flow.create({
            data:{
                active:true,
                userId,
                triggerId:""
            }
        })
        return NextResponse.json({flow:newFlow},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error},{status:500})
    }

}