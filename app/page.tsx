import React from "react";

import CircuitBackground from "./_components/UI/CircuitBackground";
import HeroSection from "./_components/layout/HeroSection";
import FeaturedProjects from "./_components/layout/FeaturedProjects";
import TeamsSection from "./_components/layout/FeaturedTeamsSection";
import {
  getFeaturedProjects,
  getFeaturedTeams,
  getTeamsCount,
  getProjectsCount,
  getTeamsWithAchievementsCount,
} from "@/utils/supabase/data-services";

// Main App Component
const Page = async () => {
  // Fetch real data for featured projects and teams
  const featuredProjects = await getFeaturedProjects();
  const {
    teams: featuredTeams,
    members: teamMembers,
    projectCounts,
  } = await getFeaturedTeams();

  // Fetch statistics data
  const totalTeams = await getTeamsCount();
  const totalProjects = await getProjectsCount();
  const teamsWithAchievements = await getTeamsWithAchievementsCount();

  return (
    <>
      <CircuitBackground />
      <HeroSection
        statistics={{
          totalTeams,
          totalProjects,
          teamsWithAchievements,
        }}
      />
      <FeaturedProjects projects={featuredProjects} />
      <TeamsSection
        teams={featuredTeams}
        members={teamMembers}
        projectCounts={projectCounts}
      />
    </>
  );
};

export default Page;
