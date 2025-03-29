"use client"

import { EllipsisVerticalIcon } from "lucide-react"

    export default function VerticalRounded() {
    return (
        <div className='absolute top-3 right-1' onClick={(e)=>e.stopPropagation()}>
            <EllipsisVerticalIcon className='w-4 h-4 text-gray-500'/>
        </div>
    )
    }
