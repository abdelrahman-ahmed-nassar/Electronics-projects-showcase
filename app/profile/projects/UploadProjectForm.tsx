"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectInterface } from "@/app/Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";

// Define the type for the form data, omitting auto-generated fields
type ProjectFormData = Omit<ProjectInterface, "id" | "created_at">;

export default function UploadProjectForm() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth(); // Get the authenticated user and loading state
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [teamChecked, setTeamChecked] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: "",
    tags: [""],
    period: "",
    link: "",
    teamId: user?.team || null,
  });

  // Update teamId when user changes or on component mount
  useEffect(() => {
    if (user?.team) {
      setFormData((prevData) => ({
        ...prevData,
        teamId: user.team,
      }));
    }
  }, [user?.team]);

  // Improved check for team membership
  useEffect(() => {
    // Only check team membership once after authentication loading is complete
    if (!authLoading && !teamChecked) {
      setTeamChecked(true);

      // If user exists but doesn't have a team, show a message and redirect
      if (user && !user.team) {
        toast.error("You must be a member of a team to upload projects.");
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      }
    }
  }, [user, router, authLoading, teamChecked]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
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
    try {
      setImageUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
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

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Double-check if user has a team
    if (!user?.team) {
      toast.error("You must be a member of a team to upload projects.");
      return;
    }

    setLoading(true);

    try {
      // Ensure teamId is set to the user's team
      const projectData = {
        ...formData,
        teamId: user.team,
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(
          result.message ||
            "Failed to upload project. Status: " + response.status
        );
      }

      toast.success("Project uploaded successfully!");

      setTimeout(() => {
        router.push("/projects");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state when auth is still loading
  if (authLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading user data...</p>
        </div>
      </div>
    );
  }

  // If user has no team, show message and don't render the form
  if (user && !user.team) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Unable to Upload Project
          </h2>
          <p className="text-gray-300 mb-6">
            You must be a member of a team to upload projects. Please join a
            team or contact your administrator.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <h1 className="text-2xl font-bold text-white mb-6">Upload New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="title">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        {/* Project Image Upload */}
        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="image">
            Project Image (Optional)
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Choose Image"}
              </button>
              {imageUploading && (
                <span className="text-yellow-500 text-sm">Uploading...</span>
              )}
              {imagePreview && !imageUploading && (
                <span className="text-green-500 text-sm">✓ Image uploaded</span>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2 relative h-40 w-full max-w-sm overflow-hidden rounded-lg border border-gray-600">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={Array.isArray(formData.tags) ? formData.tags.join(", ") : ""}
            onChange={(e) => {
              const tagsArray = e.target.value
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);
              setFormData((prev) => ({ ...prev, tags: tagsArray }));
            }}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Robotics, IoT, Embedded Systems"
          />
        </div>

        <div>
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="period"
          >
            Project Period (Optional)
          </label>
          <input
            type="text"
            id="period"
            name="period"
            value={formData.period ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Fall 2022 - Spring 2023"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="link">
            Project Link (Optional)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://github.com/your-repo"
          />
        </div>

        {/* Removed teams selection dropdown */}
        <div className="bg-gray-700 p-3 rounded-lg border border-gray-600 my-4">
          <p className="text-white mb-1 font-medium">Team Assignment</p>
          <p className="text-gray-300 text-sm">
            This project will be assigned to your team:{" "}
            {user?.team ? `Team #${user.team}` : "Loading..."}
          </p>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || imageUploading || !user?.team}
          >
            {loading ? "Uploading..." : "Upload Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
