"use client"

import Link from 'next/link';

import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
      console.log('Login attempt with:', { email, password, rememberMe });
    }, 1500);
  };

  return (
    <div className="font-sans m-0 p-0 bg-navy text-white min-h-screen flex flex-col">
      <CircuitBackground />
      
      {/* Login Form Section */}
      <main className="flex-grow flex items-center justify-center px-5 py-16 relative z-20">
        <div className="w-full max-w-md bg-white/5 rounded-lg border border-electric-blue/20 overflow-hidden shadow-xl">
          {/* Form Header */}
          <div className="p-6 border-b border-electric-blue/20">
            <h2 className="text-2xl font-bold text-mint-green text-center">Welcome Back</h2>
            <p className="text-white/70 text-center mt-2">
              Sign in to access your ElectroShowcase account
            </p>
          </div>
          
          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
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
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <a href="#" className="text-sm text-electric-blue hover:text-mint-green">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-navy border border-electric-blue/30 rounded focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-mint-green focus:ring-mint-green border-electric-blue/30 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                Remember me
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            
            {/* Register Link */}
            <div className="text-center mt-4">
              <span className="text-white/70 text-sm">Don't have an account? </span>
              <a href="register" className="text-sm text-electric-blue hover:text-mint-green">
                Register now
              </a>
            </div>
          </form>
          
          {/* Social Login Options */}
          <div className="px-6 pb-6">
            <div className="relative flex items-center justify-center text-sm text-white/50 my-4">
              <span className="px-2 bg-navy z-10">Or continue with</span>
              <div className="absolute w-full border-t border-electric-blue/20"></div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-2 px-3 bg-transparent border border-electric-blue/30 rounded text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-electric-blue/10 transition-all">
                <span>Google</span>
              </button>
              <button className="flex-1 py-2 px-3 bg-transparent border border-electric-blue/30 rounded text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-electric-blue/10 transition-all">
                <span>GitHub</span>
              </button>
              <button className="flex-1 py-2 px-3 bg-transparent border border-electric-blue/30 rounded text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-electric-blue/10 transition-all">
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
};

// Circuit Board Background Pattern Component (reused from main site)
const CircuitBackground = () => {
  return (
    <div 
      className="absolute inset-0 opacity-10 z-10"
      style={{
        backgroundImage: "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none" // Ensures the background doesn't interfere with clicks
      }}
    ></div>
  );
};


export default LoginPage;