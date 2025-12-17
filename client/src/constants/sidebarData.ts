import { Gauge, UserCog, Users, NotebookTextIcon } from "lucide-react";

export const sidebarData = [
  {
    href: "/admin/dashboard",
    icon: Gauge,
    name: "Dashboard",
  },
  {
    href: "/admin/users",
    icon: Users,
    name: "Users",
  },
  {
    href: "/admin/customers",
    icon: UserCog,
    name: "Customers",
  },
  {
    href: "/admin/reports",
    icon: NotebookTextIcon,
    name: "Reports",
  },
];
