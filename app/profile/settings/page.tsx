"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TeamInterface } from "@/app/Types";
import Image from "next/image";

const ProfileSettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [teams, setTeams] = useState<TeamInterface[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nationalId: "",
    about: "",
    skills: "",
    specialization: "",
    role: "",
    team: "",
    avatarImage: "",
    userId: "",
  });

  useEffect(() => {
    // Fetch available teams
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/teams");
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();

    // Set form data from user if available
    if (user) {
      // Only update form data if it's empty or if user has changed
      const userHasChanged = user.id !== formData.userId;
      const formIsEmpty = !formData.name && !formData.phone && !formData.about;

      if (formIsEmpty || userHasChanged) {
        // Convert skills array to comma-separated string if needed
        const skills = Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "";

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          nationalId: user.nationalId || "",
          about: user.about || "",
          skills: skills,
          specialization: user.specialization || "",
          role: user.role || "",
          team: user.team ? String(user.team) : "",
          avatarImage: user.avatarImage || "",
          userId: user.id, // Track which user this form data belongs to
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile image");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Handle image upload if there's a new image
      let imageUrl = formData.avatarImage;
      if (fileInputRef.current?.files?.[0]) {
        const uploadedImageUrl = await uploadImage(
          fileInputRef.current.files[0]
        );
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        }
      }

      // Prepare data with correct types
      const profileData = {
        ...formData,
        avatarImage: imageUrl,
        team: formData.team ? parseInt(formData.team, 10) : null,
        yearId: user?.yearId || null,
      };

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");

      // Refresh user data in auth context
      await refreshUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-md border border-gray-100 dark:border-dark-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-800 dark:text-white">
          Update Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                {previewImage || formData.avatarImage ? (
                  <Image
                    src={previewImage || formData.avatarImage}
                    alt="Profile preview"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-image-upload"
                />
                <label
                  htmlFor="profile-image-upload"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 inline-block"
                >
                  {uploadingImage ? "Uploading..." : "Choose Image"}
                </label>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              National ID
            </label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              placeholder="e.g. JavaScript, React, Node.js"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Separate multiple skills with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              placeholder="e.g. Web Development, Data Science"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Separate multiple skills with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              placeholder="e.g., Student, Team Lead, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Team
            </label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            >
              <option value="">-- Select a team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name || `Team ${team.id}`}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
