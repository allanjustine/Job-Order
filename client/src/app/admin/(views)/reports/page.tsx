"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import { api } from "@/lib/api";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { format, formatDistanceToNowStrict } from "date-fns";
import { CircleX, Eye, Search, SearchSlash, User } from "lucide-react";
import { Activity, useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import {
  FaCircleNotch,
  FaFileExcel,
  FaMagnifyingGlass,
  FaRotateRight,
} from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { DatePickerWithRange } from "@/components/date-picker.with-range";
import { DateRange } from "react-day-picker";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import ViewJobOrder from "@/components/view-job-order";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const FILTER_DATA = {
  branch: "",
  area_manager: "",
  date_range: `${format(new Date(), "yyyy-MM-dd")}, ${format(new Date(), "yyyy-MM-dd")}`,
  job_order_type: "",
};

export type filterDataType = {
  branch: string;
  area_manager: string;
  date_range: string;
  job_order_type: string;
};

const Reports = () => {
  const [filterItems, setFilterItems] = useState<filterDataType>(FILTER_DATA);
  const {
    data: reports,
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
    defaultSearch,
    setDefaultSearch,
    setSearchTerm,
    fetchData,
    setIsRefresh,
  } = useFetch(`/reports`, {
    filterItems,
  });
  const [branches, setBranches] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [viewData, setViewData] = useState<any>(null);
  const [isBrowsing, setIsBrowsing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const HAS_FILTER_APPLIED =
    Object.values(filterItems)?.some((value) => value !== "") ||
    searchTerm !== "";

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

  function handleDeleteJobOrder(id: number) {
    return function () {
      Swal.fire({
        title: "Are you sure?",
        text: "After cancelling, you will not be able to uncancel this data!",
        icon: "warning",
        input: "text",
        inputPlaceholder: "Enter reason for cancellation",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
        inputValidator: (value) => {
          if (!value) {
            return "Please enter a cancellation reason!";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reason = result.value;

          Swal.fire({
            icon: "info",
            title: "Cancelling...",
            text: "Please wait...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          try {
            const response = await api.delete(`/delete-job-order/${id}`, {
              data: {
                reason,
              },
            });

            if (response.status === 200) {
              toast.success(response.data.message, {
                position: "bottom-center",
                duration: 5000,
                icon: "👍",
                style: {
                  borderRadius: "15px",
                  background: "#333",
                  color: "#fff",
                  padding: "15px",
                },
              });
              Swal.close();
              fetchData();
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Please try again!",
            });
          }
        }
      });
    };
  }

  const handleView = (id: number) => async () => {
    setIsOpen(true);
    setIsBrowsing(true);
    try {
      const response = await api.get(`/job-orders/${id}/browse`);
      if (response.status === 200) {
        setViewData(response?.data?.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsBrowsing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesResponse, areaManagersResponse] = await Promise.all([
          api.get("/user-selection-options"),
          api.get("/area-manager-selection-options"),
        ]);
        if (
          branchesResponse.status === 200 ||
          areaManagersResponse.status === 200
        ) {
          setBranches(branchesResponse.data.data);
          setAreaManagers(areaManagersResponse.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!date?.from || !date?.to) return;

    setFilterItems((prev) => ({
      ...prev,
      date_range: `${format(date?.from || new Date(), "yyyy-MM-dd")}, ${format(date?.to || new Date(), "yyyy-MM-dd")}`,
    }));
  }, [date?.from, date?.to]);

  const columns = [
    {
      name: "JO NUMBER",
      selector: (row: any) => row.job_order_number,

      sortable: true,
      sortField: "job_order_number",
    },
    {
      name: "BRANCH NAME",
      cell: (row: any) => (
        <div>
          {row.customer.user.name}{" "}
          <span className="font-bold text-gray-600">
            ({row.customer.user.code})
          </span>
        </div>
      ),
      sortable: true,
      sortField: "customer.user.name",
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
      name: "TOTAL JOB REQUEST",
      cell: (row: any) => (
        <span className="py-1 px-2 rounded-full font-bold bg-blue-400 text-white">
          {row.job_order_details_count}
        </span>
      ),
      sortable: true,
      sortField: "job_order_details_count",
    },
    {
      name: "DATE",
      cell: (row: any) => (
        <>
          <div className="flex flex-col">
            <span className="text-sm">{format(row.date, "MMM dd, yyyy")}</span>
            <span className="text-gray-500 text-xs font-bold">
              {formatDistanceToNowStrict(row.date, { addSuffix: true })}
            </span>
          </div>
        </>
      ),
      sortable: true,
      sortField: "date",
    },
    {
      name: "ACTIONS",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleView(row.id)}
            className="p-2 bg-blue-500 text-white"
            ref={buttonRef}
          >
            <Eye /> View
          </Button>
          <HoverCard>
            <HoverCardTrigger>
              <Button
                type="button"
                onClick={handleDeleteJobOrder(row?.id)}
                disabled={row.status}
                className={`p-2 ${
                  row.status
                    ? "bg-gray-200 cursor-not-allowed text-red-600"
                    : "bg-red-500 text-white"
                }`}
              >
                <CircleX /> {row.status ? "Canceled" : "Cancel"}
              </Button>
            </HoverCardTrigger>
            {row.status && (
              <HoverCardContent side={"left"}>
                <div className="flex flex-col gap-1">
                  <h4 className="font-medium">Reason</h4>
                  <p>{row.reason_for_cancellation || "N/A"}</p>
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
        </div>
      ),
    },
  ];

  const options = [
    { value: "all", label: "All" },
    { value: "search", label: "Search" },
    { value: "branch", label: "Branch" },
    { value: "area_manager", label: "Area Manager" },
    { value: "date", label: "Date" },
    { value: "job_order_type", label: "Job Order Type" },
    { value: "job_order_detail_type", label: "Job Order Detail Type" },
  ];

  const handleFilterItems = (title: string) => (e: any) => {
    const { value } = e.target;
    setFilterItems((prev) => ({
      ...prev,
      [title]: value,
    }));
    setIsRefresh(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/export-reports", {
        params: {
          ...filterItems,
          search: searchTerm,
        },
      });

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

        let item: any = {};

        if (filterItems.branch) {
          item.branch = branches.find(
            (branch: any) => branch.id === Number(filterItems.branch),
          );
        }

        if (filterItems.area_manager) {
          item.area_manager = areaManagers.find(
            (areaManager: any) =>
              areaManager.id === Number(filterItems.area_manager),
          );
        }

        const fileName = `${filterItems.branch && `branch-${item?.branch?.name}-`}${filterItems.area_manager && `area-manager-${item?.area_manager?.name}-`}${filterItems.date_range && `date-${filterItems.date_range}-`}${filterItems.job_order_type && `job-order-type-${filterItems.job_order_type}-`}reports.xlsx`;

        const saveFileName = !HAS_FILTER_APPLIED
          ? "all-data-of-job-request-reports.xlsx"
          : fileName;

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
      <div className="p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Filter, view, and export job order reports
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="search"
              >
                Search
              </Label>
              <div className="relative">
                <Input
                  value={defaultSearch}
                  type="search"
                  placeholder="Search..."
                  onChange={handleSearch}
                  className="h-10 rounded-lg border-gray-200 pl-9 text-sm"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="branch"
              >
                Branch
              </Label>
              {isDataLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={filterItems.branch}
                  onChange={handleFilterItems("branch")}
                  className="h-10 rounded-lg border-gray-200 text-sm"
                >
                  <option value="" disabled>
                    Select branch
                  </option>
                  {branches.map((branch: any) => (
                    <option
                      key={branch.id}
                      value={branch.id}
                    >{`(${branch.code}) - ${branch.name}`}</option>
                  ))}
                </Select>
              )}
            </div>
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="area_manager"
              >
                Area Manager
              </Label>
              {isDataLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={filterItems.area_manager}
                  onChange={handleFilterItems("area_manager")}
                  className="h-10 rounded-lg border-gray-200 text-sm"
                >
                  <option value="" disabled>
                    Select area manager
                  </option>
                  {areaManagers.map((areaManager: any) => (
                    <option key={areaManager.id} value={areaManager.id}>
                      {areaManager.name}
                    </option>
                  ))}
                </Select>
              )}
            </div>
            <div className="w-full">
              <Label className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Date Range
              </Label>
              <DatePickerWithRange
                date={date}
                setDate={setDate}
                setIsRefresh={setIsRefresh}
              />
            </div>
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="order_type"
              >
                Job Order Type
              </Label>
              <Select
                value={filterItems.job_order_type}
                onChange={handleFilterItems("job_order_type")}
                className="h-10 rounded-lg border-gray-200 text-sm"
              >
                <option value="" disabled>
                  Select order type
                </option>
                <option value="motors">Motors</option>
                <option value="trimotors">Trimotors</option>
              </Select>
            </div>
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="reset"
              >
                Reset Filters
              </Label>
              <Button
                type="button"
                onClick={() => {
                  setFilterItems(FILTER_DATA);
                  setDate({ from: new Date(), to: new Date() });
                  setSearchTerm("");
                  setDefaultSearch("");
                  setIsRefresh(true);
                }}
                disabled={!HAS_FILTER_APPLIED}
                className="h-10 rounded-lg border-gray-200 text-sm w-full bg-gray-600 hover:bg-gray-500 text-white"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                Job Order Reports
              </h2>
              <p className="text-xs text-gray-400">
                {pagination.total > 0
                  ? `${pagination.total} record${pagination.total !== 1 ? "s" : ""} found`
                  : "No records found"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                disabled={isRefresh}
                className={`bg-blue-500 hover:bg-blue-400 text-white py-5 ${
                  isRefresh && "opacity-60 cursor-not-allowed!"
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
                  (filterItems || searchTerm) &&
                  !isRefresh &&
                  !isLoading &&
                  reports.length > 0
                    ? "visible"
                    : "hidden"
                }
              >
                <Button
                  type="button"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white py-5"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <FaCircleNotch className="animate-spin" /> Exporting...
                    </>
                  ) : (
                    <>
                      <FaFileExcel /> Export to Excel
                    </>
                  )}
                </Button>
              </Activity>
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={reports}
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
                <div className="py-8 text-sm text-gray-500 flex items-center justify-center gap-2">
                  {isSearching ? (
                    <>
                      <FaMagnifyingGlass className="animate-ping" /> Searching{" "}
                      {searchTerm && `"${searchTerm}"`}...
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
                <div className="py-10 text-gray-400 text-sm flex flex-col items-center gap-2">
                  {searchTerm ? (
                    <>
                      <SearchSlash className="w-8 h-8" />
                      <span>No results for "{searchTerm}"</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-8 h-8" />
                      <span>No reports found. Try adjusting your filters.</span>
                    </>
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} className="w-3xl" ref={modalRef}>
        <ModalHeader
          onClose={() => {
            setIsOpen(false);
            setViewData(null);
          }}
        >
          Viewing {viewData?.customer.name}&apos;s Job Order
          {viewData?.job_order_type && (
            <span
              className={`ml-2 text-xs font-bold px-2 py-1 rounded ${
                viewData.job_order_type === "trimotors"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {viewData.job_order_type.toUpperCase()}
            </span>
          )}
        </ModalHeader>
        <ModalBody>
          {isBrowsing ? (
            <div className="flex flex-col gap-2">
              <div className="space-y-2">
                <Skeleton className="w-1/8 h-6" />
                <Skeleton className="w-2/6 h-6" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-full h-45" />
                <Skeleton className="w-full h-45" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-11/12 h-6" />
                <Skeleton className="w-6/12 h-6" />
              </div>
            </div>
          ) : (
            <ViewJobOrder data={viewData} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white py-5"
            type="button"
            onClick={() => {
              setIsOpen(false);
              setViewData(null);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default withAuthPage(Reports);
