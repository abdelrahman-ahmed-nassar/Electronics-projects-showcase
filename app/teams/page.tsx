"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import TeamsFilterPanel, { SpecialtyOption } from "./TeamsFilterPanel";

// Define types for team data
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Team {
  id: number;
  name: string;
  description: string;
  specialty: string;
  image: string;
  members: TeamMember[];
  projects: string[];
  achievements: string[];
}

const ITEMS_PER_PAGE = 12;

// Teams Page Component
const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("newest");
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);

  // Fetch teams from the API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/teams", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load teams data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Compute canonical specialties with accurate team counts
  const specialtyOptions: SpecialtyOption[] = useMemo(() => {
    const countsMap = new Map<string, { displayName: string; count: number }>();

    teams.forEach((team) => {
      if (!team.specialty) return;
      const parts = team.specialty
        .split(",")
        .map((s) => s.trim().replace(/[.,;]+$/, ""))
        .filter(Boolean);

      const seenForTeam = new Set<string>();
      parts.forEach((raw) => {
        const key = raw.toLowerCase();
        if (seenForTeam.has(key)) return;
        seenForTeam.add(key);

        const existing = countsMap.get(key);
        if (existing) {
          existing.count += 1;
          // Prefer capitalized or acronym versions (e.g. "IoT" or "Embedded Systems")
          if (
            raw !== raw.toLowerCase() &&
            existing.displayName === existing.displayName.toLowerCase()
          ) {
            existing.displayName = raw;
          }
        } else {
          countsMap.set(key, { displayName: raw, count: 1 });
        }
      });
    });

    const list = Array.from(countsMap.values());
    // Sort by count descending, then alphabetically
    list.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.displayName.localeCompare(b.displayName);
    });

    return list;
  }, [teams]);

  // Filter teams based on search term, selected specialties, and sort option
  const filteredTeams = useMemo(() => {
    let result = [...teams];

    // Apply search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        (team) =>
          team.name?.toLowerCase().includes(query) ||
          team.specialty?.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query)
      );
    }

    // Apply specialty filter
    if (selectedSpecialties.length > 0) {
      const activeKeys = selectedSpecialties.map((s) =>
        s.toLowerCase().trim().replace(/[.,;]+$/, "")
      );

      result = result.filter((team) => {
        if (!team.specialty) return false;
        const teamParts = team.specialty
          .split(",")
          .map((s) => s.trim().replace(/[.,;]+$/, "").toLowerCase())
          .filter(Boolean);

        return activeKeys.some((key) => teamParts.includes(key));
      });
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      case "oldest":
        result.sort((a, b) => a.id - b.id);
        break;
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [teams, searchTerm, selectedSpecialties, sortOption]);

  // Reset pagination whenever filtering or sorting changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, selectedSpecialties, sortOption]);

  const toggleSpecialty = (specialty: string) => {
    const norm = specialty.toLowerCase().trim().replace(/[.,;]+$/, "");
    setSelectedSpecialties((prev) => {
      const exists = prev.some(
        (s) => s.toLowerCase().trim().replace(/[.,;]+$/, "") === norm
      );
      if (exists) {
        return prev.filter(
          (s) => s.toLowerCase().trim().replace(/[.,;]+$/, "") !== norm
        );
      } else {
        return [...prev, specialty];
      }
    });
  };

  const clearSpecialties = () => {
    setSelectedSpecialties([]);
  };

  const clearFilters = () => {
    setSelectedSpecialties([]);
    setSearchTerm("");
  };

  const toggleTeamDetails = (teamId: number) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  const displayedTeams = filteredTeams.slice(0, visibleCount);
  const hasMoreTeams = visibleCount < filteredTeams.length;

  const loadMoreTeams = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredTeams.length));
  };

  const showAllTeams = () => {
    setVisibleCount(filteredTeams.length);
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Page Banner */}
      <section className="relative py-16 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-3 text-mint-green font-bold">
            Research Teams
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Meet our innovative research teams working at the cutting edge of
            electronics engineering.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
            <span className="text-sm text-white/60">Loading research teams...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400 max-w-md mx-auto px-4">
          <div className="text-3xl mb-3">⚠️</div>
          <p className="font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue rounded-md text-sm transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div>
          {/* Sticky Search and Filter Controls Toolbar */}
          <section className="py-4 px-5 bg-navy/90 sticky top-0 z-30 backdrop-blur-md border-b border-electric-blue/20 shadow-lg shadow-black/20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-auto flex-grow max-w-lg">
                <input
                  type="text"
                  placeholder="Search teams by name, specialty, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
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
                  onClick={() => setIsMobileFilterOpen(true)}
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
                  {selectedSpecialties.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-mint-green text-navy font-bold text-xs flex items-center justify-center">
                      {selectedSpecialties.length}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 md:flex-initial">
                  <select
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
              {/* Desktop Filters Sidebar (compact, scroll-contained, sticky) */}
              <div className="hidden lg:block lg:w-72 flex-shrink-0">
                <TeamsFilterPanel
                  specialties={specialtyOptions}
                  activeSpecialties={selectedSpecialties}
                  onToggleSpecialty={toggleSpecialty}
                  onClearSpecialties={clearSpecialties}
                  totalTeamsCount={teams.length}
                  filteredTeamsCount={filteredTeams.length}
                />
              </div>

              {/* Mobile Drawer Filter Component */}
              <TeamsFilterPanel
                specialties={specialtyOptions}
                activeSpecialties={selectedSpecialties}
                onToggleSpecialty={toggleSpecialty}
                onClearSpecialties={clearSpecialties}
                totalTeamsCount={teams.length}
                filteredTeamsCount={filteredTeams.length}
                isMobileDrawer={true}
                isOpenMobile={isMobileFilterOpen}
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />

              {/* Teams Grid Area */}
              <div className="w-full lg:flex-1 min-w-0">
                {/* Active Filter Chips Bar */}
                {(selectedSpecialties.length > 0 || searchTerm) && (
                  <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white/[0.03] border border-electric-blue/15 rounded-lg">
                    <span className="text-xs text-white/50 font-medium mr-1">
                      Active:
                    </span>

                    {searchTerm && (
                      <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-electric-blue/15 border border-electric-blue/30 text-white">
                        <span className="text-white/60">Search:</span> &ldquo;{searchTerm}&rdquo;
                        <button
                          onClick={() => setSearchTerm("")}
                          className="hover:text-mint-green text-white/60 font-bold ml-0.5 cursor-pointer"
                          aria-label="Remove search filter"
                        >
                          ✕
                        </button>
                      </span>
                    )}

                    {selectedSpecialties.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-mint-green/15 border border-mint-green/30 text-mint-green"
                      >
                        <span>{spec}</span>
                        <button
                          onClick={() => toggleSpecialty(spec)}
                          className="hover:text-white text-mint-green font-bold ml-0.5 cursor-pointer"
                          aria-label={`Remove ${spec} filter`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}

                    <button
                      onClick={clearFilters}
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
                      {filteredTeams.length}
                    </span>{" "}
                    of {teams.length} teams
                  </div>
                  {filteredTeams.length > 0 && (
                    <div className="text-xs text-white/40">
                      Displaying {displayedTeams.length} on page
                    </div>
                  )}
                </div>

                {filteredTeams.length > 0 ? (
                  <>
                    {/* Teams Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayedTeams.map((team: Team, index: number) => (
                        <div
                          key={team.id}
                          className="bg-white/5 rounded-xl overflow-hidden border border-electric-blue/20 hover:border-electric-blue/60 transition-all duration-200 hover:shadow-xl hover:shadow-electric-blue/5 flex flex-col"
                        >
                          {/* Team Header Image */}
                          <div className="relative h-[200px] overflow-hidden flex-shrink-0">
                            <Image
                              src={team.image}
                              alt={`${team.name} team image`}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              width={1200}
                              height={200}
                              sizes="(max-width: 768px) 100vw, 600px"
                              priority={index < 4}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                            {/* Specialty Tags on Team Image */}
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                              <div className="flex flex-wrap gap-1.5 mb-2 max-h-16 overflow-hidden">
                                {team.specialty &&
                                  team.specialty
                                    .split(",")
                                    .map((spec, sIdx) => {
                                      const cleanSpec = spec.trim().replace(/[.,;]+$/, "");
                                      if (!cleanSpec) return null;
                                      const isSelected = selectedSpecialties.some(
                                        (act) => act.toLowerCase().trim() === cleanSpec.toLowerCase()
                                      );

                                      return (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSpecialty(cleanSpec);
                                          }}
                                          className={`py-0.5 px-2 rounded text-[11px] font-medium transition-all cursor-pointer ${
                                            isSelected
                                              ? "bg-mint-green text-navy font-bold shadow-sm"
                                              : "bg-mint-green/15 text-mint-green hover:bg-mint-green/30"
                                          }`}
                                          title={`Filter by ${cleanSpec}`}
                                        >
                                          {cleanSpec}
                                        </button>
                                      );
                                    })}
                              </div>
                              <h3 className="text-xl font-bold mt-0 mb-0 text-white truncate">
                                {team.name}
                              </h3>
                            </div>
                          </div>

                          {/* Team Info */}
                          <div className="p-5 flex flex-col flex-1 justify-between">
                            <div>
                              <p className="text-white/80 mb-4 line-clamp-3 text-sm leading-relaxed">
                                {team.description}
                              </p>

                              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-5 items-center">
                                {/* Team Members Preview */}
                                <div className="flex -space-x-2 items-center">
                                  {team.members
                                    .slice(0, 3)
                                    .map((member: TeamMember, mIdx: number) => (
                                      <div
                                        key={mIdx}
                                        className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy overflow-hidden relative shadow-sm"
                                        title={`${member.name} (${member.role})`}
                                      >
                                        <Image
                                          src={member.image}
                                          alt={member.name}
                                          className="w-full h-full object-cover"
                                          width={32}
                                          height={32}
                                          sizes="32px"
                                        />
                                      </div>
                                    ))}
                                  {team.members.length > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-electric-blue/30 flex items-center justify-center text-xs text-white border-2 border-navy font-semibold">
                                      +{team.members.length - 3}
                                    </div>
                                  )}
                                  {team.members.length === 0 && (
                                    <span className="text-xs text-white/40 italic">
                                      No members listed
                                    </span>
                                  )}
                                </div>

                                {/* Project Count */}
                                <div className="flex items-center text-white/70 text-sm">
                                  <span className="text-mint-green font-semibold mr-1.5">
                                    {team.projects.length}
                                  </span>
                                  <span>Active {team.projects.length === 1 ? "Project" : "Projects"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/5">
                              {/* View details button */}
                              <button
                                onClick={() => toggleTeamDetails(team.id)}
                                className="py-2 px-3.5 bg-transparent text-electric-blue border border-electric-blue/50 rounded-lg text-xs font-medium cursor-pointer transition-all hover:bg-electric-blue/10 flex-1 text-center"
                              >
                                {expandedTeam === team.id
                                  ? "Hide Details"
                                  : "View Details"}
                              </button>

                              {/* View Team Profile Button */}
                              <Link
                                href={`/teams/${team.id}`}
                                className="py-2 px-3.5 bg-electric-blue text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-mint-green hover:text-navy flex-1 text-center shadow-md shadow-electric-blue/10"
                              >
                                Team Profile
                              </Link>
                            </div>
                          </div>

                          {/* Expanded Team Details */}
                          {expandedTeam === team.id && (
                            <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-2 bg-black/20">
                              {/* Team Members Section */}
                              <div className="my-4">
                                <h4 className="text-sm font-semibold text-mint-green mb-3 uppercase tracking-wider">
                                  Team Members
                                </h4>
                                {team.members.length > 0 ? (
                                  <div className="flex flex-col gap-2">
                                    {team.members.map(
                                      (member: TeamMember, mIdx: number) => (
                                        <div
                                          key={mIdx}
                                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                                        >
                                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-navy">
                                            <Image
                                              src={member.image}
                                              alt={member.name}
                                              className="w-full h-full object-cover"
                                              width={40}
                                              height={40}
                                              sizes="40px"
                                            />
                                          </div>
                                          <div className="min-w-0">
                                            <div className="text-white text-sm font-medium truncate">
                                              {member.name}
                                            </div>
                                            <div className="text-electric-blue text-xs truncate">
                                              {member.role}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-white/50 italic">
                                    No member details available.
                                  </p>
                                )}
                              </div>

                              {/* Projects Section */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-mint-green mb-3 uppercase tracking-wider">
                                  Projects
                                </h4>
                                {team.projects.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {team.projects.map(
                                      (project: string, pIdx: number) => (
                                        <div
                                          key={pIdx}
                                          className="p-2.5 bg-white/5 rounded-lg border border-electric-blue/10 text-white text-xs hover:bg-electric-blue/10 transition-all truncate"
                                        >
                                          {project}
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-xs text-white/50 italic">
                                    No active projects listed.
                                  </p>
                                )}
                              </div>

                              {/* Achievements Section */}
                              <div>
                                <h4 className="text-sm font-semibold text-mint-green mb-3 uppercase tracking-wider">
                                  Achievements
                                </h4>
                                <ul className="space-y-1.5">
                                  {team.achievements.map(
                                    (achievement: string, aIdx: number) => (
                                      <li
                                        key={aIdx}
                                        className="flex items-start gap-2 text-xs text-white/80"
                                      >
                                        <span className="text-electric-blue mt-0.5">
                                          •
                                        </span>
                                        <span>{achievement}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination / Load More Footer */}
                    {hasMoreTeams && (
                      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                        {/* Progress Bar */}
                        <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-electric-blue to-mint-green h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.round(
                                (displayedTeams.length / filteredTeams.length) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/50">
                          Showing {displayedTeams.length} of {filteredTeams.length} teams
                        </span>

                        <div className="flex gap-3 mt-1">
                          <button
                            type="button"
                            onClick={loadMoreTeams}
                            className="py-2.5 px-6 rounded-lg bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue hover:text-white border border-electric-blue/40 text-sm font-semibold transition-all cursor-pointer shadow-md"
                          >
                            Load More Teams (+{Math.min(ITEMS_PER_PAGE, filteredTeams.length - displayedTeams.length)})
                          </button>
                          <button
                            type="button"
                            onClick={showAllTeams}
                            className="py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all cursor-pointer"
                          >
                            Show All ({filteredTeams.length})
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto">
                    <div className="text-4xl mb-4 text-white/30">🔍</div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      No matching teams found
                    </h3>
                    <p className="text-white/60 mb-6 text-sm">
                      {searchTerm && selectedSpecialties.length > 0
                        ? `No teams found for "${searchTerm}" with the selected specialties.`
                        : searchTerm
                        ? `No teams found matching "${searchTerm}".`
                        : "No teams found matching the selected specialties."}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="py-2.5 px-6 bg-electric-blue text-white rounded-lg cursor-pointer transition-all hover:bg-mint-green hover:text-navy font-semibold text-sm shadow-lg shadow-electric-blue/20"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
