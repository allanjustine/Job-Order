"use client";

import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import {
  PhilippinePeso,
  PillBottleIcon,
  Printer,
  Search,
  SearchSlash,
  Wrench,
  CarFrontIcon,
  BikeIcon,
  LogOut,
} from "lucide-react";
import { FaCircleNotch, FaEye } from "react-icons/fa";
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
    { category: string; amount: number }[]
  >([]);
  const [mechanicAdded, setMechanicAdded] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, handleLogout: handleLogoutUser } = useAuth();
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
        },
      });

      if (response.data.data.length === 0) {
        return toast.error("Export failed! No data to export this month", {
          position: "bottom-center",
          duration: 5000,
          icon: "😒",
          style: {
            borderRadius: "15px",
            background: "red",
            color: "#fff",
            padding: "15px",
          },
        });
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

        let item: any;

        const now = new Date();

        const monthName = now.toLocaleString("en-US", { month: "long" });

        const monthOfAndYear = `Month of ${monthName} ${now.getFullYear()}`;

        const saveFileName = searchTerm
          ? `${searchTerm}-${monthOfAndYear}.xlsx`
          : `${monthOfAndYear}-Reports.xlsx`;

        saveAs(blob, saveFileName);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Welcome Card with Buttons and Picture Space */}
        <div className="mb-8">
          <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side: Welcome text and buttons */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to Job Order System, {user?.name.toUpperCase()}
                </h1>
                <p className="text-blue-100 opacity-90 mb-6">
                  Manage and track all job orders efficiently. Create new job
                  orders or view existing ones.
                </p>

                {/* Single Button with Dropdown */}
                <div ref={dropdownRef} className="relative inline-block">
                  {/* <Button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-5 h-5" />
                    Create Job Order
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button> */}
                  <Button
                    type="button"
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </Button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full min-w-55 bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-gray-200">
                      <button
                        onClick={() => handleDropdownSelect("motorcycle")}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-3 transition-colors"
                      >
                        <BikeIcon className="w-4 h-4 text-blue-600" />
                        Motorcycle Job Order Form
                      </button>

                      <div className="border-t border-gray-200"></div>

                      <button
                        onClick={() => handleDropdownSelect("trimotors")}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-3 transition-colors"
                      >
                        <CarFrontIcon className="w-4 h-4 text-blue-600" />
                        Trimotors Job Order Form
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}

        <StatCards
          spinner={spinner}
          setIsMechanicOpen={setIsMechanicOpen}
          isMechanicOpen={isMechanicOpen}
          mechanicAdded={mechanicAdded}
          setTopJobOrders={setTopJobOrders}
        />

        {/* Data Table Section */}
        <Activity mode={!isMechanicOpen ? "visible" : "hidden"}>
          <div className="mt-10 space-y-3 flex flex-col">
            <Button
              type="button"
              ref={createButtonRef}
              onClick={handleOpenCreate}
              className="bg-blue-500 hover:bg-blue-600 text-white self-end font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Wrench className="w-5 h-5" /> Create Job Order
            </Button>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-2">
                <div className="">
                  <div className="mb-2 flex justify-end gap-1">
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
                          <FaCircleNotch className="animate-spin" />{" "}
                          Refreshing...
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
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        onClick={handleExport}
                        disabled={isExporting}
                      >
                        {isExporting ? (
                          <>
                            <FaCircleNotch className="animate-spin" />{" "}
                            Exporting...
                          </>
                        ) : (
                          <>
                            <FaFileExcel /> Export
                          </>
                        )}
                      </Button>
                    </Activity>
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
                              <FaMagnifyingGlass className="animate-ping" />{" "}
                              Searching{" "}
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
                <div className="p-5 border-gray-300 border-dashed border rounded-md h-fit">
                  <div className="text-center text-lg font-bold text-gray-500 mb-3">
                    Most Job Request & Parts Replacement
                  </div>
                  <div className="flex flex-col space-y-2">
                    {isLoading ? (
                      <>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div
                            className="w-full p-5 rounded-lg bg-slate-200 h-15 flex justify-between items-center animate-pulse"
                            key={index}
                            style={{ animationDelay: `${index * 0.2}s` }}
                          ></div>
                        ))}
                      </>
                    ) : (
                      <>
                        {topJobOrders.length > 0 ? (
                          topJobOrders.map(
                            (
                              {
                                category,
                                amount,
                              }: {
                                category: string;
                                amount: number;
                              },
                              index: number,
                            ) => (
                              <div
                                className="w-full p-5 rounded-lg bg-blue-200 h-15 flex justify-between items-center"
                                key={index}
                              >
                                <span className="text-gray-500 font-semibold">
                                  {category}
                                </span>
                                <span className="text-lg font-bold text-gray-800">
                                  {phpCurrency(amount)}
                                </span>
                              </div>
                            ),
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
        </Activity>
        <Activity mode={isMechanicOpen ? "visible" : "hidden"}>
          <div className="flex justify-end mr-5">
            <Button
              onClick={() => setIsMechanicOpen(false)}
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Close Mechanics
            </Button>
          </div>
          <Mechanics
            setMechanicAdded={setMechanicAdded}
            mechanicAdded={mechanicAdded}
          />
        </Activity>
      </div>

      <Modal isOpen={isOpenCreate} className="w-5xl" ref={createRef}>
        <ModalHeader
          onClose={handleOpenCreate}
          centerText
          className="text-2xl font-bold"
        >
          Choose a Service
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-2">
            <Link href="/motors-job-order-form" className="w-1/2 group">
              <div className="w-full h-[40vh] bg-gray-100 p-5 hover:bg-gray-200 rounded-lg">
                <p className="text-6xl font-extrabold text-blue-500 text-center group-hover:underline transition-all duration-300 ease-in-out">
                  Motors
                </p>
                <img
                  className="w-full h-[90%]"
                  src="https://imgs.search.brave.com/TcyJNPj5qwOkLO2io86o9qlohZBINWQNBLAEQiA3zgI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjcv/NjE2LzEyMC9zbWFs/bC9yZXRyby1zdHls/ZS1vcmFuZ2UtYW5k/LXdoaXRlLW1vdG9y/Y3ljbGUtaWxsdXN0/cmF0aW9uLXdpdGgt/ZGV0YWlsZWQtZGVz/aWduLXBuZy5wbmc"
                  alt="Motors"
                />
              </div>
            </Link>
            <Link href="/trimotors-job-order-form" className="w-1/2 group">
              <div className="w-full h-[40vh] bg-gray-100 p-5 hover:bg-gray-200 rounded-lg">
                <p className="text-6xl font-extrabold text-blue-500 text-center group-hover:underline transition-all duration-300 ease-in-out">
                  Trimotors
                </p>
                <img
                  className="w-full h-[90%]"
                  src="https://imgs.search.brave.com/1twD8b623YwlPd4oPNGMpMe37x0othacsDiDj8EXnwA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZHBtY28uY29tL3B1/YmxpYy9pbWFnZXMv/cHJvZHVjdC9icmFu/ZC1uZXctYmFqYWot/cmUucG5n"
                  alt="Trimotors"
                />
              </div>
            </Link>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white"
            type="button"
            onClick={handleOpenCreate}
          >
            Cancel
          </Button>
        </ModalFooter>
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
