import Forbidden from "@/components/Forbidden";
import GlobalLoader from "@/components/GlobalLoaders";
import Unauthorized from "@/components/Unauthorized";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import adminPaths from "@/data/admin-paths.json";
import { useEffect } from "react";

export default function authenticatedPage(WrappedComponent: any) {
  function AuthenticatedPageComponent(props: any) {
    const { isLoading, isAuthenticated, isAdmin, setIsLogin, isLogin } =
      useAuth();
    const pathname = usePathname();
    const isAdminPath = adminPaths.some((item) => pathname.startsWith(item));

    useEffect(() => {
      setIsLogin(false);
    }, [isAuthenticated]);

    if (isLoading) return <GlobalLoader />;

    if (!isAuthenticated) return <Unauthorized />;

    if (!isAdmin && isAdminPath) return <Forbidden />;

    return <WrappedComponent {...props} />;
  }

  return AuthenticatedPageComponent;
}
