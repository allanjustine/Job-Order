"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import adminPaths from "@/data/admin-paths.json";
import Sidebar from "./Sidebar";

export default function BaseContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsOpenSidebar] = useState<boolean>(false);
  const isSidebarActive = adminPaths.some((item) => pathname.startsWith(item));

  const handleToggleSidebar = () => {
    setIsOpenSidebar(!isSidebarOpen);
  };

  return (
    <>
      {isSidebarActive && isAuthenticated && isAdmin ? (
        <div className="flex overflow-hidden">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            handleToggleSidebar={handleToggleSidebar}
          />
          <main className="flex-1 mt-20 relative overflow-y-auto h-[calc(100vh-80px)]">
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );
}
