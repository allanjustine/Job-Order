import { Skeleton } from "./ui/skeleton";

export default function EditJoLoader() {
  return (
    <div className="space-y-10">
      <div className="border-b py-3">
        <Skeleton className="h-12 w-1/4" />
      </div>
      <div className="grid grid-cols-2 gap-4 border rounded-xl p-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="flex flex-col items-center justify-center space-y-3"
            key={index}
          >
            <Skeleton className="h-8 w-1/4 text-center" />
            <div className="border p-5 rounded-xl w-full space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="flex items-center w-full gap-4" key={index}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="w-full space-y-2 flex flex-col">
                      <Skeleton className="h-6 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-5">
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] space-y-2"
              key={index}
            >
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
