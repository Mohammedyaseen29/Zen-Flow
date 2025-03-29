"use client"
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function SignoutDropdown() {
    return (
        <DropdownMenuItem className="group" onClick={()=>{
            signOut({callbackUrl:"/auth/sign-in"});
        }}>
            <div className="flex items-center w-full">
                <span className="group-hover:text-rose-500 group-hover:font-bold font-medium">Sign Out</span>
                <LogOut className="ml-auto w-5 h-5 group-hover:text-rose-500 group-hover:font-bold"/>
            </div>
        </DropdownMenuItem>
    )
}
