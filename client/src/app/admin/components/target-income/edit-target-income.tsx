import Button from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Dispatch, SetStateAction } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  target_income: z
    .number()
    .min(1, "Target income must be at least 1")
    .max(999999, "Target income must be less than 999999"),
});

interface FormItem {
  target_income: number;
  user_id?: string;
}

export default function EditTargetIncome({
  isOpen,
  setIsOpen,
  fetchData,
  selectedTargetIncome,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  selectedTargetIncome: any;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormItem>({
    resolver: zodResolver(schema),
    values: selectedTargetIncome
      ? {
          target_income: selectedTargetIncome.target_income,
          user_id: String(selectedTargetIncome.user_id),
        }
      : {
          target_income: "",
          user_id: "",
        },
  });

  async function onSubmit(data: any) {
    try {
      const response = await api.patch(
        `/target-incomes/${selectedTargetIncome.id}`,
        {
          target_income: data.target_income,
        }
      );

      if (response.status === 200) {
        setIsOpen(false);
        reset();
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
        fetchData();
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            const msgs = messages as string[];

            setError(field as keyof FormItem, {
              type: "server",
              message: msgs[0],
            });
          }
        );
      }
    }
  }

  return (
    <>
      <Modal className="w-1/4" isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            Edit Target Income
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" required>
                  Target Income
                </Label>
                <Input
                  className="py-3"
                  placeholder="Enter target income"
                  {...register("target_income", { valueAsNumber: true })}
                />
                {errors.target_income && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.target_income.message}
                  </p>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Close
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
