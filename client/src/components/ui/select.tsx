import cn from "@/lib/utils";
import { ChangeEvent, ReactNode } from "react";

export default function Select({
  className,
  error,
  children,
  ...props
}: {
  className?: string;
  error?: boolean | null | string;
  children: ReactNode;
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string | number;
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
}) {
  return (
    <select
      {...props}
      className={cn(
        `w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          error && "border-red-500"
        }`,
        className
      )}
    >
      {children}
    </select>
  );
}
