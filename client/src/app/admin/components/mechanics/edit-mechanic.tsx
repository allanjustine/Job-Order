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
import Select from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .nonempty("Name is required"),
  user_id: z.string().nonempty("Branch selection is required"),
});

interface FormItem {
  name: string;
  user_id: string;
}

interface UserData {
  id: number;
  name: string;
  code: string;
}

export default function EditMechanic({
  isOpen,
  setIsOpen,
  fetchData,
  selectedMechanic,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  selectedMechanic: any;
}) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormItem>({
    resolver: zodResolver(schema),
    values: selectedMechanic
      ? {
          name: selectedMechanic.name,
          user_id: String(selectedMechanic.user_id),
        }
      : {
          name: "",
          user_id: "",
        },
  });

  useEffect(() => {
    if (!isOpen) return;
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await api.get("/user-selection-options");
        if (response.status === 200) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user selection options:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, [isOpen]);

  async function onSubmit(data: any) {
    try {
      const response = await api.patch(`/mechanics/${selectedMechanic.id}`, {
        name: data.name,
        user_id: data.user_id,
      });

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
            Edit Mechanic
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
              <div>
                <Label htmlFor="user_id" required>
                  Select branch
                </Label>
                {isLoading ? (
                  <p className="text-gray-500 text-md">Loading branches...</p>
                ) : (
                  <Select
                    className="py-2.5"
                    {...register("user_id", { required: true })}
                  >
                    <option value="" disabled>
                      Select branch
                    </option>
                    {users.length < 0 ? (
                      <option value="" disabled>No branches found</option>
                    ) : (
                      users.map((user: UserData, index: number) => (
                        <option key={index} value={String(user.id)}>
                          {`(${user.code}) - ${user.name}`}
                        </option>
                      ))
                    )}
                  </Select>
                )}
                {errors.user_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user_id.message}
                  </p>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
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
