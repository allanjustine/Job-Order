import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="bg-white flex justify-center items-center h-screen">
      <div className="max-w-md w-full rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              Unathenticated
            </h2>
            <p className="text-gray-600 mt-2">
              You must be logged in first to access that page.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg text-center transition duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
