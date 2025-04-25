import { NextRequest, NextResponse } from "next/server";
import {getIntegrationById} from '@repo/integrations/apps';


export async function GET(req:NextRequest,{params}:{params:{id:string}}){
    try {
        const IntegrationId = params.id;
        const integration = getIntegrationById(IntegrationId);
        if(!integration){
            return NextResponse.json({error:"Integration not found"},{status:404})
        }
        const state = req.nextUrl.searchParams.get('state');
        const authUrl = integration.oauth.getAuthUrl(state);
        return NextResponse.json(authUrl,{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:"Internal server Error"},{status:500})
    }
}