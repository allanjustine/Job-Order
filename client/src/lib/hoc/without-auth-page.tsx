import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect, usePathname } from "next/navigation";

export default function withoutAuthPage(WrappedComponent: any) {
  function WithoutAuthPageComponent(props: any) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const isAlreadyLogin = pathname === "/login" || pathname === "/register";

    if (isLoading) {
      return <GlobalLoader />;
    }

    if (isAlreadyLogin && isAuthenticated && user?.redirect_url) {
      return redirect(user?.redirect_url);
    }

    return <WrappedComponent {...props} />;
  }

  return WithoutAuthPageComponent;
}
