import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function Input({
  error,
  className,
  ...props
}: {
  error?: boolean | null | string;
  className?: string;
} & ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={cn(
        `${
          props?.type === "checkbox"
            ? "h-4 w-4 rounded border-gray-300 text-blue-600"
            : "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        } ${error && "border-red-500"}`,
        className,
      )}
    />
  );
}
