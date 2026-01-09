"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Search, SearchSlash } from "lucide-react";
import DataTable from "react-data-table-component";
import {
  FaCircleNotch,
  FaMagnifyingGlass,
  FaRotateRight,
} from "react-icons/fa6";

const Reports = () => {
  const {
    data: customers,
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
  } = useFetch("/customers");

  const columns = [
    {
      name: "JO NUMBER",
      selector: (row: any) => row.id,
      
      sortable: true,
      sortField: "id",
    },
    {
      name: "BRANCH NAME",
      cell: (row: any) => (
        <div>
          {row.user.name}{" "}
          <span className="font-bold text-gray-600">({row.user.code})</span>
        </div>
      ),
    },
    {
      name: "CUSTOMER NAME",
      selector: (row: any) => row.name,
      sortable: true,
      sortField: "name",
    },
    {
      name: "JOB FORM",
      selector: (row: any) => row.address,
      sortable: true,
      sortField: "address",
    },
    {
      name: "JOB REQUEST",
      selector: (row: any) => row.address,
      sortable: true,
      sortField: "address",
    },
    {
      name: "CONTACT NUMBER",
      selector: (row: any) => row.contact_number,
      sortable: true,
      sortField: "contact_number",
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
        <div className="bg-white rounded-md border border-gray-300 shadow">
          <div className="p-6">
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
              <h2 className="text-xl font-semibold text-gray-600">Reports</h2>
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
            <div className="overflow-x-auot">
              <DataTable
                columns={columns}
                data={customers}
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
                      "No customers yet."
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
