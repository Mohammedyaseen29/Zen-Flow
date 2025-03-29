import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import WorkspaceSidebar from '@/components/WorkspaceSidebar'

export default function Workspacelayout({children}:{children:React.ReactNode}) {
    return (
        <SidebarProvider>
            <WorkspaceSidebar/>
            <main className='w-full'>
                {children}
            </main>
        </SidebarProvider>
    )
}
