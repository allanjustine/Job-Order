import { format } from "date-fns";

export default function MonthOptions() {
  const months = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date(2000, i, 1);

    return {
      value: date.getMonth() + 1,
      label: format(date, "MMMM"),
    };
  });

  return (
    <>
      <option value="">Select Month</option>
      {months.map((month) => (
        <option key={month.value} value={month.value}>
          {month.label}
        </option>
      ))}
    </>
  );
}
