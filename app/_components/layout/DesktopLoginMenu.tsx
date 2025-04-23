"use client";
import React from "react";
import Link from "next/link";

import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { useRouter } from "next/navigation";

import { handleLogout } from "@/app/_lib/utils/auth-utils";

const DesktopLoginMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const clearAllStorageAndCookies = async () => {
    // First call server-side endpoint to clear HTTP-only cookies
    try {
      const response = await fetch("/api/auth/clear-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("Server-side session clearing result:", result);
    } catch (serverError) {
      console.error("Error clearing session server-side:", serverError);
    }

    // Clear localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }

    // Clear sessionStorage
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.clear();
    }

    // Clear cookies with more thorough approach
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");

      // Get all possible domain variations
      const hostname = window.location.hostname;
      const domains = [null, hostname, `.${hostname}`]; // null means no domain specification

      // Add root domain variations
      const parts = hostname.split(".");
      if (parts.length > 1) {
        const rootDomain = parts.slice(-2).join(".");
        domains.push(rootDomain, `.${rootDomain}`);

        if (parts.length > 2) {
          for (let i = 1; i < parts.length - 1; i++) {
            const subDomain = parts.slice(i).join(".");
            domains.push(subDomain, `.${subDomain}`);
          }
        }
      }

      // Get all possible paths
      const paths = ["/", "", window.location.pathname];

      // Combinations of secure flag
      const secureOptions = [true, false];

      // Combinations of SameSite attribute
      const sameSiteOptions = ["Lax", "Strict", "None", null];

      // Clear cookies using all combinations
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        // Try all domain combinations
        domains.forEach((domain) => {
          paths.forEach((path) => {
            secureOptions.forEach((secure) => {
              sameSiteOptions.forEach((sameSite) => {
                let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;

                if (path) cookieString += `;path=${path}`;
                if (domain) cookieString += `;domain=${domain}`;
                if (secure) cookieString += `;secure`;
                if (sameSite) cookieString += `;samesite=${sameSite}`;

                // If SameSite=None, it requires Secure flag
                if (sameSite === "None" && !secure) {
                  cookieString += `;secure`;
                }

                // Set the cookie to expire
                document.cookie = cookieString;
              });
            });
          });
        });
      }
    }
  };

  const handleLogoutAction = async () => {
    // Clear all storage and cookies before logout
    await clearAllStorageAndCookies();

    await handleLogout(logout, () => {
      router.push("/login");
    });
  };

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <button
            className="py-1.5 px-4 bg-transparent text-red-400 border border-red-500/40 rounded-sm text-xs tracking-wider cursor-pointer transition-all relative group overflow-hidden"
            onClick={handleLogoutAction}
            style={{ boxShadow: '0 0 8px rgba(255, 51, 102, 0.1)' }}
          >
            {/* Background circuit pattern effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255, 51, 102, 0.8) 1px, transparent 0)`,
                backgroundSize: '8px 8px',
              }}
            ></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500/10"></div>
            
            {/* Text with techno styling */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-all"></span>
              <span style={{ textShadow: '0 0 4px rgba(255, 51, 102, 0.4)' }}>LOG_OUT</span>
            </div>
            
            {/* Top highlight line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </button>
          
          <Link
            href="/profile"
            className="py-1.5 px-4 bg-transparent text-electric-blue border border-electric-blue/40 rounded-sm text-xs tracking-wider cursor-pointer transition-all relative group overflow-hidden no-underline"
            style={{ boxShadow: '0 0 8px rgba(77, 148, 255, 0.1)' }}
          >
            {/* Background circuit pattern effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                backgroundImage: `radial-gradient(circle at 10px 10px, rgba(77, 148, 255, 0.8) 1px, transparent 0)`,
                backgroundSize: '8px 8px',
              }}
            ></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-electric-blue/10"></div>
            
            {/* Text with techno styling */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue/80 group-hover:bg-electric-blue transition-all"></span>
              <span style={{ textShadow: '0 0 4px rgba(77, 148, 255, 0.4)' }}>PROFILE</span>
            </div>
            
            {/* Bottom highlight line */}
            <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="py-1.5 px-4 bg-transparent text-mint-green border border-mint-green/40 rounded-sm text-xs tracking-wider cursor-pointer transition-all relative group overflow-hidden no-underline"
            style={{ boxShadow: '0 0 8px rgba(100, 255, 218, 0.1)' }}
          >
            {/* Background circuit pattern effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                backgroundImage: `radial-gradient(circle at 10px 10px, rgba(100, 255, 218, 0.8) 1px, transparent 0)`,
                backgroundSize: '8px 8px',
              }}
            ></div>
            
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-mint-green/10"></div>
            
            {/* Text with techno styling */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-green/80 group-hover:bg-mint-green transition-all"></span>
              <span style={{ textShadow: '0 0 4px rgba(100, 255, 218, 0.4)' }}>LOGIN</span>
            </div>
            
            {/* Animation pulse line */}
            <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[1px] bg-gradient-to-r from-transparent via-mint-green/60 to-transparent transition-all duration-500"></div>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopLoginMenu;
