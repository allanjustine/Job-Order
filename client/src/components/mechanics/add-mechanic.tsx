import Button from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .nonempty("Name is required"),
});

interface FormItem {
  name: string;
  user_id?: string;
}

interface UserData {
  id: number;
  name: string;
  code: string;
}

export default function AddMechanic({
  isOpen,
  setIsOpen,
  fetchData,
  setMechanicAdded,
  mechanicAdded,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  setMechanicAdded: Dispatch<SetStateAction<number>>;
  mechanicAdded: number;
}) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormItem>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      user_id: "",
    },
  });

  async function onSubmit(data: any) {
    try {
      const response = await api.post("/mechanics", {
        name: data.name,
        user_id: user?.id,
      });

      if (response.status === 201) {
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
        setMechanicAdded(mechanicAdded + 1);
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
            Add Mechanic
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" required>
                  Mechanic Name
                </Label>
                <Input
                  className="py-3"
                  placeholder="Enter mechanic name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
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
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Add"}
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
