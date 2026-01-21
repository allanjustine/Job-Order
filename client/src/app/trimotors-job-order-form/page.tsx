"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { FaPrint, FaSignOutAlt } from "react-icons/fa";
import { z } from "zod";
import { FaEye, FaRotate } from "react-icons/fa6";
import Button from "@/components/ui/button";
import Swal from "sweetalert2";
import CustomerGrid from "@/components/CustomerGrid";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import ServiceAndManager from "@/components/ServiceAndManager";
import NextSchedule from "@/components/NextSchedule";
import TrimotorsDiagnosis from "@/components/TrimotorsDiagnosis";
import {
  TrimotorsDiagnosisKeys,
  DiagnosisState,
  TrimotorsJobRequestType,
  TrimotorsJobAmountType,
} from "@/types/jobOrderFormType";
import { useAuth } from "@/context/authContext";
import acronymName from "@/utils/acronymName";
import withAuthPage from "@/lib/hoc/with-auth-page";
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
import TrimotorsPreviewPrint from "@/components/TrimotorsPreviewPrint";
import TrimotorsPrintJobOrder from "@/components/trimotors-print-job";
import TrimotorsJobRequest from "@/components/TrimotorsJobRequest";
import FormHeader from "@/components/form-header";
import { trimotorsJobItems } from "@/constants/trimotors-job-items";

// Schema for form validation
const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  model: z.string().min(1, "Model is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
});

