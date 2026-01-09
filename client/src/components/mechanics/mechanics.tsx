"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import { PenIcon, Search, SearchSlash, Trash, UserPlus } from "lucide-react";
import DataTable from "react-data-table-component";
import {
  FaCircleNotch,
  FaMagnifyingGlass,
  FaRotateRight,
} from "react-icons/fa6";
import { Activity, Dispatch, SetStateAction, useState } from "react";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import AddMechanic from "@/components/mechanics/add-mechanic";
import EditMechanic from "@/components/mechanics/edit-mechanic";
import { useAuth } from "@/context/authContext";

const Mechanics = ({
  setMechanicAdded,
  mechanicAdded,
}: {
  setMechanicAdded: Dispatch<SetStateAction<number>>;
  mechanicAdded: number;
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const {
    data: mechanics,
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
  } = useFetch(`/mechanics?branch_id=${user?.id}`);

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
      selector: (row: any) => row.name,
      sortable: true,
      sortField: "name",
    },
    {
      name: "BRANCH",
      selector: (row: any) => `(${row.user.code}) - ${row.user.name}`,
      sortable: true,
      sortField: "user.name",
    },
    {
      name: "NUMBER OF JOBS",
      selector: (row: any) => row.job_orders_count,
      sortable: true,
      sortField: "job_orders_count",
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
              setSelectedMechanic(row);
            }}
          >
            <PenIcon className="size-5" />
          </Button>
          <Button
            type="button"
            onClick={handleDeleteMechanics(row?.id)}
            className="bg-red-500 hover:bg-red-600 text-white p-2"
          >
            <Trash className="size-5" />
          </Button>
        </div>
      ),
    },
  ];

  function handleDeleteMechanics(id: number) {
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
            const response = await api.delete(`/mechanics/${id}`);

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
                <UserPlus /> Add Mechanic
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-600">Mechanics</h2>
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
                data={mechanics}
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
                      "No mechanics yet."
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <AddMechanic
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fetchData={fetchData}
          setMechanicAdded={setMechanicAdded}
          mechanicAdded={mechanicAdded}
        />
      </Activity>
      <Activity mode={isOpenEdit ? "visible" : "hidden"}>
        <EditMechanic
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          fetchData={fetchData}
          selectedMechanic={selectedMechanic}
        />
      </Activity>
    </>
  );
};

export default Mechanics;
