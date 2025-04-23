import React from "react";
import Nav from "./Nav";

// Server Component Header
const Header = ({ children }) => {
  return (
    <div className="font-sans m-0 p-0 bg-navy text-white">
      <Nav />
      
      {/* Add padding to account for fixed header - reduced to match smaller nav height */}
      <div className="pt-14 md:pt-16">
        {children}
      </div>
    </div>
  );
};

export default Header;
