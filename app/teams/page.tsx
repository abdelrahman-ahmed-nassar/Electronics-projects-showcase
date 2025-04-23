"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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

// Teams Page Component
const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([
    "All",
  ]);
  const [sortOption, setSortOption] = useState("newest");
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  // Fetch teams from the API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/teams");

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setTeams(data);

        // Extract all unique specialties from teams (handling comma-separated values)
        const allSpecialties = new Set<string>();
        allSpecialties.add("All"); // Always include "All" option

        data.forEach((team: Team) => {
          if (team.specialty) {
            // Handle comma-separated specialties
            const specialties = team.specialty.split(",").map((s) => s.trim());
            specialties.forEach((specialty) => {
              if (specialty) allSpecialties.add(specialty);
            });
          }
        });

        setAvailableSpecialties(Array.from(allSpecialties));
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Failed to load teams data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search term, active filter, and sort option
  const filteredTeams = React.useMemo(() => {
    let result = [...teams];

    // Apply search filter
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (team) =>
          team.name?.toLowerCase().includes(query) ||
          team.specialty?.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query)
      );
    }

    // Apply specialty filter
    if (activeFilter !== "All") {
      result = result.filter(
        (team) =>
          team.specialty &&
          team.specialty
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .includes(activeFilter.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        // Assuming teams have a creation date field, adjust as needed
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
  }, [teams, searchTerm, activeFilter, sortOption]);

  const toggleTag = (tag: string) => {
    setActiveFilter(tag);
  };

  const clearFilters = () => {
    setActiveFilter("All");
    setSearchTerm("");
  };

  const toggleTeamDetails = (teamId: number) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Page Banner */}
      <section className="relative py-16 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-3 text-mint-green">
            Research Teams
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Meet our innovative research teams working at the cutting edge of
            electronics engineering.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : (
        /* Search and Filter Section */
        <div>
          <section className="py-8 px-5 bg-white/[0.01] sticky top-0 z-30 backdrop-blur-sm border-b border-electric-blue/20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-auto flex-grow max-w-lg">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="py-2 px-4 bg-gray-900/70 border border-electric-blue/30 rounded outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all text-white appearance-none cursor-pointer w-full md:w-auto hover:bg-gray-800/60 shadow-sm shadow-black/30"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
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
                    {activeFilter !== "All" && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-electric-blue hover:text-mint-green"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-md mb-3 text-white/80">Specialties</h4>
                    <div className="flex flex-col gap-2">
                      {availableSpecialties.map((specialty) => (
                        <label
                          key={specialty}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilter === specialty}
                            onChange={() => toggleTag(specialty)}
                            className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                          />
                          <span className="text-white/90">{specialty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams Grid */}
              <div className="lg:w-3/4">
                {filteredTeams.length > 0 ? (
                  <>
                    <div className="mb-5 text-white/70">
                      Showing {filteredTeams.length} of {teams.length} teams
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredTeams.map((team: Team) => (
                        <div
                          key={team.id}
                          className="bg-white/5 rounded-lg overflow-hidden border border-electric-blue/20 hover:border-electric-blue transition-all"
                        >
                          {/* Team Header */}
                          <div className="relative h-[200px] overflow-hidden">
                            <Image
                              src={team.image}
                              alt={`${team.name} team image`}
                              className="w-full h-full object-cover"
                              width={1200}
                              height={200}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            {/* Display specialties as separate tags */}
                            <div className="absolute bottom-0 left-0 p-5">
                              <div className="flex flex-wrap gap-2 mb-2">
                                {team.specialty &&
                                  team.specialty
                                    .split(",")
                                    .map((specialty, index) => (
                                      <div
                                        key={index}
                                        className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTag(specialty.trim());
                                        }}
                                      >
                                        {specialty.trim()}
                                      </div>
                                    ))}
                              </div>
                              <h3 className="text-xl mt-0 mb-0 text-white">
                                {team.name}
                              </h3>
                            </div>
                          </div>

                          {/* Team Info */}
                          <div className="p-5">
                            <p className="text-white/80 mb-4 line-clamp-3">
                              {team.description}
                            </p>

                            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                              {/* Team Members Preview */}
                              <div className="flex -space-x-2">
                                {team.members
                                  .slice(0, 3)
                                  .map((member: TeamMember, index: number) => (
                                    <div
                                      key={index}
                                      className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy overflow-hidden"
                                    >
                                      <Image
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        width={32}
                                        height={32}
                                      />
                                    </div>
                                  ))}
                                {team.members.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-electric-blue/30 flex items-center justify-center text-sm text-white border-2 border-navy">
                                    +{team.members.length - 3}
                                  </div>
                                )}
                              </div>

                              {/* Project Count */}
                              <div className="flex items-center text-white/70">
                                <span className="text-mint-green font-semibold mr-2">
                                  {team.projects.length}
                                </span>
                                <span>Active Projects</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-4">
                              {/* View details button */}
                              <button
                                onClick={() => toggleTeamDetails(team.id)}
                                className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10"
                              >
                                {expandedTeam === team.id
                                  ? "Hide Details"
                                  : "View Team Details"}
                              </button>

                              {/* View Team Profile Button */}
                              <Link
                                href={`/teams/${team.id}`}
                                className="py-2 px-4 bg-electric-blue text-white border-none rounded cursor-pointer transition-all hover:bg-mint-green hover:text-navy"
                              >
                                Visit Team Profile
                              </Link>
                            </div>
                          </div>

                          {/* Expanded Team Details */}
                          {expandedTeam === team.id && (
                            <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-4">
                              {/* Team Members Section */}
                              <div className="mb-6">
                                <h4 className="text-lg text-mint-green mb-4">
                                  Team Members
                                </h4>
                                <div className="flex flex-col gap-3">
                                  {team.members.map(
                                    (member: TeamMember, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded w-fit"
                                      >
                                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                          <Image
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            width={48}
                                            height={48}
                                          />
                                        </div>
                                        <div>
                                          <div className="text-white font-medium">
                                            {member.name}
                                          </div>
                                          <div className="text-electric-blue text-sm">
                                            {member.role}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Projects Section */}
                              <div className="mb-6">
                                <h4 className="text-lg text-mint-green mb-4">
                                  Projects
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {team.projects.map(
                                    (project: string, index: number) => (
                                      <div
                                        key={index}
                                        className="p-3 bg-white/5 rounded border border-electric-blue/10 text-white hover:bg-electric-blue/10 transition-all"
                                      >
                                        {project}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* Achievements Section */}
                              <div>
                                <h4 className="text-lg text-mint-green mb-4">
                                  Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {team.achievements.map(
                                    (achievement: string, index: number) => (
                                      <li
                                        key={index}
                                        className="flex items-start gap-2 text-white/80"
                                      >
                                        <span className="text-electric-blue mt-1">
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
                  </>
                ) : (
                  <div className="bg-white/5 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4 text-white/30">🔍</div>
                    <h3 className="text-xl mb-2 text-white">No teams found</h3>
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
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
