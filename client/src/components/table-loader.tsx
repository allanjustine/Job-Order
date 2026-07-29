import { FaMagnifyingGlass } from "react-icons/fa6";
import { Skeleton } from "./ui/skeleton";

export default function TableLoader({
  isSearching,
  searchTerm,
}: {
  isSearching: boolean;
  searchTerm?: string;
}) {
  return (
    <>
      {isSearching ? (
        <div className="py-8 text-sm text-gray-500 flex items-center justify-center gap-2">
          <FaMagnifyingGlass className="animate-ping" /> Searching{" "}
          {searchTerm && `"${searchTerm}"`}...
        </div>
      ) : (
        <div className="flex flex-col gap-1 p-2 w-full">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton
              className="w-full h-10"
              key={index}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </div>
      )}
    </>
  );
}
