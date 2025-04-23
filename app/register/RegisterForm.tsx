"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { translateSupabaseErrors } from "../_lib/helpers/translateSupabaseErrors";
import Link from "next/link";

const RegisterForm = ({
  submitHandler,
}: {
  submitHandler: (
    formData: FormData
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget as HTMLFormElement);
      const result = await submitHandler(formData);

      if (!result.success) {
        // Handle registration errors
        toast.error(
          translateSupabaseErrors(result.error || "Registration failed")
        );
        setIsLoading(false);
        return;
      }

      // Registration successful but awaiting admin verification
      setRegistrationSuccess(true);
      toast.success(
        result.message ||
          "Registration successful. Your account needs to be verified by an administrator before you can log in."
      );

      // Reset form
      setEmail("");
      setPassword("");
    } catch (e) {
      console.error("Registration error:", e);
      toast.error("An error occurred while trying to register.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if registration is complete
  if (registrationSuccess) {
    return (
      <div className="p-6 space-y-6 text-center">
        <div className="text-mint-green text-2xl font-bold mb-4">
          Registration Successful!
        </div>
        <p className="text-white mb-6">
          Your account has been created but needs to be verified by an
          administrator before you can log in.
        </p>
        <p className="text-gray-400 mb-6">
          Please check back later or contact the administrator for verification
          status.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-electric-blue text-white border-none rounded font-bold cursor-pointer transition-all hover:bg-mint-green hover:text-navy hover:-translate-y-0.5 hover:shadow-lg"
        >
          Return to Login
        </Link>
      </div>
    );
  }

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
          minLength={8}
        />
      </div>

      {/* Show password input */}
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
        {isLoading ? "Registering..." : "Register"}
      </button>
      {/* Admin approval notice */}
      <p className="text-gray-400 text-xs">
        New accounts require administrator approval before you can log in.
      </p>

      {/* Login Link */}
      <div className="text-center mt-4">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-mint-green hover:text-electric-blue"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
