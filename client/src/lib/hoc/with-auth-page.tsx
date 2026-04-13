import Forbidden from "@/components/Forbidden";
import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect, usePathname } from "next/navigation";
import adminPaths from "@/data/admin-paths.json";
import Swal from "sweetalert2";

export default function withAuthPage(WrappedComponent: any) {
  function WithAuthPageComponent(props: any) {
    const { isLoading, isAuthenticated, isAdmin, user } = useAuth();
    const pathname = usePathname();
    const isAdminPath = adminPaths.some((item) => pathname?.startsWith(item));

    if (isLoading) return <GlobalLoader />;

    if (!isAuthenticated || !user) {
      Swal.fire({
        title: "Redirecting...",
        text: "Redirecting to login. Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      redirect("/login");
    }

    if (!isAdmin && isAdminPath) return <Forbidden />;

    return <WrappedComponent {...props} />;
  }

  return WithAuthPageComponent;
}
