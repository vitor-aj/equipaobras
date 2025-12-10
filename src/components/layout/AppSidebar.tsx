import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, UserCircle, Building2, ChevronRight, UserCheck, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
const menuItems = [{
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "Empresas",
  url: "/empresas",
  icon: Building2
}, {
  title: "Clientes",
  url: "/clientes",
  icon: Users
}, {
  title: "Pedidos",
  url: "/pedidos",
  icon: FileText
}, {
  title: "Financeiro",
  url: "/financeiro",
  icon: UserCheck
}, {
  title: "Perfil do Usuário",
  url: "/configuracoes",
  icon: UserCircle
}];
interface AppSidebarProps {
  onLogout?: () => void;
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    return path !== "/" && currentPath.startsWith(path);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };
  return <Sidebar className="w-64 border-r border-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Equipaobra</h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Pedidos
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-medium uppercase tracking-wider px-3">
            NAVEGAÇÃO
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                      >
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                      <ChevronRight  />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer com botão de logout */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>;
}