import { useAuth } from "@/context/authContext";
import acronymName from "@/utils/acronymName";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import Button from "./ui/button";
import { sidebarData } from "@/constants/sidebarData";
import Swal from "sweetalert2";

export default function Sidebar({
  isSidebarOpen,
  handleToggleSidebar,
}: {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
}) {
  const { handleLogout, user } = useAuth();
  const router = useRouter();
  const [dropDownOpen, setDropdownOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutUser = () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You will redirect to login page!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleLogout(router);
        }
      });
      handleToggleDropdown();
    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleDropdown = () => {
    setDropdownOpen(!dropDownOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className={`bg-white shadow transition-all z-50 duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 flex items-center justify-center border-b border-gray-300">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </div>
      <nav className="p-1">
        <ul className="space-y-2">
          {sidebarData.map((item, index) => (
            <li className="flex items-center w-full" key={index}>
              <Link
                className={`flex items-center gap-4 hover:bg-blue-100 transition-all w-full ${
                  !isSidebarOpen && "justify-center"
                } p-3 rounded-lg text-blue-700 ${
                  isActive(item.href) && "bg-blue-100"
                }`}
                href={item.href}
              >
                <item.icon className="w-6 h-6 text-center" />
                {isSidebarOpen && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={`absolute top-0 transition-all shadow duration-300 z-50 ease-in-out right-0 p-4 bg-white ${
          isSidebarOpen ? "left-[257px]" : "left-[81px]"
        }`}
      >
        <div className="flex items-center">
          <button
            className="p-1 rounded-lg hover:bg-gray-200"
            type="button"
            onClick={handleToggleSidebar}
          >
            <FaBars className="text-xl text-gray-400" />
          </button>
          <div className="flex items-center justify-end w-full gap-3 relative">
            <div className="ml-3 overflow-hidden text-end">
              <p className="font-medium text-gray-900 whitespace-nowrap">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-300 font-bold">
              <Button
                type="button"
                onClick={handleToggleDropdown}
                ref={buttonRef}
              >
                {acronymName(user?.name)}
              </Button>
            </div>
            {dropDownOpen && (
              <div
                className="absolute top-12 rounded-lg right-1 min-w-1/5 bg-white shadow-md border border-gray-300"
                ref={dropdownRef}
              >
                <div className="flex flex-col">
                  <div className="p-3 hover:bg-gray-100">
                    <p className="font-bold text-gray-600">{user?.name}</p>
                  </div>
                  <hr className="text-gray-300" />
                  <div className="p-3 hover:bg-gray-100">
                    <button
                      type="button"
                      onClick={handleLogoutUser}
                      className="p-0 text-sm font-semibold text-gray-600 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
