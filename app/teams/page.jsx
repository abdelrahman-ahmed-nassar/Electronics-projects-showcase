"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Teams Page Component
const TeamsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample filters for teams - we can keep these hardcoded for now
  const filters = [
    "All",
    "Analog Electronics",
    "Medical Electronics",
    "Robotics & Automation",
    "Renewable Energy",
    "Signal Processing",
    "Embedded Systems",
  ];

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

        // Transform the data to match our UI component expectations
        const enhancedTeams = data.map((team) => {
          // Safely parse achievements or handle as a string array
          let achievements = [];
          if (team.achievements) {
            if (Array.isArray(team.achievements)) {
              achievements = team.achievements;
            } else {
              try {
                // Try to parse as JSON
                achievements = JSON.parse(team.achievements);
              } catch (e) {
                // If parsing fails, treat it as a single string
                console.warn(
                  `Failed to parse achievements for team ${team.id}: ${e.message}`
                );
                achievements = [String(team.achievements)];
              }
            }
          }

          return {
            id: team.id,
            name: team.name || "Unnamed Team",
            specialty: team.specialty || "General Electronics",
            description: team.description || "No description available",
            achievements: achievements,
            members: [], // We'll need to fetch members separately if needed
            projects: [], // We'll need to fetch projects separately if needed
            image: "/images/default-team-image.png", // Using default image
          };
        });

        setTeams(enhancedTeams);
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
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || team.specialty === activeFilter;

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
          filters={filters}
        />
      )}
      <TeamStatsSection />
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

// Teams Section Component
const TeamsSection = ({
  teams,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  filters,
}) => {
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleTeamDetails = (teamId) => {
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
            {filters.map((filter) => (
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
        <div className="space-y-12">
          {teams.length > 0 ? (
            teams.map((team) => (
              <div
                key={team.id}
                className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:border-electric-blue"
              >
                {/* Team Header */}
                <div className="relative h-[200px] overflow-hidden">
                  <img
                    src={team.image}
                    alt={`${team.name} project image`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <div className="inline-block py-1 px-2 mb-2 bg-electric-blue/80 text-white text-sm rounded">
                      {team.specialty}
                    </div>
                    <h3 className="text-2xl md:text-3xl mt-0 mb-0 text-white">
                      {team.name}
                    </h3>
                  </div>
                </div>

                {/* Team Info */}
                <div className="p-5">
                  <p className="text-white/80 mb-4">{team.description}</p>

                  <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                    {/* Team Members Preview */}
                    <div className="flex items-center gap-2">
                      {team.members.slice(0, 3).map((member, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green overflow-hidden"
                        >
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
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

                  <button
                    onClick={() => toggleTeamDetails(team.id)}
                    className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10"
                  >
                    {expandedTeam === team.id
                      ? "Hide Details"
                      : "View Team Details"}
                  </button>
                </div>

                {/* Expanded Team Details */}
                {expandedTeam === team.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-4">
                    {/* Team Members Section */}
                    <div className="mb-6">
                      <h4 className="text-lg text-mint-green mb-4">
                        Team Members
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {team.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded"
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {member.name}
                              </div>
                              <div className="text-electric-blue text-sm">
                                {member.role}
                              </div>
                              <div className="text-white/60 text-xs">
                                {member.bio}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Projects Section */}
                    <div className="mb-6">
                      <h4 className="text-lg text-mint-green mb-4">Projects</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {team.projects.map((project, index) => (
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
                        {team.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-white/80"
                          >
                            <span className="text-electric-blue mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
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

// Team Stats Section
const TeamStatsSection = () => {
  const stats = [
    { value: 6, label: "Research Teams" },
    { value: 23, label: "Active Members" },
    { value: 27, label: "Current Projects" },
    { value: 12, label: "Industry Partners" },
  ];

  return (
    <section className="py-16 px-5 bg-white/[0.03]">
      <div className="flex justify-around flex-wrap max-w-6xl mx-auto gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="text-center flex-1 min-w-[200px]">
            <div className="text-4xl font-bold text-electric-blue mb-2.5">
              {stat.value}
            </div>
            <div className="text-lg text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamsPage;
