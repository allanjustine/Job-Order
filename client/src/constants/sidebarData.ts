import {
  Gauge,
  UserCog,
  Users,
  NotebookTextIcon,
  HandCoinsIcon,
  UserCheck,
  ShieldUser,
} from "lucide-react";

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
    icon: UserCheck,
    name: "Customers",
  },
  {
    href: "/admin/mechanics",
    icon: UserCog,
    name: "Mechanics",
  },
  {
    href: "/admin/target-income",
    icon: HandCoinsIcon,
    name: "Target Income",
  },
  {
    href: "/admin/area-managers",
    icon: ShieldUser,
    name: "Area Managers",
  },
  {
    href: "/admin/reports",
    icon: NotebookTextIcon,
    name: "Reports",
  },
];
