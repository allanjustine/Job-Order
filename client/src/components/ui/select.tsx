import { ChangeEvent, ReactNode } from "react";

export default function Select({
  children,
  ...props
}: {
  children: ReactNode;
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string | number;
}) {
  return (
    <select
      {...props}
      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {children}
    </select>
  );
}
