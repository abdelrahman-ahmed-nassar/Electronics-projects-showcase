"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClearCache() {
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const router = useRouter();

  // Flag to track component mounting state
  const [isMounted, setIsMounted] = useState(true);

  // Set up effect to track component mount status
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Function to delete all cookies more thoroughly
  const deleteAllCookies = () => {
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

    // For persistent cookies that might be HTTPOnly or have specific SameSite settings
    // We'll tell users that some cookies might require them to close the browser
    return cookies.length;
  };

  const clearCache = async () => {
    if (!isMounted) return;
    setIsClearing(true);

    try {
      // Clear localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }

      // Clear sessionStorage
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.clear();
      }

      // Clear cookies with improved method
      if (typeof document !== "undefined") {
        deleteAllCookies();
      }

      // Clear IndexedDB databases (with safer implementation)
      if (typeof window !== "undefined" && window.indexedDB) {
        try {
          // Check if databases() method is supported
          if (typeof window.indexedDB.databases === "function") {
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
              if (db.name) {
                window.indexedDB.deleteDatabase(db.name);
              }
            }
          } else {
            // Fallback for browsers not supporting databases() method
            console.log(
              "IndexedDB databases() method not supported in this browser"
            );
          }
        } catch (e) {
          console.log("Error clearing IndexedDB:", e);
        }
      }

      // Attempt to clear browser cache using Cache API (if available)
      if (typeof caches !== "undefined") {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((name) => caches.delete(name)));
        } catch (e) {
          console.log("Cache API not fully supported or permission denied:", e);
        }
      }

      // Force clear service workers
      if (navigator.serviceWorker) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
          }
        } catch (e) {
          console.log("Error clearing service workers:", e);
        }
      }

      // Only update state if component is still mounted
      if (isMounted) {
        setIsCleared(true);
        setIsClearing(false);
      }

      // Redirect to login page after a short delay
      setTimeout(() => {
        if (isMounted) {
          router.push("/login");
        }
      }, 1000);
    } catch (error) {
      console.error("Error clearing cache:", error);
      // Only update state if component is still mounted
      if (isMounted) {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Clear Website Cache
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Clicking the button below will clear all browser storage including
          cookies, localStorage, sessionStorage, and application cache for this
          website.
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
          {isClearing ? "Clearing..." : "Clear All Website Cache"}
        </button>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          After clearing, you will be redirected to the login page.
        </p>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Note: Some secure cookies may require closing the browser completely
          to be removed.
        </p>
      </div>
    </div>
  );
}
