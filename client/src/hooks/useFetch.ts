import { PAGINATION } from "@/constants/pagination";
import { SORT } from "@/constants/sort";
import { api } from "@/lib/api";
import { PaginationType } from "@/types/paginationType";
import { SortType } from "@/types/sortType";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function useFetch(
  url: string,
  { filterItem, filterBy }: { filterItem?: string; filterBy?: string } = {}
) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState<PaginationType>(PAGINATION);
  const [sort, setSort] = useState<SortType>(SORT);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [cardData, setCardData] = useState<any>([]);
  const [defaultSearch, setDefaultSearch] = useState<string>("");
  const debouncedSearchTerm = useRef<NodeJS.Timeout>(null);

  const fetchData = async () => {
    const payload = {
      page: pagination.page,
      perPage: pagination.perPage,
      sort: {
        column: sort.column,
        direction: sort.sortBy,
      },
      search: searchTerm,
      filter_item: filterItem,
      filter_by: filterBy,
    };

    try {
      const response = await api.get(url, {
        params: {
          ...payload,
        },
      });
      setData(response?.data?.data?.data);
      setCardData(response?.data);
      setPagination((pagination: PaginationType) => ({
        ...pagination,
        total: response.data.data.total,
        page: response.data.data.current_page,
        perPage: response.data.data.per_page,
      }));
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
      if (error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired!",
          text: "Please login again.",
          confirmButtonText: "Back to Login",
          allowOutsideClick: false,
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
      setIsSearching(false);
      setPagination((prev: PaginationType) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    pagination.page,
    pagination.perPage,
    sort.column,
    sort.sortBy,
    searchTerm,
    filterItem,
    filterBy,
  ]);

  const handleSort = (column: any, direction: any) => {
    if (!column.sortable || !direction) return;
    setSort({
      column: column.sortField,
      sortBy: direction,
    });
  };

  const handleRowsPerPageChange = (perPage: number) => {
    setPagination((pagination: PaginationType) => ({
      ...pagination,
      perPage,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    if (pagination.isLoading) return;
    setPagination((pagination: PaginationType) => ({
      ...pagination,
      page,
      isLoading: true,
    }));
  };

  const handleSearch = (e: any) => {
    if (debouncedSearchTerm.current) clearTimeout(debouncedSearchTerm.current);

    const { value } = e.target;

    setDefaultSearch(value);

    debouncedSearchTerm.current = setTimeout(() => {
      setSearchTerm(value);
      setIsSearching(true);
    }, 500);
  };

  const handleRefresh = () => {
    setIsRefresh(true);
    fetchData();
  };

  return {
    data,
    cardData,
    sort,
    error,
    isRefresh,
    isLoading,
    searchTerm,
    pagination,
    isSearching,
    defaultSearch,
    handleSort,
    setIsRefresh,
    handleSearch,
    handleRefresh,
    setSearchTerm,
    handlePageChange,
    handleRowsPerPageChange,
    setDefaultSearch,
    fetchData,
  };
}
