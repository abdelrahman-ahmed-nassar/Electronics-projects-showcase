"use client";

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProjectInterface, TeamInterface } from "@/app/Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

// Define the type for the form data, omitting auto-generated fields
type ProjectFormData = Omit<ProjectInterface, "id" | "created_at">;

export default function UploadProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    image: "",
    tags: [""],
    period: "",
    link: "",
    teamId: null,
  });

  // Fetch teams on component mount
  useEffect(() => {
    async function fetchTeams() {
      try {
        setTeamsLoading(true);
        const response = await fetch("/api/teams");

        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.status}`);
        }

        const teamsData = await response.json();
        setTeams(teamsData);
        setTeamsError(null);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeamsError(
          error instanceof Error ? error.message : "Failed to load teams"
        );
        toast.error(
          "Could not load teams. You can still submit without selecting a team."
        );
      } finally {
        setTeamsLoading(false);
      }
    }

    fetchTeams();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "teamId" ? (value ? parseInt(value, 10) : null) : value,
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
    setLoading(true);

    try {
      console.log("Submitting form data:", formData);
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(
          result.message ||
            "Failed to upload project. Status: " + response.status
        );
      }

      console.log("Upload successful:", result);
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

        {/* Replace Image URL input with File Upload */}
        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="image">
            Project Image
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
              {formData.image && (
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

            {/* Show URL (optional) */}
            {formData.image && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {formData.image}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. React, Supabase, Next.js"
          />
        </div>

        <div>
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="period"
          >
            Time Period
          </label>
          <input
            type="text"
            id="period"
            name="period"
            value={formData.period ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Jan 2023 - Mar 2023"
          />
        </div>

        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="link">
            Project Link
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

        <div>
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="teamId"
          >
            Team (Optional)
          </label>

          {teamsLoading ? (
            <div className="bg-gray-700 text-gray-400 px-3 py-2 border border-gray-600 rounded-lg w-full">
              Loading teams...
            </div>
          ) : (
            <select
              id="teamId"
              name="teamId"
              value={formData.teamId ?? ""}
              onChange={handleChange}
              className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a team --</option>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name || `Team ${team.id}`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {teamsError ? "Error loading teams" : "No teams available"}
                </option>
              )}
            </select>
          )}
          {teamsError && (
            <p className="mt-1 text-xs text-red-400">{teamsError}</p>
          )}
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || imageUploading}
          >
            {loading ? "Uploading..." : "Upload Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
