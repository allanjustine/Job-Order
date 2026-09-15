import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import Select from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import capitalized from "@/utils/capitalize";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .nonempty("Name is required"),
  code: z
    .string()
    .toUpperCase()
    .min(2, "Code must be at least 2 characters long")
    .max(15, "Code must be at most 15 characters long")
    .nonempty("Code is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  branch_id: z.string().nonempty("Branch selection is required"),
  role_id: z.string().nonempty("Role selection is required"),
});

type FormItem = z.infer<typeof schema>;

const initialValues: FormItem = {
  name: "",
  code: "",
  email: "",
  branch_id: "",
  role_id: "",
};

interface RoleType {
  id: number | string;
  name: string;
}

interface BranchType {
  id: number | string;
  branch_name: string;
  branch_code: string;
}

interface SelectType {
  id: number | string;
  branch_name?: string;
  branch_code?: string;
  name?: string;
}

export interface UserType {
  id: string;
  name: string;
  code: string;
  email: string;
  branch_id: string;
  roles: {
    id: string;
  }[];
}

export default function EditUser({
  isOpen,
  setIsOpen,
  fetchData,
  selectedUser,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  selectedUser: UserType | null;
}) {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branches, setBranches] = useState<BranchType[]>([]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    values: {
      name: selectedUser?.name || "",
      code: selectedUser?.code || "",
      email: selectedUser?.email || "",
      branch_id: String(selectedUser?.branch_id) || "",
      role_id: String(selectedUser?.roles[0]?.id) || "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    handleFetchItems();
  }, [isOpen]);

  const handleFetchItems = async () => {
    setIsLoading(true);
    try {
      const [roles, branches] = await Promise.all([
        api.get("/get-all-roles"),
        api.get("/branches"),
      ]);

      if (roles.status === 200) {
        setRoles(roles.data.data);
      }

      if (branches.status === 200) {
        setBranches(branches.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await api.patch(
        `/users/${selectedUser?.id}/update-details`,
        data,
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
  };

  useMemo(() => {
    if (!watch("name")) return;

    setValue(
      "email",
      `${watch("name")?.toLowerCase().replace(/ /g, "_")}@smctgroup.com`,
    );
  }, [watch("name")]);

  const FORM_ARRAY = Object.entries(initialValues).map(
    ([key, value]) => key,
  ) as [keyof typeof initialValues];

  const SELECT_DATA: { [key: string]: SelectType[] } = {
    role_id: roles,
    branch_id: branches,
  };

  return (
    <Modal className="w-1/4" isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader onClose={() => setIsOpen(false)}>Edit User</ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            {FORM_ARRAY.map((key) => (
              <div key={key}>
                <Label htmlFor={key}>
                  {capitalized(key).split("_").shift()}
                </Label>
                {!["role_id", "branch_id"].includes(key) ? (
                  <Input
                    className="py-3"
                    placeholder="Enter name"
                    {...register(key, { required: true })}
                  />
                ) : isLoading ? (
                  <Skeleton className="w-full h-12 border" />
                ) : (
                  <Select className="py-2.5" {...register(key)}>
                    <option value="" disabled>
                      Select {key.split("_").shift()}
                    </option>
                    {SELECT_DATA[key].length < 0 ? (
                      <option value="" disabled>
                        No {key.split("_").shift()} found
                      </option>
                    ) : (
                      SELECT_DATA[key].map(
                        (item: SelectType, index: number) => (
                          <option key={index} value={String(item.id)}>
                            {item.name || item.branch_name}
                          </option>
                        ),
                      )
                    )}
                  </Select>
                )}
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[key]!.message}
                  </p>
                )}
              </div>
            ))}
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
                <Save /> Update
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
  );
}
