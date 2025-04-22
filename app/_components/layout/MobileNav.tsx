"use client";
import Link from "next/link";
import React, { useState } from "react";

import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { useRouter } from "next/navigation";

import { handleLogout } from "@/app/_lib/utils/auth-utils";

const MobileNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    if (mobileMenuOpen) setMobileMenuOpen(() => !mobileMenuOpen);

    // Clear all storage and cookies before logout
    await clearAllStorageAndCookies();

    await handleLogout(logout, () => {
      router.push("/login");
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden flex flex-col gap-1.5 cursor-pointer z-50"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-all ${
            mobileMenuOpen ? "transform rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-all ${
            mobileMenuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white transition-all ${
            mobileMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Navigation Menu */}
      <nav
        className={`fixed top-0 right-0 bg-navy h-full w-64 p-8 pt-20 shadow-lg z-40 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col gap-5 list-none p-0 m-0 mb-12">
          <li>
            <Link
              href="/"
              className="text-white no-underline text-base block py-2"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="text-white no-underline text-base block py-2"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/students"
              className="text-white no-underline text-base block py-2"
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              href="/teams"
              className="text-white no-underline text-base block py-2"
            >
              Teams
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-white no-underline text-base block py-2"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-white no-underline text-base block py-2"
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="flex flex-col gap-4 w-full">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-center text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
              >
                Profile
              </Link>
              <button
                onClick={handleLogoutAction}
                className="py-2 px-4 bg-red-500 text-white border border-red-500 rounded text-center text-sm cursor-pointer transition-all hover:bg-red-700 hover:text-yellow-200 no-underline"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-center text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default MobileNav;
