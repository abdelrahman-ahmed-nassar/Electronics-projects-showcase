"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { TeamInterface } from "@/app/Types";
import {  toast } from "react-toastify";
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
    image: null,
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

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      // Pass the old image URL if one exists
      if (formData.image) {
        uploadFormData.append("oldImageUrl", formData.image);
      }

      const response = await fetch("/api/upload-team-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();

      toast.success("Team logo uploaded successfully!");

      setFormData((prevData) => ({
        ...prevData,
        image: data.imageUrl,
      }));
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
    <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg shadow-lg w-full max-w-3xl mx-auto">

      <h1 className="text-xl sm:text-2xl font-bold text-white mb-5">
        Create New Team
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full">
          <label
            className="block text-gray-300 font-medium mb-1.5 text-sm"
            htmlFor="name"
          >
            Team Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-4 py-2.5 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            required
            placeholder="Enter team name"
          />
        </div>

        <div className="w-full">
          <label
            className="block text-gray-300 font-medium mb-1.5 text-sm"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-4 py-2.5 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px] transition-all duration-200"
            required
            placeholder="Describe your team and its purpose"
          />
        </div>

        {/* Team Logo Upload */}
        <div className="w-full">
          <label
            className="block text-gray-300 font-medium mb-1.5 text-sm"
            htmlFor="image"
          >
            Team Logo (Optional)
          </label>
          <div className="flex flex-col space-y-3">
            <input
              type="file"
              id="image"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Choose Logo"}
              </button>
              {imageUploading && (
                <span className="text-yellow-500">Uploading...</span>
              )}
              {imagePreview && !imageUploading && (
                <span className="text-green-500">✓ Logo uploaded</span>
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative h-48 w-full max-w-[280px] overflow-hidden rounded-lg border border-gray-600 bg-gray-900">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  style={{ objectFit: "contain" }}
                  className="p-2"
                />
              </div>
            )}
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Maximum file size: 5MB. Supported formats: JPEG, PNG, GIF, WEBP
          </p>
        </div>

        <div className="w-full">
          <label
            className="block text-gray-300 font-medium mb-1.5 text-sm"
            htmlFor="specialty"
          >
            Specialty (comma-separated)
          </label>
          <input
            type="text"
            id="specialty"
            name="specialty"
            value={formData.specialty ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-4 py-2.5 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            placeholder="e.g. Embedded Systems, IoT, Robotics"
          />
          <p className="mt-1 text-xs text-gray-400">
            Separate multiple skills with commas
          </p>
        </div>

        <div className="w-full">
          <label
            className="block text-gray-300 font-medium mb-1.5 text-sm"
            htmlFor="achievements"
          >
            Achievements
          </label>
          <textarea
            id="achievements"
            name="achievements"
            value={formData.achievements ?? ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-4 py-2.5 border border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px] transition-all duration-200"
            placeholder="e.g. Competitions won, projects completed, recognitions"
          />
        </div>

        <div className="flex items-center justify-end pt-2 mt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-4 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2.5 px-5 rounded-lg focus:outline-none transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || imageUploading}
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </div>
  );
}
