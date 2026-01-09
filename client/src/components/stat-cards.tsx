import { api } from "@/lib/api";
import phpCurrency from "@/utils/phpCurrency";
import {
  ArrowUp,
  ChartSpline,
  PhilippinePeso,
  PillBottleIcon,
  Plus,
  Printer,
  UserCog,
  Wrench,
} from "lucide-react";
import { Activity, useEffect, useState } from "react";
import Button from "./ui/button";

export default function StatCards({
  spinner,
  setIsMechanicOpen,
  isMechanicOpen,
  mechanicAdded,
  setTopJobOrders,
}: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await api.get("/branch-stats");

        if (response.status === 200) {
          setData(response.data.data);
          setTopJobOrders(response.data.data.top_job_orders);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Monthly Target Income",
      value: isLoading ? spinner() : data.monthly_target_income,
      icon: Wrench,
      color: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Monthly Shop Income",
      value: isLoading ? spinner() : data.monthly_shop_income,
      icon: PillBottleIcon,
      color: "from-rose-500 to-rose-400",
    },
    {
      label: "Target Income Statistics",
      value: isLoading ? spinner() : data.target_data.total_remaining_target,
      percentage: isLoading ? spinner() : data.target_data.target_percentage,
      icon: ChartSpline,
      color: "from-violet-500 to-violet-400",
    },
  ];

  function percentageColor(percentage: number) {
    switch (true) {
      case percentage < 20:
        return "text-rose-600";
      case percentage < 40:
        return "text-rose-400";
      case percentage < 60:
        return "text-emerald-200";
      case percentage < 80:
        return "text-emerald-400";
      case percentage < 100:
        return "text-emerald-600";
      default:
        return "text-rose-800";
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Total Job Prints
            </p>
            <p className="text-2xl font-semibold text-gray-800">
              {isLoading ? spinner() : data.total_job_prints.total}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-blue-400 shadow-md">
            <Printer className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="absolute z-10 top-full left-0 mt-2 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <p>
            <span className="font-medium">Motocycle:</span>{" "}
            {isLoading ? spinner() : data.total_job_prints.total_motors}
          </p>
          <p>
            <span className="font-medium">Trimotors:</span>{" "}
            {isLoading ? spinner() : data.total_job_prints.total_trimotors}
          </p>
        </div>
      </div>

      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-gray-800 items-center flex gap-2">
                  {isLoading ? item.value : phpCurrency(item.value)}{" "}
                  <Activity mode={item.percentage ? "visible" : "hidden"}>
                    <span
                      className={`text-xs flex gap-1 items-center ${percentageColor(
                        Number(!isLoading && item?.percentage?.split(".")[0])
                      )}`}
                    >
                      <ArrowUp className="size-3" /> {item.percentage}
                    </span>
                  </Activity>
                </p>
              </div>
              <div
                className={`p-3 rounded-lg bg-linear-to-br ${item.color} shadow-md`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        );
      })}

      <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group col-span-1 sm:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Total Amount
            </p>
            <p className="text-2xl font-semibold text-gray-800">
              {isLoading ? spinner() : phpCurrency(data.total_amount)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-linear-to-br from-amber-500 to-amber-400 shadow-md">
            <PhilippinePeso className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* <div className="absolute z-10 top-full left-0 mt-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <p>
            <span className="font-medium">PMS:</span>{" "}
            {isLoading ? spinner() : data.pmsAmount}
          </p>
          <p>
            <span className="font-medium">Repair:</span>{" "}
            {isLoading ? spinner() : data.repairAmount}
          </p>
          <p>
            <span className="font-medium">Warranty Claim:</span>{" "}
            {isLoading ? spinner() : data.warrantyClaimAmount}
          </p>
        </div> */}
      </div>
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Total Mechanics
            </p>
            <div className="flex gap-2 items-center">
              <p className="text-2xl font-semibold text-gray-800">
                {isLoading ? spinner() : data.total_mechanics + mechanicAdded}
              </p>
              <Activity mode={isMechanicOpen ? "hidden" : "visible"}>
                <Button
                  type="button"
                  onClick={() => setIsMechanicOpen(!isMechanicOpen)}
                  className="p-0 text-blue-500 hover:text-blue-600"
                >
                  <Plus size="20" /> Add more mechanic
                </Button>
              </Activity>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-linear-to-br from-yellow-500 to-yellow-400 shadow-md">
            <UserCog className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
