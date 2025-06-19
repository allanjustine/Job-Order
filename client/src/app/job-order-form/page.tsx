"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { FaPrint } from "react-icons/fa";
import PrintJobOrder from "@/components/print-job";
import { z } from "zod";
import { FaEye, FaRotate } from "react-icons/fa6";
import Button from "@/components/ui/button";
import Swal from "sweetalert2";
import CustomerGrid from "@/components/CustomerGrid";
import VehicleGrid from "@/components/VehicleGrid";
import JobDetailsGrid from "@/components/JobDetailsGrid";
import DocumentAndVisualCheck from "@/components/DocumentAndVisualCheck";
import CustomersJobRequest from "@/components/CustomersJobRequest";
import PartsAndLubricantsRequest from "@/components/PartsAndLubricantsRequest";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import ServiceAndManager from "@/components/ServiceAndManager";
import {
  JobRequest,
  PartRequest,
  VehicleDocument,
  VehicleVisualCheck,
} from "@/types/jobOrderFormType";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import acronymName from "@/utils/acronymName";
import authenticatedPage from "@/lib/hoc/authenticatedPage";
import dap from "@/assets/images/dap.jpg";
import dsm from "@/assets/images/dsm.png";
import smct from "@/assets/images/smct_branch.png";
import hd from "@/assets/images/hd.png";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import PreviewPrint from "@/components/PreviewPrint";

// Schema for form validation
const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  date: z.string().min(1, "Date is required"),
  address: z.string().min(1, "Address is required"),
  contact: z.string().min(1, "Contact is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  chassis: z.string().min(1, "Chassis number is required"),
});

