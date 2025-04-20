"use client";
import { useState } from "react";
import ProjectCard from "../UI/ProjectCard";
import { ProjectDisplayInterface } from "@/app/Types";

// Featured Projects Component
interface FeaturedProjectsProps {
  projects: ProjectDisplayInterface[];
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  const [activeFilter, setActiveFilter] = useState("All");

  // Extract unique tags from all projects for filter options
  const uniqueTags = [
    "All",
    ...new Set(projects.flatMap((project) => project.tags || [])),
  ];

  // Filter projects based on the active filter
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter(
          (project) => project.tags && project.tags.includes(activeFilter)
        );

  return (
    <section className="py-16 px-5" id="projects">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Featured Projects
      </h2>

      {/* Project Filters */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-8 max-w-6xl mx-auto">
        {uniqueTags.map((filter) => (
          <button
            key={filter}
            className={`py-2 px-4 bg-transparent border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 ${
              activeFilter === filter
                ? "bg-electric-blue text-white"
                : "text-electric-blue"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects;
