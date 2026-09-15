import Input from "../ui/input";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import { Spinner } from "../ui/spinner";
import { FaCheckCircle } from "react-icons/fa";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { api } from "@/lib/api";
import Select from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "../ui/attachment";
import toast from "react-hot-toast";
import { formatBytes } from "@/utils/format-bytes";

const schema = z.object({
  title: z.string().min(2).max(255).nonempty("Title is required"),
  description: z.string().min(2).max(5000).nonempty("Description is required"),
  ticket_category_id: z.string().nonempty("Ticket category is required"),
  ticket_brand_id: z.string().nonempty("Ticket brand is required"),
  attachments: z.custom<FileList>().optional(),
  froms: z.array(z.string()).optional(),
  from_tos: z
    .array(
      z.object({
        from: z.string().nonempty("From is required"),
        to: z.string().nonempty("To is required"),
      }),
    )
    .optional(),
  job_order_id: z.string().optional(),
});

const initialValues: FormInput = {
  title: "",
  description: "",
  ticket_category_id: "",
  ticket_brand_id: "",
  attachments: undefined,
  from_tos: [
    {
      from: "",
      to: "",
    },
  ],
  job_order_id: "",
};

type FormInput = z.infer<typeof schema>;

type DataType = {
  categories: {
    id: number | string;
    name: string;
  }[];
  brands: {
    id: number | string;
    name: string;
  }[];
};

export default function CreateTicket({
  isOpen,
  setIsOpen,
  fetchData,
  selectedData,
  fetchDashboardData,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
  selectedData: {
    id: number | string;
    transaction_code: string;
  } | null;
  fetchDashboardData: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DataType>({
    categories: [],
    brands: [],
  });
  const {
    control,
    register,
    handleSubmit,
    setError,
    watch,
    formState: { isSubmitting, errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "from_tos",
  });

  useEffect(() => {
    if (!isOpen || !selectedData?.id) return;
    handleFetchCategoriesAndBrands();
    setValue("job_order_id", String(selectedData?.id));
  }, [isOpen, selectedData?.id]);

  const handleFetchCategoriesAndBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get("/ticket-categories-and-brands");
      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (!["attachments", "from_tos"].includes(key)) {
          formData.append(key, String(value));
        }
      });

      if (data.attachments) {
        Array.from(data.attachments).forEach((file: any) => {
          formData.append("attachments[]", file);
        });
      }

      const from_tos = data.from_tos
        .filter((item: { from: string; to: string }) => item.from && item.to)
        .map((item: { from: string; to: string }) => ({
          from: item.from,
          to: item.to,
        }));

      if (from_tos.length > 0) {
        from_tos.forEach(
          (item: { from: string; to: string }, index: number) => {
            formData.append(`from_tos[${index}][from]`, item.from);
            formData.append(`from_tos[${index}][to]`, item.to);
          },
        );
      }

      const response = await api.post("/tickets", formData);

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
        fetchDashboardData();
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            const msgs = messages as string[];

            setError(field as keyof FormInput, {
              type: "server",
              message: msgs[0],
            });
          },
        );
      }

      if (error.response.status === 400) {
        toast.error(error.response.data.message, {
          position: "bottom-center",
          duration: 5000,
          icon: "❌",
          style: {
            borderRadius: "15px",
            background: "#FF0000",
            color: "#fff",
            padding: "15px",
          },
        });
      }
    }
  };

  const attachments = watch("attachments");

  const previews = useMemo(() => {
    if (!attachments) return [];

    return Array.from(attachments).map((file: any) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
  }, [attachments]);

  return (
    <Modal isOpen={isOpen} className="w-lg">
      <ModalHeader onClose={() => setIsOpen(false)}>
        Submitting a ticket for "{selectedData?.transaction_code || "N/A"}"
      </ModalHeader>
      <ModalBody>
        <div className="space-y-5">
          <div>
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-600"
            >
              Ticket Title
            </Label>
            <Input
              id="title"
              type="text"
              {...register("title")}
              autoFocus
              placeholder="Enter ticket title..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="ticket_category_id"
              className="text-sm font-medium text-gray-600"
            >
              Ticket Category
            </Label>
            {loading ? (
              <Skeleton className="h-10 w-ful border" />
            ) : (
              <Select
                {...register("ticket_category_id")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {data.categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
            {errors.ticket_category_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ticket_category_id.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="ticket_brand_id"
              className="text-sm font-medium text-gray-600"
            >
              Ticket Brand
            </Label>
            {loading ? (
              <Skeleton className="h-10 w-ful border" />
            ) : (
              <Select
                {...register("ticket_brand_id")}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              >
                <option value="" disabled>
                  Select a brand
                </option>
                {data.brands.map((brand) => (
                  <option key={brand.id} value={String(brand.id)}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            )}
            {errors.ticket_brand_id && (
              <p className="text-red-500 text-xs mt-1">
                {errors.ticket_brand_id.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-600"
            >
              Ticket Description
            </Label>
            <Textarea
              id="description"
              autoFocus
              {...register("description")}
              placeholder="Enter ticket description..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none h-26!"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="attachments"
              className="text-sm font-medium text-gray-600"
            >
              Attachments (optional)
            </Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept="image/*"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              hidden
              {...register("attachments")}
            />
            <Label
              htmlFor="attachments"
              className="w-full h-12 bg-blue-400 hover:bg-blue-500 hover:scale-102 text-white font-bold py-2 px-4 flex items-center justify-center rounded-xl cursor-pointer"
            >
              Upload attachments
            </Label>
            {previews.length > 0 && (
              <AttachmentGroup>
                {previews.map((preview) => (
                  <Attachment key={preview.name} orientation="vertical">
                    <AttachmentMedia variant="image">
                      <img src={preview.url} alt={preview.name} />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{preview.name}</AttachmentTitle>
                      <AttachmentDescription
                        title={`${preview.name} · ${formatBytes(preview.size)}`}
                      >
                        {`${preview.name.split(".").at(-1)} · ${formatBytes(preview.size)}`}
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                ))}
              </AttachmentGroup>
            )}
            {previews.length > 0 && (
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-500 hover:scale-102 mt-2"
                onClick={() => {
                  setValue("attachments", undefined, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              >
                Remove All
              </Button>
            )}
            {errors.attachments && (
              <p className="text-red-500 text-xs mt-1">
                {errors.attachments.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="from_tos"
              className="text-sm font-medium text-gray-600"
            >
              Change Requests (optional)
            </Label>
            {fields.map((field, index) => (
              <div
                className="grid grid-cols-[1fr_1fr_auto] gap-1 items-center"
                key={field.id}
              >
                <div>
                  <Label
                    htmlFor="from"
                    className="text-sm font-medium text-gray-600"
                  >
                    From
                  </Label>
                  <Input
                    type="input"
                    {...register(`from_tos.${index}.from`)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />

                  {errors.from_tos?.[index]?.from && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.from_tos[index].from.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="to"
                    className="text-sm font-medium text-gray-600"
                  >
                    To
                  </Label>
                  <Input
                    type="input"
                    {...register(`from_tos.${index}.to`)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                  {errors.from_tos?.[index]?.to && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.from_tos[index].to.message}
                    </p>
                  )}
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              onClick={() => append({ from: "", to: "" })}
              className="bg-blue-500 hover:bg-blue-600 hover:scale-105"
            >
              <Plus /> Add
            </Button>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-white py-5"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={`bg-green-500 py-5 hover:bg-green-600 text-white ${
            isSubmitting ? "cursor-not-allowed!" : ""
          }`}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Submitting...
            </>
          ) : (
            <>
              <FaCheckCircle /> Submit
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
