"use client";

import { Button } from "@/components/ui/button";

export default function Error() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-white">
      <div className="max-w-md w-full rounded-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mx-auto text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">
              Oops! Something went wrong to this page.
            </h2>
            <p className="text-gray-600 mt-2">
              Please try again later or return to the previous page or reload
              the page.
            </p>
          </div>
          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full px-4 py-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg text-center transition duration-200"
            >
              Reload page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
