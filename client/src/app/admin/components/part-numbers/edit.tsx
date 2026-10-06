import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  part_number: z
    .string()
    .min(2, "Part_number must be at least 2 characters long")
    .max(50, "Part_number must be at most 50 characters long")
    .nonempty("Part_number is required"),
});

interface FormItem {
  part_number: string;
}

export default function EditPartBrand({
  isOpen,
  setIsOpen,
  fetchData,
  selectedPartNumber,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  selectedPartNumber: any;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormItem>({
    resolver: zodResolver(schema),
    values: {
      part_number: selectedPartNumber.part_number || "",
    },
  });

  async function onSubmit(data: any) {
    try {
      const response = await api.patch(
        `/part-numbers/${selectedPartNumber.id}`,
        {
          part_number: data.part_number,
        },
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
          },
        );
      }
    }
  }

  return (
    <>
      <Modal className="w-1/4" isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            Edit Part Number
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name">Part Number</Label>
                <Input
                  className="py-3"
                  placeholder="Enter part number"
                  {...register("part_number", { required: true })}
                />
                {errors.part_number && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.part_number.message}
                  </p>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white py-5"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Updating...
                </>
              ) : (
                <>
                  <Edit /> Update
                </>
              )}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white py-5"
            >
              Close
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
