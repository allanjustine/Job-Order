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
import { Search, SearchSlash, Trash, User } from "lucide-react";
import { Activity, ChangeEvent, useEffect, useState } from "react";
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

const Reports = () => {
  const [filterItem, setFilterItem] = useState<string | undefined>("");
  const [filterBy, setFilterBy] = useState("all");
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
  } = useFetch(`/reports`, {
    filterItem,
    filterBy,
  });
  const [branches, setBranches] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  function handleDeleteJobOrder(id: number) {
    return function () {
      Swal.fire({
        title: "Are you sure?",
        text: "After cancelling, you will not be able to uncancel this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
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
            const response = await api.delete(`/delete-job-order/${id}`);

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
    if (filterBy !== "date" || !date?.from || !date?.to) return;

    setFilterItem(
      `${format(date?.from, "yyyy-MM-dd")}, ${format(date?.to, "yyyy-MM-dd")}`,
    );
  }, [date?.from, date?.to, filterBy]);

  useEffect(() => {
    if (filterBy === "all") {
      handleRefresh();
      setFilterItem("all");
    }
    setDefaultSearch("");
    setSearchTerm("");
  }, [filterBy]);

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
      name: "CREATED AT",
      cell: (row: any) => (
        <>
          <div className="flex flex-col">
            <span className="text-sm">
              {format(row.created_at, "MMM dd, yyyy hh:mm a")}
            </span>
            <span className="text-gray-500 text-xs font-bold">
              {formatDistanceToNowStrict(row.created_at, { addSuffix: true })}
            </span>
          </div>
        </>
      ),
      sortable: true,
      sortField: "created_at",
    },
    {
      name: "ACTIONS",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleDeleteJobOrder(row?.id)}
            disabled={row.status}
            className={`px-10 py-2 ${
              row.status
                ? "bg-gray-200 cursor-not-allowed text-red-600"
                : "bg-red-500 text-white"
            }`}
          >
            {row.status ? "Cancelled" : "Cancel"}
          </Button>
        </div>
      ),
    },
  ];

  const handleSelectFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value !== "all") {
      setFilterItem("");
    }

    setFilterBy(value);
  };

  const options = [
    { value: "all", label: "All" },
    { value: "search", label: "Search" },
    { value: "branch", label: "Branch" },
    { value: "area_manager", label: "Area Manager" },
    { value: "date", label: "Date" },
    { value: "job_order_type", label: "Job Order Type" },
    { value: "job_order_detail_type", label: "Job Order Detail Type" },
  ];

  const handleFilterItem = (e: any) => {
    const { value } = e.target;
    setFilterItem(value);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/export-reports", {
        params: {
          filter_item: filterItem,
          filter_by: filterBy,
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

        let item: any;

        if (filterBy === "branch") {
          item = branches.find(
            (branch: any) => branch.id === Number(filterItem),
          );
        } else if (filterBy === "area_manager") {
          item = areaManagers.find(
            (areaManager: any) => areaManager.id === Number(filterItem),
          );
        }

        const saveFileName =
          filterBy === "all"
            ? "all-data-of-job-request-reports.xlsx"
            : filterBy === "job_order_detail_type" ||
                filterBy === "job_order_type"
              ? `${filterBy}-(${filterItem})-data-of-job-request-reports.xlsx`
              : filterBy === "branch"
                ? `${filterBy}-(${item?.code})-${item?.name}-data-of-job-request-reports.xlsx`
                : filterBy === "search"
                  ? `${filterBy}-(${searchTerm?.toLowerCase()})-data-of-job-request-reports.xlsx`
                  : filterBy === "date"
                    ? date?.from &&
                      date?.to &&
                      `${filterBy}-(${format(date?.from, "LLL dd, y")} - ${format(date?.to, "LLL dd, y")})-data-of-job-request-reports.xlsx`
                    : filterBy === "area_manager"
                      ? `${filterBy}-${item?.name}-data-of-job-request-reports.xlsx`
                      : `reports.xlsx`;

        saveAs(blob, saveFileName);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const activeFilterLabel = options.find((o) => o.value === filterBy)?.label;

  return (
    <>
      <div className="p-6 space-y-5">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Filter, view, and export job order reports
          </p>
        </div>

        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              <h2 className="text-sm font-semibold text-gray-700">Filters</h2>
            </div>
            {filterBy !== "all" && (
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full border border-blue-100">
                Active: {activeFilterLabel}
              </span>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="w-full">
              <Label
                className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                htmlFor="filter_type"
              >
                Filter by
              </Label>
              <Select
                disabled={isDataLoading}
                value={filterBy}
                onChange={handleSelectFilter}
                className="h-10 rounded-lg border-gray-200 text-sm"
              >
                <option value="" disabled>
                  Select filter type
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <Activity mode={filterBy === "search" ? "visible" : "hidden"}>
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
            </Activity>

            <Activity mode={filterBy === "branch" ? "visible" : "hidden"}>
              <div className="w-full">
                <Label
                  className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  htmlFor="branch"
                >
                  Branch
                </Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
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
              </div>
            </Activity>

            <Activity mode={filterBy === "area_manager" ? "visible" : "hidden"}>
              <div className="w-full">
                <Label
                  className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  htmlFor="area_manager"
                >
                  Area Manager
                </Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
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
              </div>
            </Activity>

            <Activity mode={filterBy === "date" ? "visible" : "hidden"}>
              <div className="w-full">
                <Label className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Date Range
                </Label>
                <DatePickerWithRange date={date} setDate={setDate} />
              </div>
            </Activity>

            <Activity
              mode={filterBy === "job_order_detail_type" ? "visible" : "hidden"}
            >
              <div className="w-full">
                <Label
                  className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  htmlFor="detail_type"
                >
                  Job Order Detail Type
                </Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-10 rounded-lg border-gray-200 text-sm"
                >
                  <option value="" disabled>
                    Select detail type
                  </option>
                  <option value="job_request">Job Request</option>
                  <option value="parts_replacement">Parts Replacement</option>
                </Select>
              </div>
            </Activity>

            <Activity
              mode={filterBy === "job_order_type" ? "visible" : "hidden"}
            >
              <div className="w-full">
                <Label
                  className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  htmlFor="order_type"
                >
                  Job Order Type
                </Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-10 rounded-lg border-gray-200 text-sm"
                >
                  <option value="" disabled>
                    Select order type
                  </option>
                  <option value="motors">Motors</option>
                  <option value="trimotors">Trimotors</option>
                </Select>
              </div>
            </Activity>
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
                  filterBy &&
                  (filterItem || searchTerm) &&
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
    </>
  );
};

export default withAuthPage(Reports);
