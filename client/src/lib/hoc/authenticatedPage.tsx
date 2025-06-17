import Forbidden from "@/components/Forbidden";
import GlobalLoader from "@/components/GlobalLoaders";
import Unauthorized from "@/components/Unauthorized";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import adminPaths from "@/data/admin-paths.json";

export default function authenticatedPage(WrappedComponent: any) {
  function AuthenticatedPageComponent(props: any) {
    const { isLoading, isAuthenticated, isAdmin } = useAuth();
    const pathname = usePathname();
    const isAdminPath = adminPaths.some((item) => pathname.startsWith(item));

    if (isLoading) return <GlobalLoader />;

    if (!isAuthenticated) return <Unauthorized />;

    if (!isAdmin && isAdminPath) return <Forbidden />;

    return <WrappedComponent {...props} />;
  }

  return AuthenticatedPageComponent;
}
