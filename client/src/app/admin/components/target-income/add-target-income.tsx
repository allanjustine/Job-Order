import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Activity, Dispatch, SetStateAction, useEffect, useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { MultipleSelect } from "@/components/ui/multiple-select";

const schema = z.object({
  target_income: z
    .number()
    .min(1, "Target income must be at least 1")
    .max(999999, "Target income must be less than 999999"),
  user_ids: z.array(z.string()).min(1, "Branch selection is required"),
});

interface FormItem {
  target_income: number;
  user_ids: string[];
}

export interface UserData {
  id: number;
  name: string;
  code: string;
}

export default function AddTargetIncome({
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
  const [value, setValue] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
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
      target_income: 0,
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
            type: "target-income",
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
      const response = await api.post("/target-incomes", {
        target_income: data.target_income,
        user_ids: data.user_ids,
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
          },
        );
      }
    }
  }
  async function handleSyncWithLastMonth() {
    setIsSyncing(true);
    try {
      const response = await api.post("/target-incomes/sync-with-last-month");

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
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <>
      <Modal className="w-1/4" isOpen={isOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            Add Target Income
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <div>
                {isLoading ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                  <Controller
                    name="user_ids"
                    control={control}
                    render={({ field }) => (
                      <MultipleSelect
                        value={field.value}
                        setValue={field.onChange}
                        userLists={users}
                        placeholder="Select branches"
                      />
                    )}
                  />
                )}
                {errors.user_ids && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.user_ids.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="target_income">Target Income</Label>
                <Input
                  type="number"
                  min="1"
                  max="999999"
                  className="py-3"
                  placeholder="Enter target income (1-999999)"
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
            <Activity mode={users?.length > 0 ? "visible" : "hidden"}>
              <Button
                type="button"
                onClick={handleSyncWithLastMonth}
                disabled={isSubmitting || isLoading || isSyncing}
                className="bg-green-500 hover:bg-green-600 text-white py-5"
              >
                {isSyncing ? (
                  <>
                    <Spinner /> Syncing...
                  </>
                ) : (
                  <>
                    <Plus /> Sync with Last Month
                  </>
                )}
              </Button>
            </Activity>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || isSyncing}
              className="bg-blue-500 hover:bg-blue-600 text-white py-5"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Adding...
                </>
              ) : (
                <>
                  <Plus /> Add
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
