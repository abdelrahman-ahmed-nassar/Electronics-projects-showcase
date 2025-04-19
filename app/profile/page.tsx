"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiPhone, FiMail, FiUsers } from "react-icons/fi";
import ProfileCard from "@/public/images/default-user-profile-image.svg";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { ProjectInterface } from "@/app/Types";
import Link from "next/link";

import CourseImage from "@/public/images/default-project-image.png";
function Page() {
  const authContext = useAuth();
  const [teamProjects, setTeamProjects] = useState<ProjectInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamProjects = async () => {
      if (!authContext.user?.team) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/teams/${authContext.user.team}/projects`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch team projects: ${response.status}`);
        }

        const data = await response.json();
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setTeamProjects(data);
        } else if (
          data &&
          typeof data === "object" &&
          Array.isArray(data.projects)
        ) {
          // Handle case where API returns { projects: [...] }
          setTeamProjects(data.projects);
        } else {
          console.error("API returned unexpected data format:", data);
          setTeamProjects([]);
          setError("Received invalid data format from server");
        }
      } catch (err) {
        console.error("Error fetching team projects:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load team projects"
        );
        setTeamProjects([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTeamProjects();
  }, [authContext.user?.team]);

  if (!authContext.user) return <div></div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">
        Profile
      </h1>

      <div className="card bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-dark-700 mb-8">
        <div className="md:flex">
          {/* Profile Image Section */}
          <div className="md:w-1/3 bg-gradient-to-br from-primary-500 to-primary-700 p-6 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
              <Image
                src={ProfileCard}
                alt="Profile Image"
                className="object-cover"
                fill
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              {authContext.user.name}
            </h2>
            <p className="text-primary-100 text-sm">Student</p>
          </div>

          {/* Profile Details Section */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-semibold text-dark-800 dark:text-white mb-4">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                  <FiPhone className="text-lg" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone Number
                  </p>
                  <p className="font-medium text-dark-800 dark:text-white">
                    {authContext.user.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                  <FiMail className="text-lg" />
                </div>
                <div className="ml-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-dark-800 dark:text-white">
                    {authContext.user.email}
                  </p>
                </div>
              </div>

              {authContext.user.team && (
                <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500">
                    <FiUsers className="text-lg" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Team
                    </p>
                    <p className="font-medium text-dark-800 dark:text-white">
                      <Link
                        href={`/teams/${authContext.user.team}`}
                        className="text-primary-500 hover:underline"
                      >
                        View My Team
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Projects Section */}
      {authContext.user.team && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-dark-800 dark:text-white">
            Team Projects
          </h2>

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          ) : teamProjects.length === 0 ? (
            <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No projects found for your team.
              </p>
              <Link
                href="/profile/projects"
                className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Upload a Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-dark-800 overflow-hidden rounded-lg shadow-md border border-gray-100 dark:border-dark-700 hover:shadow-lg transition-shadow"
                >
                  {project.image ? (
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={project.image || CourseImage}
                        alt={project.title || "Project Image"}
                        className="w-full h-full object-cover"
                        width={400}
                        height={200}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 dark:bg-dark-700 flex items-center justify-center">
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

                    {project.tags &&
                      Array.isArray(project.tags) &&
                      project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="py-1 px-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-block px-3 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors text-sm"
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
