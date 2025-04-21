"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectDisplayInterface } from "../Types";
import Image from "next/image";

interface ProjectsFilterProps {
  initialProjects: ProjectDisplayInterface[];
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ initialProjects }) => {
  // State for managing projects, filters, sorting and search
  const [projects, setProjects] = useState<ProjectDisplayInterface[]>(
    initialProjects || []
  );
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectDisplayInterface[]
  >(initialProjects || []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeProject, setActiveProject] =
    useState<ProjectDisplayInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading] = useState(false);

  // Extract all unique tags from projects
  const allTags = [
    ...new Set(projects.flatMap((project) => project.tags).filter(Boolean)),
  ].sort();

  // Update projects when initialProjects changes
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
      setFilteredProjects(initialProjects);
    }
  }, [initialProjects]);

  // Filter projects based on search query and tag filters
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag?.toLowerCase().includes(query)) ||
          project.team.name.toLowerCase().includes(query)
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter((project) =>
        project.tags.some((tag) => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.dateCreated).getTime() -
            new Date(b.dateCreated).getTime()
        );
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, selectedTags, sortOption]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const openProjectModal = (project: ProjectDisplayInterface) => {
    setActiveProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Search and Filter Section */}
      <section className="py-8 px-5 bg-white/[0.01] sticky top-0 z-30 backdrop-blur-sm border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 bg-white/5 border border-electric-blue/30 rounded outline-none focus:border-electric-blue transition-all text-white"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <label htmlFor="sort-projects" className="sr-only">
                Sort projects
              </label>
              <select
                id="sort-projects"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="py-2 px-4 pr-8 bg-navy/80 border border-electric-blue/40 rounded outline-none focus:border-electric-blue hover:bg-navy/60 transition-all text-white appearance-none cursor-pointer w-full md:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-electric-blue">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/5 rounded-lg p-5 sticky top-28">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl m-0 text-mint-green">Filters</h3>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-electric-blue hover:text-mint-green"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div>
                <h4 className="text-md mb-3 text-white/80">Tags</h4>
                <div className="flex flex-col gap-2">
                  {allTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                      />
                      <span className="text-white/90">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <>
                <div className="mb-5 text-white/70">
                  Showing {filteredProjects.length} of {projects.length}{" "}
                  projects
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/5 rounded-lg overflow-hidden border border-electric-blue/20 hover:border-electric-blue transition-all hover:shadow-lg cursor-pointer"
                      onClick={() => openProjectModal(project)}
                    >
                      <div
                        className="h-[200px] bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${project.image})` }}
                      ></div>
                      <div className="p-5">
                        <div className="text-xs text-electric-blue mb-2">
                          <Link
                            href={`/teams/${project.team.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-mint-green transition-colors underline"
                          >
                            {project.team.name}
                          </Link>{" "}
                          • {formatDate(project.dateCreated)}
                        </div>
                        <h3 className="text-xl mt-0 mb-2 text-white">
                          {project.title}
                        </h3>
                        <p className="text-white/80 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="py-1 px-2 bg-white/10 rounded text-xs text-white/80">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.team.members
                              .slice(0, 3)
                              .map((member, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy overflow-hidden"
                                  title={member.name}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent opening the project modal
                                    window.location.href = `/students/${member.id}`;
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <Image
                                    src={
                                      member.image ||
                                      "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg"
                                    }
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    width={32}
                                    height={32}
                                  />
                                </div>
                              ))}
                          </div>
                          <span className="text-sm text-white/70">
                            Team:{" "}
                            <Link
                              href={`/teams/${project.team.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-electric-blue hover:text-mint-green transition-colors underline"
                            >
                              {project.team.name}
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4 text-white/30">🔍</div>
                <h3 className="text-xl mb-2 text-white">No projects found</h3>
                <p className="text-white/70 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="py-2 px-4 bg-electric-blue text-white border-none rounded cursor-pointer transition-all hover:bg-mint-green hover:text-navy"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {isModalOpen && activeProject && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-navy border border-electric-blue/50 rounded-lg max-w-5xl w-full mx-auto relative">
              {/* Close button */}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              {/* Modal content */}
              <div className="flex flex-col md:flex-row">
                {/* Project image */}
                <div
                  className="md:w-1/2 h-64 md:h-auto bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${activeProject.image})` }}
                ></div>

                {/* Project details */}
                <div className="md:w-1/2 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                  <div className="text-sm text-electric-blue mb-2">
                    <Link
                      href={`/teams/${activeProject.team.id}`}
                      className="hover:text-mint-green transition-colors underline"
                    >
                      {activeProject.team.name}
                    </Link>{" "}
                    • {formatDate(activeProject.dateCreated)}
                  </div>
                  <h2 className="text-2xl md:text-3xl mb-4 text-white">
                    {activeProject.title}
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Overview</h3>
                    <p className="text-white/90 mb-4">
                      {activeProject.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Team</h3>
                    <p className="text-white/90 mb-2">
                      Team:{" "}
                      <span className="text-white">
                        {activeProject.team.name}
                      </span>
                    </p>
                    <div className="flex flex-col gap-2">
                      {activeProject.team.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Link
                            href={`/students/${member.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-navy block"
                          >
                            <Image
                              width={32}
                              height={32}
                              src={
                                member.image ||
                                "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg"
                              }
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          <div>
                            <div className="text-white">{member.name}</div>
                            <div className="text-white/70 text-sm">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    {activeProject.link && (
                      <Link
                        href={activeProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md flex items-center justify-center gap-2 transition-all"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Visit Project
                      </Link>
                    )}
                    <Link
                      href={`/projects/${activeProject.id}`}
                      className="py-2 px-4 bg-mint-green hover:bg-mint-green/80 text-navy rounded-md flex items-center justify-center gap-2 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      Project Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsFilter;
