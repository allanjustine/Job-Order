import { ADMIN_ACCESS, REPORTS_ACCESS } from "@/lib/permissions";
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
  Tags,
  Tickets,
} from "lucide-react";

export const sidebarData = [
  {
    href: "/admin/dashboard",
    icon: Gauge,
    name: "Dashboard",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/users",
    icon: Users,
    name: "Users",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/customers",
    icon: UserCheck,
    name: "Customers",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/mechanics",
    icon: UserCog,
    name: "Mechanics",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/target-incomes",
    icon: HandCoinsIcon,
    name: "Target Incomes",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/area-managers",
    icon: ShieldUser,
    name: "Area Managers",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/tickets",
    icon: TicketIcon,
    name: "Tickets",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/ticket-categories",
    icon: Tags,
    name: "Ticket Categories",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/ticket-brands",
    icon: Tickets,
    name: "Ticket Brands",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/roles-and-permissions",
    icon: ShieldUser,
    name: "Roles and Permissions",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/activity-logs",
    icon: Activity,
    name: "Activity Logs",
    permissions: ADMIN_ACCESS,
  },
  {
    href: "/admin/reports",
    icon: NotebookTextIcon,
    name: "Reports",
    permissions: REPORTS_ACCESS,
  },
];
