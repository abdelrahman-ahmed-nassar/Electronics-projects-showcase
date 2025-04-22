"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClearCache() {
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const router = useRouter();

  const clearCache = () => {
    setIsClearing(true);

    try {
      // Clear localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }

      // Clear cookies
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name =
            eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      }

      setIsCleared(true);
      setIsClearing(false);

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Error clearing cache:", error);
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Clear Website Cache
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Clicking the button below will clear all cookies and local storage
          data for this website. This may solve issues with outdated data or
          login problems.
        </p>

        {isCleared ? (
          <div className="text-center p-4 mb-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Cache cleared successfully! Redirecting to login page...
          </div>
        ) : null}

        <button
          onClick={clearCache}
          disabled={isClearing}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isClearing ? "Clearing..." : "Clear Cache"}
        </button>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          After clearing, you will be redirected to the login page.
        </p>
      </div>
    </div>
  );
}
