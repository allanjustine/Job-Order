import { Gauge, UserCog, Users } from "lucide-react";

export const sidebarData = [
  {
    href: "/dashboard",
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
];
