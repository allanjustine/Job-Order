import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect, usePathname } from "next/navigation";
import Swal from "sweetalert2";

export default function withoutAuthPage(WrappedComponent: any) {
  function WithoutAuthPageComponent(props: any) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const isAlreadyLogin = pathname === "/login" || pathname === "/register";

    if (isLoading) {
      return <GlobalLoader />;
    }

    if (isAlreadyLogin && isAuthenticated && user?.redirect_url) {
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
