"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiPhone,
  FiMail,
  FiUsers,
  FiInfo,
  FiBriefcase,
  FiHash,
} from "react-icons/fi";
import ProfileCard from "@/public/images/default-user-profile-image.svg";
import TeamImage from "@/public/images/default-team-image.png";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { ProjectInterface, TeamInterface, UserInterface } from "@/app/Types";
import Link from "next/link";
import CourseImage from "@/public/images/default-project-image.png";

function Page() {
  const authContext = useAuth();
  const [teamProjects, setTeamProjects] = useState<ProjectInterface[]>([]);
  const [userProjects, setUserProjects] = useState<ProjectInterface[]>([]);
  const [teamData, setTeamData] = useState<TeamInterface | null>(null);
  const [teamMembers, setTeamMembers] = useState<UserInterface[]>([]);
  const [isLoading, setIsLoading] = useState({
    team: false,
    teamProjects: false,
    userProjects: false,
  });
  const [error, setError] = useState<{
    team?: string | null;
    teamProjects?: string | null;
    userProjects?: string | null;
  }>({});

  // Fetch team data if the user is in a team
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!authContext.user?.team) return;

      try {
        setIsLoading((prev) => ({ ...prev, team: true }));
        setError((prev) => ({ ...prev, team: null }));

        const response = await fetch(`/api/teams/${authContext.user.team}`);

        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 specifically with a user-friendly message
            throw new Error(
              "Your team information could not be found. The team may have been deleted."
            );
          }
          throw new Error(`Failed to fetch team data: ${response.status}`);
        }

        const data = await response.json();
        if (data.team && typeof data.team === "object") {
          setTeamData(data.team);
        }

        if (data.members && Array.isArray(data.members)) {
          setTeamMembers(data.members);
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError((prev) => ({
          ...prev,
          team: err instanceof Error ? err.message : "Failed to load team data",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, team: false }));
      }
    };

    fetchTeamData();
  }, [authContext.user?.team]);

  // Fetch team projects
  useEffect(() => {
    const fetchTeamProjects = async () => {
      if (!authContext.user?.team) return;

      try {
        setIsLoading((prev) => ({ ...prev, teamProjects: true }));
        setError((prev) => ({ ...prev, teamProjects: null }));

        const response = await fetch(
          `/api/teams/${authContext.user.team}/projects`
        );

        if (!response.ok) {
          if (response.status === 404) {
            // Handle 404 specifically with a user-friendly message
            throw new Error(
              "No projects found for your team. The team may not exist or have any projects."
            );
          }
          throw new Error(`Failed to fetch team projects: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTeamProjects(data);
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray(data.projects)
        ) {
          setTeamProjects(data.projects);
        } else {
          console.error("API returned unexpected data format:", data);
          setTeamProjects([]);
          setError((prev) => ({
            ...prev,
            teamProjects: "Received invalid data format from server",
          }));
        }
      } catch (err) {
        console.error("Error fetching team projects:", err);
        setError((prev) => ({
          ...prev,
          teamProjects:
            err instanceof Error ? err.message : "Failed to load team projects",
        }));
        setTeamProjects([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, teamProjects: false }));
      }
    };

    fetchTeamProjects();
  }, [authContext.user?.team]);

  // Fetch user's personal projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      if (!authContext.user?.id) return;

      try {
        setIsLoading((prev) => ({ ...prev, userProjects: true }));
        setError((prev) => ({ ...prev, userProjects: null }));

        const response = await fetch(
          `/api/users/${authContext.user.id}/projects`
        );

        if (!response.ok) {
          if (response.status === 404) {
            // No projects is not an error
            setUserProjects([]);
            return;
          }
          throw new Error(`Failed to fetch user projects: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setUserProjects(data);
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray(data.projects)
        ) {
          setUserProjects(data.projects);
        } else {
          setUserProjects([]);
        }
      } catch (err) {
        console.error("Error fetching user projects:", err);
        setError((prev) => ({
          ...prev,
          userProjects:
            err instanceof Error ? err.message : "Failed to load user projects",
        }));
        setUserProjects([]);
      } finally {
        setIsLoading((prev) => ({ ...prev, userProjects: false }));
      }
    };

    fetchUserProjects();
  }, [authContext.user?.id]);

  // If no authentication, show empty div
  if (!authContext.user)
    return (
      <div className="text-center py-12">
        Please log in to view your profile.
      </div>
    );

  // Format skills from string to array if it exists
  const userSkills = authContext.user.skills
    ? typeof authContext.user.skills === "string"
      ? authContext.user.skills.split(",").map((skill) => skill.trim())
      : []
    : [];

  return (
    <div className="container mx-auto py-3 px-2 sm:py-8 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-6 text-dark-800 dark:text-white">
        My Profile
      </h1>

      {/* User Profile Card */}
      <div className="card bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-dark-700 mb-4 sm:mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-primary-500 to-primary-700 p-3 sm:p-6 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-2 sm:mb-4">
              <Image
                src={authContext.user.avatarImage || ProfileCard}
                alt="Profile Image"
                className="object-cover"
                fill
              />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1 text-center">
              {authContext.user.name || "No Name"}
            </h2>
            <p className="text-primary-100 text-sm text-center">
              {authContext.user.role ||
                authContext.user.specialization ||
                "Student"}
            </p>

            {userSkills.length > 0 && (
              <div className="mt-2 sm:mt-4 flex flex-wrap justify-center gap-1 sm:gap-2">
                {userSkills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="py-1 px-2 bg-white/20 text-white text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {userSkills.length > 3 && (
                  <span className="py-1 px-2 bg-white/20 text-white text-xs rounded-full">
                    +{userSkills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Profile Details Section */}
          <div className="w-full md:w-2/3 p-3 sm:p-6">
            <h3 className="text-md sm:text-lg font-semibold text-dark-800 dark:text-white mb-2 sm:mb-4">
              Contact Information
            </h3>

            <div className="space-y-2 sm:space-y-4">
              {authContext.user.phone && (
                <div className="flex items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiPhone className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Phone Number
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white text-sm sm:text-base break-words">
                      {authContext.user.phone}
                    </p>
                  </div>
                </div>
              )}

              {authContext.user.email && (
                <div className="flex items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiMail className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4 w-full">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white text-sm sm:text-base break-words">
                      {authContext.user.email}
                    </p>
                  </div>
                </div>
              )}

              {authContext.user.specialization && (
                <div className="flex items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiBriefcase className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Specialization
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white text-sm sm:text-base break-words">
                      {authContext.user.specialization}
                    </p>
                  </div>
                </div>
              )}

              {authContext.user.nationalId && (
                <div className="flex items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiHash className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      National ID
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white text-sm sm:text-base break-words">
                      {authContext.user.nationalId}
                    </p>
                  </div>
                </div>
              )}

              {authContext.user.about && (
                <div className="flex items-start p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mt-1">
                    <FiInfo className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      About
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white text-sm sm:text-base break-words">
                      {authContext.user.about}
                    </p>
                  </div>
                </div>
              )}

              {authContext.user.team && (
                <div className="flex items-center p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-1.5 sm:p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiUsers className="text-base sm:text-lg" />
                  </div>
                  <div className="ml-2 sm:ml-4 flex-grow">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Team
                    </p>
                    <div className="font-medium text-dark-800 dark:text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <span className="break-words">
                        {teamData ? teamData.name : "Loading team..."}
                      </span>
                      <Link
                        href={`/teams/${authContext.user.team}`}
                        className="text-primary-500 hover:underline text-sm whitespace-nowrap"
                      >
                        View Team
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <Link
                href="/profile/settings"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-center sm:text-left text-sm sm:text-base"
              >
                Edit Profile
              </Link>
              <Link
                href="/profile/projects"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-center sm:text-left text-sm sm:text-base"
              >
                Manage Projects
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Information */}
      {authContext.user.team && (
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-dark-800 dark:text-white">
            My Team
          </h2>

          {isLoading.team ? (
            <div className="flex justify-center items-center p-4 sm:p-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error.team ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded-lg">
              {error.team}
            </div>
          ) : teamData ? (
            <div className="bg-white dark:bg-dark-800 overflow-hidden rounded-lg shadow-md border border-gray-100 dark:border-dark-700">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 p-3 sm:p-6">
                  <div className="relative w-full aspect-square max-w-[150px] sm:max-w-[200px] mx-auto md:mx-0 overflow-hidden rounded-lg border border-gray-200 dark:border-dark-600">
                    <Image
                      src={teamData.image || TeamImage}
                      alt={teamData.name || "Team Image"}
                      className="object-cover"
                      fill
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-6 w-full md:w-3/4">
                  <h3 className="text-md sm:text-lg font-semibold mb-1 sm:mb-2 text-dark-800 dark:text-white">
                    {teamData.name || "My Team"}
                  </h3>

                  {teamData.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 text-sm sm:text-base">
                      {teamData.description}
                    </p>
                  )}

                  {teamData.specialty && (
                    <div className="mb-2 sm:mb-4">
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Specialty:{" "}
                      </span>
                      <span className="text-dark-800 dark:text-white text-sm sm:text-base">
                        {teamData.specialty}
                      </span>
                    </div>
                  )}

                  {teamMembers.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                        Team Members:
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {teamMembers.slice(0, 3).map((member, idx) => (
                          <Link
                            key={member.id || idx}
                            href={`/students/${member.id}`}
                            className="flex items-center gap-1 sm:gap-2 bg-gray-50 dark:bg-dark-700 px-2 sm:px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
                          >
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={member.avatarImage || ProfileCard}
                                alt={member.name || "Team Member"}
                                width={24}
                                height={24}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs sm:text-sm truncate max-w-[70px] sm:max-w-[120px]">
                              {member.name || "Team Member"}
                            </span>
                          </Link>
                        ))}
                        {teamMembers.length > 3 && (
                          <span className="bg-gray-50 dark:bg-dark-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                            +{teamMembers.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center sm:justify-end">
                    <Link
                      href={`/teams/${authContext.user.team}`}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-xs sm:text-sm"
                    >
                      View Team Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-dark-700 p-3 sm:p-6 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Team information could not be loaded.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Team Projects Section */}
      {authContext.user.team && (
        <div className="mt-4 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-dark-800 dark:text-white">
            Team Projects
          </h2>

          {isLoading.teamProjects ? (
            <div className="flex justify-center items-center p-4 sm:p-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error.teamProjects ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded-lg">
              {error.teamProjects}
            </div>
          ) : teamProjects.length === 0 ? (
            <div className="bg-gray-50 dark:bg-dark-700 p-3 sm:p-6 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No projects found for your team.
              </p>
              <Link
                href="/profile/projects"
                className="mt-2 sm:mt-4 inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                Upload a Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {teamProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-dark-800 overflow-hidden rounded-lg shadow-md border border-gray-100 dark:border-dark-700 hover:shadow-lg transition-shadow"
                >
                  {project.image ? (
                    <div className="h-32 sm:h-48 overflow-hidden">
                      <Image
                        src={project.image || CourseImage}
                        alt={project.title || "Project Image"}
                        className="w-full h-full object-cover"
                        width={400}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="h-32 sm:h-48 bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        No image
                      </span>
                    </div>
                  )}

                  <div className="p-2 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-dark-800 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1 sm:mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {project.tags &&
                      Array.isArray(project.tags) &&
                      project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="py-0.5 px-1 sm:py-1 sm:px-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-[10px] sm:text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="py-0.5 px-1 sm:py-1 sm:px-2 bg-gray-50 dark:bg-dark-700 rounded text-[10px] sm:text-xs text-gray-500">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-xs sm:text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Personal Projects Section */}
      {userProjects.length > 0 && (
        <div className="mt-4 sm:mt-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-dark-800 dark:text-white">
            My Personal Projects
          </h2>

          {isLoading.userProjects ? (
            <div className="flex justify-center items-center p-4 sm:p-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error.userProjects ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 sm:p-4 rounded-lg">
              {error.userProjects}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {userProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-dark-800 overflow-hidden rounded-lg shadow-md border border-gray-100 dark:border-dark-700 hover:shadow-lg transition-shadow"
                >
                  {project.image ? (
                    <div className="h-32 sm:h-48 overflow-hidden">
                      <Image
                        src={project.image || CourseImage}
                        alt={project.title || "Project Image"}
                        className="w-full h-full object-cover"
                        width={400}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="h-32 sm:h-48 bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        No image
                      </span>
                    </div>
                  )}

                  <div className="p-2 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-dark-800 dark:text-white line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-1 sm:mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    {project.tags &&
                      Array.isArray(project.tags) &&
                      project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="py-0.5 px-1 sm:py-1 sm:px-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-[10px] sm:text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="py-0.5 px-1 sm:py-1 sm:px-2 bg-gray-50 dark:bg-dark-700 rounded text-[10px] sm:text-xs text-gray-500">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-xs sm:text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