const JobOrderForm = () => {
  // Form state
  const { user, handleLogout } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [chassis, setChassis] = useState("");
  const [dealer, setDealer] = useState("");
  const [mileage, setMileage] = useState("");
  const [dateSold, setDateSold] = useState("");
  const [jobType, setJobType] = useState("");
  const [repairStart, setRepairStart] = useState("");
  const [repairEnd, setRepairEnd] = useState("");
  const [signatures, setSignatures] = useState<{
    serviceAdvisor: string;
    branchManager: string;
  }>({
    serviceAdvisor: "",
    branchManager: "",
  });

  const [documents, setDocuments] = useState<VehicleDocument>({
    ownerToolKit: false,
    ownerManual: false,
    warrantyGuideBook: false,
    others: false,
    othersText: "",
  });

  const [visualCheck, setVisualCheck] = useState<VehicleVisualCheck>({
    dent: false,
    dentNotes: "",
    scratch: false,
    scratchNotes: "",
    broken: false,
    brokenNotes: "",
    missing: false,
    missingNotes: "",
  });

  const [jobRequests, setJobRequests] = useState<JobRequest[]>([
    { request: "", cost: 0 },
  ]);
  const [partsRequests, setPartsRequests] = useState<PartRequest[]>([
    { name: "", partNo: "", quantity: 0, price: 0 },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPrint, setIsPrint] = useState(false);
  const router = useRouter();
  const [dropDownOpen, setDropdownOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalButtonRef = useRef<HTMLButtonElement>(null);

  // Form validation
  const validateForm = () => {
    try {
      formSchema.parse({
        customerName,
        date,
        address,
        contact,
        vehicleModel,
        chassis,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPrint]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        modalButtonRef.current &&
        !modalButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Set default date to today
  useState(() => {
    setDate(new Date().toISOString().split("T")[0]);
  });

  // Calculate totals with memoization
  const laborTotal = useMemo(
    () => jobRequests.reduce((sum, item) => sum + (item.cost || 0), 0),
    [jobRequests]
  );

  const partsTotal = useMemo(
    () =>
      partsRequests.reduce(
        (sum, item) => sum + (item.price * item.quantity || 0),
        0
      ),
    [partsRequests]
  );

  const totalAmount = useMemo(
    () => laborTotal + partsTotal,
    [laborTotal, partsTotal]
  );

  // Form handlers
  const addJobRequest = () => {
    if (jobRequests.length >= 4) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You can only add up to 4 job request(s)",
      });
      return;
    }
    setJobRequests([...jobRequests, { request: "", cost: 0 }]);
  };

  const removeAllJobRequest = () => {
    setJobRequests([{ request: "", cost: 0 }]);
  };

  const addPartRequest = () => {
    if (partsRequests.length >= 7) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "You can only add up to 7 part(s)",
      });
      return;
    }
    setPartsRequests([
      ...partsRequests,
      { name: "", partNo: "", quantity: 0, price: 0 },
    ]);
  };

  const removeAllPartRequest = () => {
    setPartsRequests([{ name: "", partNo: "", quantity: 0, price: 0 }]);
  };

  const updateJobRequest = (
    index: number,
    field: keyof JobRequest,
    value: string | number
  ) => {
    const updatedRequests = [...jobRequests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]: field === "cost" ? Number(value) : value,
    };
    setJobRequests(updatedRequests);
  };

  const updatePartRequest = (
    index: number,
    field: keyof PartRequest,
    value: string | number
  ) => {
    const updatedRequests = [...partsRequests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]:
        field === "quantity" || field === "price" ? Number(value) : value,
    };
    setPartsRequests(updatedRequests);
  };

  const deleteJobRequest = (index: number) => {
    const newRequests = [...jobRequests];
    newRequests.splice(index, 1);
    setJobRequests(newRequests);
  };

  const deletePartRequest = (index: number) => {
    const newRequests = [...partsRequests];
    newRequests.splice(index, 1);
    setPartsRequests(newRequests);
  };

  // Prepare data for printing
  const jobOrderData = {
    branch: "Main Branch",
    customerName,
    address,
    vehicleModel,
    chassis,
    dealer,
    repairStart,
    repairEnd,
    documents,
    visualCheck,
    jobRequests,
    partsRequests,
    laborTotal,
    partsTotal,
    totalAmount,
    date,
    contact,
    mileage,
    dateSold,
    jobType,
    ...signatures,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isPrint) return;

    window.onafterprint = () => {
      handlePrint();
      handleSavePrint();
    };

    window.print();

    return () => {
      window.onafterprint = null;
    };
  }, [isPrint]);

  const handleSavePrint = async () => {
    try {
      const response = await api.post("/create-job-order", jobOrderData);
      if (response.status === 201) {
        toast.success(response.data, {
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
        handlePreviewPrint();
        handleReset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = () => {
    setIsPrint(!isPrint);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handlePreviewPrint();
    }
  };

  const handlePreviewPrint = () => {
    setIsOpen(!isOpen);
  };

  const handleReset = () => {
    setCustomerName("");
    setAddress("");
    setVehicleModel("");
    setChassis("");
    setDealer("");
    setRepairStart("");
    setRepairEnd("");
    setDocuments({
      ownerToolKit: false,
      ownerManual: false,
      warrantyGuideBook: false,
      others: false,
      othersText: "",
    });
    setVisualCheck({
      dent: false,
      dentNotes: "",
      scratch: false,
      scratchNotes: "",
      broken: false,
      brokenNotes: "",
      missing: false,
      missingNotes: "",
    });
    setJobRequests([{ request: "", cost: 0 }]);
    setPartsRequests([{ name: "", partNo: "", quantity: 0, price: 0 }]);
    setDate("");
    setContact("");
    setMileage("");
    setDateSold("");
    setJobType("");
  };

  const handleLogoutUser = () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You will redirect to login page!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleLogout(router);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleDropdown = () => {
    setDropdownOpen(!dropDownOpen);
  };

  const branchImages: any = {
    HO: smct,
    SMCT: smct,
    DSM: dsm,
    DAP: dap,
    HD: hd,
  };

  return (
    <>
      {/* Print View (hidden until printing) */}
      {isPrint ? (
        <PrintJobOrder data={jobOrderData} />
      ) : (
        <>
          <div className="flex items-center p-5 bg-white">
            <div className="flex items-center justify-between relative w-full">
              <div>
                <Image
                  height={100}
                  width={200}
                  src={branchImages[user?.branch?.branch_code] || ""}
                  alt="logo"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="ml-3 overflow-hidden text-end">
                  <p
                    className="font-medium text-gray-900 whitespace-nowrap"
                    onClick={handleLogoutUser}
                  >
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-300 font-bold">
                  <Button
                    type="button"
                    onClick={handleToggleDropdown}
                    ref={buttonRef}
                  >
                    {acronymName(user?.name)}
                  </Button>
                </div>
              </div>
              {dropDownOpen && (
                <div
                  className="absolute top-12 rounded-lg right-2 min-w-1/5 bg-white shadow-md border border-gray-300"
                  ref={dropdownRef}
                >
                  <div className="flex flex-col">
                    <div className="p-3 hover:bg-gray-100">
                      <p className="font-bold text-gray-600">{user?.name}</p>
                    </div>
                    <hr className="text-gray-300" />
                    <div className="p-3 hover:bg-gray-100">
                      <button
                        type="button"
                        onClick={handleLogoutUser}
                        className="p-0 text-sm text-left font-semibold text-gray-600 w-full"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="min-h-screen bg-gray-50 py-4 md:px-20 no-print">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[95vw] mx-auto">
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="text-center mb-6 border-b-1 border-gray-300 pb-4">
                  <img
                    src="/logo.png"
                    alt="Company Logo"
                    className="mx-auto mb-3 w-32 h-auto"
                  />
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    JOB ORDER
                  </h1>
                  <h2 className="text-lg text-gray-600">
                    SMCT GROUP OF COMPANIES
                  </h2>
                </div>

                {/* Customer Info - Wider 5-column layout */}
                <p className="block text-lg font-bold text-gray-900 mb-1">
                  CUSTOMER DETAILS
                </p>

                <CustomerGrid
                  errors={errors}
                  customerName={customerName}
                  date={date}
                  address={address}
                  setCustomerName={setCustomerName}
                  setDate={setDate}
                  setAddress={setAddress}
                  setContact={setContact}
                  contact={contact}
                />
                <p className="block text-lg font-bold text-gray-900 mb-1">
                  VEHICLE DETAILS
                </p>

                {/* Vehicle Info - Wider 5-column layout */}
                <VehicleGrid
                  errors={errors}
                  vehicleModel={vehicleModel}
                  chassis={chassis}
                  dealer={dealer}
                  mileage={mileage}
                  dateSold={dateSold}
                  setVehicleModel={setVehicleModel}
                  setChassis={setChassis}
                  setDealer={setDealer}
                  setMileage={setMileage}
                  setDateSold={setDateSold}
                />

                <p className="block text-lg font-bold text-gray-900 mb-1">
                  JOB DETAILS
                </p>

                {/* Repair Dates - Full width */}
                <JobDetailsGrid
                  jobType={jobType}
                  repairStart={repairStart}
                  repairEnd={repairEnd}
                  setJobType={setJobType}
                  setRepairStart={setRepairStart}
                  setRepairEnd={setRepairEnd}
                />

                {/* Documents and Visual Check - Side by side */}
                <DocumentAndVisualCheck
                  documents={documents}
                  setDocuments={setDocuments}
                  visualCheck={visualCheck}
                  setVisualCheck={setVisualCheck}
                />

                {/* Customer Job Request - Full width */}
                <CustomersJobRequest
                  jobRequests={jobRequests}
                  addJobRequest={addJobRequest}
                  updateJobRequest={updateJobRequest}
                  deleteJobRequest={deleteJobRequest}
                  removeAllJobRequest={removeAllJobRequest}
                  laborTotal={laborTotal}
                />

                {/* Parts & Lubricants Request - Full width */}
                <PartsAndLubricantsRequest
                  partsRequests={partsRequests}
                  updatePartRequest={updatePartRequest}
                  deletePartRequest={deletePartRequest}
                  removeAllPartRequest={removeAllPartRequest}
                  addPartRequest={addPartRequest}
                  partsTotal={partsTotal}
                />

                {/* Total Amount */}
                <div className="text-right text-xl font-bold mb-6 p-3 bg-blue-50 rounded-md">
                  TOTAL AMOUNT:{" "}
                  {totalAmount.toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                  })}
                </div>

                <ServiceAndManager
                  errors={errors}
                  signatures={signatures}
                  setSignatures={setSignatures}
                />

                {/* Submit Button */}
                <div className="flex justify-end">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white"
                    >
                      <FaRotate /> Reset
                    </Button>

                    <Button
                      ref={modalButtonRef}
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FaEye /> Preview
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Modal isOpen={isOpen} className="w-5xl" ref={modalRef}>
            <ModalHeader onClose={handlePreviewPrint}>
              Previewing Job Order Data before print...
            </ModalHeader>
            <ModalBody>
              <PreviewPrint data={jobOrderData} />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white"
                onClick={handlePreviewPrint}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePrint}
              >
                <FaPrint /> Print Job Order
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
};

export default authenticatedPage(JobOrderForm);
