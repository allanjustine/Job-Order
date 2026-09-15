import {
  Gauge,
  UserCog,
  Users,
  NotebookTextIcon,
  HandCoinsIcon,
  UserCheck,
  ShieldUser,
  Activity,
  TicketIcon,
  GitBranchPlus,
  Tags,
  Tickets,
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
    href: "/admin/target-incomes",
    icon: HandCoinsIcon,
    name: "Target Incomes",
  },
  {
    href: "/admin/area-managers",
    icon: ShieldUser,
    name: "Area Managers",
  },
  {
    href: "/admin/activity-logs",
    icon: Activity,
    name: "Activity Logs",
  },
  {
    href: "/tickets",
    icon: TicketIcon,
    name: "Tickets",
  },
  {
    href: "/admin/ticket-categories",
    icon: Tags,
    name: "Ticket Categories",
  },
  {
    href: "/admin/ticket-brands",
    icon: Tickets,
    name: "Ticket Brands",
  },
  {
    href: "/admin/roles-and-permissions",
    icon: ShieldUser,
    name: "Roles and Permissions",
  },
  {
    href: "/admin/reports",
    icon: NotebookTextIcon,
    name: "Reports",
  },
];
