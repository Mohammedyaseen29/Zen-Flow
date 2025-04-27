"use client"

import DeleteFlow from "./DeleteFlow"

export default function VerticalRounded() {
    return (
        <div className='absolute top-3 right-1' onClick={(e) => e.stopPropagation()}>
            <DeleteFlow/>
        </div>
    )
}
