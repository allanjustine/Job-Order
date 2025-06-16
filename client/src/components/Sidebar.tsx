import { useAuth } from "@/context/authContext";
import acronymName from "@/utils/acronymName";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaGauge } from "react-icons/fa6";

export default function Sidebar({
  isSidebarOpen,
  handleToggleSidebar,
}: {
  isSidebarOpen: boolean;
  handleToggleSidebar: () => void;
}) {
  const { handleLogout, user } = useAuth();
  const router = useRouter();

  const handleLogoutUser = async () => {
    try {
      await handleLogout(router);
    } catch (error) {
      console.error(error);
    }
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
          <li
            className={`flex items-center transition-all ${
              !isSidebarOpen && "justify-center"
            } p-3 rounded-lg bg-blue-100 text-blue-600`}
          >
            <Link href="/dashboard" className="flex items-center gap-4">
              <FaGauge className="w-6 h-6 text-center" />
              {isSidebarOpen && (
                <span className="whitespace-nowrap">Dashboard</span>
              )}
            </Link>
          </li>
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
          <div className="flex items-center justify-end w-full gap-3">
            <div className="ml-3 overflow-hidden text-end">
              <p
                className="font-medium text-gray-900 whitespace-nowrap"
                onClick={handleLogoutUser}
              >
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-300 font-bold">
              {acronymName(user?.name)}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
