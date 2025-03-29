import { EllipsisVerticalIcon } from 'lucide-react';
import React from 'react'
import VerticalRounded from './VerticalRounded';

interface FlowBoxInterface{
    id:string;
    name:string;
}

export default function FlowBox({id,name}:FlowBoxInterface) {
    const colors = ["bg-red-500","bg-blue-500","bg-green-500","bg-yellow-500","bg-purple-500"]
    const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
    return (
        <div className='bg-white relative p-6 rounded-3xl shadow-md hover:scale-95 transition border cursor-pointer'>
            <VerticalRounded/>
            <div className='flex items-center space-x-2.5'>
                <div className={`${getRandomColor()} rounded-full p-2 w-14 h-14 flex items-center justify-center`}>
                    <p className='font-bold text-white text-xl'>{name.charAt(0)}</p>
                </div>
                <div>
                    <p className='font-semibold text-2xl'>{name}</p>
                </div>
            </div>
        </div>
    )
}
