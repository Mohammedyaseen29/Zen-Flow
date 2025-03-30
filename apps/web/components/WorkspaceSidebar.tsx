import { SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarImage } from "./ui/avatar";
import { nextAuth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SignoutDropdown from "./SignoutDropdown";
import { Home, LayoutTemplate, Search, Sparkles } from "lucide-react";



export default async function WorkspaceSidebar() {
    const session = await getServerSession(nextAuth);

    const items = [
        {
            title: "Home",
            url:"/workspace",
            icon:Home,
        },
        {
            title:"Search",
            url:"#",
            icon:Search
        },
        {
            title:"Ask Zen",
            url:"/zen",
            icon:Sparkles
        },
        {
            title:"Templates",
            url:"/templates",
            icon:LayoutTemplate
        }
    ]

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
                <SidebarMenu className="pl-4 mt-4">
                    {items.map((item)=>(
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url}>
                                    <item.icon/>
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
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
