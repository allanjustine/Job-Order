"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Spinner } from "@/components/ui/spinner";
import ViewJobOrder from "@/components/view-job-order";
import { api } from "@/lib/api";
import { AlertCircleIcon, Search } from "lucide-react";
import { ChangeEvent, useState } from "react";
import z from "zod";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{ transaction_code: string | null }>({
    transaction_code: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleFindData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`/job-order/search`, {
        transaction_code: searchTerm,
      });

      if (response.status === 200) {
        setData(response.data.data);
        setIsOpen(true);
        setErrors({ transaction_code: null });
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors || null);
        setError("");
      } else {
        setErrors({ transaction_code: null });
        setError(
          error.response.data.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="flex justify-center items-center h-screen w-full relative overflow-hidden"
      style={{ backgroundImage: "url('/engine.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/80 z-0"></div>
      <section className="relative py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="h-46 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-logo.png";
              }}
            />
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                SMCT Group of Companies{" "}
                <span className="text-white">Job Order Form</span>
              </h1>
              <p className="mx-auto max-w-2xl text-gray-200 text-lg sm:text-xl">
                Manage vehicle repairs, customer details, and parts requests
                seamlessly with job order system for automotive service
                providers.
              </p>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="max-w-md border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50"
              >
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="relative w-full md:w-1/3">
                <Input
                  type="search"
                  onChange={handleSearch}
                  value={searchTerm}
                  placeholder="Search by transaction code"
                  className={`w-full h-15 border border-gray-300 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-white ${errors?.transaction_code && "border-red-500"}`}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors?.transaction_code && (
                <small className="text-red-500">
                  {errors?.transaction_code[0]}
                </small>
              )}
              <Button
                type="button"
                onClick={handleFindData}
                className="text-lg px-8 py-6 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner /> Searching...
                  </>
                ) : (
                  "Search Transaction"
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={isOpen} className="w-3xl">
        <ModalHeader
          onClose={() => {
            setIsOpen(false);
            setData(null);
          }}
        >
          Viewing {data?.customer.name}&apos;s Job Order
          {data?.job_order_type && (
            <span
              className={`ml-2 text-xs font-bold px-2 py-1 rounded ${
                data.job_order_type === "trimotors"
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {data.job_order_type.toUpperCase()}
            </span>
          )}
        </ModalHeader>
        <ModalBody>
          <ViewJobOrder data={data} />
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white py-5"
            type="button"
            onClick={() => {
              setIsOpen(false);
              setData(null);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
