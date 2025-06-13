'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import data from "@/data/credentials.json";


export default function Login () {
const router = useRouter();
  const [branchCode, setBranchCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  // Loop through each branch and search for the matching user
  let foundUser = null;

  for (const branch of data) {
    const user = branch.users.find(
      (u) => u.branchCode === branchCode && u.password === password
    );
    if (user) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    setError("Invalid branch code or password");
    return;
  }

  // Login success
  router.push("/job-order-form");
};
  


  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
          </div>
        </nav>
      </header>

      <div className="min-h-screen flex items-center justify-center px-4 bg-white relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-2xl">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          </div>
        <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-xl">
         <img src="/logo.png" alt="Company Logo" className="mx-auto mb-4 w-45 h-auto"/>
          <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            LOGIN
          </h1>

          {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">Login with your email and password</p>
            <p>Email</p>
            <input
              type="text"
              placeholder="Enter your branch code"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p>Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer"
            >
              Login
            </button>
            <p className="text-sm text-gray-600 text-center">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Sign up </a></p>
          </form>
        
        </div>

        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </div>
  )
}
