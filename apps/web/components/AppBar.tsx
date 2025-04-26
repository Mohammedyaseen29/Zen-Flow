"use client"

import React, { useState } from 'react'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppBar({flowId}:{flowId:string}) {
    const [flowName,setFlowName] = useState("Untitled")
    const [isActive, setIsActive] = useState(false)
    const toggleFlow = async (enabled: boolean) => {
        setIsActive(enabled)
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/flow/${flowId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ active: enabled }),
            })
            
            if (!response.ok) {
                console.error("Failed to toggle flow")
                setIsActive(!enabled) // Revert UI state if request fails
            }
        } catch (error) {
            console.error("Error toggling flow:", error)
            setIsActive(!enabled) // Revert UI state if request fails
        }
    }
    
    return (
        <div className='bg-white flex justify-between h-8 p-2'>
            <SidebarTrigger/>
            <Input placeholder='Enter the flow Name' value={flowName} onChange={(e)=>setFlowName(e.target.value)} className='bg-white w-64'/>
            <Switch checked={isActive} onCheckedChange={toggleFlow}/>
        </div>
    )
}
