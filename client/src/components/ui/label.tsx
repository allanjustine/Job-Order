import cn from "@/lib/utils";
import { ReactNode } from "react";

export default function Label({
  children,
  required,
  onCheck,
  className,
}: {
  children: ReactNode;
  required?: boolean;
  onCheck?: boolean;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        onCheck
          ? "flex items-center gap-2 cursor-pointer hover:text-gray-500"
          : "block text-sm font-semibold text-gray-500 mb-1",
        className
      )}
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
