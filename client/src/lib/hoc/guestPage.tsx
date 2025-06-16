import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function guestPage(WrappedComponent: any) {
  function GuestPageComponent(props: any) {
    const { isLoading, isAuthenticated, user, isLogin } = useAuth();
    const pathname = usePathname();
    const isAlreadyLogin = pathname === "/login" || pathname === "/register";
    const router = useRouter();

    if (isLoading) return <GlobalLoader />;

    if (isAlreadyLogin && isAuthenticated && !isLogin) {
      router.push(user?.redirect_url);
      Swal.fire({
        icon: "info",
        title: "Opss!",
        text: "You are already logged in",
      });
      return;
    }

    return <WrappedComponent {...props} />;
  }

  return GuestPageComponent;
}
