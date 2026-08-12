"use client";

import EditJoContent from "@/components/edit-jo-content";
import EditJoLoader from "@/components/edit-jo-loader";
import { api } from "@/lib/api";
import withAuthPage from "@/lib/hoc/with-auth-page";
import { useParams } from "next/navigation";
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

  const fetchData = async () => {
    try {
      const response = await api.get(`/show-jo/${id}/browse`);

      const data = response.data.data;

      if (response.status === 200) {
        setFormInputs({
          job_order_number: data.job_order_number,
          date: data.date,
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

  return (
    <div className="p-6">
      {loading ? (
        <EditJoLoader />
      ) : (
        <EditJoContent
          formInputs={formInputs}
          setFormInputs={setFormInputs}
          id={id as number | string | undefined}
        />
      )}
    </div>
  );
}

export default withAuthPage(EditJo);
