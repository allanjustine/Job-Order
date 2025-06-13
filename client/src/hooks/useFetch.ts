import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function useFetch(url: string) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchJobOrderData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data.data);
      } catch (error: any) {
        console.log(error);
        setError(error.response.data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOrderData();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}
