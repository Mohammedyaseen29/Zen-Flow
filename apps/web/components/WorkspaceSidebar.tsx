import { SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { nextAuth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SignoutDropdown from "./SignoutDropdown";



export default async function WorkspaceSidebar() {
    const session = await getServerSession(nextAuth);
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu className="pl-4">
                    <SidebarMenuItem>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Image src={logo} className="w-8 h-8" alt="logo.svg"/>
                            <p className="font-bold text-xl">ZenFlow</p>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <div className="flex items-center space-x-2">
                                        <Avatar>
                                            <AvatarImage src={session?.user?.image}/>
                                        </Avatar>
                                        <h1 className="font-semibold text-lg text-black">
                                            {session?.user?.name}
                                        </h1>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top">
                                <SignoutDropdown/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
