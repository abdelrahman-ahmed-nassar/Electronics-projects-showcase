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

  // Filter teams based on search term and active filter
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle filtering by specialty, including comma-separated values
    const matchesFilter =
      activeFilter === "All" ||
      (team.specialty &&
        team.specialty
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .includes(activeFilter.toLowerCase()));

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <CircuitBackground />
      <TeamHeroSection />
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : (
        <TeamsSection
          teams={filteredTeams}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filters={availableSpecialties}
        />
      )}
    </>
  );
};

// Circuit Board Background Pattern Component (reused from main App)
const CircuitBackground = () => {
  return (
    <div
      className="absolute inset-0 opacity-10 z-10"
      style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none", // Ensures the background doesn't interfere with clicks
      }}
    ></div>
  );
};

// Team Hero Section Component
const TeamHeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 h-[40vh]">
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      ></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">
        Research Teams
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10">
        Meet our innovative research teams working at the cutting edge of
        electronics engineering.
      </p>
    </section>
  );
};

// Define props interface for TeamsSection
interface TeamsSectionProps {
  teams: Team[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  filters: string[];
}

// Teams Section Component
const TeamsSection: React.FC<TeamsSectionProps> = ({
  teams,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  filters,
}) => {
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  const toggleTeamDetails = (teamId: number) => {
    if (expandedTeam === teamId) {
      setExpandedTeam(null);
    } else {
      setExpandedTeam(teamId);
    }
  };

  return (
    <section className="py-16 px-5" id="teams">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-5 items-center">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-transparent border border-electric-blue rounded text-white focus:outline-none focus:border-mint-green"
            />
          </div>

          <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-end">
            {filters.map((filter: string) => (
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
        </div>

        {/* Teams List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.length > 0 ? (
            teams.map((team: Team) => (
              <div
                key={team.id}
                className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:border-electric-blue"
              >
                {/* Team Header */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={team.image}
                    alt={`${team.name} project image`}
                    className="w-full h-full object-cover"
                    width={1200}
                    height={200}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  {/* Display specialties as separate tags */}
                  <div className="absolute bottom-0 left-0 p-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {team.specialty &&
                        team.specialty.split(",").map((specialty, index) => (
                          <div
                            key={index}
                            className="inline-block py-1 px-2 bg-electric-blue/80 text-white text-sm rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilter(specialty.trim());
                            }}
                          >
                            {specialty.trim()}
                          </div>
                        ))}
                    </div>
                    <h3 className="text-2xl md:text-3xl mt-0 mb-0 text-white">
                      {team.name}
                    </h3>
                  </div>
                </div>

                {/* Team Info */}
                <div className="p-5">
                  <p className="text-white/80 mb-4 line-clamp-4">{team.description}</p>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                    {/* Team Members Preview */}
                    <div className="flex items-center gap-2">
                      {team.members
                        .slice(0, 3)
                        .map((member: TeamMember, index: number) => (
                          <div
                            key={index}
                            className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green overflow-hidden"
                          >
                            <Image
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                        ))}
                      {team.members.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-electric-blue/30 flex items-center justify-center text-sm text-white border-2 border-electric-blue">
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

                    {/* Achievement Count */}
                    <div className="flex items-center text-white/70">
                      <span className="text-mint-green font-semibold mr-2">
                        {team.achievements.length}
                      </span>
                      <span>Achievements</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {/* View details button (existing) */}
                    <button
                      onClick={() => toggleTeamDetails(team.id)}
                      className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10"
                    >
                      {expandedTeam === team.id
                        ? "Hide Details"
                        : "View Team Details"}
                    </button>

                    {/* View Team Profile Button (new) */}
                    <Link
                      href={`/teams/${team.id}`}
                      className="py-2 px-4 bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue rounded border border-electric-blue/50 text-sm cursor-pointer transition-all flex items-center gap-1"
                    >
                      Visit Team Profile
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
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
                      <h4 className="text-lg text-mint-green mb-4">Projects</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.projects.map((project: string, index: number) => (
                          <Link
                            href="#"
                            key={index}
                            className="p-3 bg-white/5 rounded border border-electric-blue/10 text-white hover:bg-electric-blue/10 transition-all"
                          >
                            {project}
                          </Link>
                        ))}
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
                              <span className="text-electric-blue mt-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-white/70">
              No teams found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamsPage;
