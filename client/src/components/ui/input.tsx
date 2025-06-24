import clsx from "clsx";
import { ChangeEvent } from "react";
import { twMerge } from "tailwind-merge";

export default function Input({
  error,
  className,
  ...props
}: {
  error?: boolean | null | string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
  checked?: boolean;
  disabled?: boolean;
  min?: string;
  step?: string;
  className?: string;
  name?: string;
  id?: string;
}) {
  return (
    <input
      {...props}
      className={twMerge(
        clsx(
          `${
            props?.type === "checkbox"
              ? "h-4 w-4 rounded border-gray-300 text-blue-600"
              : "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          } ${error && "border-red-500"}`,
          className
        )
      )}
    />
  );
}
