import Link from "next/link";
import React from "react";
import Image from "next/image";
import MobileNav from "@/app/_components/layout/MobileNav";
import DesktopLoginMenu from "./layout/DesktopLoginMenu";
import logoImage from "@/public/images/logo.png"
// Header Component with Navigation
const Header = ({ children }) => {
  return (
    <div className="font-sans m-0 p-0 bg-navy text-white">
      <header className="flex justify-between items-center p-5 border-b border-electric-blue relative z-50">
        <div className="flex items-center gap-4 md:gap-8">
          <Image src={logoImage} className="w-16  md:w-28" alt="logo"/>
        </div>

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
          <DesktopLoginMenu />
        </nav>
        <MobileNav />
      </header>
      {children}
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ href, label }) => {
  return (
    <li>
      <Link
        href={href}
        className="text-white no-underline text-base relative hover:text-mint-green after:content-[''] after:absolute after:w-0 after:h-0.5 after:-bottom-1.5 after:left-0 after:bg-mint-green after:transition-all hover:after:w-full"
      >
        {label}
      </Link>
    </li>
  );
};

export default Header;
