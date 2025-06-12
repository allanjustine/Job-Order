import { ReactNode } from "react";

export default function Label({
  children,
  required,
  onCheck,
}: {
  children: ReactNode;
  required?: boolean;
  onCheck?: boolean;
}) {
  return (
    <label
      className={
        onCheck
          ? "flex items-center gap-2 cursor-pointer hover:text-gray-500"
          : "block text-sm font-medium text-gray-700 mb-1"
      }
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
