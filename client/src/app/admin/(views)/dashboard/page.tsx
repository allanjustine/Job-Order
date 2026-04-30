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
  User,
} from "lucide-react";
import { FaCircleNotch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import { Button } from "@/components/ui/button";
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
      name: "MECHANIC(s)",
      cell: (row: any) => (
        <div className="flex flex-col gap-1">
          {row.mechanics.map((mechanic: any) => (
            <span className="flex gap-1 items-center" key={mechanic.id}>
              <User size={15} /> {mechanic.name}
            </span>
          ))}
        </div>
      ),
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
      sub: "Printed today",
    },
    {
      label: "Weekly Prints",
      value: isLoadingStats ? spinner() : data.weeklyPrints,
      icon: Calendar,
      color: "from-purple-500 to-purple-400",
      sub: "This week",
    },
    {
      label: "Monthly Prints",
      value: isLoadingStats ? spinner() : data.monthlyPrints,
      icon: Calendar,
      color: "from-orange-500 to-orange-400",
      sub: "This month",
    },
    {
      label: "Total Mechanics",
      value: isLoadingStats ? spinner() : data.totalMechanics,
      icon: UserCog,
      color: "from-indigo-500 to-indigo-400",
      sub: "Active mechanics",
    },
    {
      label: "Motorcycle Jobs",
      value: isLoadingStats ? spinner() : data.totalMotorcycleJobs,
      icon: BikeIcon,
      color: "from-emerald-500 to-emerald-400",
      sub: "Total revenue",
    },
    {
      label: "Trimotor Jobs",
      value: isLoadingStats ? spinner() : data.totalTrimotorsJobs,
      icon: CarFrontIcon,
      color: "from-rose-500 to-rose-400",
      sub: "Total revenue",
    },
  ];

  const rankBadge = (index: number) => {
    const badges = [
      "bg-yellow-400 text-yellow-900",
      "bg-gray-300 text-gray-700",
      "bg-amber-600 text-amber-100",
    ];
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
          index < 3 ? badges[index] : "bg-gray-100 text-gray-500"
        }`}
      >
        {index + 1}
      </span>
    );
  };

  const skeletonRows = (count = 5, height = "h-12") =>
    Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`w-full rounded-lg bg-slate-100 ${height} animate-pulse`}
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ));

  return (
    <>
      <div className="p-6 space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">Job Order Printing System — Admin Overview</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Job Prints — with hover breakdown */}
          <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Total Job Prints</p>
                <p className="text-3xl font-bold text-gray-800">
                  {isLoadingStats ? spinner() : data.totalReceiptPrints}
                </p>
                <p className="text-xs text-gray-400 mt-1">Hover to see breakdown</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-md">
                <Printer className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="absolute z-10 top-full left-0 mt-2 w-52 p-3 bg-white border border-gray-200 rounded-xl shadow-lg text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Motorcycle</span>
                <span className="font-semibold">{isLoadingStats ? spinner() : data.total_job_motor_print}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Trimotors</span>
                <span className="font-semibold">{isLoadingStats ? spinner() : data.total_job_trimotor_print}</span>
              </div>
            </div>
          </div>

          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{item.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Amount */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800">
                  {isLoadingStats ? spinner() : data.totalOverAllAmount}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 shadow-md">
                <PhilippinePeso className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Job Orders Table */}
          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Recent Print Job Orders</h2>
                <p className="text-xs text-gray-400">Latest submitted job orders</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search..."
                    onChange={handleSearch}
                    className="border border-gray-200 rounded-lg px-4 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <Button
                  type="button"
                  disabled={isRefresh}
                  className={`bg-blue-500 hover:bg-blue-400 text-white py-5 ${
                    isRefresh && "opacity-60 cursor-not-allowed!"
                  }`}
                  onClick={handleRefresh}
                >
                  {isRefresh ? (
                    <><FaCircleNotch className="animate-spin" /> Refreshing...</>
                  ) : (
                    <><FaRotateRight /> Refresh</>
                  )}
                </Button>
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
                  <div className="py-8 font-semibold text-gray-500 text-sm flex items-center justify-center gap-2">
                    {isSearching ? (
                      <><FaMagnifyingGlass className="animate-ping" /> Searching {searchTerm && `"${searchTerm}"`}...</>
                    ) : (
                      <><CgSpinner className="animate-spin text-blue-500 text-lg" /> Loading...</>
                    )}
                  </div>
                }
                persistTableHead
                paginationRowsPerPageOptions={PER_PAGE_OPTIONS}
                defaultSortAsc={sort.sortBy}
                defaultSortFieldId={sort.column}
                noDataComponent={
                  <div className="py-10 text-gray-400 text-sm flex flex-col items-center gap-2">
                    {searchTerm ? (
                      <><SearchSlash className="w-8 h-8" /><span>No results for "{searchTerm}"</span></>
                    ) : (
                      <><Printer className="w-8 h-8" /><span>No job orders yet.</span></>
                    )}
                  </div>
                }
              />
            </div>
          </div>

          {/* Rankings */}
          <div className="xl:col-span-2 grid grid-cols-1 gap-4">
            {/* Top Overall */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Top 10 Overall Job Orders
              </h3>
              <div className="flex flex-col gap-2">
                {isLoadingStats ? skeletonRows(5) : adminStats.top_over_all_job_orders.length > 0 ? (
                  adminStats.top_over_all_job_orders.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      title={item.category}
                    >
                      {rankBadge(index)}
                      <span className="flex-1 text-xs font-medium text-gray-600 line-clamp-1">{item.category}</span>
                      <span className="text-xs font-bold text-gray-800 shrink-0">{phpCurrency(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400 py-4">No data yet.</p>
                )}
              </div>
            </div>

            {/* Top Branch */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block"></span>
                Top 10 Branch Job Orders
              </h3>
              <div className="flex flex-col gap-2">
                {isLoadingStats ? skeletonRows(5) : adminStats.top_branch_job_orders.length > 0 ? (
                  adminStats.top_branch_job_orders.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 hover:bg-violet-100 transition-colors"
                      title={item.category}
                    >
                      {rankBadge(index)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 line-clamp-1">{`(${item.branch.code}) ${item.branch.name}`}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.category}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-800 shrink-0">{phpCurrency(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400 py-4">No data yet.</p>
                )}
              </div>
            </div>

            {/* Top Area Manager */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Top 10 Area Manager Job Orders
              </h3>
              <div className="flex flex-col gap-2">
                {isLoadingStats ? skeletonRows(5, "h-14") : adminStats.top_area_manager_job_orders.length > 0 ? (
                  adminStats.top_area_manager_job_orders.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      title={item.category}
                    >
                      {rankBadge(index)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-700 line-clamp-1">{item.area_manager_name}</p>
                        <p className="text-xs font-medium text-gray-500 line-clamp-1">{`(${item.branch.code}) ${item.branch.name}`}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.category}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-800 shrink-0">{phpCurrency(item.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-gray-400 py-4">No data yet.</p>
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
