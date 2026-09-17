import Forbidden from "@/components/Forbidden";
import GlobalLoader from "@/components/GlobalLoaders";
import { useAuth } from "@/context/authContext";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";
import { ComponentType } from "react";

type RoleType = {
  name: string;
};

export default function withAuthPage<P extends object>(
  WrappedComponent: ComponentType<P>,
  CAN_ACCESS?: string[],
): ComponentType<P> {
  function WithAuthPageComponent(props: P) {
    const { isLoading, isAuthenticated, user } = useAuth();
    const noAccess = !CAN_ACCESS?.some((item) =>
      user?.roles?.some((role: RoleType) => role?.name?.includes(item)),
    );

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

    if (noAccess) return <Forbidden />;

    return <WrappedComponent {...props} />;
  }

  return WithAuthPageComponent;
}
