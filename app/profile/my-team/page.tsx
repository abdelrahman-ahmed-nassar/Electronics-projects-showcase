"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { TeamInterface, UserInterface, ProjectInterface } from "@/app/Types";
import Link from "next/link";
import { FiExternalLink, FiUser, FiCalendar, FiTag } from "react-icons/fi";

export default function MyTeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamInterface | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserInterface[]>([]);
  const [teamProjects, setTeamProjects] = useState<ProjectInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!user?.team) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the team data
        const teamResponse = await fetch(`/api/teams/${user.team}`);
        if (!teamResponse.ok) {
          throw new Error(`Failed to fetch team: ${teamResponse.status}`);
        }
        const teamData = await teamResponse.json();
        setTeam(teamData.team);
        setTeamMembers(teamData.members || []);

        // Fetch the team's projects
        const projectsResponse = await fetch(
          `/api/teams/${user.team}/projects`
        );
        if (!projectsResponse.ok) {
          throw new Error(
            `Failed to fetch team projects: ${projectsResponse.status}`
          );
        }
        const projectsData = await projectsResponse.json();
        setTeamProjects(projectsData);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load team data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user?.team]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!user?.team) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-gray-50 dark:bg-dark-700 p-8 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4 text-dark-800 dark:text-white">
            No Team Assigned
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You are not currently assigned to any team. Please contact your
            administrator or professor to be assigned to a team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Team Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">
          {team?.name || "My Team"}
        </h1>
        <p className="text-primary-100">
          {team?.description || "No team description available."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Info & Members */}
        <div className="lg:col-span-1 space-y-6">
          {/* Team Info Card */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-100 dark:border-dark-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-dark-800 dark:text-white">
              Team Information
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  Specialty
                </h3>
                <p className="text-dark-800 dark:text-white font-medium">
                  {team?.specialty || "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">
                  Achievements
                </h3>
                <p className="text-dark-800 dark:text-white font-medium">
                  {team?.achievements || "No achievements listed"}
                </p>
              </div>
            </div>
          </div>

          {/* Team Members Card */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-100 dark:border-dark-700 p-6">
            <h2 className="text-xl font-semibold mb-4 text-dark-800 dark:text-white">
              Team Members ({teamMembers.length})
            </h2>
            <div className="space-y-4">
              {teamMembers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No team members found.
                </p>
              ) : (
                teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500">
                      <FiUser />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-dark-800 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role || "Member"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Team Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-100 dark:border-dark-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark-800 dark:text-white">
                Team Projects ({teamProjects.length})
              </h2>
              <Link
                href="/profile/projects"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                Upload New Project
              </Link>
            </div>

            {teamProjects.length === 0 ? (
              <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Your team hasn't uploaded any projects yet.
                </p>
                <Link
                  href="/profile/projects"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Upload Your First Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-50 dark:bg-dark-700 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-dark-600 hover:shadow-md transition-shadow"
                  >
                    {project.image ? (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title || "Project Image"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 bg-gray-200 dark:bg-dark-600 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500">
                          No image
                        </span>
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-dark-800 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {project.period && (
                          <div className="flex items-center">
                            <FiCalendar className="mr-1" />
                            <span>{project.period}</span>
                          </div>
                        )}

                        {project.tags &&
                          Array.isArray(project.tags) &&
                          project.tags.length > 0 && (
                            <div className="flex items-center">
                              <FiTag className="mr-1" />
                              <span>
                                {project.tags.slice(0, 3).join(", ")}
                                {project.tags.length > 3 ? "..." : ""}
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="flex justify-between items-center">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-primary-500 hover:text-primary-600 transition-colors font-medium text-sm flex items-center"
                        >
                          View Details <FiExternalLink className="ml-1" />
                        </Link>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          >
                            <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
