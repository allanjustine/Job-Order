import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import authPaths from "@/data/auth-paths.json";

export default function withoutAuthPage(WrappedComponent: any) {
  function WithoutAuthPageComponent(props: any) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const isAuthPath = authPaths.includes(pathname);

    if (isLoading) {
      return <GlobalLoader />;
    }

    if ((isAuthPath && isAuthenticated && user?.redirect_url) || user) {
      Swal.fire({
        title: "Authenticating...",
        text: "Redirecting to dashboard. Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      redirect(user?.redirect_url);
    }

    return <WrappedComponent {...props} />;
  }

  return WithoutAuthPageComponent;
}
