"use client"

import { Trash } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"


    export default function DeleteFlow() {
        const handleDelete = async()=>{

        }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Trash className='w-4 h-4 text-rose-500 hover:scale-90'/>
            </DialogTrigger>
            <DialogContent className="shadow-md border-none text-black">
                <DialogHeader>
                    <DialogTitle className="text-center text-rose-500 text-2xl">Delete Flow</DialogTitle>
                    <DialogDescription className="text-center text-lg">Are You sure, You Wanna Delete this Flow</DialogDescription>
                </DialogHeader>
                <div className="flex mt-8 justify-between">
                    <DialogClose asChild>
                        <button className="px-4 py-2 bg-white text-black border-blue-500 rounded hover:scale-95">Cancel</button>
                    </DialogClose>
                    <button className="bg-red-500 px-4 py-2 rounded hover:scale-95" onClick={handleDelete}>Delete</button>
                </div>
            </DialogContent>

        </Dialog>
    )
}
