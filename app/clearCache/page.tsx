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

    // Log how many cookies we're attempting to clear
    console.log(`Attempting to clear ${cookies.length} cookies`);

    // Get all possible domain variations
    const hostname = window.location.hostname;
    const domains = [null, hostname, `.${hostname}`]; // null means no domain specification

    // Add root domain variations
    const parts = hostname.split(".");
    if (parts.length > 1) {
      // For domains like "app.example.com", we want to try "example.com" and ".example.com"
      const rootDomain = parts.slice(-2).join(".");
      domains.push(rootDomain, `.${rootDomain}`);

      // For longer subdomains, try more variations
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

      console.log(`Attempting to clear cookie: ${name}`);

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

    // Log how many cookies remain after clearing
    const remainingCookies = document.cookie
      .split("; ")
      .filter((c) => c.trim() !== "");
    console.log(`Remaining cookies after clearing: ${remainingCookies.length}`);

    // For persistent cookies that might be HTTPOnly or have specific SameSite settings
    // We'll tell users that some cookies might require them to close the browser
    return cookies.length;
  };

  const clearCache = async () => {
    if (!isMounted) return;
    setIsClearing(true);

    try {
      // First call our server-side endpoint to clear HTTP-only cookies
      // This is crucial for production environments
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
        // Continue with client-side clearing even if server-side fails
      }

      // Clear localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.clear();
      }

      // Clear sessionStorage
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.clear();
      }

      // Clear cookies with our improved method
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
          await Promise.all(
            cacheNames.map((name: string) => {
              return caches.delete(name);
            })
          );
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
