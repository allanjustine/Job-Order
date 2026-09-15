import { format } from "date-fns";

export const formatDateAndTime = (date?: string | null) => {
  if (!date) return "";

  return format(new Date(date), "MMM dd, yyyy hh:mm a");
};
