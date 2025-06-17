"use client";

import useFetch from "@/hooks/useFetch";
import {
  Calendar,
  Clock,
  Home,
  PhilippinePeso,
  PillBottleIcon,
  Printer,
  Search,
  SearchSlash,
  Wrench,
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
  const [viewData, setViewData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const columns = [
    {
      name: "ID",
      sortable: true,
      selector: (row: any) => row.id,
      sortField: "id",
      width: "80px",
    },
    {
      name: "BRANCH",
      selector: (row: any) => row.customer?.user?.branch?.branch_name,
    },
    {
      name: "CHASSIS",
      sortable: true,
      selector: (row: any) => row.chassis,
      sortField: "chassis",
    },
    {
      name: "TYPE OF JOB",
      sortable: true,
      cell: (row: { type_of_job: keyof typeof TYPE_OF_JOB }) => (
        <span
          className={`rounded-full px-2.5 py-0.5 font-medium 
          ${
            row.type_of_job === "wc"
              ? "bg-green-100 text-green-700"
              : row.type_of_job === "pms"
              ? "bg-blue-100  text-blue-700"
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
      name: "SERVICE ADVISOR",
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
      <div>
        <CgSpinner className="animate-spin" />
      </div>
    );
  };

  const stats = [
    {
      label: "Today's Prints",
      value: isLoading ? spinner() : data.todaysPrints,
      icon: Clock,
      color: "from-green-500 to-green-400",
    },
    {
      label: "Weekly Prints",
      value: isLoading ? spinner() : data.weeklyPrints,
      icon: Calendar,
      color: "from-purple-500 to-purple-400",
    },
    {
      label: "Monthly Prints",
      value: isLoading ? spinner() : data.monthlyPrints,
      icon: Calendar,
      color: "from-orange-500 to-orange-400",
    },
    {
      label: "Branch Printed Records",
      value: isLoading ? spinner() : data.totalBranchPrintedRecords,
      icon: Home,
      color: "from-indigo-500 to-indigo-400",
    },
    {
      label: "Total Labor",
      value: isLoading ? spinner() : data.totalLabor,
      icon: Wrench,
      color: "from-emerald-500 to-emerald-400",
    },
    {
      label: "Total Parts & Lubricants",
      value: isLoading ? spinner() : data.totalPartsLubricants,
      icon: PillBottleIcon,
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
                  {isLoading ? spinner() : cardData.total_job_orders}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 shadow-md">
                <Printer className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="absolute z-10 top-full left-0 mt-2 w-56 p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              <p>
                <span className="font-medium">PMS:</span> {isLoading ? spinner() : cardData.total_pms}
              </p>
              <p>
                <span className="font-medium">Repair:</span> {isLoading ? spinner() : cardData.total_rr}
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
                <span className="font-medium">PMS:</span> {isLoading ? spinner() : data.pmsAmount}
              </p>
              <p>
                <span className="font-medium">Repair:</span> {isLoading ? spinner() : data.repairAmount}
              </p>
              <p>
                <span className="font-medium">Warranty Claim:</span>{" "}
                {isLoading ? spinner() : data.warrantyClaimAmount}
              </p>
            </div>
          </div>
        </div>

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
        <ModalHeader onClose={handleView(null)}>Job Order Header</ModalHeader>
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
