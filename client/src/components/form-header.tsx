import capitalized from "@/utils/capitalize";
import { Caravan } from "lucide-react";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { FaMotorcycle } from "react-icons/fa6";

export default function FormHeader({
  category,
}: {
  category: "motors" | "trimotors";
}) {
  const IconItem = category === "motors" ? FaMotorcycle : Caravan;
  return (
    <div className="flex justify-between sticky top-0 bg-white p-5">
      <Link
        href="/dashboard"
        className="flex gap-2 p-2 bg-gray-400 hover:bg-gray-500 rounded-xl text-white items-center"
      >
        <BiArrowBack /> Back
      </Link>
      <Link
        href={`/${category}-job-order-form`}
        className="flex gap-2 p-2 bg-blue-400 hover:bg-blue-500 rounded-xl text-white items-center"
      >
        <IconItem /> Proceed to {capitalized(category)}
      </Link>
    </div>
  );
}
