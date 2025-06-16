"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    < div className="flex justify-center items-center h-screen w-full"
    style={{ backgroundImage: "url('/engine.jpg')" }}>
      <div className="absolute inset-0 bg-black/80 z-0"></div>
     <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="h-46 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-logo.png';
              }}
             
            />
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                SMCT Group of Companies{' '}
                <span className="text-primary  ">Job Order Form</span>
              </h1>
              <p className="mx-auto max-w-2xl text-white text-muted-foreground text-lg sm:text-xl">
               Manage vehicle repairs, customer details, and parts requests seamlessly with job order system for automotive service providers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
              onClick={() => router.push("/login")}
              className="text-lg px-8 py-6 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-700" >
     
                  Get Started
                
              </button>
            </div>
          </div>
        </div>
      </section>
       </div>
  );
}
