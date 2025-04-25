"use client"

import React, { useState } from 'react'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppBar() {
    const [flowName,setFlowName] = useState("Untitled")
    return (
        <div className='bg-white flex justify-between h-8 p-2'>
            <SidebarTrigger/>
            <Input placeholder='Enter the flow Name' value={flowName} onChange={(e)=>setFlowName(e.target.value)} className='bg-white w-64'/>
            <Switch/>
        </div>
    )
}
