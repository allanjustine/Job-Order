import { ReactNode } from "react";

export default function ValidationText({ children }: { children: ReactNode }) {
  return <small className="text-red-500 font-bold">{children}</small>;
}
