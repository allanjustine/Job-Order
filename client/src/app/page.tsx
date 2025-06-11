"use client";

import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <h1 className="text-4xl font-bold">Job Order</h1>

      <button 
      type="button" 
      onClick={() => router.push("/login")} 
      className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-4 cursor-pointer hover:bg-blue-600">Dashboard</button>
    </div>
  );
}
