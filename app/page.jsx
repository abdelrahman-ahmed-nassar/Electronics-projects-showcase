import React from "react";

import CircuitBackground from "./_components/UI/CircuitBackground";
import HeroSection from "./_components/layout/HeroSection";
import ProjectOfTheMonth from "./_components/layout/ProjectOfTheMonth";
import FeaturedProjects from "./_components/layout/FeaturedProjects";
import StatsSection from "./_components/layout/StatsSection";
import TeamsSection from "./_components/layout/teamsSection";
import { getProfileById } from "@/utils/supabase/data-services";

// Main App Component
const Page = async () => {
  // Make sure any data fetched is properly initialized as an array
  // If you're fetching team projects data, ensure it's an array before passing to components
  // const teamProjects = await fetchTeamProjects() || [];

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
