"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";

// Define types for better TypeScript support
interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  thumbnail: string;
  fullImage: string;
  category: string;
  tags: string[];
  dateCreated: string;
  featured: boolean;
  award: string | null;
  team: Team;
  technicalDetails: string[];
  developmentTime: string;
  videoDemo: boolean;
}

interface FormData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  technicalDetails: string[];
  featured: boolean;
  award: string;
  videoDemo: boolean;
  developmentTime: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  longDescription?: string;
  category?: string;
  tags?: string;
  technicalDetails?: string;
  developmentTime?: string;
}

const EditProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hasPermission, setHasPermission] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    tags: [],
    technicalDetails: [""],
    featured: false,
    award: "",
    videoDemo: false,
    developmentTime: "",
  });

  const [tagInput, setTagInput] = useState("");
  const categories = [
    "Embedded Systems",
    "Robotics",
    "IoT",
    "Signal Processing",
    "Renewable Energy",
    "Medical Devices",
    "AI & Machine Learning",
    "Power Electronics",
    "Communication Systems",
  ];

  useEffect(() => {
    // Check if user is authenticated and redirect if not
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch project data
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch the project from an API
        // For now, simulate a delay and use mock data
        setTimeout(() => {
          const mockProject: Project = {
            id: parseInt(id as string),
            title: "Neural-Enhanced Prosthetic Hand",
            description:
              "An advanced prosthetic hand system with integrated neural feedback mechanisms that provide tactile sensation to users.",
            longDescription:
              "This project addresses the limitations of traditional prosthetic devices by incorporating a sophisticated neural interface that translates electrical signals from residual muscles into precise hand movements. The system features 15 degrees of freedom, allowing for complex grasping patterns and fine motor control.",
            thumbnail: "/api/placeholder/300/200",
            fullImage: "/api/placeholder/800/450",
            category: "Medical Devices",
            tags: [
              "Biomedical Engineering",
              "Neural Interfaces",
              "Machine Learning",
              "Tactile Sensors",
            ],
            dateCreated: "2024-10-15",
            featured: true,
            award: "Industry Award Winner",
            team: {
              id: "team-123",
              name: "BioTech Solutions",
              members: [
                { id: "user-1", name: "Emma Patel", role: "Team Lead" },
                {
                  id: "user-2",
                  name: "David Kim",
                  role: "Neural Interface Specialist",
                },
                {
                  id: "user-3",
                  name: "Olivia Wilson",
                  role: "Machine Learning Engineer",
                },
              ],
            },
            technicalDetails: [
              "16-bit microcontroller with 120MHz processing capabilities",
              "Advanced EMG signal processing with 99.2% pattern recognition accuracy",
              "Battery life of 14 hours under normal usage conditions",
              "Wireless charging and data synchronization",
              "Waterproof to IP67 standards",
            ],
            developmentTime: "12 weeks",
            videoDemo: true,
          };

          setProject(mockProject);

          // Check if user belongs to the team that owns this project
          if (user && user.team && String(user.team) === mockProject.team.id) {
            setHasPermission(true);

            // Populate form data
            setFormData({
              title: mockProject.title,
              description: mockProject.description,
              longDescription: mockProject.longDescription,
              category: mockProject.category,
              tags: [...mockProject.tags],
              technicalDetails: [...mockProject.technicalDetails],
              featured: mockProject.featured,
              award: mockProject.award || "",
              videoDemo: mockProject.videoDemo,
              developmentTime: mockProject.developmentTime,
            });
          } else {
            setHasPermission(false);
          }

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching project:", error);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, isAuthenticated, router, user]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle tag input
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Add a new tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Add a new technical detail field
  const addTechnicalDetail = () => {
    setFormData({
      ...formData,
      technicalDetails: [...formData.technicalDetails, ""],
    });
  };

  // Update a technical detail
  const updateTechnicalDetail = (index: number, value: string) => {
    const updatedDetails = [...formData.technicalDetails];
    updatedDetails[index] = value;
    setFormData({
      ...formData,
      technicalDetails: updatedDetails,
    });
  };

  // Remove a technical detail
  const removeTechnicalDetail = (index: number) => {
    if (formData.technicalDetails.length > 1) {
      const updatedDetails = formData.technicalDetails.filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        technicalDetails: updatedDetails,
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Short description is required";
    if (!formData.longDescription.trim())
      errors.longDescription = "Detailed description is required";
    if (!formData.category) errors.category = "Category is required";
    if (formData.tags.length === 0)
      errors.tags = "At least one tag is required";
    if (!formData.developmentTime.trim())
      errors.developmentTime = "Development time is required";

    // Check if any technical detail is empty
    const hasEmptyTechnicalDetail = formData.technicalDetails.some(
      (detail) => !detail.trim()
    );
    if (hasEmptyTechnicalDetail)
      errors.technicalDetails = "All technical details must be filled";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSaving(true);

    try {
      // In a real app, this would be an API call to update the project
      // For now, simulate a delay
      setTimeout(() => {
        setIsSaving(false);

        // Redirect to the project details page after successful update
        router.push(`/projects/${id}`);
      }, 1500);
    } catch (error) {
      console.error("Error saving project:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="font-sans bg-navy text-white min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="font-sans bg-navy text-white min-h-screen flex justify-center items-center">
        <div className="text-center p-8">
          <h2 className="text-2xl mb-4 text-mint-green">Access Denied</h2>
          <p className="mb-6 text-white/80">
            You don&apos;t have permission to edit this project. Only team
            members can edit their team&apos;s projects.
          </p>
          <Link
            href={`/projects/${id}`}
            className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md"
          >
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Page Header */}
      <section className="relative py-12 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl mb-3 text-mint-green">
            Edit Project: {project?.title}
          </h1>
          <p className="text-md max-w-3xl mb-0 text-white/80">
            Update your team&apos;s project information
          </p>
        </div>
      </section>

      {/* Edit Form */}
      <section className="py-10 px-5">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-mint-green mb-6">
                Basic Information
              </h2>

              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block mb-2 text-white/90">
                  Project Title <span className="text-magenta">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full py-2 px-4 bg-white/5 border ${
                    formErrors.title
                      ? "border-magenta"
                      : "border-electric-blue/30"
                  } rounded outline-none focus:border-electric-blue transition-all text-white`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block mb-2 text-white/90"
                >
                  Short Description <span className="text-magenta">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full py-2 px-4 bg-white/5 border ${
                    formErrors.description
                      ? "border-magenta"
                      : "border-electric-blue/30"
                  } rounded outline-none focus:border-electric-blue transition-all text-white`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Detailed Description */}
              <div className="mb-6">
                <label
                  htmlFor="longDescription"
                  className="block mb-2 text-white/90"
                >
                  Detailed Description <span className="text-magenta">*</span>
                </label>
                <textarea
                  id="longDescription"
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full py-2 px-4 bg-white/5 border ${
                    formErrors.longDescription
                      ? "border-magenta"
                      : "border-electric-blue/30"
                  } rounded outline-none focus:border-electric-blue transition-all text-white`}
                />
                {formErrors.longDescription && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.longDescription}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block mb-2 text-white/90">
                  Category <span className="text-magenta">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full py-2 px-4 bg-white/5 border ${
                    formErrors.category
                      ? "border-magenta"
                      : "border-electric-blue/30"
                  } rounded outline-none focus:border-electric-blue transition-all text-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Development Time */}
              <div className="mb-6">
                <label
                  htmlFor="developmentTime"
                  className="block mb-2 text-white/90"
                >
                  Development Time <span className="text-magenta">*</span>
                </label>
                <input
                  type="text"
                  id="developmentTime"
                  name="developmentTime"
                  value={formData.developmentTime}
                  onChange={handleChange}
                  placeholder="e.g., 12 weeks"
                  className={`w-full py-2 px-4 bg-white/5 border ${
                    formErrors.developmentTime
                      ? "border-magenta"
                      : "border-electric-blue/30"
                  } rounded outline-none focus:border-electric-blue transition-all text-white`}
                />
                {formErrors.developmentTime && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.developmentTime}
                  </p>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-mint-green mb-6">
                Technical Details
              </h2>

              {formData.technicalDetails.map((detail, index) => (
                <div key={index} className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) =>
                      updateTechnicalDetail(index, e.target.value)
                    }
                    placeholder={`Technical detail ${index + 1}`}
                    className={`flex-grow py-2 px-4 bg-white/5 border ${
                      formErrors.technicalDetails
                        ? "border-magenta"
                        : "border-electric-blue/30"
                    } rounded outline-none focus:border-electric-blue transition-all text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTechnicalDetail(index)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded"
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}

              {formErrors.technicalDetails && (
                <p className="mt-1 mb-2 text-magenta text-sm error-message">
                  {formErrors.technicalDetails}
                </p>
              )}

              <button
                type="button"
                onClick={addTechnicalDetail}
                className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-2"
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Technical Detail
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-mint-green mb-6">Tags</h2>

              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    placeholder="Enter a tag and press Add"
                    className={`flex-grow py-2 px-4 bg-white/5 border ${
                      formErrors.tags
                        ? "border-magenta"
                        : "border-electric-blue/30"
                    } rounded outline-none focus:border-electric-blue transition-all text-white`}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                {formErrors.tags && (
                  <p className="mt-1 text-magenta text-sm error-message">
                    {formErrors.tags}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="py-1 px-2 bg-mint-green/10 rounded text-sm text-mint-green flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-mint-green/80 hover:text-mint-green"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
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
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-mint-green mb-6">
                Additional Options
              </h2>

              {/* Featured Status */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                  />
                  <span className="text-white/90">
                    Mark as Featured Project
                  </span>
                </label>
              </div>

              {/* Video Demo */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="videoDemo"
                    checked={formData.videoDemo}
                    onChange={handleChange}
                    className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                  />
                  <span className="text-white/90">Has Video Demo</span>
                </label>
              </div>

              {/* Award */}
              <div className="mb-4">
                <label htmlFor="award" className="block mb-2 text-white/90">
                  Award (if any)
                </label>
                <input
                  type="text"
                  id="award"
                  name="award"
                  value={formData.award}
                  onChange={handleChange}
                  placeholder="e.g., Best Innovation Award"
                  className="w-full py-2 px-4 bg-white/5 border border-electric-blue/30 rounded outline-none focus:border-electric-blue transition-all text-white"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
              <Link
                href={`/projects/${id}`}
                className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-md text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
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
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProjectPage;
