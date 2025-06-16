import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mx-auto text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              Permission Denied
            </h2>
            <p className="text-gray-600 mt-2">
              This content requires specific permissions that your account
              doesn't currently have.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-lg text-center transition duration-200"
            >
              Back to Home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
