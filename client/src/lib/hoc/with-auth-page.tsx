import Forbidden from "@/components/Forbidden";
import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect, usePathname } from "next/navigation";
import adminPaths from "@/data/admin-paths.json";

export default function withAuthPage(WrappedComponent: any) {
  function WithAuthPageComponent(props: any) {
    const { isLoading, isAuthenticated, isAdmin, user } = useAuth();
    const pathname = usePathname();
    const isAdminPath = adminPaths.some((item) => pathname?.startsWith(item));

    if (isLoading && !user) return <GlobalLoader />;

    if (!isAuthenticated && !user) {
      redirect("/login");
    }

    if (!isAdmin && isAdminPath) return <Forbidden />;

    return <WrappedComponent {...props} />;
  }

  return WithAuthPageComponent;
}
