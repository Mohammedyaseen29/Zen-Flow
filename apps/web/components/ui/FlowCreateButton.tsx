"use client"
import React, { useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function FlowCreateButton() {
    const [loading,setLoading] = useState(false);
    const router = useRouter();

    const createFlow = async()=>{
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flow`);
            console.log(res);
            router.push(`/workspace/Flow/${res?.data.flow.id}`);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        } finally{
            setLoading(false);
        }
    }
    
    return (
        <button disabled={loading} onClick={createFlow} className="bg-[#166EE1] text-white px-2 sm:px-4 py-1 text-sm sm:text-base rounded-md hover:scale-95 transition w-full sm:w-auto">{loading ? "creating..." : "Create Flow"}</button>
    )
}
