"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { TeamInterface, ProjectInterface } from "@/app/Types";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type TeamFormData = {
  name: string;
  description: string;
  specialty: string;
  achievements: string;
  image: string | null;
  isFeatured: boolean;
};

const UpdateTeamPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for team data
  const [teamData, setTeamData] = useState<TeamInterface | null>(null);
  type TeamMemberInterface = {
    id: string | number;
    name?: string;
    avatarImage?: string;
    role?: string;
    specialization?: string;
  };
  
  const [teamMembers, setTeamMembers] = useState<TeamMemberInterface[]>([]);
  const [teamProjects, setTeamProjects] = useState<ProjectInterface[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectInterface | null>(null);
  const [isLoading, setIsLoading] = useState({
    team: true,
    projects: true,
    updateTeam: false,
    deleteProject: false,
  });
  const [error, setError] = useState<{
    team?: string | null;
    projects?: string | null;
  }>({});

  // Form data state
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    specialty: "",
    achievements: "",
    image: null,
    isFeatured: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch team data when component mounts
  useEffect(() => {
    if (!user?.team) {
      toast.info("You are not a member of any team");
      router.push("/profile");
      return;
    }

    fetchTeamData();
    fetchTeamProjects();
  }, [user, router]);

  // Fetch the user's team data
  const fetchTeamData = async () => {
    if (!user?.team) return;

    try {
      setIsLoading((prev) => ({ ...prev, team: true }));
      setError((prev) => ({ ...prev, team: null }));

      const response = await fetch(`/api/teams/${user.team}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Your team information could not be found. The team may have been deleted.");
        }
        throw new Error(`Failed to fetch team data: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.team && typeof data.team === "object") {
        setTeamData(data.team);
        
        // Convert achievements array to comma-separated string for form
        const achievementsString = Array.isArray(data.team.achievements) 
          ? data.team.achievements.join(", ")
          : data.team.achievements || "";
        
        // Set form data
        setFormData({
          name: data.team.name || "",
          description: data.team.description || "",
          specialty: data.team.specialty || "",
          achievements: achievementsString,
          image: data.team.image || null,
          isFeatured: data.team.isFeatured || false,
        });

        // Set image preview if team has an image
        if (data.team.image) {
          setImagePreview(data.team.image);
        }
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
      toast.error(err instanceof Error ? err.message : "Failed to load team data");
    } finally {
      setIsLoading((prev) => ({ ...prev, team: false }));
    }
  };

  // Fetch team projects
  const fetchTeamProjects = async () => {
    if (!user?.team) return;

    try {
      setIsLoading((prev) => ({ ...prev, projects: true }));
      setError((prev) => ({ ...prev, projects: null }));

      const response = await fetch(`/api/teams/${user.team}/projects`);

      if (!response.ok) {
        if (response.status === 404) {
          // No projects is not an error
          setTeamProjects([]);
          return;
        }
        throw new Error(`Failed to fetch team projects: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setTeamProjects(data);
      } else if (data && typeof data === "object" && Array.isArray(data.projects)) {
        setTeamProjects(data.projects);
      } else {
        setTeamProjects([]);
      }
    } catch (err) {
      console.error("Error fetching team projects:", err);
      setError((prev) => ({
        ...prev,
        projects: err instanceof Error ? err.message : "Failed to load team projects",
      }));
    } finally {
      setIsLoading((prev) => ({ ...prev, projects: false }));
    }
  };

  // Handle selecting a project to view/delete
  const handleSelectProject = (project: ProjectInterface) => {
    setSelectedProject(project);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  // Handle image file changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    // 5MB max size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the image to Supabase
    uploadTeamImage(file);
  };

  // Handle team image upload
  const uploadTeamImage = async (file: File) => {
    try {
      setImageUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-team-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const { imageUrl } = await response.json();

      // Update form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      toast.success("Team logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImagePreview(formData.image);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle team update
  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamData) return;

    try {
      setIsLoading((prev) => ({ ...prev, updateTeam: true }));

      // Convert achievements string to array if needed for API
      const achievementsArray = formData.achievements
        ? formData.achievements.split(",").map(item => item.trim()).filter(item => item)
        : [];

      const teamUpdateData = {
        ...formData,
        achievements: achievementsArray,
      };

      const response = await fetch(`/api/teams/${teamData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamUpdateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update team: ${response.status}`);
      }

      const updatedTeam = await response.json();
      setTeamData(updatedTeam);
      
      toast.success("Team information updated successfully!");
    } catch (err) {
      console.error("Error updating team:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update team information");
    } finally {
      setIsLoading((prev) => ({ ...prev, updateTeam: false }));
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      setIsLoading((prev) => ({ ...prev, deleteProject: true }));

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }

      // Remove the project from the list
      setTeamProjects((prev) =>
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
        Manage Your Team
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Information (Left Column) */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-dark-800 dark:text-white">
              Team Information
            </h2>

            {isLoading.team ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error.team ? (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
                {error.team}
              </div>
            ) : !teamData ? (
              <div className="text-center p-6">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-dark-600 dark:text-gray-300 mb-4">
                  You don&apos;t have a team yet
                </p>
                <Link
                  href="/profile"
                  className="inline-block px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
                >
                  Back to Profile
                </Link>
              </div>
            ) : (
              <div>
                <div className="mb-6 relative w-full h-40 bg-gray-200 dark:bg-dark-600 rounded-lg overflow-hidden">
                  {teamData.image ? (
                    <Image
                      src={teamData.image}
                      alt={teamData.name || "Team image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-electric-blue/20 text-electric-blue">
                      <span className="text-lg">Team Image</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-dark-800 dark:text-white mb-2">
                  {teamData.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-sm bg-electric-blue/10 dark:bg-electric-blue/20 text-electric-blue px-2 py-1 rounded-full">
                    {teamData.specialty || "General Research"}
                  </span>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium text-dark-800 dark:text-white mb-2">Team Members ({teamMembers.length})</h4>
                  <div className="max-h-60 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3 py-2 border-b border-gray-100 dark:border-dark-700 last:border-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-dark-600">
                          {member.avatarImage ? (
                            <Image
                              src={member.avatarImage}
                              alt={member.name || "Team member"}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-dark-600 text-gray-500 dark:text-gray-400">
                              <span className="text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-dark-800 dark:text-white">
                            {member.name || "Unnamed Member"}
                          </div>
                          <div className="text-sm text-dark-500 dark:text-gray-400">
                            {member.role || member.specialization || "Team Member"}
                          </div>
                        </div>
                      </div>
                    ))}
                    {teamMembers.length === 0 && (
                      <p className="text-dark-500 dark:text-gray-400 text-center py-4">No team members found</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Projects Section */}
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-dark-800 dark:text-white">
              Team Projects
            </h2>

            {isLoading.projects ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : error.projects ? (
              <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
                {error.projects}
              </div>
            ) : teamProjects.length === 0 ? (
              <div className="text-center p-6">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-dark-600 dark:text-gray-300 mb-4">
                  No projects for this team yet
                </p>
                <Link
                  href="/profile/projects"
                  className="inline-block px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
                >
                  Create New Project
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {teamProjects.map((project) => (
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

        {/* Team Edit Form (Right Column) */}
        <div className="lg:col-span-2">
          {!teamData ? (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow p-8 text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-xl font-bold mb-2 text-dark-800 dark:text-white">
                Team Information Not Available
              </h2>
              <p className="text-dark-600 dark:text-gray-300 mb-6">
                Please make sure you are a member of a team to manage team settings.
              </p>
            </div>
          ) : selectedProject ? (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-dark-700 p-6">
                <h2 className="text-xl font-bold text-dark-800 dark:text-white">
                  Project Details
                </h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Delete Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-dark-700 dark:hover:bg-dark-600 text-dark-800 dark:text-white rounded-md transition-colors"
                  >
                    Back to Team
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6 relative w-full h-60 bg-gray-200 dark:bg-dark-600 rounded-lg overflow-hidden">
                  {selectedProject.image ? (
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title || "Project image"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-electric-blue/20 text-electric-blue">
                      <span className="text-lg">No Project Image</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-dark-800 dark:text-white">
                  {selectedProject.title}
                </h3>
                
                <div className="mb-4">
                  <span className="text-sm text-dark-500 dark:text-gray-400">
                    Created: {formatDate(selectedProject.created_at)}
                  </span>
                  {selectedProject.period && (
                    <span className="text-sm text-dark-500 dark:text-gray-400 ml-4">
                      Period: {selectedProject.period}
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-dark-800 dark:text-white mb-2">Description</h4>
                  <p className="text-dark-600 dark:text-gray-300">
                    {selectedProject.description || "No description available"}
                  </p>
                </div>
                
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-dark-800 dark:text-white mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-electric-blue/10 dark:bg-electric-blue/20 text-electric-blue px-2 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProject.link && (
                  <div className="mb-6">
                    <h4 className="font-medium text-dark-800 dark:text-white mb-2">Project Link</h4>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-blue hover:underline"
                    >
                      {selectedProject.link}
                    </a>
                  </div>
                )}
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Link
                    href={`/projects/${selectedProject.id}`}
                    className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
                  >
                    View Project Page
                  </Link>
                  <Link
                    href={`/profile/updateProjects`}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition-colors"
                  >
                    Edit Project
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-dark-700 p-6">
                <h2 className="text-xl font-bold text-dark-800 dark:text-white">
                  Update Team Information
                </h2>
              </div>

              <form onSubmit={handleUpdateTeam} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="col-span-2">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                      htmlFor="name"
                    >
                      Team Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
                      placeholder="Enter team name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                      htmlFor="description"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
                      placeholder="Describe your team"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                      htmlFor="specialty"
                    >
                      Specialty
                    </label>
                    <input
                      type="text"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
                      placeholder="e.g., Embedded Systems, IoT, Machine Learning"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                      htmlFor="achievements"
                    >
                      Achievements
                    </label>
                    <textarea
                      id="achievements"
                      name="achievements"
                      value={formData.achievements}
                      onChange={handleChange}
                      rows={3}
                      className="bg-gray-50 dark:bg-dark-700 text-dark-800 dark:text-white px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
                      placeholder="List team achievements (separate with commas)"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Separate multiple achievements with commas
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                      Team Image
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="md:col-span-1">
                        <div className="relative w-full h-32 bg-gray-100 dark:bg-dark-600 rounded-lg overflow-hidden border border-gray-300 dark:border-dark-600">
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Team image preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-dark-700 text-gray-500 dark:text-gray-400">
                              <span className="text-sm">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex flex-col space-y-2">
                          <div className="relative">
                            <input
                              type="file"
                              id="image-upload"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors w-full flex items-center justify-center"
                              disabled={imageUploading}
                            >
                              {imageUploading ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Uploading...
                                </>
                              ) : (
                                "Choose Image"
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WEBP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="h-5 w-5 text-electric-blue focus:ring-electric-blue rounded"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">
                        Feature this team (requires admin approval)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-700 pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-md transition-colors"
                    disabled={isLoading.updateTeam}
                  >
                    {isLoading.updateTeam
                      ? "Saving Changes..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
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

export default UpdateTeamPage;
