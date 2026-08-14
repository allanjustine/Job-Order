"use client";

import EditJoContent from "@/components/edit-jo-content";
import EditJoLoader from "@/components/edit-jo-loader";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { formatDate } from "date-fns";
import { BookX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Customer = {
  id: number;
  name: string;
  address: string;
  contact_number: string;
  user?: {
    mechanics: {
      id: number;
      name: string;
    }[];
  };
};

type Mechanic = {
  id: number;
};

type JobOrderDetail = {
  id: number;
  job_order_id: number;
  category: string;
  amount: number;
  part_brand: string;
  part_number: string;
  quantity: number;
  type: string;
};

export type FormInputType = {
  job_order_number?: string;
  date: string;
  purchase_date: string;
  next_schedule_date: string;
  next_schedule_kms: string;
  branch_manager: string;
  general_remarks: string;
  estimated_repair_time: string;
  repair_end: string;
  repair_start: string;
  service_advisor: string;
  fuel_level?: string;
  model: string;
  mileage: string;
  engine_number: string;
  category: string;
  reason_for_cancellation: string;
  dealers_name: string;
  customer: Customer;
  mechanics: Mechanic[];
  job_order_details: JobOrderDetail[];
  transaction_code?: string;
};

const FORM_INPUTS = {
  date: "",
  purchase_date: "",
  next_schedule_date: "",
  next_schedule_kms: "",
  branch_manager: "",
  general_remarks: "",
  estimated_repair_time: "",
  repair_end: "",
  repair_start: "",
  service_advisor: "",
  fuel_level: "",
  model: "",
  mileage: "",
  engine_number: "",
  category: "",
  reason_for_cancellation: "",
  dealers_name: "",
  customer: {
    id: 0,
    name: "",
    address: "",
    contact_number: "",
  },
  mechanics: [],
  job_order_details: [],
};

function EditJo() {
  const id = useParams()?.id;
  const [formInputs, setFormInputs] = useState<FormInputType>(FORM_INPUTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const response = await api.get(`/show-jo/${id}/browse`);

      const data = response.data.data;

      if (response.status === 200) {
        setIsCanceled(data.status === "cancelled");
        setFormInputs({
          job_order_number: data.job_order_number,
          date: formatDate(data.date, "yyyy-MM-dd"),
          purchase_date: data.purchase_date,
          next_schedule_date: data.next_schedule_date,
          next_schedule_kms: data.next_schedule_kms,
          branch_manager: data.branch_manager,
          general_remarks: data.general_remarks,
          estimated_repair_time: data.estimated_repair_time,
          repair_end: data.repair_end,
          repair_start: data.repair_start,
          service_advisor: data.service_advisor,
          fuel_level: data.fuel_level,
          model: data.model,
          mileage: data.mileage,
          engine_number: data.engine_number,
          category: data.category,
          reason_for_cancellation: data.reason_for_cancellation,
          dealers_name: data.dealers_name,
          customer: data.customer,
          mechanics: data.mechanics.map((mechanic: Mechanic) => mechanic.id),
          job_order_details: data.job_order_details,
          transaction_code: data.transaction_code,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  if (isCanceled)
    return (
      <div className="grid justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-3">
          <BookX className="w-32 h-32 text-gray-700" />
          <h1 className="text-4xl font-bold text-gray-700">
            Sorry you cannot edit this job order as it has been cancelled
          </h1>
          <Button
            type="button"
            size="lg"
            className="px-7 py-6 bg-blue-500 hover:bg-blue-600 hover:-translate-y-1"
            onClick={() => router.replace("/admin/reports")}
          >
            Back
          </Button>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      {loading ? (
        <EditJoLoader />
      ) : (
        <EditJoContent
          formInputs={formInputs}
          setFormInputs={setFormInputs}
          id={id as number | string | undefined}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}

export default withAuthPage(EditJo);
