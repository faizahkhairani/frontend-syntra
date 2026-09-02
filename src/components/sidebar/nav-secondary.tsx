import { type LucideIcon } from "lucide-react";


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

interface NavSecondaryProps {
    items: NavItem[]
}

const NavSecondary = ({items}: NavSecondaryProps  ) => {
    const location = useLocation()
  return (
    <SidebarGroup>
        <SidebarGroupLabel className="uppercase text-sm">other menu</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2 text-gray-700 text-xl">
                {items.map((item) => {
                    const isActive = item.url == location.pathname || location.pathname?.startsWith(item.url + "?")
                    return (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton size="lg" tooltip={item.title} 
                        isActive={isActive} asChild>
                                <Link to={item.url}>
                                {item.icon && <item.icon className={`${isActive ? "text-primary bg-primary/10" : ""}`} />}
                                <span className={`text-[16px] ${isActive ? "text-primary rounded-full" : ""}`}>{item.title}</span>
                                </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>

        </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavSecondary