"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import Sidebar from "./Sidebar";

export default function BaseContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [isSidebarOpen, setIsOpenSidebar] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsOpenSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleToggleSidebar = () => {
    setIsOpenSidebar(!isSidebarOpen);
  };

  return (
    <>
      {isAuthenticated && !user?.is_employee ? (
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
