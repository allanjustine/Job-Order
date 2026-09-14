"use client";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { PER_PAGE_OPTIONS } from "@/constants/perPageOptipns";
import useFetch from "@/hooks/useFetch";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { PenIcon, Plus, Search, SearchSlash, Trash } from "lucide-react";
import { Activity, useState } from "react";
import DataTable from "react-data-table-component";
import { FaCircleNotch, FaRotateRight } from "react-icons/fa6";
import { formatDateAndTime } from "@/utils/format-date-and-time";
import { diffForHumans } from "@/utils/diff-for-humans";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import TableLoader from "@/components/table-loader";
import { Skeleton } from "@/components/ui/skeleton";
import CreateRolesOrPermissions, {
  Permission,
} from "../../components/roles-and-permissions/create";
import EditRolesOrPermissions from "../../components/roles-and-permissions/edit";

const Reports = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [keyItem, setKeyItem] = useState<string>("");
  const {
    data: rolesAndPermissions,
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
  } = useFetch("/role-and-permissions");

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
      name: "PERMISSIONS",
      cell: (row: any) => (
        <div className="flex flex-wrap gap-1 py-2">
          {row.permissions.map(
            (permissions: { name: string }, index: number) => (
              <span
                className="p-2 rounded-xl bg-blue-400 hover:bg-blue-500 text-white"
                key={index}
              >
                {permissions.name}
              </span>
            ),
          )}
        </div>
      ),
      has: "roles",
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
            className="text-blue-500 hover:text-blue-600"
            variant={"link"}
            size={"icon"}
            onClick={() => {
              setIsOpenEdit(true);
              setSelectedItem(row);
              setKeyItem(row.type);
            }}
          >
            <PenIcon className="size-5" />
          </Button>
          <Button
            type="button"
            onClick={handleDeleteRolesAndPermissions(row?.id, row?.type)}
            className="text-red-500 hover:text-red-600"
            variant={"link"}
            size={"icon"}
          >
            <Trash className="size-5" />
          </Button>
        </div>
      ),
    },
  ];

  function handleDeleteRolesAndPermissions(id: number, key: string) {
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
            const response = await api.delete(
              `/role-and-permissions/${id}/${key}`,
            );

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

  const filteredData = Object.entries(rolesAndPermissions);

  const filteredPermissions =
    Object.entries(rolesAndPermissions)?.pop()?.pop() || [];

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-gray-300 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Roles and Permissions
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Job Order Printing System — Roles and Permissions Overview
              </p>
            </div>

            <div className="mb-2 flex justify-between items-center gap-1">
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
            <div className="grid grid-cols-2 gap-2 p-2">
              {isLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-70 w-full rounded-lg" />
                  ))
                : filteredData.map(([key, value]: any) => (
                    <div
                      key={key}
                      className="border border-gray-300 rounded-lg p-4 h-fit"
                    >
                      <div className="flex justify-between">
                        <h2 className="text-lg font-bold text-gray-800 mb-2 capitalize">
                          {key}
                        </h2>

                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Input
                              type="search"
                              placeholder="Search..."
                              onChange={(e) => {
                                setKeyItem(key);
                                handleSearch(e);
                              }}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          </div>
                          <Button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-400 text-white py-5 rounded-lg"
                            onClick={() => {
                              setKeyItem(key);
                              setIsOpen(true);
                            }}
                          >
                            <Plus /> Add{" "}
                            <span className="capitalize">{key}</span>
                          </Button>
                        </div>
                      </div>
                      <DataTable
                        columns={columns.filter(
                          (col) => col.has === key || !col.has,
                        )}
                        data={value}
                        pagination={false}
                        paginationServer
                        sortServer
                        onSort={handleSort}
                        paginationTotalRows={pagination.total}
                        onChangeRowsPerPage={handleRowsPerPageChange}
                        onChangePage={handlePageChange}
                        paginationPerPage={pagination.perPage}
                        striped
                        highlightOnHover
                        progressPending={
                          isLoading ||
                          isRefresh ||
                          (isSearching && keyItem === key)
                        }
                        progressComponent={
                          <TableLoader
                            isSearching={isSearching && keyItem === key}
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
                              `No ${key} yet.`
                            )}
                          </div>
                        }
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <CreateRolesOrPermissions
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          fetchData={fetchData}
          keyItem={keyItem}
          permissions={filteredPermissions as Permission[]}
        />
      </Activity>
      <Activity mode={isOpenEdit ? "visible" : "hidden"}>
        <EditRolesOrPermissions
          isOpen={isOpenEdit}
          setIsOpen={setIsOpenEdit}
          fetchData={fetchData}
          keyItem={keyItem}
          permissions={filteredPermissions as Permission[]}
          selectedItem={selectedItem}
        />
      </Activity>
    </>
  );
};

export default withAuthPage(Reports);
