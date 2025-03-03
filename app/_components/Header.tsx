"use client";
import Link from "next/link";
import React, { useState } from "react";

// Header Component with Navigation
const Header = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="font-sans m-0 p-0 bg-navy text-white">
      <header className="flex justify-between items-center p-5 border-b border-electric-blue relative z-20">
        <Link href={"/"} className="text-mint-green font-bold text-2xl">
          ElectroShowcase
        </Link>

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

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex gap-5 list-none p-0 m-0">
            <NavItem href="/" label="Home" />
            <NavItem href="projects" label="Projects" />
            <NavItem href="students" label="Students" />
            <NavItem href="teams" label="Teams" />
            <NavItem href="about" label="About" />
            <NavItem href="contact" label="Contact" />
          </ul>
          <div className="flex items-center gap-4 ml-8">
            <Link
              href="login"
              className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
            >
              Log In
            </Link>
            <Link
              href="register"
              className="py-2 px-4 bg-mint-green text-navy border-none rounded text-sm cursor-pointer transition-all hover:bg-electric-blue hover:text-white no-underline"
            >
              Register
            </Link>
          </div>
        </nav>

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
          <button
            className="absolute top-4 right-4 text-white"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <span className="text-2xl">×</span>
          </button>
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
            <Link
              href="login"
              className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-center text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
            >
              Log In
            </Link>
            <Link
              href="register"
              className="py-2 px-4 bg-mint-green text-navy border-none rounded text-center text-sm cursor-pointer transition-all hover:bg-electric-blue hover:text-white no-underline"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>
      {children}
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ href, label }) => {
  return (
    <li>
      <a
        href={href}
        className="text-white no-underline text-base relative hover:text-mint-green after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-mint-green after:transition-all hover:after:w-full"
      >
        {label}
      </a>
    </li>
  );
};

export default Header;
