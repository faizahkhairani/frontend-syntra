import { LogOut, Settings, User, type LucideIcon } from "lucide-react";


import { 
SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, 
} from "../ui/sidebar";

import { useLocation } from "react-router";
import { Link } from "react-router";

type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon
}

interface NavMainProps {
    items: NavItem[]
}

const NavMain = ({items}: NavMainProps  ) => {
    const location = useLocation()
  return (
    <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2 text-gray-700">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton size="lg" tooltip={item.title} 
                        isActive={
                            item.url == location.pathname || location.pathname?.startsWith(item.url + "?")} asChild>
                                <Link to={item.url}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>

        </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavMain