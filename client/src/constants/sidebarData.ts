import { Gauge, UserCog, Users, NotebookTextIcon, HandCoinsIcon, UserLockIcon } from "lucide-react";

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
    href: "/admin/mechanics",
    icon: UserLockIcon,
    name: "Mechanics",
  },
  {
    href: "/admin/target-income",
    icon: HandCoinsIcon,
    name: "Target Income",
  },
  {
    href: "/admin/reports",
    icon: NotebookTextIcon,
    name: "Reports",
  },
];
