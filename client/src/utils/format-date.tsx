import { formatDate as f } from "date-fns";

export default function formatDate(date: Date | undefined) {
  if (!date) return null;

  return f(new Date(date), "yyyy-MM-dd");
}
