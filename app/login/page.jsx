import Link from "next/link";
import React, { Suspense } from "react";
import LoginForm from "./LoginForm";
import { login } from "./actions";
import CircuitBackground from "../_components/UI/CircuitBackground";

// Loading component to show while LoginForm is loading
const LoginFormSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="h-10 bg-navy/30 rounded mb-4"></div>
    <div className="h-10 bg-navy/30 rounded mb-4"></div>
    <div className="h-5 w-1/4 bg-navy/30 rounded mb-6"></div>
    <div className="h-12 bg-navy/30 rounded"></div>
  </div>
);

const LoginPage = () => {
  return (
    <div className="font-sans m-0 p-0 bg-navy text-white min-h-screen flex flex-col">
      <CircuitBackground />

      {/* Login Form Section */}
      <main className="flex-grow flex items-center justify-center px-5 py-16 relative z-20">
        <div className="w-full max-w-md bg-white/5 rounded-lg border border-electric-blue/20 overflow-hidden shadow-xl">
          {/* Form Header */}
          <div className="p-6 border-b border-electric-blue/20">
            <h2 className="text-2xl font-bold text-mint-green text-center">
              Welcome Back
            </h2>
            <p className="text-white/70 text-center mt-2">
              Sign in to access your ElectroShowcase account
            </p>
          </div>
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm submitHandler={login} />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
