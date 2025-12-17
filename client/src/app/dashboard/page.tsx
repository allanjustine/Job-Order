"use client";

import useFetch from "@/hooks/useFetch";
import { useRouter } from 'next/navigation';
import {
  PhilippinePeso,
  PillBottleIcon,
  Printer,
  Search,
  SearchSlash,
  Wrench,
  ChevronDown,
  CarFrontIcon,
  BikeIcon,
} from "lucide-react";
import { FaCircleNotch, FaEdit, FaEye, FaTrash } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import { TYPE_OF_JOB } from "@/constants/typeOfJob";
import Button from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import PreviewData from "@/components/PreviewData";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/ui/input";
import authenticatedPage from "@/lib/hoc/authenticatedPage";
import { FaMagnifyingGlass, FaRotateRight } from "react-icons/fa6";
import phpCurrency from "@/utils/phpCurrency";
import { CgSpinner } from "react-icons/cg";
import { format, formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleDropdownSelect = (type: string) => {
    if (type === 'motorcycle') {
      router.push("/job-order-form");
    } else if (type === 'trimotors') {
      router.push("/trimotors-job-order-form");
    }
    setIsDropdownOpen(false);
  };

  const columns = [
    {
      name: "JO NUMBER",
      sortable: true,
      selector: (row: any) => row.id,
      sortField: "id",
    },
    {
      name: "BRANCH",
      selector: (row: any) => row.customer?.user?.branch?.branch_name,
    },
    {
      name: "CUSTOMER NAME",
      sortable: true,
      selector: (row: any) => row.customer_name,
      sortField: "customer_name",
    },
    {
      name: "TYPE OF JOB",
      sortable: true,
      cell: (row: { type_of_job: keyof typeof TYPE_OF_JOB }) => (
        <span
          className={`rounded-full px-2.5 py-0.5 font-medium 
          ${
            row.type_of_job === "coupon"
              ? "bg-green-100 text-green-700"
              : row.type_of_job === "changeOil"
              ? "bg-blue-100  text-blue-700"
              : row.type_of_job === "overhaul"
              ? "bg-blue-100  text-violet-700"
              : "bg-orange-100 text-orange-700"
          }
        `}
        >
          {TYPE_OF_JOB[row.type_of_job]}
        </span>
      ),
      sortField: "type_of_job",
    },
    {
      name: "MECHANIC",
      sortable: true,
      selector: (row: any) => row.service_advisor,
      sortField: "service_advisor",
    },
    {
      name: "TOTAL AMOUNT",
      selector: (row: any) => (
        <span className="font-bold text-md text-gray-600">
          {phpCurrency(
            row.job_requests.reduce(
              (sum: any, item: any) => sum + item.cost,
              0
            ) +
              row.parts_requests.reduce(
                (sum: any, item: any) => sum + item.sub_total_price,
                0
              )
          )}
        </span>
      ),
    },
    {
      name: "PRINTED ON",
      cell: (row: any) => (
        <div>
          <p>{format(row.created_at, "MMM dd, yyyy hh:mm a")}</p>
          <span className="text-xs font-semibold">
            {formatDistanceToNowStrict(row.created_at, {
              addSuffix: true,
            })}
          </span>
        </div>
      ),
      sortField: "created_at",
      sortable: true,
    },
    {
      name: "ACTION",
      cell: (row: any) => (
        <div className="flex gap-1">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleView(row)}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
          >
            <FaEye />
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          >
            <FaEdit />
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: "130px",
    },
  ];

  const handleView = (row: any) => () => {
    setIsOpen(!isOpen);
    setViewData(row);
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

  const stats = [
    {
      label: "Monthly Target Income",
      value: isLoading ? spinner() : data.totalLabor,
      icon: Wrench,
      color: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Monthly Shop Income",
      value: isLoading ? spinner() : data.totalPartsLubricants,
      icon: PillBottleIcon,
      color: "from-rose-500 to-rose-400",
    },
  ];

  const router = useRouter();

  return (
    <>
      <div className="p-6">
        {/* Welcome Card with Buttons and Picture Space */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side: Welcome text and buttons */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to Job Order System
                </h1>
                <p className="text-blue-100 opacity-90 mb-6">
                  Manage and track all job orders efficiently. Create new job orders or view existing ones.
                </p>
                
                {/* Single Button with Dropdown */}
                <div ref={dropdownRef} className="relative inline-block">
                  <Button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-5 h-5" />
                    Create Job Order
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full min-w-[220px] bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-gray-200">
                      <button
                        onClick={() => handleDropdownSelect('motorcycle')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-800 font-medium flex items-center gap-3 transition-colors"
                      >
                        <BikeIcon className="w-4 h-4 text-blue-600" />
                        Motorcycle Job Order Form
                      </button>
                      
                      <div className="border-t border-gray-200"></div>
                      
                      <button
                        onClick={() => handleDropdownSelect('trimotors')}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Total Job Prints
                </p>
                <p className="text-2xl font-semibold text-gray-800">
                  {isLoading ? spinner() : cardData.total_job_orders}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 shadow-md">
                <Printer className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="absolute z-10 top-full left-0 mt-2 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <p>
                <span className="font-medium">PMS:</span>{" "}
                {isLoading ? spinner() : cardData.total_pms}
              </p>
              <p>
                <span className="font-medium">Repair:</span>{" "}
                {isLoading ? spinner() : cardData.total_rr}
              </p>
              <p>
                <span className="font-medium">Warranty Claim:</span>{" "}
                {isLoading ? spinner() : cardData.total_wc}
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
                    className={`p-3 rounded-lg bg-gradient-to-br ${item.color} shadow-md`}
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
                  {isLoading ? spinner() : data.totalOverAllAmount}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-amber-400 shadow-md">
                <PhilippinePeso className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="absolute z-10 top-full left-0 mt-2 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
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
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="mb-2 flex justify-end">
            <Button
              type="button"
              disabled={isRefresh}
              className={`bg-blue-500 hover:bg-blue-400 text-white p-2 ${
                isRefresh && "!bg-blue-400 !cursor-not-allowed"
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
      </div>

      <Modal isOpen={isOpen} className="w-5xl" ref={modalRef}>
        <ModalHeader onClose={handleView(null)}>Viewing {viewData?.customer.name}&apos;s Job Order</ModalHeader>
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

export default authenticatedPage(Dashboard);