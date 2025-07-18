import { ReactNode } from "react";
import cn from "@/lib/utils";

export default function Button({
  children,
  ...props
}: {
  children: ReactNode;
  type: "button" | "submit";
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  onClick?: () => void;
  ref?: any;
}) {
  return (
    <button
      {...props}
      className={cn(
        "px-6 py-2 rounded-md flex items-center gap-2 transition-all duration-300 ease-in-out",
        props.className
      )}
    >
      {children}
    </button>
  );
}
