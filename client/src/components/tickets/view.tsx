import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";
import { Button } from "../ui/button";
import {
  JobOrderType,
  TICKET_STATUS_COLOR,
  TicketCategoryOrBrandType,
  UserType,
} from "./base";
import { api } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { TICKET_STATUS } from "@/constants/ticket-status";
import { formatDateAndTime } from "@/utils/format-date-and-time";
import TicketChangeRequests from "./change-requests";
import TicketAttachments from "./attachments";
import TicketNotes from "./notes";
import Swal from "sweetalert2";
import { Pen } from "lucide-react";
import { TICKETS_ACCESS } from "@/lib/permissions";

type ViewTicketProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  id: string | number | null;
  fetchDataProp: () => void;
  setId: Dispatch<SetStateAction<string | number | null>>;
};

export type AttachmentsType = {
  id: string | number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: string;
};

export type ChangeRequestsType = {
  from: string;
  to: string;
};

export type NotesType = {
  id: string | null;
  noted_by: UserType;
  content: string;
};

type TicketType = {
  id: string | number;
  user: UserType;
  ticket_category: TicketCategoryOrBrandType;
  ticket_brand: TicketCategoryOrBrandType;
  title: string;
  ticket_code: string;
  status: string;
  job_order: JobOrderType;
  description: string;
  edited_at: string | null;
  edited_by: UserType | null;
  notes: NotesType[];
  created_at: string;
  attachments: AttachmentsType[];
  change_requests: ChangeRequestsType[];
  rejected_reason: string | null;
};

