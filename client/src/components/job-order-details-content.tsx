import {
  Activity,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { Label } from "./ui/label";
import Input from "./ui/input";
import { brandChoices } from "./PartsReplacement";
import { FormInputType } from "@/app/admin/(views)/reports/[id]/page";
import { api } from "@/lib/api";
import { NumberFieldGroupState } from "@base-ui/react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./ui/modal";
import Swal from "sweetalert2";

type JobOrderDetailType = {
  job_order_id: string | NumberFieldGroupState;
  category: string;
  amount: string;
  part_brand: string;
  part_number: string;
  quantity: string;
  type: string;
};

const JOB_ORDER_DETAILS_FIELDS = {
  job_order_id: "",
  category: "",
  amount: "",
  part_brand: "",
  part_number: "",
  quantity: "",
  type: "",
};

export default function JobOrderDetailsContent({
  formInputs,
  setFormInputs,
  fetchData,
  id,
}: {
  formInputs: FormInputType;
  setFormInputs: Dispatch<SetStateAction<FormInputType>>;
  fetchData: () => void;
  id?: string | number;
}) {
  const [inputFields, setInputFields] = useState<JobOrderDetailType>(
    JOB_ORDER_DETAILS_FIELDS,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    setInputFields((prev) => ({
      ...prev,
      job_order_id: String(id),
    }));
  }, [id]);

  const handleJobOrderDetailChange =
    (joId: string | number, title: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormInputs((prev) => ({
        ...prev,
        job_order_details: prev.job_order_details.map((detail) => {
          if (detail.id === joId) {
            return {
              ...detail,
              [title]: e.target.value,
            };
          }

          return detail;
        }),
      }));
    };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        "/manage-job-order-detail/store",
        inputFields,
      );

      const { job_order_id, ...rest } = JOB_ORDER_DETAILS_FIELDS;

      if (response.status === 201) {
        fetchData();
        setIsOpen(false);
        setInputFields({ ...rest, job_order_id: String(id) });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
        setErrors({});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddJobOrderDetails = (title: string) => () => {
    setIsOpen(true);
    setInputFields((prev) => ({
      ...prev,
      type: title,
    }));
  };

  const handleDeleteJobOrderDetail =
    (jobOrderDetailId: string | number, category: string) => () => {
      Swal.fire({
        icon: "info",
        title: "Delete Job Order Detail",
        text: `Are you sure you want to delete this ${category} job order detail?`,
        confirmButtonText: "Yes",
        confirmButtonColor: "#3085d6",
        showCancelButton: true,
        cancelButtonText: "No",
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "info",
            title: "Deleting Job Order Detail",
            text: "Please wait...",
            didOpen: () => {
              Swal.showLoading();
            },
            allowOutsideClick: false,
          });
          try {
            const response = await api.delete(
              `/manage-job-order-detail/${jobOrderDetailId}/delete`,
            );
            if (response.status === 200) {
              fetchData();
              Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message,
              });
            }
          } catch (error: any) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data.message,
            });
          }
        }
      });
    };

  return (
    <>
      <div className="border rounded-xl p-5">
        <h3 className="text-xl text-gray-700 font-bold">JOB ORDER DETAILS</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-3 h-fit relative">
            <h4 className="text-lg font-bold text-gray-600 text-center mb-5">
              Job Request
            </h4>
            <Button
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600"
              size="lg"
              type="button"
              onClick={handleAddJobOrderDetails("job_request")}
            >
              <Plus /> Add Job Request
            </Button>
            {formInputs.job_order_details
              .filter((item) => item.type === "job_request")
              .map((detail, index) => (
                <div key={index} className="flex gap-3 space-y-2">
                  <div className="w-full space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      type={"text"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.category
                      }
                      onChange={handleJobOrderDetailChange(
                        detail.id,
                        "category",
                      )}
                    />
                  </div>
                  {formInputs.job_order_details
                    .find((item) => item.id === detail.id)
                    ?.category?.startsWith("Coupon") && (
                    <div className="w-full space-y-2">
                      <Label>Parts Brand</Label>
                      <select
                        className="py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        required
                        value={
                          formInputs.job_order_details.find(
                            (item) => item.id === detail.id,
                          )?.part_brand || ""
                        }
                        onChange={handleJobOrderDetailChange(
                          detail.id,
                          "part_brand",
                        )}
                      >
                        <option value="n/a" disabled>
                          Select Brand
                        </option>
                        {brandChoices.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="w-full space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type={"number"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.amount
                      }
                      onChange={handleJobOrderDetailChange(detail.id, "amount")}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleDeleteJobOrderDetail(
                      detail.id,
                      detail.category,
                    )}
                    variant="destructive"
                    className="mt-6"
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
          </div>
          <div className="border rounded-lg p-3 h-fit relative">
            <h4 className="text-lg font-bold text-gray-600 text-center mb-5">
              Parts Used
            </h4>
            <Button
              className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600"
              size="lg"
              type="button"
              onClick={handleAddJobOrderDetails("parts_replacement")}
            >
              <Plus /> Add Parts Used
            </Button>
            {formInputs.job_order_details
              .filter((item) => item.type === "parts_replacement")
              .map((detail, index) => (
                <div key={index} className="flex gap-3 space-y-2">
                  <div className="w-full space-y-2">
                    <Label>Parts Name</Label>
                    <Input
                      type={"text"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.category
                      }
                      onChange={handleJobOrderDetailChange(
                        detail.id,
                        "category",
                      )}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Parts Brand</Label>
                    <select
                      className="py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      required
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.part_brand
                      }
                      onChange={handleJobOrderDetailChange(
                        detail.id,
                        "part_brand",
                      )}
                    >
                      <option value="" disabled>
                        Select Brand
                      </option>
                      {brandChoices.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Part Number</Label>
                    <Input
                      type={"text"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.part_number
                      }
                      onChange={handleJobOrderDetailChange(
                        detail.id,
                        "part_number",
                      )}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Qty</Label>
                    <Input
                      type={"number"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.quantity
                      }
                      onChange={handleJobOrderDetailChange(
                        detail.id,
                        "quantity",
                      )}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type={"number"}
                      className="h-10"
                      value={
                        formInputs.job_order_details.find(
                          (item) => item.id === detail.id,
                        )?.amount
                      }
                      onChange={handleJobOrderDetailChange(detail.id, "amount")}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleDeleteJobOrderDetail(
                      detail.id,
                      detail.category,
                    )}
                    variant="destructive"
                    className="mt-6"
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} className="w-lg">
        <ModalHeader
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <span className="capitalize">
            Add {inputFields.type.replaceAll("_", " ")}
          </span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <div className="w-full space-y-2">
              <Label>
                {inputFields.type === "job_request"
                  ? "Category Name"
                  : "Parts Name"}
              </Label>
              <Input
                type={"text"}
                className="h-10"
                value={inputFields.category}
                onChange={(e) =>
                  setInputFields((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
              {errors?.category && (
                <small className="text-red-500">{errors?.category}</small>
              )}
            </div>
            <Activity
              mode={
                inputFields.type === "parts_replacement" ||
                inputFields.category.startsWith("Coupon")
                  ? "visible"
                  : "hidden"
              }
            >
              <div className="w-full space-y-2">
                <Label>Parts Brand</Label>
                <select
                  className="py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  required
                  value={inputFields.part_brand}
                  onChange={(e) =>
                    setInputFields((prev) => ({
                      ...prev,
                      part_brand: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Brand
                  </option>
                  {brandChoices.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                {errors?.part_brand && (
                  <small className="text-red-500">{errors?.part_brand}</small>
                )}
              </div>
            </Activity>
            <Activity
              mode={
                inputFields.type === "parts_replacement" ? "visible" : "hidden"
              }
            >
              <div className="w-full space-y-2">
                <Label>Part Number</Label>
                <Input
                  type={"text"}
                  className="h-10"
                  value={inputFields.part_number}
                  onChange={(e) =>
                    setInputFields((prev) => ({
                      ...prev,
                      part_number: e.target.value,
                    }))
                  }
                />
                {errors?.part_number && (
                  <small className="text-red-500">{errors?.part_number}</small>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label>Qty</Label>
                <Input
                  type={"number"}
                  className="h-10"
                  value={inputFields.quantity}
                  onChange={(e) =>
                    setInputFields((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
                {errors?.quantity && (
                  <small className="text-red-500">{errors?.quantity}</small>
                )}
              </div>
            </Activity>
            <div className="w-full space-y-2">
              <Label>Amount</Label>
              <Input
                type={"number"}
                className="h-10"
                value={inputFields.amount}
                onChange={(e) =>
                  setInputFields((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
              {errors?.amount && (
                <small className="text-red-500">{errors?.amount}</small>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="bg-gray-400 hover:bg-gray-500 text-white py-5 px-3"
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 py-5 px-5"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
