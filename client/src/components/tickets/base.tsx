import TableLoader from "@/components/table-loader";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Eye, Search, SearchSlash, Trash } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaCircleNotch, FaRotateRight } from "react-icons/fa6";
import ViewTicket from "./view";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import { TICKET_STATUS } from "@/constants/ticket-status";
import Select from "../ui/select";

export type UserType = {
  name: string;
  code: string;
};

export type TicketCategoryOrBrandType = {
  name: string;
};

export type JobOrderType = {
  id: string | number;
  job_order_number: string;
  transaction_code: string;
};

type TicketType = {
  id: string | number;
  user: UserType;
  ticket_category: TicketCategoryOrBrandType;
  ticket_brand: TicketCategoryOrBrandType;
  title: string;
  ticket_code: string;
  status: string;
  job_order: JobOrderType;
  created_at: string;
};

export const TICKET_STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-800",
  edited: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};

export default function TicketBaseContent() {
  const [isView, setIsView] = useState<boolean>(false);
  const [filterItems, setFilterItems] = useState<{ status: string }>({
    status: "ALL",
  });
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const {
    data: tickets,
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
    fetchData,
    setIsLoading,
  } = useFetch("/tickets", { filterItems });

  const columns = [
    {
      name: "ID",
      selector: (row: TicketType) => row.id,
      sortable: true,
      sortField: "id",
      width: "80px",
    },
    {
      name: "TICKET CODE",
      cell: (row: TicketType) => (
        <span className="font-bold text-gray-600">{row.ticket_code}</span>
      ),
      sortable: true,
      sortField: "ticket_code",
    },
    {
      name: "TICKET TITLE",
      cell: (row: TicketType) => (
        <span className="font-bold text-gray-600">{row.title}</span>
      ),
      sortable: true,
      sortField: "title",
    },
    {
      name: "JOB ORDER NUMBER",
      cell: (row: TicketType) => (
        <span className="font-bold text-gray-600">
          {row.job_order.job_order_number}
        </span>
      ),
    },
    {
      name: "REQUESTED BY",
      cell: (row: TicketType) => (
        <div>
          {row.user.name}{" "}
          <span className="font-bold text-gray-600">({row.user.code})</span>
        </div>
      ),
    },
    {
      name: "TICKET BRAND",
      selector: (row: TicketType) => row.ticket_brand.name,
    },
    {
      name: "TICKET CATEGORY",
      selector: (row: TicketType) => row.ticket_category.name,
    },
    {
      name: "STATUS",
      cell: (row: TicketType) => (
        <div
          className={`${TICKET_STATUS_COLOR[row.status as keyof typeof TICKET_STATUS_COLOR]} font-bold px-3 py-1.5 rounded-xl uppercase text-[9px]`}
        >
          {row.status}
        </div>
      ),
      sortable: true,
      sortField: "status",
    },
    {
      name: "CREATED AT",
      cell: (row: TicketType) => (
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
      cell: (row: TicketType) => (
        <div className="flex gap-1 items-center">
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 hover:scale-102"
            onClick={() => {
              setIsView(true);
              setSelectedId(row.id);
            }}
          >
            <Eye /> View
          </Button>
          {row.status === TICKET_STATUS.PENDING && (
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600 hover:scale-102"
              onClick={handleDeleteTicket(row.id)}
            >
              <Trash /> Delete
            </Button>
          )}
        </div>
      ),
      width: "200px",
    },
  ];

  const handleDeleteTicket = (ticketId: string | number) => () => {
    Swal.fire({
      title: "Are you sure you want to delete this ticket?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      allowOutsideClick: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Deleting ticket...`,
          text: "Please wait...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.delete(`/tickets/${ticketId}/delete`);
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            fetchData();
          }
        } catch (error: any) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response.data.message ||
              "Something went wrong. Please try again later.",
          });
        }
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-300 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Job Order Printing System — Tickets Overview
            </p>
          </div>

          <div className="mb-2 flex gap-1 items-center flex-col lg:flex-row">
            <Select
              value={filterItems.status}
              onChange={(e) => {
                setFilterItems({ status: e.target.value });
                setIsLoading(true);
              }}
            >
              <option value="" disabled>
                Select status
              </option>
              {Object.entries({ ALL: "all", ...TICKET_STATUS }).map(
                ([status, value]) => (
                  <option value={status} key={value}>
                    {status}
                  </option>
                ),
              )}
            </Select>
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                onChange={handleSearch}
                className="border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-50"
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
            data={tickets}
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
              <TableLoader isSearching={isSearching} searchTerm={searchTerm} />
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
                  "No tickets yet."
                )}
              </div>
            }
          />
        </div>
      </div>
      <ViewTicket
        isOpen={isView}
        setIsOpen={setIsView}
        id={selectedId}
        fetchDataProp={fetchData}
        setId={setSelectedId}
      />
    </>
  );
}
