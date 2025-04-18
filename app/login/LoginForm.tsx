"use client";
import React, { useState } from "react";

import Link from "next/link";
import { toast } from "react-toastify";
import { translateSupabaseErrors } from "../_lib/helpers/translateSupabaseErrors";
import { useAuth } from "../_lib/context/AuthenticationContext";
import { useSearchParams } from "next/navigation";

import { UserInterface } from "../Types";

const LoginForm = ({
  submitHandler,
}: {
  submitHandler: (
    formData: FormData
  ) => Promise<{ success: boolean; userData?: UserInterface; error?: string }>;
}) => {
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login: updateAuthContext } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const result = await submitHandler(formData);

      if (!result.success) {
        // Handle other errors
        toast.error(
          translateSupabaseErrors(result.error || "Login error")
        );

        setIsLoading(false);
        return;
      }

      // Login successful - update auth context with complete user data
      if (result.userData) {
        updateAuthContext(result.userData, redirectPath);
      } else {
        toast.error("Failed to retrieve user data");
        setIsLoading(false);
      }
    } catch (e) {
      console.error("Login error:", e);
      toast.error("An error occurred while trying to log in.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-navy border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
          placeholder="your.email@example.com"
          required
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="flex justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white"
          >
            Password
          </label>
          <Link
            href="#"
            className="text-sm text-electric-blue hover:text-mint-green"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-navy border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
          placeholder="••••••••"
          required
        />
      </div>

      {/* show password  input*/}
      <div>
        <input
          type="checkbox"
          id="show-password"
          onChange={() => setShowPassword((prev) => !prev)}
        />
        <label htmlFor="show-password" className="ml-2 text-gray-400">
          Show Password
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>

    </form>
  );
};

export default LoginForm;
