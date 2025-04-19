"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { TeamInterface } from "@/app/Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

// Define the type for the form data, omitting auto-generated fields
type TeamFormData = Omit<TeamInterface, "id" | "createdAt">;

export default function UploadTeamForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    achievements: "",
    specialty: "",
  });

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

      toast.success("Team logo uploaded successfully!");

      // Note: We're not setting the image in formData since TeamInterface doesn't have an image field
      // If you want to add an image field to teams, you'll need to update your database schema and Types.ts
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
      const response = await fetch("/api/teams", {
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
          result.message || "Failed to create team. Status: " + response.status
        );
      }

      toast.success("Team created successfully!");

      setTimeout(() => {
        router.push("/teams");
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

      <h1 className="text-2xl font-bold text-white mb-6">Create New Team</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="name">
            Team Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name ?? ""}
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

        {/* Team Logo Upload */}
        <div>
          <label className="block text-gray-300 font-bold mb-1" htmlFor="image">
            Team Logo (Optional)
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
                {imageUploading ? "Uploading..." : "Choose Logo"}
              </button>
              {imageUploading && (
                <span className="text-yellow-500 text-sm">Uploading...</span>
              )}
              {imagePreview && !imageUploading && (
                <span className="text-green-500 text-sm">✓ Logo uploaded</span>
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
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="specialty"
          >
            Specialty
          </label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            value={formData.specialty ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Embedded Systems, IoT, Robotics"
          />
        </div>

        <div>
          <label
            className="block text-gray-300 font-bold mb-1"
            htmlFor="achievements"
          >
            Achievements
          </label>
          <textarea
            id="achievements"
            name="achievements"
            value={formData.achievements ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="e.g. Competitions won, projects completed, recognitions"
          />
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || imageUploading}
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
}
