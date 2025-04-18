import Link from "next/link";

import React from "react";
import LoginForm from "./LoginForm";

import { login } from "./actions";

import CircuitBackground from "../_components/UI/CircuitBackground";

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
          <LoginForm submitHandler={login} />
        </div>
      </main>
    </div>
  );
};



export default LoginPage;