export default function ViewTicket({
  isOpen,
  setIsOpen,
  id,
  fetchDataProp,
  setId,
}: ViewTicketProps) {
  const { user } = useAuth();
  const [data, setData] = useState<TicketType | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!id && !isOpen) return;
    fetchData();
  }, [id, isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tickets/${id}`);
      if (response.status === 200) {
        setData(response.data.data);
        setError("");
      }
    } catch (error: any) {
      console.error(error);
      setData(null);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketStatus =
    (ticketId: string | number, title: string) => () => {
      Swal.fire({
        title: `Are you sure you want to ${title} this ticket?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${title} it!`,
        input: "textarea",
        inputPlaceholder: "Enter a note",
        allowOutsideClick: false,
        showCloseButton: true,
        customClass: {
          input: "resize-none h-46!",
        },
        inputAttributes: {
          "aria-label": "Enter a note",
        },
        inputValidator: (value) => {
          if (!value.trim()) {
            return "Please enter a note!";
          }

          if (value.trim().length < 10) {
            return "Note must be at least 10 characters.";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: `${title === "reject" ? "Rejecting" : "Editing"} Ticket...`,
            text: "Please wait...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          try {
            const response = await api.patch(`/tickets/${ticketId}/${title}`, {
              note: result.value,
            });
            if (response.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: response.data.message,
              });
              fetchDataProp();
              setIsOpen(false);
              setId(null);
            }
          } catch (error: any) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.response.data.message ||
                "Something went wrong. Please try again later.",
            });
          }
        }
      });
    };

  const handleAddNote = async () => {
    Swal.fire({
      title: `Are you sure you want to add a note to this ticket?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, add note!`,
      input: "textarea",
      inputPlaceholder: "Enter a note",
      allowOutsideClick: false,
      showCloseButton: true,
      customClass: {
        input: "resize-none h-46!",
      },
      inputAttributes: {
        "aria-label": "Enter a note",
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter a note!";
        }

        if (value.trim().length < 10) {
          return "Note must be at least 10 characters.";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Adding note...`,
          text: "Please wait...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.patch(
            `/tickets/add-note/${data!.id}/add-note`,
            {
              note: result.value,
            },
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            fetchData();
          }
        } catch (error: any) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response.data.message ||
              "Something went wrong. Please try again later.",
          });
        }
      }
    });
  };

  const handleEditRejectedReason = async () => {
    Swal.fire({
      title: `Are you sure you want to update the rejected reason to this ticket?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, update it!`,
      input: "textarea",
      inputPlaceholder: "Enter a new rejected reason",
      allowOutsideClick: false,
      showCloseButton: true,
      inputValue: data?.rejected_reason,
      customClass: {
        input: "resize-none h-46!",
      },
      inputAttributes: {
        "aria-label": "Enter a new rejected reason",
      },
      inputValidator: (value) => {
        if (!value.trim()) {
          return "Please enter a new rejected reason!";
        }

        if (value.trim().length < 10) {
          return "Rejected reason must be at least 10 characters.";
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `Updating rejected reason...`,
          text: "Please wait...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          const response = await api.patch(
            `/tickets/rejected-reason/${data!.id}/update-rejected-reason`,
            {
              rejected_reason: result.value,
            },
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: response.data.message,
            });
            fetchData();
          }
        } catch (error: any) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              error.response.data.message ||
              "Something went wrong. Please try again later.",
          });
        }
      }
    });
  };

  return (
    <Modal isOpen={isOpen && id} className="w-xl">
      <ModalHeader
        onClose={() => {
          setIsOpen(false);
          setId(null);
          setData(null);
        }}
      >
        {isLoading ? (
          <Skeleton className="w-78 h-10 bg-slate-200" />
        ) : (
          <span className="flex items-center gap-2">
            <span>Viewing Ticket of Job Order</span>
            <span
              className={`${TICKET_STATUS_COLOR[data?.status as keyof typeof TICKET_STATUS_COLOR]} font-bold px-3 py-1.5 rounded-xl uppercase text-[9px]`}
            >
              {data?.status}
            </span>
          </span>
        )}
      </ModalHeader>
      <ModalBody>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="w-full h-20 bg-slate-200" />
            <Skeleton className="w-full h-50 bg-slate-200" />
            <Skeleton className="w-full h-30 bg-slate-200" />
          </div>
        ) : error ? (
          <small className="text-red-500">{error}</small>
        ) : (
          <div className="flex flex-col space-y-3">
            <Card title="Job Order Information">
              <CardItem
                title="Job Order Number"
                value={data?.job_order.job_order_number}
              />
              <CardItem
                title="Transcation Code"
                value={data?.job_order.transaction_code ?? "N/A"}
              />
            </Card>
            <Card title="Ticket Information">
              <CardItem title="Ticket Code" value={data?.ticket_code} />
              <CardItem title="Title" value={data?.title} />
              <CardItem title="Ticket Brand" value={data?.ticket_brand.name} />
              <CardItem
                title="Ticket Category"
                value={data?.ticket_category.name}
              />
              <CardItem
                title="Created At"
                value={formatDateAndTime(data?.created_at)}
              />
              <CardItem
                title="Created By"
                value={`${data?.user?.name} (${data?.user?.code})`}
              />
            </Card>
            <Card title="Other Details" cols="grid-cols-1">
              <CardItem title="Description" value={data?.description} />
              {data?.edited_by && (
                <CardItem title="Edited By" value={data?.edited_by.name} />
              )}
              {data?.edited_at && (
                <CardItem
                  title="Edited At"
                  value={formatDateAndTime(data?.edited_at)}
                />
              )}
            </Card>
            {data?.rejected_reason && (
              <Card
                title="Rejected Reason"
                cols="grid-cols-1"
                button={
                  TICKETS_ACCESS.includes(user?.roles[0]?.name) && (
                    <Button
                      type="button"
                      onClick={handleEditRejectedReason}
                      className="bg-blue-500 hover:bg-blue-600 hover:scale-102 hover:translate-x-1"
                      size="sm"
                    >
                      <Pen /> Edit Reason
                    </Button>
                  )
                }
              >
                <CardItem
                  title="Content"
                  value={data?.rejected_reason}
                  danger
                />
              </Card>
            )}
            {data?.attachments?.length! > 0 && (
              <TicketAttachments attachments={data!.attachments} />
            )}
            {data?.change_requests?.length! > 0 && (
              <TicketChangeRequests changeRequests={data!.change_requests} />
            )}
            {TICKETS_ACCESS.includes(user?.roles[0]?.name) &&
              data?.status === TICKET_STATUS.EDITED && (
                <TicketNotes
                  notes={data!.notes}
                  handleAddNote={handleAddNote}
                  fetchData={fetchData}
                />
              )}
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          className="bg-gray-400 hover:bg-gray-500 text-white py-5"
          onClick={() => {
            setIsOpen(false);
            setId(null);
            setData(null);
          }}
        >
          Close
        </Button>
        {TICKETS_ACCESS.includes(user?.roles[0]?.name) &&
          data?.status === TICKET_STATUS.PENDING && (
            <>
              <Button
                type="button"
                className="bg-red-400 hover:bg-red-500 text-white py-5"
                onClick={handleUpdateTicketStatus(data.id, "reject")}
              >
                Reject
              </Button>
              <Button
                type="button"
                className="bg-cyan-400 hover:bg-cyan-500 text-white py-5"
                onClick={handleUpdateTicketStatus(data.id, "edit")}
              >
                Mark as Edited
              </Button>
              <Link
                href={`/admin/reports/${data?.job_order.id}`}
                className="bg-blue-400 hover:bg-blue-500 text-white flex items-center justify-center px-3 rounded-lg text-xs font-bold h-10"
                target="_blank"
              >
                View Job Order
              </Link>
            </>
          )}
      </ModalFooter>
    </Modal>
  );
}

export const Card = ({
  title,
  cols,
  button,
  children,
}: {
  title: string;
  cols?: string;
  button?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="border px-4 py-2 rounded-xl shadow-lg hover:shadow-xl space-y-2">
      <h2
        className={`font-bold text-gray-400 tracking-wide uppercase ${button && "flex items-center justify-between"}`}
      >
        {title}
        {button}
      </h2>
      <div className={`grid ${cols ?? "grid-cols-2"} space-y-2`}>
        {children}
      </div>
    </div>
  );
};

export const CardItem = ({
  title,
  value,
  danger,
}: {
  title: string;
  value?: string | number;
  danger?: boolean;
}) => {
  return (
    <div className="space-y-1">
      <h2 className="text-xs font-semibold dark:text-white text-gray-400 uppercase tracking-wide flex items-center gap-1">
        {title}
      </h2>
      <p
        className={`text-xs font-semibold text-gray-900 tracking-wide whitespace-break-spaces wrap-break-word ${danger && "text-red-500"}`}
      >
        {value}
      </p>
    </div>
  );
};
