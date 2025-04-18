import React from "react";

import CircuitBackground from "./_components/UI/CircuitBackground";
import HeroSection from "./_components/layout/HeroSection";
import ProjectOfTheMonth from "./_components/layout/ProjectOfTheMonth";
import FeaturedProjects from "./_components/layout/FeaturedProjects";
import StatsSection from "./_components/layout/StatsSection";
import TeamsSection from "./_components/layout/teamsSection";

// Main App Component
const Page = async () => {

  return (
    <>
      <CircuitBackground />
      <HeroSection />
      <ProjectOfTheMonth />
      <FeaturedProjects />
      <StatsSection />
      <TeamsSection />
    </>
  );
};

export default Page;
