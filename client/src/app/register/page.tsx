"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import Select from "@/components/ui/select";
import { FORM_INPUTS } from "@/constants/formInputs";
import { FormInputType } from "@/types/formInputType";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/authContext";
import Swal from "sweetalert2";
import guestPage from "@/lib/hoc/guestPage";
import ValidationText from "@/components/ui/ValidationText";
import { Lock } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    branch: "",
    branchName: "",
    branchCode: "",
    email: "",
    password: "",
  });
  const [formInputs, setFormInputs] = useState<FormInputType>(FORM_INPUTS);
  const { branches } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/register", formInputs);
      if (response.status === 201) {
        setFormInputs(FORM_INPUTS);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data,
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.response.status === 422) {
        setError("Something went wrong. Please fix the errors.");
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (title: any) => (e: any) => {
    const { value } = e.target;
    setFormInputs((formInputs) => ({
      ...formInputs,
      [title]: value,
    }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
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
                (e.target as HTMLImageElement).src = "/default-logo.png";
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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Branch</Label>
              <Select
                error={errors?.branch}
                className="py-3"
                value={formInputs.branch}
                onChange={handleChange("branch")}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches.map((branch, index) => (
                  <option value={branch.id} key={index}>
                    {branch.branch_name}
                  </option>
                ))}
              </Select>
              <ValidationText>{errors?.branch?.[0]}</ValidationText>
            </div>

            <div>
              <Label> Branch Name</Label>
              <div className="relative">
                <Input
                  className="py-3"
                  type="text"
                  placeholder="Enter your branch name"
                  error={errors?.branchName}
                  value={formInputs.branchName}
                  onChange={handleChange("branchName")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <ValidationText>{errors?.branchName?.[0]}</ValidationText>
            </div>

            <div>
              <Label>Branch Code</Label>

              <div className="relative">
                <Input
                  className="py-3"
                  type="text"
                  placeholder="Enter your branch code"
                  error={errors?.branchCode}
                  value={formInputs.branchCode}
                  onChange={handleChange("branchCode")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <ValidationText>{errors?.branchCode?.[0]}</ValidationText>
            </div>

            <div>
              <Label>Branch Email</Label>

              <div className="relative">
                <Input
                  className="py-3"
                  type="email"
                  placeholder="Enter your branch email"
                  error={errors?.email}
                  value={formInputs.email}
                  onChange={handleChange("email")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <ValidationText>{errors?.email?.[0]}</ValidationText>
            </div>

            <div>
              <Label>Password</Label>

              <div className="relative">
                <Input
                  className="py-3"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  error={errors?.password}
                  value={formInputs.password}
                  onChange={handleChange("password")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ValidationText>{errors?.password?.[0]}</ValidationText>
            </div>
            <div>
              <Label>Confirm Password</Label>

              <div className="relative">
                <Input
                  className="py-3"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter confirm password"
                  error={errors?.password}
                  value={formInputs.password_confirmation}
                  onChange={handleChange("password_confirmation")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <Label
                htmlFor="show-password"
                className="ml-2 text-sm text-gray-700 flex gap-2 items-center cursor-pointer"
              >
                <Input
                  id="show-password"
                  name="show-password"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  onChange={handleShowPassword}
                />
                <span>{showPassword ? "Hide" : "Show"} passwords</span>
              </Label>
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

          <p className="mt-2 text-sm text-gray-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-bold">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SMCT Group of Companies. All rights
          reserved.
        </div>
      </div>
    </div>
  );
};

export default guestPage(RegisterPage);
