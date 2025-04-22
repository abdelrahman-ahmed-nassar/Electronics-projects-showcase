"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { ProjectInterface } from "@/app/Types";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ProjectFormData = Omit<ProjectInterface, "id" | "created_at">;

const UpdateProjectsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // State for projects list and selected project
  const [userProjects, setUserProjects] = useState<ProjectInterface[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);
  const [isLoading, setIsLoading] = useState({
    projects: true,
    updateProject: false,
    deleteProject: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: null,
    tags: [],
    period: null,
    link: null,
    teamId: null,
    isFeatured: false,
  });

  // State for tags input
  const [tagInput, setTagInput] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Define fetchUserProjects using useCallback before it's used in useEffect
  const fetchUserProjects = useCallback(async () => {
    try {
      setIsLoading((prev) => ({ ...prev, projects: true }));
      setError(null);

      // Fetch personal projects
      const personalProjectsResponse = await fetch(
        `/api/users/${user?.id}/projects`
      );
      let allProjects: ProjectInterface[] = [];

      if (personalProjectsResponse.ok) {
        const personalData = await personalProjectsResponse.json();
        if (Array.isArray(personalData)) {
          allProjects = [...personalData];
        } else if (
          personalData &&
          typeof personalData === "object" &&
          Array.isArray(personalData.projects)
        ) {
          allProjects = [...personalData.projects];
        }
      }

      // If user has a team, also fetch team projects
      if (user?.team) {
        const teamProjectsResponse = await fetch(
          `/api/teams/${user.team}/projects`
        );
        if (teamProjectsResponse.ok) {
          const teamData = await teamProjectsResponse.json();
          if (Array.isArray(teamData)) {
            allProjects = [...allProjects, ...teamData];
          } else if (
            teamData &&
            typeof teamData === "object" &&
            Array.isArray(teamData.projects)
          ) {
            allProjects = [...allProjects, ...teamData.projects];
          }
        }
      }

      setUserProjects(allProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setIsLoading((prev) => ({ ...prev, projects: false }));
    }
  }, [user]);

  // Fetch user projects on component mount
  useEffect(() => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    fetchUserProjects();
  }, [user, router, fetchUserProjects]);

  // Handle selecting a project to edit
  const handleSelectProject = (project: ProjectInterface) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      image: project.image,
      tags: project.tags || [],
      period: project.period,
      link: project.link,
      teamId: project.teamId,
      isFeatured: project.isFeatured || false,
    });
    setTagInput("");
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle submitting the form to update a project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject) return;

    try {
      setIsLoading((prev) => ({ ...prev, updateProject: true }));

      // First, format the data properly for the API
      const projectUpdateData = {
        ...formData,
        teamId: formData.teamId || null,
        // Ensure tags is an array
        tags: Array.isArray(formData.tags) ? formData.tags : [],
      };

      // Convert the project ID to a string to ensure proper URL formatting
      const projectId = selectedProject.id.toString();

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectUpdateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Update error response:", errorData);
        const errorMessage =
          errorData?.message || `Failed to update project: ${response.status}`;
        throw new Error(errorMessage);
      }

      const updatedProject = await response.json();

      // Update the project in the list
      setUserProjects((prev) =>
        prev.map((project) =>
          project.id === selectedProject.id ? updatedProject : project
        )
      );

      // Reset selection
      setSelectedProject(null);

      toast.success("Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update project"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, updateProject: false }));
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      setIsLoading((prev) => ({ ...prev, deleteProject: true }));

      // Convert the project ID to a string to ensure proper URL formatting
      const projectId = selectedProject.id.toString();

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Delete error response:", errorData);
        throw new Error(
          errorData?.message || `Failed to delete project: ${response.status}`
        );
      }

      // Remove the project from the list
      setUserProjects((prev) =>
        prev.filter((project) => project.id !== selectedProject.id)
      );

      // Reset selection and close modal
      setSelectedProject(null);
      setIsDeleteModalOpen(false);

      toast.success("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete project"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, deleteProject: false }));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer position="top-right" />

      <h1 className="text-3xl font-bold mb-8 text-dark-800 dark:text-white">
        Manage Your Projects
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects List (Left Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 text-dark-800 dark:text-white">
              Your Projects
            </h2>

            {isLoading.projects ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : userProjects.length === 0 ? (
              <div className="text-center p-6">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-dark-600 dark:text-gray-300 mb-4">
                  You don&apos;t have any projects yet
                </p>
                <Link
                  href="/profile/projects"
                  className="inline-block px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
                >
                  Create Your First Project
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {userProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md border
                      ${
                        selectedProject?.id === project.id
                          ? "border-electric-blue bg-electric-blue/10 dark:bg-electric-blue/20"
                          : "border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-700"
                      }`}
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-200 dark:bg-dark-600 rounded overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title || "Project image"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-dark-600 text-gray-500 dark:text-gray-400">
                            <span className="text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-dark-800 dark:text-white">
                          {project.title || "Untitled Project"}
                        </h3>
                        <p className="text-sm text-dark-500 dark:text-gray-400">
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Edit Form (Right Column) */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-dark-700 p-6">
                <h2 className="text-xl font-bold text-dark-800 dark:text-white">
                  Edit Project
                </h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    disabled={isLoading.deleteProject}
                  >
                    {isLoading.deleteProject ? "Deleting..." : "Delete Project"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-white rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="w-full">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
                      htmlFor="title"
                    >
                      Project Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
                      htmlFor="description"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      rows={4}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue resize-y min-h-[150px] transition-all"
                      placeholder="Describe your project"
                      required
                    />
                  </div>

                  <div className="w-full">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
                      htmlFor="period"
                    >
                      Time Period
                    </label>
                    <input
                      type="text"
                      id="period"
                      name="period"
                      value={formData.period || ""}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                      placeholder="e.g. Jan 2023 - Mar 2023"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm"
                      htmlFor="link"
                    >
                      Project Link
                    </label>
                    <input
                      type="url"
                      id="link"
                      name="link"
                      value={formData.link || ""}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                      placeholder="https://github.com/your-repo"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
                      Tags
                    </label>
                    <div className="flex items-center mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddTag())
                        }
                        className="flex-grow bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-electric-blue transition-all"
                        placeholder="Add a tag"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-3 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-r-lg transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags &&
                        formData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center bg-electric-blue/10 dark:bg-electric-blue/20 text-electric-blue px-3 py-1.5 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 text-electric-blue hover:text-red-500 focus:outline-none"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-4 mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors font-medium"
                    disabled={isLoading.updateProject}
                  >
                    {isLoading.updateProject
                      ? "Saving Changes..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">✏️</div>
              <h2 className="text-xl font-bold mb-2 text-dark-800 dark:text-white">
                Select a Project to Edit
              </h2>
              <p className="text-dark-600 dark:text-gray-300 mb-6">
                Choose a project from the list on the left to update its details
                or delete it.
              </p>
              <Link
                href="/profile/projects"
                className="inline-block px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
              >
                Upload New Project
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            <h3 className="text-xl font-bold mb-4 text-dark-800 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-dark-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedProject?.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                disabled={isLoading.deleteProject}
              >
                {isLoading.deleteProject ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProjectsPage;
