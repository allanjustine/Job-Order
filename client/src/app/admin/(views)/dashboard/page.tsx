"use client";

import useFetch from "@/hooks/useFetch";
import {
  Calendar,
  Clock,
  PhilippinePeso,
  Printer,
  Search,
  SearchSlash,
  BikeIcon,
  CarFrontIcon,
  UserCog,
} from "lucide-react";
import { FaCircleNotch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import Button from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import PreviewData from "@/components/PreviewData";
import { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/components/ui/input";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { FaMagnifyingGlass, FaRotateRight } from "react-icons/fa6";
import phpCurrency from "@/utils/phpCurrency";
import { CgSpinner } from "react-icons/cg";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import { formatDateAndTime } from "@/utils/format-date-and-time";
import { diffForHumans } from "@/utils/diff-for-humans";

interface StatItem {
  total_job_prints: {
    total: number;
    total_motors: number;
    total_trimotors: number;
  };
  today_prints: number;
  weekly_prints: number;
  monthly_prints: number;
  total_mechanics: number;
  total_motorcycle_jobs: number;
  total_trimotors_job: number;
  total_amount: number;
  total_job_motor_print: number;
  total_job_trimotor_print: number;
  top_over_all_job_orders: {
    category: string;
    amount: number;
  }[];
  top_area_manager_job_orders: {
    category: string;
    area_manager_name: string;
    amount: number;
    branch: {
      name: string;
      code: string;
    };
  }[];
  top_branch_job_orders: {
    category: string;
    amount: number;
    branch: {
      name: string;
      code: string;
    };
  }[];
}

const Dashboard = () => {
  const {
    data: jobOrders,
    cardData,
    isLoading,
    error,
    pagination,
    sort,
    isRefresh,
    isSearching,
    searchTerm,
    handleSort,
    handleRowsPerPageChange,
    handlePageChange,
    handleSearch,
    handleRefresh,
  } = useFetch("/admin-job-orders");
  const [viewData, setViewData] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [adminStats, setAdminStats] = useState<StatItem>({
    total_job_prints: {
      total: 0,
      total_motors: 0,
      total_trimotors: 0,
    },
    today_prints: 0,
    weekly_prints: 0,
    monthly_prints: 0,
    total_mechanics: 0,
    total_motorcycle_jobs: 0,
    total_trimotors_job: 0,
    total_amount: 0,
    total_job_motor_print: 0,
    total_job_trimotor_print: 0,
    top_over_all_job_orders: [
      {
        category: "",
        amount: 0,
      },
    ],
    top_area_manager_job_orders: [
      {
        category: "",
        area_manager_name: "",
        amount: 0,
        branch: {
          name: "",
          code: "",
        },
      },
    ],
    top_branch_job_orders: [
      {
        category: "",
        amount: 0,
        branch: {
          name: "",
          code: "",
        },
      },
    ],
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const response = await api.get("/admin-stats");

        if (response.status === 200) {
          setAdminStats(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    fetchAdminStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setViewData(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    Swal.close();
  }, []);

  const columns = [
    {
      name: "JO NUMBER",
      sortable: true,
      selector: (row: any) => row.job_order_number,
      sortField: "job_order_number",
    },
    {
      name: "CUSTOMER NAME",
      selector: (row: any) => row.customer.name,
      sortable: true,
      sortField: "customer.name",
    },
    {
      name: "MECHANIC",
      selector: (row: any) => row.mechanic.name,
      sortable: true,
      sortField: "mechanic.name",
    },
    {
      name: "TOTAL AMOUNT",
      cell: (row: any) => (
        <span className="font-bold text-md text-gray-600">
          {phpCurrency(Number(row?.total_amount))}
        </span>
      ),
      sortable: true,
      sortField: "total_amount",
    },
    {
      name: "PRINTED ON",
      cell: (row: any) => (
        <div>
          <p>{formatDateAndTime(row.created_at)}</p>
          <span className="text-xs font-semibold">
            {diffForHumans(row.created_at)}
          </span>
        </div>
      ),
      sortField: "created_at",
      sortable: true,
    },
  ];

  const handleView = (row: any) => () => {
    setIsOpen(!isOpen);
    setViewData(row);
  };

  const data = {
    totalReceiptPrints: adminStats.total_job_prints.total,
    todaysPrints: adminStats.today_prints,
    weeklyPrints: adminStats.weekly_prints,
    monthlyPrints: adminStats.monthly_prints,
    totalMechanics: adminStats.total_mechanics,
    totalMotorcycleJobs: phpCurrency(adminStats.total_motorcycle_jobs || 0),
    totalTrimotorsJobs: phpCurrency(adminStats.total_trimotors_job || 0),
    totalOverAllAmount: phpCurrency(Number(adminStats.total_amount) || 0),
    total_job_motor_print: adminStats.total_job_prints.total_motors,
    total_job_trimotor_print: adminStats.total_job_prints.total_trimotors,
  };

  const spinner = () => {
    return (
      <>
        <CgSpinner className="animate-spin" />
      </>
    );
  };

  const stats = [
    {
      label: "Today's Prints",
      value: isLoadingStats ? spinner() : data.todaysPrints,
      icon: Clock,
      color: "from-green-500 to-green-400",
    },
    {
      label: "Weekly Prints",
      value: isLoadingStats ? spinner() : data.weeklyPrints,
      icon: Calendar,
      color: "from-purple-500 to-purple-400",
    },
    {
      label: "Monthly Prints",
      value: isLoadingStats ? spinner() : data.monthlyPrints,
      icon: Calendar,
      color: "from-orange-500 to-orange-400",
    },
    {
      label: "Total Mechanics",
      value: isLoadingStats ? spinner() : data.totalMechanics,
      icon: UserCog,
      color: "from-indigo-500 to-indigo-400",
    },
    {
      label: "Total Motorcycle Jobs",
      value: isLoadingStats ? spinner() : data.totalMotorcycleJobs,
      icon: BikeIcon,
      color: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Total Trimotors Jobs",
      value: isLoadingStats ? spinner() : data.totalTrimotorsJobs,
      icon: CarFrontIcon,
      color: "from-rose-500 to-rose-400",
    },
  ];

  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Total Job Prints
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {isLoadingStats ? spinner() : data.totalReceiptPrints}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-br from-blue-500 to-blue-400 shadow-md">
                <Printer className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute z-10 top-full left-0 mt-2 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <p>
                <span className="font-medium">Motocycle:</span>{" "}
                {isLoadingStats ? spinner() : data.total_job_motor_print}
              </p>
              <p>
                <span className="font-medium">Trimotors:</span>{" "}
                {isLoadingStats ? spinner() : data.total_job_trimotor_print}
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
                    <p className="text-2xl font-semibold text-gray-800">
                      {item.value}
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
                  {isLoadingStats ? spinner() : data.totalOverAllAmount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-linear-to-br from-amber-500 to-amber-400 shadow-md">
                <PhilippinePeso className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-fit">
            <div className="mb-2 flex justify-end">
              <Button
                type="button"
                disabled={isRefresh}
                className={`bg-blue-500 hover:bg-blue-400 text-white p-2 ${
                  isRefresh && "bg-blue-400! cursor-not-allowed!"
                }`}
                onClick={handleRefresh}
              >
                {isRefresh ? (
                  <>
                    <FaCircleNotch className="animate-spin" /> Refreshing...
                  </>
                ) : (
                  <>
                    <FaRotateRight /> Refresh
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-600">
                Recent Print Job Orders
              </h2>
              <div className="relative w-full md:w-1/3">
                <Input
                  type="search"
                  placeholder="Search..."
                  onChange={handleSearch}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={jobOrders}
                pagination
                paginationServer
                sortServer
                onSort={handleSort}
                paginationTotalRows={pagination.total}
                onChangeRowsPerPage={handleRowsPerPageChange}
                onChangePage={handlePageChange}
                paginationPerPage={pagination.perPage}
                striped
                highlightOnHover
                progressPending={isLoading || isRefresh || isSearching}
                progressComponent={
                  <div className="py-5 font-bold text-gray-600 text-xl">
                    {isSearching ? (
                      <div className="flex items-center gap-1">
                        <FaMagnifyingGlass className="animate-ping" /> Searching{" "}
                        {searchTerm !== "" && <span>"{searchTerm}"</span>}
                        ...
                      </div>
                    ) : (
                      "Loading..."
                    )}
                  </div>
                }
                persistTableHead
                paginationRowsPerPageOptions={PER_PAGE_OPTIONS}
                defaultSortAsc={sort.sortBy}
                defaultSortFieldId={sort.column}
                noDataComponent={
                  <div className="py-5 font-bold text-gray-600 text-xl">
                    {searchTerm ? (
                      <>
                        <span className="flex gap-1 items-center">
                          <SearchSlash /> No results for "{searchTerm}"
                        </span>
                      </>
                    ) : (
                      "No job orders yet."
                    )}
                  </div>
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-2 h-fit">
            <div className="p-5 border-gray-300 border-dashed border rounded-md h-fit">
              <div className="text-center text-md font-bold text-gray-500 mb-3">
                Top 10 Overall Job Orders
              </div>
              <div className="flex flex-col space-y-2">
                {isLoadingStats ? (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="w-full p-5 rounded-lg bg-slate-200 h-12 flex justify-between items-center animate-pulse"
                        key={index}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      ></div>
                    ))}
                  </>
                ) : (
                  <>
                    {adminStats.top_over_all_job_orders.length > 0 ? (
                      adminStats.top_over_all_job_orders.map(
                        (item, index: number) => (
                          <div
                            className="w-full p-5 rounded-lg bg-blue-200 hover:bg-blue-300 h-12 flex justify-between items-center"
                            key={index}
                            title={item.category}
                          >
                            <span className="text-gray-500 font-semibold text-xs line-clamp-1">
                              {item.category}
                            </span>
                            <span className="text-md font-bold text-gray-800">
                              {phpCurrency(item.amount)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center text-md font-semibold text-gray-600">
                        No data yet.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="p-5 border-gray-300 border-dashed border rounded-md h-fit">
              <div className="text-center text-md font-bold text-gray-500 mb-3">
                Top 10 Branch Job Orders
              </div>
              <div className="flex flex-col space-y-2">
                {isLoadingStats ? (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="w-full p-5 rounded-lg bg-slate-200 h-12 flex justify-between items-center animate-pulse"
                        key={index}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      ></div>
                    ))}
                  </>
                ) : (
                  <>
                    {adminStats.top_branch_job_orders.length > 0 ? (
                      adminStats.top_branch_job_orders.map(
                        (item, index: number) => (
                          <div
                            className="w-full p-5 rounded-lg bg-violet-200 hover:bg-violet-300 h-12 flex justify-between items-center"
                            title={item.category}
                            key={index}
                          >
                            <div className="flex-col flex">
                              <span
                                className="text-gray-500 font-semibold line-clamp-1 text-sm"
                                title={item.branch.name}
                              >
                                {`(${item.branch.code}) - ${item.branch.name}`}
                              </span>
                              <span
                                className="text-gray-600 text-xs line-clamp-1"
                                title={item.category}
                              >
                                {item.category}
                              </span>
                            </div>
                            <span className="text-md font-bold text-gray-800">
                              {phpCurrency(item.amount)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center text-md font-semibold text-gray-600">
                        No data yet.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="p-5 border-gray-300 border-dashed border rounded-md h-fit">
              <div className="text-center text-md font-bold text-gray-500 mb-3">
                Top 10 Area Manager Job Orders
              </div>
              <div className="flex flex-col space-y-2">
                {isLoadingStats ? (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="w-full p-5 rounded-lg bg-slate-200 h-17 flex justify-between items-center animate-pulse"
                        key={index}
                        style={{ animationDelay: `${index * 0.2}s` }}
                      ></div>
                    ))}
                  </>
                ) : (
                  <>
                    {adminStats.top_area_manager_job_orders.length > 0 ? (
                      adminStats.top_area_manager_job_orders.map(
                        (item, index: number) => (
                          <div
                            className="w-full p-5 rounded-lg bg-violet-200 hover:bg-violet-300 h-17 flex justify-between items-center"
                            title={item.category}
                            key={index}
                          >
                            <div className="flex-col flex">
                              <span
                                className="text-gray-500 font-semibold line-clamp-1 text-md"
                                title={item.area_manager_name}
                              >
                                {item.area_manager_name}
                              </span>
                              <span
                                className="text-gray-500 font-semibold line-clamp-1 text-sm"
                                title={item.branch.name}
                              >
                                {`(${item.branch.code}) - ${item.branch.name}`}
                              </span>
                              <span
                                className="text-gray-600 text-xs line-clamp-1"
                                title={item.category}
                              >
                                {item.category}
                              </span>
                            </div>
                            <span className="text-md font-bold text-gray-800">
                              {phpCurrency(item.amount)}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center text-md font-semibold text-gray-600">
                        No data yet.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} className="w-5xl" ref={modalRef}>
        <ModalHeader onClose={handleView(null)}>
          Viewing {viewData?.customer.name}&apos;s Job Order
        </ModalHeader>
        <ModalBody>
          <PreviewData data={viewData} />
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white"
            type="button"
            onClick={handleView(null)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withAuthPage(Dashboard);
