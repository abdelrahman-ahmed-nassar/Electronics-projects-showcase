"use client";
import Link from "next/link";
import React, { useState } from "react";

import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { useRouter, usePathname } from "next/navigation";

import { handleLogout } from "@/app/_lib/utils/auth-utils";

const MobileNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const clearAllStorageAndCookies = async () => {
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

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }

    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.clear();
    }

    if (typeof document !== "undefined") {
      const cookies = document.cookie.split("; ");
      const hostname = window.location.hostname;
      const domains = [null, hostname, `.${hostname}`];
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
      const paths = ["/", "", window.location.pathname];
      const secureOptions = [true, false];
      const sameSiteOptions = ["Lax", "Strict", "None", null];

      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

        domains.forEach((domain) => {
          paths.forEach((path) => {
            secureOptions.forEach((secure) => {
              sameSiteOptions.forEach((sameSite) => {
                let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;

                if (path) cookieString += `;path=${path}`;
                if (domain) cookieString += `;domain=${domain}`;
                if (secure) cookieString += `;secure`;
                if (sameSite) cookieString += `;samesite=${sameSite}`;

                if (sameSite === "None" && !secure) {
                  cookieString += `;secure`;
                }

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

    await clearAllStorageAndCookies();

    await handleLogout(logout, () => {
      router.push("/login");
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Futuristic Mobile menu button */}
      <button
        className="lg:hidden flex flex-col gap-1.5 cursor-pointer z-50 relative"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {/* Electronic circuit-like hamburger icon */}
        <div className="p-1 rounded-md relative bg-navy/80 border border-electric-blue/30">
          <span
            className={`block w-5 h-0.5 bg-electric-blue transition-all duration-300 ${
              mobileMenuOpen ? "transform rotate-45 translate-y-1.5" : ""
            }`}
            style={{
              boxShadow: "0 0 4px rgba(77, 148, 255, 0.8)",
            }}
          ></span>
          <span
            className={`block w-5 h-0.5 mt-1.5 transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : "bg-mint-green"
            }`}
            style={{
              boxShadow: mobileMenuOpen
                ? "none"
                : "0 0 4px rgba(100, 255, 218, 0.8)",
            }}
          ></span>
          <span
            className={`block w-5 h-0.5 mt-1.5 bg-electric-blue transition-all duration-300 ${
              mobileMenuOpen ? "transform -rotate-45 -translate-y-1.5" : ""
            }`}
            style={{
              boxShadow: "0 0 4px rgba(77, 148, 255, 0.8)",
            }}
          ></span>

          {/* Pulsing dot next to menu icon */}
          <div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-mint-green animate-pulse"
            style={{ boxShadow: "0 0 6px rgba(100, 255, 218, 0.8)" }}
          ></div>
        </div>
      </button>

      {/* Mobile Navigation Overlay with Tech Pattern */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-navy/70 backdrop-blur-md z-40"
          onClick={toggleMobileMenu}
          style={{
            backgroundImage: `
              radial-gradient(circle at 40px 40px, rgba(0, 255, 216, 0.15) 2px, transparent 0),
              linear-gradient(to right, rgba(0, 210, 255, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 210, 255, 0.07) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 20px 20px, 20px 20px",
            backgroundAttachment: "fixed", // This ensures the background stays fixed during scroll
          }}
        ></div>
      )}

      {/* Futuristic Mobile Navigation Menu */}
      <nav
        className={`fixed top-0 right-0 bg-navy/95 h-full w-72 shadow-lg z-50 transform transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          borderLeft: "1px solid rgba(0, 210, 255, 0.2)",
          boxShadow: "0 0 15px rgba(0, 210, 255, 0.15)",
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(0, 255, 216, 0.05) 2px, transparent 0),
            linear-gradient(to right, rgba(0, 210, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 210, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: "30px 30px, 15px 15px, 15px 15px",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Close button with futuristic design */}
        <button
          onClick={closeMenu}
          className="absolute top-4 right-4 p-2 z-[60] cursor-pointer rounded-sm border border-electric-blue/30 bg-navy/90 transition-all hover:bg-electric-blue/10"
          style={{
            boxShadow: "0 0 8px rgba(0, 210, 255, 0.15)",
            position: "absolute",
            zIndex: 60,
          }}
          aria-label="Close menu"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <span
              className="absolute w-5 h-0.5 bg-mint-green transform rotate-45"
              style={{ boxShadow: "0 0 4px rgba(100, 255, 218, 0.8)" }}
            ></span>
            <span
              className="absolute w-5 h-0.5 bg-electric-blue transform -rotate-45"
              style={{ boxShadow: "0 0 4px rgba(77, 148, 255, 0.8)" }}
            ></span>
            <div
              className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-mint-green animate-pulse"
              style={{ boxShadow: "0 0 6px rgba(100, 255, 218, 0.8)" }}
            ></div>
          </div>
        </button>

        {/* Circuit board border effect */}
        <div className="absolute h-full w-[1px] left-0 overflow-hidden">
          <div className="absolute h-full w-full bg-gradient-to-b from-electric-blue/20 via-mint-green/40 to-electric-blue/20"></div>
          <div
            className="absolute h-2 w-full bg-mint-green animate-data-transfer"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>

        {/* Glowing header */}
        <div className="pt-8 px-6 mb-8 relative">
          <h2
            className="text-mint-green text-lg font-light tracking-widest"
            style={{ textShadow: "0 0 10px rgba(100, 255, 218, 0.6)" }}
          >
            NAV<span className="text-electric-blue">_MENU</span>
          </h2>
          <div className="absolute left-6 right-6 h-[1px] bottom-0 bg-gradient-to-r from-electric-blue/50 via-mint-green/50 to-transparent"></div>
        </div>

        <div className="px-6 py-4">
          <ul className="flex flex-col gap-4 list-none p-0 m-0 mb-12">
            <MobileNavItem
              href="/"
              label="HOME"
              isActive={pathname === "/"}
              closeMenu={closeMenu}
            />
            <MobileNavItem
              href="/projects"
              label="PROJECTS"
              isActive={pathname.includes("/projects")}
              closeMenu={closeMenu}
            />
            <MobileNavItem
              href="/students"
              label="STUDENTS"
              isActive={pathname.includes("/students")}
              closeMenu={closeMenu}
            />
            <MobileNavItem
              href="/teams"
              label="TEAMS"
              isActive={pathname.includes("/teams")}
              closeMenu={closeMenu}
            />
            <MobileNavItem
              href="/about"
              label="ABOUT"
              isActive={pathname.includes("/about")}
              closeMenu={closeMenu}
            />
            <MobileNavItem
              href="/contact"
              label="CONTACT"
              isActive={pathname.includes("/contact")}
              closeMenu={closeMenu}
            />
          </ul>

          <div className="flex flex-col gap-4 w-full pt-4 border-t border-electric-blue/20">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link
                  href="/profile"
                  className="py-2 px-4 bg-navy text-electric-blue border border-electric-blue/50 rounded-sm text-center text-xs tracking-wider cursor-pointer transition-all hover:bg-electric-blue/10 no-underline flex items-center justify-center gap-2 group"
                  style={{
                    boxShadow: "0 0 8px rgba(77, 148, 255, 0.1)",
                  }}
                  onClick={closeMenu}
                >
                  <span className="w-2 h-2 rounded-full bg-electric-blue/80 group-hover:bg-electric-blue transition-all"></span>
                  PROFILE
                </Link>
                <button
                  onClick={handleLogoutAction}
                  className="py-2 px-4 bg-navy text-red-500 border border-red-500/50 rounded-sm text-center text-xs tracking-wider cursor-pointer transition-all hover:bg-red-500/10 flex items-center justify-center gap-2 group"
                  style={{
                    boxShadow: "0 0 8px rgba(255, 51, 102, 0.1)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-all"></span>
                  LOGOUT
                </button>
              </div>
            ) : (
              <>
              <Link
                href="/login"
                className="py-2 px-4 bg-navy text-electric-blue border border-electric-blue/50 rounded-sm text-center text-xs tracking-wider cursor-pointer transition-all hover:bg-electric-blue/10 no-underline flex items-center justify-center gap-2 group"
                style={{
                  boxShadow: "0 0 8px rgba(77, 148, 255, 0.1)",
                }}
                onClick={closeMenu}
              >
                <span className="w-2 h-2 rounded-full bg-electric-blue/80 group-hover:bg-electric-blue transition-all"></span>
                LOGIN
              </Link>
              <Link
                href="/register"
                className="py-2 px-4 bg-navy text-mint-green border border-mint-green/50 rounded-sm text-center text-xs tracking-wider cursor-pointer transition-all hover:bg-mint-green/10 no-underline flex items-center justify-center gap-2 group"
                style={{
                  boxShadow: "0 0 8px rgba(100, 255, 218, 0.2)",
                }}
                onClick={closeMenu}
              >
                <span className="w-2 h-2 rounded-full bg-mint-green/80 group-hover:bg-mint-green transition-all"></span>
                REGISTER
              </Link>
            </>
            )}
          </div>

          {/* Electronic tech decoration element */}
          <div className="absolute bottom-10 left-6 right-6">
            <div className="h-10 w-full opacity-30">
              {/* Circuit-like pattern */}
              <div className="w-full h-full relative">
                <div className="absolute left-0 right-8 top-4 h-[1px] bg-mint-green/70"></div>
                <div className="absolute left-4 right-0 bottom-4 h-[1px] bg-electric-blue/70"></div>
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-mint-green/70"></div>
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-electric-blue/70"></div>

                {/* Dots representing components */}
                <div className="absolute top-4 left-0 w-2 h-2 rounded-full bg-mint-green/80"></div>
                <div className="absolute top-4 right-8 w-2 h-2 rounded-full bg-mint-green/80"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-electric-blue/80"></div>
                <div className="absolute bottom-4 right-0 w-2 h-2 rounded-full bg-electric-blue/80"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// Mobile navigation item with tech effects
interface MobileNavItemProps {
  href: string;
  label: string;
  isActive: boolean;
  closeMenu: () => void;
}

const MobileNavItem = ({
  href,
  label,
  isActive,
  closeMenu,
}: MobileNavItemProps) => {
  return (
    <li className="relative">
      <Link
        href={href}
        className={`text-xs tracking-wider py-2.5 relative transition-all duration-300 flex items-center gap-3 group
          ${
            isActive ? "text-mint-green" : "text-white hover:text-electric-blue"
          }`}
        style={{
          textShadow: isActive ? "0 0 6px rgba(0, 255, 216, 0.6)" : "none",
        }}
        onClick={closeMenu}
      >
        {/* Electronic node indicator - Enhanced for active state */}
        <div
          className={`relative w-3 h-3 rounded-[1px] flex items-center justify-center overflow-hidden transition-all duration-300
          ${
            isActive
              ? "border border-mint-green/90 rotate-45"
              : "border border-electric-blue/50 group-hover:border-mint-green/70 rotate-45"
          }`}
        >
          <div className="absolute inset-0.5 bg-navy"></div>

          {/* Glowing center for active items */}
          <div
            className={`absolute inset-1 transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-br from-mint-green/30 to-mint-green/50"
                : "bg-gradient-to-br from-transparent to-electric-blue/30 group-hover:to-mint-green/40"
            }`}
          ></div>

          {/* Pulsing center dot for active items */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-mint-green animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Label with enhanced active state */}
        <span className="relative">
          {label}

          {/* Underline - static for active, animated for hover */}
          <span
            className={`absolute left-0 right-0 bottom-[-3px] h-[1px] transition-all duration-300
            ${
              isActive
                ? "bg-mint-green/70 w-full"
                : "bg-mint-green/30 w-0 group-hover:w-full"
            }`}
          ></span>

          {/* Data flow animation for active items only */}
          {isActive && (
            <span className="absolute left-0 right-0 bottom-[-3px] h-[1px]">
              <span className="absolute h-full w-2 bg-white/80 animate-data-transfer"></span>
            </span>
          )}
        </span>

        {/* Active item background glow */}
        {isActive && (
          <div
            className="absolute -inset-1 rounded-sm -z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 255, 216, 0.05), rgba(0, 255, 216, 0.15))",
              boxShadow: "0 0 8px rgba(0, 255, 216, 0.05) inset",
            }}
          ></div>
        )}
      </Link>
    </li>
  );
};

export default MobileNav;
