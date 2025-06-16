'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({branchName: "", branchCode: "", email: "",password: ""});
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [email, setEmail] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
  
    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

      // Login success
      router.push("/login");
      setIsLoading(false);
    
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 to-transparent opacity-70"></div>
        <div className="absolute top-0 right-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 to-transparent opacity-70 w-1/2 h-full"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="h-16 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-logo.png';
              }}
            />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Registration Form
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            Please enter your credentials to register
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
             
                <Label>Type of Job</Label>
                <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="" disabled>Select Branch</option>
                  <option value="Repair">Strong Moto Centrum Inc</option>
                  <option value="Maintenance">DES Appliance Plaza Inc</option>
                  <option value="Inspection">DES Strong Motors Inc</option>
                  <option value="Inspection">Honda DES Inc</option>
                </Select>
                
              
               <Label> Branch Name</Label>
             
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your branch name"
                  error={errors.branchName}
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
  
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
            
           <Label>Branch Code</Label> 
         
            <div className="relative">
            <Input
                type="text"
                placeholder="Enter your branch code"
                error={errors.branchCode}
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}      
                required
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            </div>
            </div>

              <div>
              
                <Label>Branch Email</Label>
             
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your branch email"
                  error={errors.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
             
                <Label>Password</Label>
        
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  error={errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

           <button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              aria-busy={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 ease-in-out
              bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              `}
            >
              {isLoading ? (
                <>
                  <span 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SMCT Group of Companies. All rights reserved.
        </div>
      </div>
    </div>
  );
}