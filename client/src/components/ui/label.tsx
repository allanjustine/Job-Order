import clsx from "clsx";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
      className={twMerge(
        clsx(
          onCheck
            ? "flex items-center gap-2 cursor-pointer hover:text-gray-500"
            : "block text-sm font-medium text-gray-700 mb-1",
          className
        )
      )}
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
