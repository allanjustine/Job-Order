import clsx from "clsx";
import { ChangeEvent, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

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
}) {
  return (
    <select
      {...props}
      className={twMerge(
        clsx(
          `w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            error && "border-red-500"
          }`,
          className
        )
      )}
    >
      {children}
    </select>
  );
}
