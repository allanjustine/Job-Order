"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { PenIcon, Search, SearchSlash, Trash, UserPlus } from "lucide-react";
import { Activity, useState } from "react";
import DataTable from "react-data-table-component";
import {
  FaCircleNotch,
  FaMagnifyingGlass,
  FaRotateRight,
} from "react-icons/fa6";
import { formatDateAndTime } from "@/utils/format-date-and-time";
import { diffForHumans } from "@/utils/diff-for-humans";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import AddAreaManager from "../../components/area-manager/add-area-manager";
import EditAreaManager from "../../components/area-manager/edit-area-manager";

const Reports = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [selectedAreaManager, setSelectedAreaManager] = useState<any>(null);
  const {
    data: areaManagers,
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
  } = useFetch("/area-managers");

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.id,

      sortable: true,
      sortField: "id",
      width: "80px",
    },
    {
      name: "NAME",
      cell: (row: any) => row.name,
    },
    {
      name: "BRANCHES UNDER AREA MANAGERS",
      cell: (row: any) => (
        <div className="flex flex-wrap gap-1">
          {row.users.map((user: { code: string }, index: number) => (
            <span
              className="p-2 rounded-xl bg-blue-400 hover:bg-blue-500 text-white"
              key={index}
            >
              {user.code}
            </span>
          ))}
        </div>
      ),
    },
    {
      name: "CREATED AT",
      cell: (row: any) => (
        <>
          <div className="flex flex-col">
            <span className="text-sm">{formatDateAndTime(row.created_at)}</span>
            <span className="text-gray-500 text-xs font-bold">
              {diffForHumans(row.created_at)}
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
            className="bg-blue-500 hover:bg-blue-600 text-white p-2"
            onClick={() => {
              setIsOpenEdit(true);
              setSelectedAreaManager(row);
            }}
          >
            <PenIcon className="size-5" />
          </Button>
          <Button
            type="button"
            onClick={handleDeleteAreaManagers(row?.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-2"
          >
            <Trash className="size-5" />
          </Button>
        </div>
      ),
    },
  ];

  function handleDeleteAreaManagers(id: number) {
    return function () {
      Swal.fire({
        title: "Are you sure?",
        text: "After deleting, you will not be able to recover this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "info",
            title: "Deleting...",
            text: "Please wait...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          try {
            const response = await api.delete(`/area-managers/${id}`);

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

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-md border border-gray-300 shadow">
          <div className="p-6">
            <div className="mb-2 flex justify-between items-center">
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

              <Button
                type="button"
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <UserPlus /> Add Area Manager
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-600">
                Area Manager
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
            <div className="overflow-x-auot">
              <DataTable
                columns={columns}
                data={areaManagers}
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
                      "No area managers yet."
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <AddAreaManager
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fetchData={fetchData}
        />
      </Activity>
      <Activity mode={isOpenEdit ? "visible" : "hidden"}>
        <EditAreaManager
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          fetchData={fetchData}
          selectedAreaManager={selectedAreaManager}
        />
      </Activity>
    </>
  );
};

export default withAuthPage(Reports);
