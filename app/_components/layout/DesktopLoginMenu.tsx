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
    <div className="flex items-center gap-4 ml-8">
      {isAuthenticated ? (
        <>
          <button
            className="py-2 px-4 bg-transparent text-red-500 border border-red-500 rounded text-sm cursor-pointer transition-all hover:bg-red-500/10"
            onClick={handleLogoutAction}
          >
            Log Out
          </button>
          <Link
            href="/profile"
            className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
          >
            Profile
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
          >
            Log In
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopLoginMenu;
