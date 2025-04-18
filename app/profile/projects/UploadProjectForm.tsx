"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: "",
    period: "",
    link: "",
    teamId: null as number | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "teamId" ? (value ? parseInt(value, 10) : null) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the API endpoint that will use the uploadProject function
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload project");
      }

      router.push("/projects"); // Redirect to projects page
      router.refresh(); // Refresh the page data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Upload New Project</h1>

      {error && (
        <div className="bg-red-600 text-red-100 border border-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 font-bold mb-2" htmlFor="title">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-300 font-bold mb-2"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 font-bold mb-2" htmlFor="image">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 font-bold mb-2" htmlFor="tags">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            placeholder="e.g. React, Node.js, TypeScript"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-300 font-bold mb-2"
            htmlFor="period"
          >
            Time Period
          </label>
          <input
            type="text"
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            placeholder="e.g. Jan 2023 - Mar 2023"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 font-bold mb-2" htmlFor="link">
            Project Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            placeholder="https://..."
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-300 font-bold mb-2"
            htmlFor="teamId"
          >
            Team ID
          </label>
          <input
            type="number"
            id="teamId"
            name="teamId"
            value={formData.teamId || ""}
            onChange={handleChange}
            className="bg-gray-700 text-white px-3 py-2 border rounded-lg w-full"
            placeholder="Team ID"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
