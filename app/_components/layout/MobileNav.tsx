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

  const handleLogoutAction = async () => {
    if (mobileMenuOpen) setMobileMenuOpen(() => !mobileMenuOpen);
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
              href="projects"
              className="text-white no-underline text-base block py-2"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="students"
              className="text-white no-underline text-base block py-2"
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              href="teams"
              className="text-white no-underline text-base block py-2"
            >
              Teams
            </Link>
          </li>
          <li>
            <Link
              href="about"
              className="text-white no-underline text-base block py-2"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="contact"
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
                href="login"
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
