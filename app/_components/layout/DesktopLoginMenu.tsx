"use client";
import React from "react";
import Link from "next/link";

import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { useRouter } from "next/navigation";

import { handleLogout } from "@/app/_lib/utils/auth-utils";

const DesktopLoginMenu = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const clearAllStorageAndCookies = () => {
    // Clear localStorage
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }

    // Clear sessionStorage
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.clear();
    }

    // Clear cookies
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");

      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        // Delete cookie with path=/
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;

        // Delete cookie without path specification
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        // Try with secure flag
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure`;

        // Try with common subdomains
        const domain = window.location.hostname;
        const parts = domain.split(".");

        // Try various domain possibilities
        if (parts.length > 1) {
          // Root domain
          const rootDomain = parts.slice(-2).join(".");
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${rootDomain}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${rootDomain}`;

          // Full domain
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
        }
      }
    }
  };

  const handleLogoutAction = async () => {
    // Clear all storage and cookies before logout
    clearAllStorageAndCookies();

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
