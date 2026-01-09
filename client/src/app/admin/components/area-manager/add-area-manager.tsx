import Button from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Select, { MultiValue } from "react-select";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .nonempty("Name is required"),
  user_ids: z.array(z.number()).refine((value) => value.length > 0, {
    message: "Branch selection is required",
  }),
});

interface FormItem {
  name: string;
  user_ids: number[];
}

interface UserData {
  id: number;
  name: string;
  code: string;
}

export default function AddAreaManager({
  isOpen,
  setIsOpen,
  fetchData,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormItem>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      user_ids: [],
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await api.get("/user-selection-options", {
          params: {
            type: "area-manager",
          },
        });
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
      const response = await api.post("/area-managers", {
        name: data.name,
        user_ids: data.user_ids,
        month_of: data.month_of,
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
            Add Area Manager
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" required>
                  Area Manager
                </Label>
                <Input
                  type="text"
                  className="py-3"
                  placeholder="Enter name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="user_ids" required>
                  Select branch
                </Label>
                <Controller
                  name="user_ids"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={users.map((user) => ({
                        value: user.id,
                        label: `(${user.code}) - ${user.name}`,
                      }))}
                      onChange={(
                        val: MultiValue<{ value: number; label: string }>
                      ) => field.onChange(val.map((v) => v.value))}
                      value={users
                        .filter((user) => field.value.includes(user.id))
                        .map((user) => ({
                          value: user.id,
                          label: `(${user.code}) - ${user.name}`,
                        }))}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  )}
                />
                {errors.user_ids && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user_ids.message}
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
