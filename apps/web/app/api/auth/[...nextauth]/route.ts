import NextAuth from "next-auth/next";
import {nextAuth} from "@/lib/auth";

const handler = NextAuth(nextAuth);

export {handler as GET , handler as POST};





