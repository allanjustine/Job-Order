"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import { api } from "@/lib/api";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Search, SearchSlash } from "lucide-react";
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

const Reports = () => {
  const [filterItem, setFilterItem] = useState<string>("");
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
  } = useFetch(`/reports`, {
    filterItem,
    filterBy,
  });
  const [branches, setBranches] = useState([]);
  const [areaManagers, setAreaManagers] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

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
      name: "MECHANIC NAME",
      selector: (row: any) => row.mechanic.name,
      sortable: true,
      sortField: "mechanic.name",
    },
    {
      name: "JOB FORM",
      selector: (row: any) => (
        <span className="uppercase font-bold text-gray-500">
          {row.job_order_type}
        </span>
      ),
      sortable: true,
      sortField: "job_order_type",
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
                ? `${filterBy}-(${filterItem})-data-of-job-request-reports.xlsx`
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

  return (
    <>
      <div className="p-6 space-y-2">
        <div className="p-5 border border-gray-300 shadow-lg bg-white rounded-lg space-y-5">
          <h1 className="text-2xl font-semibold text-gray-600">Filter</h1>
          <div className="grid gap-2 grid-cols-2">
            <div className="w-full">
              <Label htmlFor="filter_type">Filter by</Label>
              <Select
                disabled={isDataLoading}
                value={filterBy}
                onChange={handleSelectFilter}
                className="h-12"
              >
                <option value="" disabled>
                  {" "}
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
                <Label htmlFor="search">Search</Label>
                <div className="relative w-full">
                  <Input
                    value={defaultSearch}
                    type="search"
                    placeholder="Search..."
                    onChange={handleSearch}
                    className="w-full border border-gray-300 h-12 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            </Activity>
            <Activity mode={filterBy === "branch" ? "visible" : "hidden"}>
              <div className="w-full">
                <Label htmlFor="branch">Filter by Branch</Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-12"
                >
                  <option value="" disabled>
                    {" "}
                    Select branch
                  </option>
                  {branches.map((branch: any) => (
                    <option key={branch.id} value={branch.id}>
                      {`(${branch.code}) - ${branch.name}`}
                    </option>
                  ))}
                </Select>
              </div>
            </Activity>
            <Activity mode={filterBy === "area_manager" ? "visible" : "hidden"}>
              <div className="w-full">
                <Label htmlFor="area_manager">Filter by Area Manager</Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-12"
                >
                  <option value="" disabled>
                    {" "}
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
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-12"
                />
              </div>
            </Activity>
            <Activity
              mode={filterBy === "job_order_detail_type" ? "visible" : "hidden"}
            >
              <div className="w-full">
                <Label htmlFor="branch">Filter by Job Order Detail Type</Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-12"
                >
                  <option value="" disabled>
                    {" "}
                    Select job order detail type
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
                <Label htmlFor="branch">Filter by Job Order Type</Label>
                <Select
                  value={filterItem}
                  onChange={handleFilterItem}
                  className="h-12"
                >
                  <option value="" disabled>
                    {" "}
                    Select job order type
                  </option>
                  <option value="motors">Motors</option>
                  <option value="trimotors">Trimotors</option>
                </Select>
              </div>
            </Activity>
          </div>
        </div>
        <div className="bg-white rounded-md border border-gray-300 shadow">
          <div className="p-6">
            <div className="mb-2 flex justify-end">
              <div className="flex gap-2">
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
                <Activity
                  mode={
                    filterBy && (filterItem || searchTerm) && !isRefresh && !isLoading && reports.length > 0
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
                        <FaCircleNotch className="animate-spin" /> Exporting...
                      </>
                    ) : (
                      <>
                        <FaFileExcel /> Export
                      </>
                    )}
                  </Button>
                </Activity>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-600">Reports</h2>
            </div>
            <div className="overflow-x-auot">
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
                      "No reports yet."
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthPage(Reports);
