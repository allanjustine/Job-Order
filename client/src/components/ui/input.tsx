import cn from "@/lib/utils";
import { ChangeEvent } from "react";

export default function Input({
  error,
  className,
  ...props
}: {
  error?: boolean | null | string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hidden?: boolean;
  checked?: boolean;
  disabled?: boolean;
  min?: string | number;
  step?: string;
  className?: string;
  name?: string;
  id?: string;
  readOnly?: boolean;
  max?: string | number;
  ref?: any;
}) {
  return (
    <input
      {...props}
      className={cn(
        `${
          props?.type === "checkbox"
            ? "h-4 w-4 rounded border-gray-300 text-blue-600"
            : "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        } ${error && "border-red-500"}`,
        className
      )}
    />
  );
}
