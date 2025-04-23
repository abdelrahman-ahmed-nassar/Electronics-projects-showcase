"use client";
import React from "react";
import RegisterForm from "./RegisterForm";
import { register } from "./actions";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import CircuitBackground from "../_components/UI/CircuitBackground";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <CircuitBackground />

      <div className="w-full max-w-md bg-deep-navy shadow-lg rounded-lg overflow-hidden border border-electric-blue/20 relative z-20 bg-white/5">
        <div className="text-center p-6 bg-electric-blue">
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="text-white/80 mt-2">
            Register to join the electronics community
          </p>
        </div>

        <RegisterForm submitHandler={register} />

        <div className="text-center p-4 border-t border-electric-blue/20">
          <Link
            href="/"
            className="text-mint-green hover:text-electric-blue text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