const TrimotorsJobOrderForm = () => {
  // Form state
  const { user, handleLogout } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState("");
  const [branch, setBranch] = useState(`(${user?.code}) - ${user?.name}`);
  const [contact, setContact] = useState("");
  const [model, setModel] = useState("");
  const [engineFrameNo, setEngineFrameNo] = useState("");
  const [mileage, setMileage] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [repairStart, setRepairStart] = useState("");
  const [repairEnd, setRepairEnd] = useState("");
  const [fuelLevel, setFuelLevel] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [motorcycleUnit, setMotorcycleUnit] = useState("");
  const [remarks, setRemarks] = useState("");
  const [engineUnit, setEngineUnit] = useState("");
  const [engineCondition, setEngineCondition] = useState("");
  const [contentUbox, setContentUbox] = useState("");
  const [nextScheduleDate, setNextScheduleDate] = useState("");
  const [nextScheduleKms, setNextScheduleKms] = useState("");
  const [generalRemarks, setGeneralRemarks] = useState("");

  // Amounts state
  const [jobAmounts, setJobAmounts] = useState<TrimotorsJobAmountType>({});

  const [signatures, setSignatures] = useState<{
    serviceAdvisor: string;
    branchManager: string;
  }>({
    serviceAdvisor: "",
    branchManager: "",
  });

  const [jobRequest, setJobRequest] = useState<TrimotorsJobRequestType>({
    vehicleWashing: false,
    airFilter: false,
    breather: false,
    checkLights: false,
    oilStrainer: false,
    checkSteering: false,
    cleanSpark: false,
    checkValve: false,
    checkFuel: false,
    checkBattery: false,
    tireRotation: false,
    replaceProp: false,
    replaceOil: false,
    checkCabies: false,
    checkShock: false,
    checkBrake: false,
    deCarbonising: false,
    checkBrakeLiner: false,
    replaceEngine: false,
    replaceDifferential: false,
    greaseSteering: false,
    greaseFront: false,
    greaseNipple: false,
    greasePropeller: false,
    greaseGear: false,
    greaseFare: false,
    speedometer: false,
    petroleum: false,
    others: false,
    othersText: "",
  });

  const [diagnosis, setDiagnosis] = useState<
    Record<TrimotorsDiagnosisKeys, DiagnosisState>
  >({
    windshield: { status: null, remarks: "" },
    wipeArm: { status: null, remarks: "" },
    frontIndicator: { status: null, remarks: "" },
    frontHeadLamp: { status: null, remarks: "" },
    housingScudo: { status: null, remarks: "" },
    housingHeadlamp: { status: null, remarks: "" },
    frontFender: { status: null, remarks: "" },
    mudFlapFront: { status: null, remarks: "" },
    scudoFront: { status: null, remarks: "" },
    frontEmblem: { status: null, remarks: "" },
    tailLamp: { status: null, remarks: "" },
    bumper: { status: null, remarks: "" },
    mudFlapRear: { status: null, remarks: "" },
    rearDoor: { status: null, remarks: "" },
    rearEmblem: { status: null, remarks: "" },
    tailEnd: { status: null, remarks: "" },
    leftBeading: { status: null, remarks: "" },
    leftBodyPaint: { status: null, remarks: "" },
    mudGuard: { status: null, remarks: "" },
    rightBeading: { status: null, remarks: "" },
    rightBodyPaint: { status: null, remarks: "" },
    checkHoles: { status: null, remarks: "" },
    damageStitching: { status: null, remarks: "" },
    coverHood: { status: null, remarks: "" },
    tapeHood: { status: null, remarks: "" },
    alumninum: { status: null, remarks: "" },
    nailScrew: { status: null, remarks: "" },
    dashboard: { status: null, remarks: "" },
    seatsDriver: { status: null, remarks: "" },
    seatsPassenger: { status: null, remarks: "" },
    seatBelts: { status: null, remarks: "" },
    handleLeather: { status: null, remarks: "" },
    rubberMatting: { status: null, remarks: "" },
    underseatCover: { status: null, remarks: "" },
    headlamp: { status: null, remarks: "" },
    beam: { status: null, remarks: "" },
    signalLamp: { status: null, remarks: "" },
    hazardlamp: { status: null, remarks: "" },
    wiper: { status: null, remarks: "" },
    interiorLamp: { status: null, remarks: "" },
    gaugeLamp: { status: null, remarks: "" },
    carCharger: { status: null, remarks: "" },
    tools: { status: null, remarks: "" },
    battery: { status: null, remarks: "" },
    jack: { status: null, remarks: "" },
    spareTire: { status: null, remarks: "" },
    sideMirror: { status: null, remarks: "" },
    warrantyBooklet: { status: null, remarks: "" },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPrint, setIsPrint] = useState(false);
  const [dropDownOpen, setDropdownOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalButtonRef = useRef<HTMLButtonElement>(null);
  const [jobOrderNumber, setJobOrderNumber] = useState("");

  useEffect(() => {
    fetchJobOrderNumber();
  }, []);

   const fetchJobOrderNumber = async () => {
      try {
        const response = await api.get("/get-job-order-number");

        if (response.status === 200) {
          setJobOrderNumber(response.data.job_order_number);
        }
      } catch (error) {
        console.error(error);
      }
    };

  // Handler functions for amount changes
  const handleJobAmountChange = (
    key: keyof TrimotorsJobAmountType,
    value: number,
  ) => {
    setJobAmounts((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Calculate totals
  const jobTotal = useMemo(() => {
    return Object.values(jobAmounts).reduce(
      (total, amount) => total + (amount || 0),
      0,
    );
  }, [jobAmounts]);

  // Clean up amounts when checkboxes are unchecked
  useEffect(() => {
    const updatedAmounts = { ...jobAmounts };

    // Remove amount entries for unchecked jobRequest
    Object.keys(updatedAmounts).forEach((key) => {
      const typedKey = key as keyof TrimotorsJobAmountType;
      // Check if the key exists in jobRequest and if it's false (exclude 'others' which is handled separately)
      if (
        typedKey !== "others" &&
        !jobRequest[typedKey as keyof TrimotorsJobRequestType]
      ) {
        delete updatedAmounts[typedKey];
      }
    });

    setJobAmounts(updatedAmounts);
  }, [jobRequest]);

  // Form validation
  const validateForm = () => {
    try {
      formSchema.parse({
        customerName,
        date,
        branch,
        model,
        purchaseDate,
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

  // Set default date to today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setDate(today);
  }, []);

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

  // Prepare data for printing
  const TrimotorsjobOrderData = {
    branch: branch || "Main Branch",
    customerName,
    date,
    contact,
    model,
    engineFrameNo,
    mileage,
    purchaseDate,
    repairStart,
    repairEnd,
    fuelLevel,
    motorcycleUnit,
    remarks,
    engineUnit,
    engineCondition,
    contentUbox,
    diagnosis,
    jobRequest,
    jobAmounts,
    nextScheduleDate,
    nextScheduleKms,
    generalRemarks,
    serviceAdvisor: signatures.serviceAdvisor,
    branchManager: signatures.branchManager,
    mechanic,
    jobOrderNumber,
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
      fetchJobOrderNumber();
    };

    window.print();

    return () => {
      window.onafterprint = null;
    };
  }, [isPrint]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const itemsData = trimotorsJobItems
    .filter((item) => jobRequest[item.key as keyof TrimotorsJobRequestType])
    .map((item) => ({
      category: item.key === "others" ? jobRequest.othersText : item.label,
      amount: jobAmounts[item.key as keyof TrimotorsJobAmountType] || 0,
    }));

  const itemToStore = {
    customer: {
      name: customerName,
      contact_number: contact,
    },
    job_order: {
      job_order_type: "trimotors",
      date: date,
      branch_manager: signatures.branchManager,
      general_remarks: generalRemarks,
      mechanic_id: mechanic.split("_")[0],
      repair_end: repairEnd,
      repair_start: repairStart,
      service_advisor: signatures.serviceAdvisor,
      fuel_level: fuelLevel,
      model: model,
      mileage: mileage,
      engine_number: engineFrameNo,
    },
    job_order_details: itemsData,
  };

  console.log(itemsData);

  const handleSavePrint = async () => {
    try {
      const response = await api.post("/create-job-order", itemToStore);
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
    setContact("");
    setModel("");
    setEngineFrameNo("");
    setMileage("");
    setPurchaseDate("");
    setRepairStart("");
    setRepairEnd("");
    setFuelLevel("");
    setMotorcycleUnit("");
    setRemarks("");
    setEngineUnit("");
    setEngineCondition("");
    setContentUbox("");
    setNextScheduleDate("");
    setNextScheduleKms("");
    setGeneralRemarks("");
    setMechanic("");

    // Reset amounts
    setJobAmounts({});

    // Reset job request
    setJobRequest({
      vehicleWashing: false,
      airFilter: false,
      breather: false,
      checkLights: false,
      oilStrainer: false,
      checkSteering: false,
      cleanSpark: false,
      checkValve: false,
      checkFuel: false,
      checkBattery: false,
      tireRotation: false,
      replaceProp: false,
      replaceOil: false,
      checkCabies: false,
      checkShock: false,
      checkBrake: false,
      deCarbonising: false,
      checkBrakeLiner: false,
      replaceEngine: false,
      replaceDifferential: false,
      greaseSteering: false,
      greaseFront: false,
      greaseNipple: false,
      greasePropeller: false,
      greaseGear: false,
      greaseFare: false,
      speedometer: false,
      petroleum: false,
      others: false,
      othersText: "",
    });

    // Reset diagnosis
    setDiagnosis({
      windshield: { status: null, remarks: "" },
      wipeArm: { status: null, remarks: "" },
      frontIndicator: { status: null, remarks: "" },
      frontHeadLamp: { status: null, remarks: "" },
      housingScudo: { status: null, remarks: "" },
      housingHeadlamp: { status: null, remarks: "" },
      frontFender: { status: null, remarks: "" },
      mudFlapFront: { status: null, remarks: "" },
      scudoFront: { status: null, remarks: "" },
      frontEmblem: { status: null, remarks: "" },
      tailLamp: { status: null, remarks: "" },
      bumper: { status: null, remarks: "" },
      mudFlapRear: { status: null, remarks: "" },
      rearDoor: { status: null, remarks: "" },
      rearEmblem: { status: null, remarks: "" },
      tailEnd: { status: null, remarks: "" },
      leftBeading: { status: null, remarks: "" },
      leftBodyPaint: { status: null, remarks: "" },
      mudGuard: { status: null, remarks: "" },
      rightBeading: { status: null, remarks: "" },
      rightBodyPaint: { status: null, remarks: "" },
      checkHoles: { status: null, remarks: "" },
      damageStitching: { status: null, remarks: "" },
      coverHood: { status: null, remarks: "" },
      tapeHood: { status: null, remarks: "" },
      alumninum: { status: null, remarks: "" },
      nailScrew: { status: null, remarks: "" },
      dashboard: { status: null, remarks: "" },
      seatsDriver: { status: null, remarks: "" },
      seatsPassenger: { status: null, remarks: "" },
      seatBelts: { status: null, remarks: "" },
      handleLeather: { status: null, remarks: "" },
      rubberMatting: { status: null, remarks: "" },
      underseatCover: { status: null, remarks: "" },
      headlamp: { status: null, remarks: "" },
      beam: { status: null, remarks: "" },
      signalLamp: { status: null, remarks: "" },
      hazardlamp: { status: null, remarks: "" },
      wiper: { status: null, remarks: "" },
      interiorLamp: { status: null, remarks: "" },
      gaugeLamp: { status: null, remarks: "" },
      carCharger: { status: null, remarks: "" },
      tools: { status: null, remarks: "" },
      battery: { status: null, remarks: "" },
      jack: { status: null, remarks: "" },
      spareTire: { status: null, remarks: "" },
      sideMirror: { status: null, remarks: "" },
      warrantyBooklet: { status: null, remarks: "" },
    });

    // Reset signatures
    setSignatures({
      serviceAdvisor: "",
      branchManager: "",
    });

    // Reset errors
    setErrors({});
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
          await handleLogout();
        }
      });
      handleToggleDropdown();
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
        <TrimotorsPrintJobOrder data={TrimotorsjobOrderData} />
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
                <div className="overflow-hidden">
                  <Button
                    type="button"
                    onClick={handleToggleDropdown}
                    ref={buttonRef}
                    className="px-0 py-0"
                  >
                    <div className="ml-3 rounded-full w-10 h-10 flex items-center justify-center bg-gray-300 font-bold">
                      {acronymName(user?.name)}
                    </div>
                  </Button>
                </div>
              </div>
              {dropDownOpen && (
                <div
                  className="absolute top-14 rounded-lg right-0 min-w-1/5 bg-white shadow-md border border-gray-300 z-99999"
                  ref={dropdownRef}
                >
                  <div className="flex flex-col relative">
                    <div className="absolute -top-2 -rotate-45 right-3 w-0 h-0 border-l-16 border-t-16 border-l-transparent border-t-gray-200"></div>
                    <div className="p-3 hover:bg-gray-100 rounded-lg">
                      <div className="flex gap-2 items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-300 font-bold">
                          {acronymName(user?.name)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-600">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <hr className="text-gray-300" />
                    <div className="p-3 hover:bg-gray-100 rounded-lg">
                      <Button
                        type="button"
                        onClick={handleLogoutUser}
                        className="p-0 text-sm text-left font-semibold text-gray-600 w-full"
                      >
                        <span className="flex gap-2 items-center">
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="min-h-screen bg-gray-50 py-4 md:px-20 no-print">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[80vw] mx-auto">
              <FormHeader category="motors" />
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="text-center mb-6 border-b border-gray-300 pb-4">
                  <img
                    src="/trimotors-logo.png"
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
                  branch={branch}
                  contact={contact}
                  model={model}
                  engineFrameNo={engineFrameNo}
                  mileage={mileage}
                  purchaseDate={purchaseDate}
                  repairStart={repairStart}
                  repairEnd={repairEnd}
                  fuelLevel={fuelLevel}
                  mechanic={mechanic}
                  setCustomerName={setCustomerName}
                  setDate={setDate}
                  setBranch={setBranch}
                  setContact={setContact}
                  setModel={setModel}
                  setEngineFrameNo={setEngineFrameNo}
                  setMileage={setMileage}
                  setPurchaseDate={setPurchaseDate}
                  setRepairStart={setRepairStart}
                  setRepairEnd={setRepairEnd}
                  setFuelLevel={setFuelLevel}
                  setMechanic={setMechanic}
                />

                <p className="block text-lg font-bold text-gray-900 mb-1">
                  TRIMOTORS' DIAGNOSIS
                </p>

                <TrimotorsDiagnosis
                  diagnosis={diagnosis}
                  setDiagnosis={setDiagnosis}
                />
                <p className="block text-lg font-bold text-gray-900 mb-1">
                  JOB ORDER
                </p>

                {/* Documents and Visual Check - Side by side
                 */}
                <TrimotorsJobRequest
                  jobRequest={jobRequest}
                  setJobRequest={setJobRequest}
                  jobAmounts={jobAmounts}
                  handleJobAmountChange={handleJobAmountChange}
                  jobTotal={jobTotal}
                />

                <NextSchedule
                  nextScheduleDate={nextScheduleDate}
                  nextScheduleKms={nextScheduleKms}
                  generalRemarks={generalRemarks}
                  setNextScheduleDate={setNextScheduleDate}
                  setNextScheduleKms={setNextScheduleKms}
                  setGeneralRemarks={setGeneralRemarks}
                />

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
          <Modal isOpen={isOpen} className="w-3xl" ref={modalRef}>
            <ModalHeader onClose={handlePreviewPrint}>
              Previewing Job Order Data before print...
            </ModalHeader>
            <ModalBody>
              <TrimotorsPreviewPrint data={TrimotorsjobOrderData} />
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

export default withAuthPage(TrimotorsJobOrderForm);
