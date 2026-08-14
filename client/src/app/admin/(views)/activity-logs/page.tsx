"use client";

import TableLoader from "@/components/table-loader";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Search, SearchSlash } from "lucide-react";
import DataTable from "react-data-table-component";
import { FaCircleNotch, FaRotateRight } from "react-icons/fa6";

const ActivityLogs = () => {
  const {
    data: activityLogs,
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
  } = useFetch("/activity-logs");

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,
      sortable: true,
      sortField: "id",
      width: "80px",
    },
    {
      name: "CAUSER",
      selector: (row: any) => (
        <div>
          <span className="font-bold text-gray-700">
            {row.causer ? row.causer.name : "N/A"}
          </span>
        </div>
      ),
      sortable: true,
      sortField: "causer.name",
    },
    {
      name: "SUBJECT",
      cell: (row: any) => (
        <div>
          <span className="font-bold text-gray-600">
            {row.subject_type ? row.subject_type : "N/A"}
          </span>
        </div>
      ),
      sortable: true,
      sortField: "subject_type",
    },
    {
      name: "LOG DESCRIPTION",
      cell: (row: any) => row.description,
      sortable: true,
      sortField: "description",
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

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-300 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Activity Logs
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Job Order Printing System — Activity Logs Overview
              </p>
            </div>

            <div className="mb-2 flex gap-1 items-center">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search..."
                  onChange={handleSearch}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <Button
                type="button"
                disabled={isRefresh}
                className={`bg-yellow-500 hover:bg-yellow-400 text-white py-5 ${
                  isRefresh && "bg-yellow-400! cursor-not-allowed!"
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
          </div>
          <div className="overflow-x-auto border-t">
            <DataTable
              columns={columns}
              data={activityLogs}
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
                <TableLoader
                  isSearching={isSearching}
                  searchTerm={searchTerm}
                />
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
                    "No activity logs yet."
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

export default withAuthPage(ActivityLogs);
