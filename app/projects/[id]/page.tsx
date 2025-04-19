"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userCanEdit, setUserCanEdit] = useState(false);

  useEffect(() => {
    // In a real app, fetch the project from an API
    // For now, we'll simulate fetching a single project
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
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
          setIsLoading(false);

          // Check if user can edit this project (if they are on the team)
          if (isAuthenticated && user && user.team) {
            const canEdit = String(user.team) ===  mockProject.team.id;
            setUserCanEdit(canEdit);
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching project:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, isAuthenticated, user]);

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="font-sans bg-navy text-white min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="font-sans bg-navy text-white min-h-screen flex justify-center items-center">
        <div className="text-center p-8">
          <h2 className="text-2xl mb-4 text-mint-green">Project Not Found</h2>
          <p className="mb-6 text-white/80">
            The project you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/projects"
            className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Project Header */}
      <section className="relative py-16 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex gap-3 mb-3">
                <span className="py-1 px-2 bg-mint-green/10 rounded text-sm text-mint-green">
                  {project.category}
                </span>
                {project.award && (
                  <span className="py-1 px-2 bg-magenta text-white text-sm font-medium rounded">
                    {project.award}
                  </span>
                )}
                {project.featured && (
                  <span className="py-1 px-2 bg-mint-green text-navy text-sm font-medium rounded">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl mb-3 text-mint-green">
                {project.title}
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mb-4 text-white/80">
                {project.description}
              </p>
              <div className="text-white/70">
                Created on: {formatDate(project.dateCreated)}
              </div>
            </div>

            {/* Edit button for team members */}
            {userCanEdit && (
              <Link
                href={`/projects/edit/${project.id}`}
                className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md flex items-center gap-2"
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Project
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-10 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Project Image */}
            <div
              className="w-full h-[400px] bg-cover bg-center rounded-lg mb-8"
              style={{ backgroundImage: `url(${project.fullImage})` }}
            />

            {/* Project Description */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4 text-mint-green">Overview</h2>
              <p className="text-white/90 mb-4 leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Technical Details */}
            <div className="mb-8">
              <h2 className="text-2xl mb-4 text-mint-green">
                Technical Details
              </h2>
              <ul className="list-disc pl-5 text-white/90">
                {project.technicalDetails.map(
                  (detail: string, index: number) => (
                    <li key={index} className="mb-2">
                      {detail}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Team Information */}
            <div className="bg-white/5 rounded-lg p-5 mb-6">
              <h3 className="text-xl mb-4 text-mint-green">Team</h3>
              <div className="mb-3">
                <div className="text-white font-medium">
                  {project.team.name}
                </div>
              </div>
              <div className="space-y-3">
                {project.team.members.map(
                  (member: TeamMember, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-navy flex items-center justify-center text-white font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white">{member.name}</div>
                        <div className="text-white/70 text-sm">
                          {member.role}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white/5 rounded-lg p-5 mb-6">
              <h3 className="text-xl mb-4 text-mint-green">Project Details</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-white/70 text-sm">Category</div>
                  <div className="text-white">{project.category}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Development Time</div>
                  <div className="text-white">{project.developmentTime}</div>
                </div>
                <div>
                  <div className="text-white/70 text-sm">Date Created</div>
                  <div className="text-white">
                    {formatDate(project.dateCreated)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white/5 rounded-lg p-5">
              <h3 className="text-xl mb-4 text-mint-green">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Video Button */}
            {project.videoDemo && (
              <button className="w-full py-3 px-4 mt-6 bg-magenta hover:bg-magenta/80 text-white rounded-md flex items-center justify-center gap-2 transition-all">
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
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Watch Demo Video
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
