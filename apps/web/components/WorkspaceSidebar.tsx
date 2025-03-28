import { SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";


export default function WorkspaceSidebar() {
    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup />
            </SidebarContent>
        </Sidebar>
    )
}
