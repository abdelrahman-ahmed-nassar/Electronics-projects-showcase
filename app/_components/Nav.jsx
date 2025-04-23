"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import MobileNav from "@/app/_components/layout/MobileNav";
import DesktopLoginMenu from "./layout/DesktopLoginMenu";
import { usePathname } from "next/navigation";

// Futuristic Electronics-themed Navigation Component
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoverEffect, setHoverEffect] = useState({
    active: false,
    x: 0,
    width: 0,
  });
  const pathname = usePathname();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 left-0 transition-all duration-300 z-50 
        ${scrolled ? "py-1.5 bg-navy/90 backdrop-blur-md" : "py-2 bg-navy/85"}`}
      style={{
        boxShadow: scrolled ? "0 4px 12px rgba(0, 255, 216, 0.15)" : "none",
        borderBottom: "1px solid rgba(0, 210, 255, 0.2)",
      }}
    >
      {/* Circuit Board Pattern Background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(0, 255, 216, 0.5) 2px, transparent 0),
            linear-gradient(to right, rgba(0, 210, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 210, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: "40px 40px, 20px 20px, 20px 20px",
          }}
        ></div>
      </div>

      {/* Glowing Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-80"></div>

      <div className="container mx-auto px-4 flex justify-between items-center relative">
        {/* Logo Area with Circuit Animation */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-white no-underline text-base relative group flex items-center"
          >
            <div className="relative overflow-hidden rounded-full">
              {/* Pulsing ring animation around logo */}
              <div className="absolute inset-0 rounded-full animate-pulse-slow bg-gradient-to-r from-electric-blue/0 via-electric-blue/30 to-mint-green/0"></div>

              <Image
                src="/images/logo.png"
                className="z-10 transition-all duration-300 relative"
                style={{
                  width: scrolled ? "40px" : "44px",
                  height: scrolled ? "40px" : "44px",
                  filter: "drop-shadow(0 0 4px rgba(0, 210, 255, 0.7))",
                }}
                alt="Electronics Projects Logo"
                priority
                width={44}
                height={44}
              />

              {/* Holo effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/40 to-mint-green/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-full"></div>
            </div>
          </Link>

          {/* Text Logo with Tech-Inspired Look */}
          <div className="flex flex-col">
            <span
              className="text-white font-medium tracking-wide text-sm"
              style={{
                textShadow: "0 0 8px rgba(0, 210, 255, 0.7)",
              }}
            >
              ELECTRONIC<span className="text-mint-green">_PROJECTS</span>
            </span>
            <span className="text-electric-blue/80 text-[10px] tracking-widest">
              CIRCUIT • DESIGN • BUILD
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex gap-6 list-none p-0 m-0 relative">
            {/* Navigation Items */}
            <NavItem
              href="/"
              label="HOME"
              isActive={pathname === "/"}
              onHover={setHoverEffect}
            />
            <NavItem
              href="/projects"
              label="PROJECTS"
              isActive={pathname.includes("/projects")}
              onHover={setHoverEffect}
            />
            <NavItem
              href="/students"
              label="STUDENTS"
              isActive={pathname.includes("/students")}
              onHover={setHoverEffect}
            />
            <NavItem
              href="/teams"
              label="TEAMS"
              isActive={pathname.includes("/teams")}
              onHover={setHoverEffect}
            />
            <NavItem
              href="/about"
              label="ABOUT"
              isActive={pathname.includes("/about")}
              onHover={setHoverEffect}
            />
            <NavItem
              href="/contact"
              label="CONTACT"
              isActive={pathname.includes("/contact")}
              onHover={setHoverEffect}
            />

            {/* Animated glowing hover indicator */}
            <div
              className="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
              style={{
                left: `${hoverEffect.x}px`,
                width: `${hoverEffect.width}px`,
                opacity: hoverEffect.active ? 1 : 0,
                background:
                  "linear-gradient(90deg, rgba(0,210,255,0) 0%, rgba(0,210,255,1) 50%, rgba(0,210,255,0) 100%)",
                boxShadow:
                  "0 0 10px rgba(0, 210, 255, 0.8), 0 0 20px rgba(0, 210, 255, 0.4)",
              }}
            ></div>
          </ul>

          {/* Modified Login Menu with Tech Style */}
          <div className="ml-6 border-l border-electric-blue/30 pl-6">
            <DesktopLoginMenu />
          </div>
        </nav>

        {/* Mobile Nav Button */}
        <MobileNav />
      </div>
    </header>
  );
};

// Enhanced Navigation Item Component with Hover Effects
const NavItem = ({ href, label, isActive, onHover }) => {
  const itemRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      onHover({
        active: true,
        x:
          rect.left -
          (itemRef.current.offsetParent?.getBoundingClientRect().left || 0),
        width: rect.width,
      });
    }
  };

  const handleMouseLeave = () => {
    onHover({ active: false, x: 0, width: 0 });
  };

  return (
    <li
      className="relative group"
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`text-white no-underline text-xs tracking-wider font-medium py-1 px-1 relative transition-all duration-300 flex flex-col items-center
          ${isActive ? "text-mint-green" : "hover:text-electric-blue"}`}
        style={{
          textShadow: isActive ? "0 0 8px rgba(0, 255, 216, 0.8)" : "none",
        }}
      >
        {/* Active tab background effect */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-sm -mx-1 z-[-1]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0, 255, 216, 0.08) 0%, rgba(0, 255, 216, 0.15) 100%)",
              boxShadow: "0 0 12px rgba(0, 255, 216, 0.12) inset",
              border: "1px solid rgba(0, 255, 216, 0.2)",
              backdropFilter: "blur(4px)",
            }}
          ></div>
        )}

        {label}

        {/* Enhanced active indicator "pixel" dots - digital counter look */}
        {/* {isActive && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-[3px]">
            <div className="h-1.5 w-1.5 rounded-[1px] bg-mint-green animate-pulse"></div>
            <div className="h-1.5 w-1.5 rounded-[1px] bg-electric-blue animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-1.5 w-1.5 rounded-[1px] bg-mint-green animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )} */}

        {/* Data transmission effect line - visible on active items */}
        {isActive && (
          <div className="absolute -bottom-1 w-full h-[2px]">
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/40 via-mint-green/80 to-electric-blue/40 opacity-90"></div>
            <div className="absolute h-full w-3 bg-white/90 animate-data-transfer"></div>
          </div>
        )}

        {/* Top accent mark for active items */}
        {isActive && (
          <div className="absolute -top-[1px] w-full h-[2px] overflow-hidden">
            <div
              className="w-full h-full bg-mint-green"
              style={{
                boxShadow: "0 0 8px 1px rgba(0, 255, 216, 0.7)",
              }}
            ></div>
          </div>
        )}
      </Link>
    </li>
  );
};

export default Nav;
