"use client";

import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import {
  Search,
  SearchSlash,
  Wrench,
  LogOut,
  X,
  BikeIcon,
  CarFrontIcon,
  User,
} from "lucide-react";
import { FaCheckCircle, FaCircleNotch } from "react-icons/fa";
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
import { Activity, useEffect, useRef, useState } from "react";
import Input from "@/components/ui/input";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { FaFileExcel, FaMagnifyingGlass, FaRotateRight } from "react-icons/fa6";
import phpCurrency from "@/utils/phpCurrency";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import Swal from "sweetalert2";
import { formatDateAndTime } from "@/utils/format-date-and-time";
import { diffForHumans } from "@/utils/diff-for-humans";
import StatCards from "@/components/stat-cards";
import Mechanics from "@/components/mechanics/mechanics";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { DatePickerWithRange } from "@/components/date-picker.with-range";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import formatDate from "@/utils/format-date";

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
  } = useFetch("/job-orders");
  const [viewData, setViewData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMechanicOpen, setIsMechanicOpen] = useState<boolean>(false);
  const [topJobOrders, setTopJobOrders] = useState<
    {
      category: string;
      amount: number;
      type: string;
      quantity: number;
      part_brand: number;
    }[]
  >([]);
  const [mechanicAdded, setMechanicAdded] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, handleLogout: handleLogoutUser } = useAuth();
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExport, setIsExport] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isLoadingMechanicChecking, setIsLoadingMechanicChecking] =
    useState<boolean>(false);
  const [hasMechanic, setHasMechanic] = useState<boolean>(false);
  const [isScale, setIsScale] = useState<boolean>(false);

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

      // Close dropdown when clicking outside
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchHasMechanicChecking = async () => {
      setIsLoadingMechanicChecking(true);
      try {
        const response = await api.get("mechanic-checking");

        if (response.status === 200) {
          setHasMechanic(response.data.has_mechanic);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMechanicChecking(false);
      }
    };

    fetchHasMechanicChecking();
  }, [mechanicAdded]);

  useEffect(() => {
    Swal.close();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        createRef.current &&
        !createRef.current.contains(event.target as Node) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpenCreate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const columns = [
    {
      name: "JO NUMBER",
      sortable: true,
      selector: (row: any) => row.job_order_number,
      sortField: "job_order_number",
    },
    {
      name: "JOB TYPE",
      cell: (row: any) => (
        <span
          className={`${row.job_order_type === "motors" ? "text-red-600" : "text-blue-600"} font-bold text-xs`}
        >
          {row.job_order_type?.toUpperCase()}
        </span>
      ),
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
      name: "STATUS",
      cell: (row: any) => (
        <span
          className={`font-bold text-md text-gray-600 ${row.status ? "text-red-500" : "text-green-500"}`}
        >
          {row.status ? row.status?.toUpperCase() : "RECORDED"}
        </span>
      ),
      sortable: true,
      sortField: "status",
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

  const handleDropdownSelect = (type: string) => {
    if (type === "motorcycle") {
      router.push("/job-order-form");
    } else if (type === "trimotors") {
      router.push("/trimotors-job-order-form");
    }
    setIsDropdownOpen(false);
  };

  const handleView = (row: any) => () => {
    setIsOpen(!isOpen);
    setViewData(row);
  };

  const handleOpenCreate = () => {
    if (!hasMechanic) {
      toast.error("No mechanic found, Please add mechanic first!", {
        position: "bottom-center",
        duration: 5000,
        icon: "🤔",
        style: {
          borderRadius: "15px",
          background: "red",
          color: "#fff",
          padding: "15px",
        },
      });
      return;
    }
    setIsOpenCreate(!isOpenCreate);
  };

  const data = {
    totalReceiptPrints: cardData.total_job_orders,
    todaysPrints: cardData.todays_print,
    weeklyPrints: cardData.this_week_print,
    monthlyPrints: cardData.this_month_print,
    totalBranchPrintedRecords: cardData.total_branch_prints,
    totalLabor: phpCurrency(cardData.total_labor || 0),
    totalPartsLubricants: phpCurrency(cardData.total_parts || 0),
    totalOverAllAmount: phpCurrency(cardData.total_over_all_amount || 0),
    repairAmount: phpCurrency(cardData.total_rr_amount || 0),
    pmsAmount: phpCurrency(cardData.total_pms_amount || 0),
    warrantyClaimAmount: phpCurrency(cardData.total_wc_amount || 0),
  };

  const spinner = () => {
    return (
      <>
        <CgSpinner className="animate-spin" />
      </>
    );
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will redirect to login page!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogoutUser();
      }
    });
  };

  const router = useRouter();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/export-branch-reports", {
        params: {
          search: searchTerm,
          from: formatDate(date?.from),
          to: formatDate(date?.to),
        },
      });

      if (response.data.data.length === 0) {
        return toast.error(
          "Export failed! No data to export in selected date range.",
          {
            position: "bottom-center",
            duration: 5000,
            icon: "😒",
            style: {
              borderRadius: "15px",
              background: "red",
              color: "#fff",
              padding: "15px",
            },
          },
        );
      }

      if (response.status === 200) {
        const worksheet = XLSX.utils.json_to_sheet(response.data.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });

        const dateFromTo =
          date?.from &&
          date?.to &&
          `${format(date?.from, "LLL dd, y")} to ${format(date?.to, "LLL dd, y")}`;

        const saveFileName = searchTerm
          ? `(Searched: ${searchTerm}) ${dateFromTo}.xlsx`
          : `${dateFromTo} Reports.xlsx`;

        saveAs(blob, saveFileName);

        setIsExport(false);

        setDate({
          from: new Date(),
          to: new Date(),
        });

        toast.error(
          "Export Ready! After saving the file, Please check your downloads folder.",
          {
            position: "bottom-center",
            duration: 5000,
            icon: "✅",
            style: {
              borderRadius: "15px",
              background: "green",
              color: "#fff",
              padding: "15px",
            },
          },
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewExport = () => {
    setIsExport(!isExport);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Welcome Banner */}
        <div className="mb-6 bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-lg p-6 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-blue-200 text-sm">{greeting()},</p>
              <h1 className="text-2xl font-bold leading-tight">
                {user?.name?.toUpperCase()}
              </h1>
              <p className="text-blue-100 text-xs mt-0.5 opacity-80">
                Job Order Management System
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 border border-white/30 text-white font-medium py-5 px-4 rounded-lg flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <StatCards
          spinner={spinner}
          setIsMechanicOpen={setIsMechanicOpen}
          isMechanicOpen={isMechanicOpen}
          mechanicAdded={mechanicAdded}
          setTopJobOrders={setTopJobOrders}
          isScale={isScale}
          isRefreshing={isRefresh}
        />

        {/* Data Table Section */}
        <Activity mode={!isMechanicOpen ? "visible" : "hidden"}>
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Job Orders
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  disabled={isRefresh}
                  className={`bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 py-5 px-3 text-sm shadow-sm ${
                    isRefresh && "cursor-not-allowed! opacity-60"
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
                <Activity
                  mode={
                    !isRefresh && !isLoading && jobOrders.length > 0
                      ? "visible"
                      : "hidden"
                  }
                >
                  <Button
                    type="button"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-5 px-3 text-sm shadow-sm"
                    onClick={handleViewExport}
                  >
                    <FaFileExcel /> Export
                  </Button>
                </Activity>
                <Button
                  type="button"
                  ref={createButtonRef}
                  onClick={handleOpenCreate}
                  onMouseDown={() => {
                    if (!hasMechanic) setIsScale(true);
                  }}
                  onMouseUp={() => {
                    if (!hasMechanic) setIsScale(false);
                  }}
                  onMouseLeave={() => {
                    if (!hasMechanic) setIsScale(false);
                  }}
                  disabled={isLoadingMechanicChecking}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-5 px-4 text-sm font-semibold shadow-sm flex items-center gap-2"
                >
                  {isLoadingMechanicChecking ? (
                    <>
                      <Spinner /> Checking...
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" /> Create Job Order
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
              {/* Table Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Recent Print Job Orders
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      All printed job orders from this branch
                    </p>
                  </div>
                  <div className="relative w-full sm:w-56">
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      onChange={handleSearch}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                      <div className="py-8 text-gray-500 text-sm font-medium flex items-center gap-2">
                        {isSearching ? (
                          <>
                            <FaMagnifyingGlass className="animate-ping" />{" "}
                            Searching {searchTerm && `"${searchTerm}"`}...
                          </>
                        ) : (
                          <>
                            <FaCircleNotch className="animate-spin text-blue-500 text-lg" />{" "}
                            Loading...
                          </>
                        )}
                      </div>
                    }
                    persistTableHead
                    paginationRowsPerPageOptions={PER_PAGE_OPTIONS}
                    defaultSortAsc={sort.sortBy}
                    defaultSortFieldId={sort.column}
                    noDataComponent={
                      <div className="py-12 flex flex-col items-center gap-2 text-gray-400">
                        {searchTerm ? (
                          <>
                            <SearchSlash className="w-8 h-8" />
                            <span className="text-sm font-medium">
                              No results for "{searchTerm}"
                            </span>
                          </>
                        ) : (
                          <>
                            <Wrench className="w-8 h-8" />
                            <span className="text-sm font-medium">
                              No job orders yet
                            </span>
                          </>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Top Job Orders Sidebar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Top Job Requests
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Most requested & parts replaced
                  </p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-16 rounded-xl bg-gray-100 animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))
                  ) : topJobOrders.length > 0 ? (
                    topJobOrders.map(
                      (
                        {
                          category,
                          amount,
                          type,
                          quantity,
                          part_brand,
                        }: {
                          category: string;
                          amount: number;
                          type: string;
                          quantity: number;
                          part_brand: number;
                        },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all duration-200"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">
                              {category}
                            </p>
                            <span
                              className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${
                                type === "parts_replacement"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {type.toUpperCase().replace("_", " ")}
                            </span>
                            <Activity
                              mode={
                                type === "parts_replacement"
                                  ? "visible"
                                  : "hidden"
                              }
                            >
                              <p className="text-[11px] text-gray-400 mt-0.5">
                                Qty: x{quantity} · Brands: {part_brand}
                              </p>
                            </Activity>
                          </div>
                          <span className="text-sm font-bold text-gray-800 shrink-0">
                            {phpCurrency(amount)}
                          </span>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="py-8 flex flex-col items-center gap-2 text-gray-400">
                      <Wrench className="w-7 h-7" />
                      <p className="text-sm font-medium">No data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Activity>

        <Activity mode={isMechanicOpen ? "visible" : "hidden"}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Mechanics</h2>
            <Button
              onClick={() => setIsMechanicOpen(false)}
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-5 px-4"
            >
              <X /> Close Mechanics
            </Button>
          </div>
          <Mechanics
            setMechanicAdded={setMechanicAdded}
            mechanicAdded={mechanicAdded}
          />
        </Activity>
      </div>

      <Modal isOpen={isOpenCreate} className="w-2xl" ref={createRef}>
        <ModalHeader
          onClose={handleOpenCreate}
          centerText
          className="text-xl font-bold"
        >
          Create New Job Order
        </ModalHeader>
        <ModalBody>
          <p className="text-center text-sm text-gray-400 mb-5 -mt-1">
            Select the vehicle type to proceed
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/motors-job-order-form" className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-blue-400 bg-linear-to-br from-blue-50 to-blue-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="p-6 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-blue-500 group-hover:bg-blue-600 flex items-center justify-center shadow-md transition-colors duration-300">
                    <BikeIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      Motorcycle
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      2-wheel job order form
                    </p>
                  </div>
                  <img
                    className="w-full h-32 object-contain drop-shadow-md"
                    src="https://imgs.search.brave.com/TcyJNPj5qwOkLO2io86o9qlohZBINWQNBLAEQiA3zgI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjcv/NjE2LzEyMC9zbWFs/bC9yZXRyby1zdHls/ZS1vcmFuZ2UtYW5k/LXdoaXRlLW1vdG9y/Y3ljbGUtaWxsdXN0/cmF0aW9uLXdpdGgt/ZGV0YWlsZWQtZGVz/aWduLXBuZy5wbmc"
                    alt="Motorcycle"
                  />
                  <span className="w-full text-center text-sm font-semibold text-blue-600 bg-blue-100 group-hover:bg-blue-500 group-hover:text-white py-2 rounded-lg transition-all duration-300">
                    Select Motorcycle →
                  </span>
                </div>
              </div>
            </Link>
            <Link href="/trimotors-job-order-form" className="group">
              <div className="relative overflow-hidden rounded-2xl border-2 border-transparent group-hover:border-indigo-400 bg-linear-to-br from-indigo-50 to-indigo-100 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                <div className="p-6 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-indigo-500 group-hover:bg-indigo-600 flex items-center justify-center shadow-md transition-colors duration-300">
                    <CarFrontIcon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      Trimotors
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      3-wheel job order form
                    </p>
                  </div>
                  <img
                    className="w-full h-32 object-contain drop-shadow-md"
                    src="https://imgs.search.brave.com/1twD8b623YwlPd4oPNGMpMe37x0othacsDiDj8EXnwA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZHBtY28uY29tL3B1/YmxpYy9pbWFnZXMv/cHJvZHVjdC9icmFu/ZC1uZXctYmFqYWot/cmUucG5n"
                    alt="Trimotors"
                  />
                  <span className="w-full text-center text-sm font-semibold text-indigo-600 bg-indigo-100 group-hover:bg-indigo-500 group-hover:text-white py-2 rounded-lg transition-all duration-300">
                    Select Trimotors →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={isOpen} className="w-5xl" ref={modalRef}>
        <ModalHeader onClose={handleView(null)}>
          Viewing {viewData?.customer.name}&apos;s Job Order
        </ModalHeader>
        <ModalBody>
          <PreviewData data={viewData} />
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white py-5"
            type="button"
            onClick={handleView(null)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isExport} className="w-md">
        <ModalHeader onClose={handleViewExport}>
          Filter Date and Export
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="button"
            className={`bg-green-500 py-5 hover:bg-green-600 text-white ${isExporting || !date?.from || !date?.to ? "cursor-not-allowed!" : ""}`}
            onClick={handleExport}
            disabled={isExporting || !date?.from || !date?.to}
          >
            {isExporting ? (
              <>
                <FaCircleNotch className="animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <FaCheckCircle /> Proceed
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withAuthPage(Dashboard);
