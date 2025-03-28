import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@repo/db/client"
import  GoogleProvider  from "next-auth/providers/google"
import  EmailProvider  from "next-auth/providers/email"

export const nextAuth = {
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
    ],
    callbacks:{
        async session({session,user}:any){
            if(session?.user){
                session.user.id = user.id
            }
            return session;
        }
    },
    pages:{
        signIn:"/auth/signin",
        verifyRequest:"/auth/verify-request",
    },
    sercret:process.env.AUTH_SECRET
}