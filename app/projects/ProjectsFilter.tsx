"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProjectDisplayInterface } from "../Types";
import Image from "next/image";
import { CLOUDINARY_DEFAULTS } from "@/utils/cloudinary/helpers";
import ProjectsFilterPanel, { TagOption } from "./ProjectsFilterPanel";

interface ProjectsFilterProps {
  initialProjects: ProjectDisplayInterface[];
}

const ITEMS_PER_PAGE = 12;

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ initialProjects }) => {
  // State for managing projects, filters, sorting and search
  const [projects, setProjects] = useState<ProjectDisplayInterface[]>(
    initialProjects || []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeProject, setActiveProject] =
    useState<ProjectDisplayInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Extract all unique tags with counts
  const tagOptions: TagOption[] = useMemo(() => {
    const countsMap = new Map<string, { displayName: string; count: number }>();

    projects.forEach((project) => {
      if (!project.tags) return;
      const seenForProject = new Set<string>();

      project.tags.forEach((raw) => {
        const clean = raw?.trim().replace(/[.,;]+$/, "");
        if (!clean) return;
        const key = clean.toLowerCase();
        if (seenForProject.has(key)) return;
        seenForProject.add(key);

        const existing = countsMap.get(key);
        if (existing) {
          existing.count += 1;
          if (
            clean !== clean.toLowerCase() &&
            existing.displayName === existing.displayName.toLowerCase()
          ) {
            existing.displayName = clean;
          }
        } else {
          countsMap.set(key, { displayName: clean, count: 1 });
        }
      });
    });

    return Array.from(countsMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [projects]);

  // Update projects when initialProjects changes
  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  // Filter projects based on search query, tag filters, and sort option
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
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
      const activeTagKeys = selectedTags.map((t) =>
        t.toLowerCase().trim().replace(/[.,;]+$/, "")
      );

      result = result.filter((project) =>
        project.tags.some((tag) => {
          const clean = tag?.toLowerCase().trim().replace(/[.,;]+$/, "");
          return clean && activeTagKeys.includes(clean);
        })
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

    return result;
  }, [projects, searchQuery, selectedTags, sortOption]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedTags, sortOption]);

  const toggleTag = (tag: string) => {
    const key = tag.toLowerCase().trim().replace(/[.,;]+$/, "");
    setSelectedTags((prev) => {
      const exists = prev.some(
        (t) => t.toLowerCase().trim().replace(/[.,;]+$/, "") === key
      );
      if (exists) {
        return prev.filter(
          (t) => t.toLowerCase().trim().replace(/[.,;]+$/, "") !== key
        );
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearTags = () => {
    setSelectedTags([]);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
    clearDateFilter();
  };

  // Fetch projects from API with optional date range
  const fetchProjectsByDate = async (
    start?: string | null,
    end?: string | null
  ) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      if (start) params.set("startDate", start);
      if (end) params.set("endDate", end);

      const url = `/api/projects${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.status}`);
      }
      const data: ProjectDisplayInterface[] = await res.json();

      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects by date:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyDateFilter = () => {
    setDateError(null);
    if (startDate && endDate && startDate > endDate) {
      setDateError("Start date must be before or equal to end date.");
      return;
    }

    fetchProjectsByDate(startDate, endDate);
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setDateError(null);
    fetchProjectsByDate();
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const hasDateFilter = Boolean(startDate || endDate);
  const totalActiveCount =
    selectedTags.length +
    (hasDateFilter ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProjects.length));
  };

  const showAll = () => {
    setVisibleCount(filteredProjects.length);
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Sticky Search and Filter Controls Toolbar */}
      <section className="py-4 px-5 bg-navy/90 sticky top-0 z-30 backdrop-blur-md border-b border-electric-blue/20 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search projects by title, description, team, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-4 pl-10 pr-9 bg-white/5 border border-electric-blue/30 rounded-lg outline-none focus:border-electric-blue focus:bg-white/[0.08] transition-all text-white text-sm placeholder-white/40"
            />
            <svg
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-electric-blue/30 rounded-lg text-sm text-white transition-all cursor-pointer flex-1 md:flex-initial justify-center"
            >
              <svg
                className="w-4 h-4 text-mint-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
              {totalActiveCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-mint-green text-navy font-bold text-xs flex items-center justify-center">
                  {totalActiveCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <label htmlFor="sort-projects" className="sr-only">
                Sort projects
              </label>
              <select
                id="sort-projects"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="py-2.5 pl-4 pr-9 bg-gray-900/80 border border-electric-blue/30 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all text-white text-sm appearance-none cursor-pointer w-full hover:bg-gray-800/80 shadow-sm shadow-black/30"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-electric-blue">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <ProjectsFilterPanel
              tags={tagOptions}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              onClearTags={clearTags}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApplyDateFilter={applyDateFilter}
              onClearDateFilter={clearDateFilter}
              dateError={dateError}
              isLoadingDate={isLoading}
              onClearAll={clearAllFilters}
              totalProjectsCount={projects.length}
              filteredProjectsCount={filteredProjects.length}
            />
          </div>

          {/* Mobile Drawer Filter Component */}
          <ProjectsFilterPanel
            tags={tagOptions}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearTags={clearTags}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApplyDateFilter={applyDateFilter}
            onClearDateFilter={clearDateFilter}
            dateError={dateError}
            isLoadingDate={isLoading}
            onClearAll={clearAllFilters}
            totalProjectsCount={projects.length}
            filteredProjectsCount={filteredProjects.length}
            isMobileDrawer={true}
            isOpenMobile={isMobileDrawerOpen}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />

          {/* Projects Grid Area */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Active Filters Bar */}
            {totalActiveCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white/[0.03] border border-electric-blue/15 rounded-lg">
                <span className="text-xs text-white/50 font-medium mr-1">
                  Active:
                </span>

                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-electric-blue/15 border border-electric-blue/30 text-white">
                    <span className="text-white/60">Search:</span> &ldquo;{searchQuery}&rdquo;
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-mint-green text-white/60 font-bold ml-0.5 cursor-pointer"
                      aria-label="Remove search filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {hasDateFilter && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-accent/15 border border-accent/30 text-accent">
                    <span>
                      Date: {startDate || "start"} to {endDate || "present"}
                    </span>
                    <button
                      onClick={clearDateFilter}
                      className="hover:text-white text-accent font-bold ml-0.5 cursor-pointer"
                      aria-label="Remove date range filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-mint-green/15 border border-mint-green/30 text-mint-green"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:text-white text-mint-green font-bold ml-0.5 cursor-pointer"
                      aria-label={`Remove ${tag} filter`}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-electric-blue hover:text-mint-green ml-auto transition-colors font-medium cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Header Count */}
            <div className="flex items-center justify-between mb-5 text-sm text-white/70">
              <div>
                Showing{" "}
                <span className="text-mint-green font-semibold">
                  {filteredProjects.length}
                </span>{" "}
                of {projects.length} projects
              </div>
              {filteredProjects.length > 0 && (
                <div className="text-xs text-white/40">
                  Displaying {displayedProjects.length} on page
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <>
                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/5 rounded-xl overflow-hidden border border-electric-blue/20 hover:border-electric-blue/60 transition-all duration-200 hover:shadow-xl hover:shadow-electric-blue/5 cursor-pointer flex flex-col justify-between"
                      onClick={() => openProjectModal(project)}
                    >
                      <div>
                        {/* Project Image */}
                        <div
                          className="h-[200px] bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${project.image})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                            <span className="text-xs text-white/80 bg-navy/80 px-2 py-0.5 rounded-full border border-white/10">
                              {formatDate(project.dateCreated)}
                            </span>
                          </div>
                        </div>

                        {/* Project Card Content */}
                        <div className="p-5">
                          <div className="text-xs text-electric-blue mb-2">
                            <Link
                              href={`/teams/${project.team.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-mint-green transition-colors underline font-medium"
                            >
                              {project.team.name}
                            </Link>
                          </div>
                          <h3 className="text-xl font-bold mt-0 mb-2 text-white truncate">
                            {project.title}
                          </h3>
                          <p className="text-white/80 mb-4 line-clamp-3 text-sm leading-relaxed">
                            {project.description}
                          </p>

                          {/* Interactive Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.tags.slice(0, 4).map((tag, index) => {
                              const isSelected = selectedTags.some(
                                (t) => t.toLowerCase().trim() === tag.toLowerCase().trim()
                              );
                              return (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTag(tag);
                                  }}
                                  className={`py-0.5 px-2 rounded text-[11px] font-medium transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-mint-green text-navy font-bold shadow-sm"
                                      : "bg-mint-green/10 text-mint-green hover:bg-mint-green/20"
                                  }`}
                                  title={`Filter by tag: ${tag}`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                            {project.tags.length > 4 && (
                              <span className="py-0.5 px-2 bg-white/5 rounded text-[11px] text-white/60">
                                +{project.tags.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.team.members
                            .slice(0, 3)
                            .map((member, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy overflow-hidden"
                                title={member.name}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `/students/${member.id}`;
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <Image
                                  src={
                                    member.image ||
                                    CLOUDINARY_DEFAULTS.profile
                                  }
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                  width={32}
                                  height={32}
                                />
                              </div>
                            ))}
                          {project.team.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-electric-blue/30 flex items-center justify-center text-xs text-white border-2 border-navy font-semibold">
                              +{project.team.members.length - 3}
                            </div>
                          )}
                        </div>

                        <span className="text-xs text-white/70">
                          Team:{" "}
                          <Link
                            href={`/teams/${project.team.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-electric-blue hover:text-mint-green transition-colors underline font-medium"
                          >
                            {project.team.name}
                          </Link>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination / Load More Footer */}
                {hasMore && (
                  <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                    {/* Progress Bar */}
                    <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-electric-blue to-mint-green h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (displayedProjects.length / filteredProjects.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/50">
                      Showing {displayedProjects.length} of {filteredProjects.length} projects
                    </span>

                    <div className="flex gap-3 mt-1">
                      <button
                        type="button"
                        onClick={loadMore}
                        className="py-2.5 px-6 rounded-lg bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue hover:text-white border border-electric-blue/40 text-sm font-semibold transition-all cursor-pointer shadow-md"
                      >
                        Load More Projects (+{Math.min(ITEMS_PER_PAGE, filteredProjects.length - displayedProjects.length)})
                      </button>
                      <button
                        type="button"
                        onClick={showAll}
                        className="py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all cursor-pointer"
                      >
                        Show All ({filteredProjects.length})
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto">
                <div className="text-4xl mb-4 text-white/30">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-white">No projects found</h3>
                <p className="text-white/60 mb-6 text-sm">
                  Try adjusting your filters, tags, or search criteria
                </p>
                <button
                  onClick={clearAllFilters}
                  className="py-2.5 px-6 bg-electric-blue text-white rounded-lg cursor-pointer transition-all hover:bg-mint-green hover:text-navy font-semibold text-sm shadow-lg shadow-electric-blue/20"
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
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 z-10 cursor-pointer"
                aria-label="Close modal"
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
                    <p className="text-white/90 mb-4 leading-relaxed">
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
                                CLOUDINARY_DEFAULTS.profile
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
                        className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                      className="py-2 px-4 bg-mint-green hover:bg-mint-green/80 text-navy rounded-md flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold"
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
