import { Customer, FormInputType } from "@/app/admin/(views)/reports/[id]/page";
import { Button } from "./ui/button";
import { formatDate } from "date-fns";
import { Label } from "./ui/label";
import Input from "./ui/input";
import {
  BOTTOM_FIELDS,
  CUSTOMER_DETAILS_FIELDS,
} from "@/constants/dynamic-fields";
import Select from "./ui/select";
import { MultiMechanic } from "./MultiMechanic";
import Swal from "sweetalert2";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import JobOrderDetailsContent from "./job-order-details-content";

export default function EditJoContent({
  formInputs,
  setFormInputs,
  id,
  fetchData,
  setErrors,
  errors,
  prevNextStats,
}: {
  formInputs: FormInputType;
  setFormInputs: Dispatch<SetStateAction<FormInputType>>;
  id?: string | number;
  fetchData: () => void;
  setErrors: Dispatch<SetStateAction<{ [key: string]: string }>>;
  errors: { [key: string]: string };
  prevNextStats: { prev: number | null; next: number | null };
}) {
  const router = useRouter();

  const handleSave = () => {
    Swal.fire({
      icon: "info",
      title: "Update Job Order",
      text: "Are you sure you want to update this job order?",
      confirmButtonText: "Yes",
      confirmButtonColor: "#3085d6",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { job_order_details, customer, mechanics, ...rest } = formInputs;

        Swal.fire({
          icon: "info",
          title: "Updating Job Order",
          text: "Please wait...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.patch(`/update-job-order/${id}/update`, {
            job_order: rest,
            customer,
            job_order_details,
            mechanic_ids: mechanics,
          });

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Updated Job Order",
              text: response.data.message,
              allowOutsideClick: false,
            }).then(() => {
              router.push("/admin/reports");
            });
          }
        } catch (error: any) {
          console.error(error);
          if (error.response.status === 422) {
            setErrors(error.response.data.errors);
          } else {
            setErrors({});
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data.message || "An error occurred.",
            });
          }
        }
      }
    });
  };

  const prevNext = Object.entries(prevNextStats).map(([key, value]) => {
    return {
      key,
      value,
    };
  });

  return (
    <div className="space-y-3 relative">
      <div className="border-b border-gray-500 py-2 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-gray-700">
          {" "}
          Editing JO: {formInputs.job_order_number}
        </div>
        <div className="text-2xl font-extrabold text-gray-700">
          {" "}
          Transaction Code: {formInputs.transaction_code}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {prevNext.map((item) => (
          <Button
            key={item.key}
            className="uppercase bg-cyan-500"
            size="lg"
            onClick={() => router.push(`/admin/reports/${item.value}`)}
            disabled={item.value === null}
          >
            {item.key}
          </Button>
        ))}
      </div>
      <div className="border rounded-xl p-5 space-y-2">
        <h3 className="text-xl text-gray-700 font-bold">CUSTOMER DETAILS</h3>
        <div className="flex flex-wrap gap-4">
          {CUSTOMER_DETAILS_FIELDS.map((field) => (
            <div
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
              key={field.value}
            >
              <Label>{field.label}</Label>
              {field.type === "multiple_select" ? (
                <MultiMechanic
                  mechanics={formInputs?.customer?.user?.mechanics}
                  mechanic={formInputs[field.value as keyof FormInputType]}
                  setMechanic={(value) =>
                    setFormInputs((formInputs) => ({
                      ...formInputs,
                      [field.value as keyof FormInputType]: value,
                    }))
                  }
                />
              ) : field.type === "select" ? (
                <Select
                  value={String(formInputs[field.value as keyof FormInputType])}
                  onChange={(e) =>
                    setFormInputs((formInput) => ({
                      ...formInput,
                      [field.value]: e.target.value,
                    }))
                  }
                  className="h-10"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Repo Recon">Repo Recon</option>
                  <option value="Branch MC/CCR Service">
                    Branch MC/CCR Service
                  </option>
                  <option value="Branch Delivery/Towing">
                    Branch Delivery/Towing
                  </option>
                  <option value="Warranty Claim">Warranty Claim</option>
                  <option value="Regular Customer">Regular Customer</option>
                  <option value="Walk In">Walk In</option>
                  <option value="E-Bike">E-Bike</option>
                  <option value="others">Others</option>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={`${field.value === "date" || field.value === "purchase_date" ? formatDate(formInputs.date, "yyyy-MM-dd") : field.is_customer_details ? formInputs.customer[field.value as keyof Customer] : formInputs[field.value as keyof FormInputType]}`}
                  className="h-10"
                  onChange={(e) =>
                    setFormInputs((prev) => {
                      if (field.is_customer_details) {
                        return {
                          ...prev,
                          customer: {
                            ...prev.customer,
                            [field.value]: e.target.value,
                          },
                        };
                      }

                      return {
                        ...prev,
                        [field.value]: e.target.value,
                      };
                    })
                  }
                />
              )}
              <small className="text-red-500">{errors[field.value]}</small>
            </div>
          ))}
        </div>
      </div>
      <JobOrderDetailsContent
        formInputs={formInputs}
        setFormInputs={setFormInputs}
        fetchData={fetchData}
        id={id}
      />
      <div className="border rounded-xl p-5">
        <h3 className="text-xl text-gray-700 font-bold">OTHERS</h3>
        <div className="flex flex-wrap gap-4">
          {BOTTOM_FIELDS.map((field) => (
            <div
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
              key={field.value}
            >
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                value={
                  field.type === "date" &&
                  formInputs[field.value as keyof FormInputType]
                    ? formatDate(
                        String(formInputs[field.value as keyof FormInputType]),
                        "yyyy-MM-dd",
                      )
                    : String(formInputs[field.value as keyof FormInputType])
                }
                className="h-10"
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    [field.value]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full p-5 rounded-xl sticky bottom-0 bg-white border shadow">
        <div className="grid grid-cols-2">
          <Button
            type="button"
            onClick={() =>
              Swal.fire({
                icon: "info",
                title: "Are you sure?",
                text: "Are you sure you want to cancel?",
                confirmButtonText: "Yes",
                confirmButtonColor: "#3085d6",
                showCancelButton: true,
                cancelButtonText: "No",
              }).then((result) => {
                if (result.isConfirmed) {
                  router.push("/admin/reports");
                }
              })
            }
            className="bg-gray-700 hover:bg-gray-600 hover:-translate-y-1 py-5"
            size="lg"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 hover:-translate-y-1 py-5"
            size="lg"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
