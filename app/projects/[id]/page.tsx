import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProjectDisplayById } from "@/utils/supabase/data-services";
import { ProjectDisplayInterface } from "@/app/Types";

// Format date to more readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Extract main category from tags
const getMainCategory = (project: ProjectDisplayInterface) => {
  if (!project?.tags || project.tags.length === 0) return "Uncategorized";
  return project.tags[0];
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const projectId = parseInt((await params).id, 10);

  if (isNaN(projectId)) {
    notFound();
  }

  // Fetch project data from server
  const project = await getProjectDisplayById(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-navy text-white min-h-screen font-sans">
      {/* Header */}
      <section className="relative">
        {/* Hero Image */}
        <div className="w-full h-[40vh] relative bg-gradient-to-b from-black/50 to-navy">
          {project.image ? (
            <div className="absolute inset-0 opacity-50">
              <Image
                src={project.image}
                alt={project.title || "Project image"}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/30 to-magenta/30"></div>
          )}

          {/* Decorative elements */}
          <div className="absolute inset-0 bg-circuit-pattern opacity-20"></div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-5">
              <div className="max-w-4xl">
                {/* Tags/Categories */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="py-1 px-3 bg-mint-green/20 text-mint-green text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                  {project.title}
                </h1>

                {/* Project meta */}
                <div className="flex items-center text-white/70 gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {formatDate(project.dateCreated)}
                  </span>

                  {project.team && (
                    <Link
                      href={`/teams/${project.team.id}`}
                      className="flex items-center gap-1 hover:text-electric-blue transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      {project.team.name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-5 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Project Description */}
            <div className="mb-10">
              <h2 className="text-2xl text-mint-green mb-4">
                Project Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/90">
                  {project.description || "No description available"}
                </p>
              </div>
            </div>

            {/* Project Gallery or Image */}
            {project.image && (
              <div className="mb-10">
                <h2 className="text-2xl text-mint-green mb-4">
                  Project Gallery
                </h2>
                <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title || "Project image"}
                    width={1000}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div className="mb-10">
              <h2 className="text-2xl text-mint-green mb-4">
                Technical Details
              </h2>
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg p-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.tags?.map((tag, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-electric-blue flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Project Link */}
            {project.link && (
              <div className="mb-10">
                <h2 className="text-2xl text-mint-green mb-4">
                  Project Resources
                </h2>
                <div className="bg-white/5 border border-electric-blue/20 rounded-lg p-6">
                  <Link
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-xl gap-2 text-electric-blue hover:text-mint-green transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                    
                    View Project Resources
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Team Information */}
            {project.team && (
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl text-mint-green mb-4">Team</h3>
                  <div className="mb-4">
                    <Link
                      href={`/teams/${project.team.id}`}
                      className="font-medium text-white hover:text-electric-blue transition-colors"
                    >
                      {project.team.name}
                    </Link>
                  </div>

                  {/* Team Members */}
                  {project.team.members.length > 0 && (
                    <div>
                      <h4 className="text-white/90 text-sm mb-3">
                        Team Members
                      </h4>
                      <div className="flex flex-col gap-3">
                        {project.team.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Link
                              href={`/students/${member.id}`}
                              className="w-10 h-10 bg-navy-light rounded-full overflow-hidden flex-shrink-0 block"
                            >
                              <Image
                                src={
                                  member.image ||
                                  "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg"
                                }
                                alt={member.name || "Team member"}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </Link>
                            <div>
                              <Link
                                href={`/students/${member.id}`}
                                className="text-white font-medium hover:text-electric-blue transition-colors"
                              >
                                {member.name}
                              </Link>
                              <div className="text-white/70 text-sm">
                                {member.role}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Project Details */}
            <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <h3 className="text-xl text-mint-green mb-4">
                  Project Details
                </h3>
                <div className="divide-y divide-white/10">
                  <div className="py-3 flex justify-between">
                    <span className="text-white/70">Category</span>
                    <span className="text-white">
                      {getMainCategory(project)}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <span className="text-white/70">Project Period</span>
                    <span className="text-white">
                      {project.period || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl text-mint-green mb-4">Navigation</h3>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/projects"
                    className="py-2 px-4 bg-navy-light hover:bg-navy-lighter text-white rounded-md flex items-center gap-2 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                      ></path>
                    </svg>
                    Back to Projects
                  </Link>
                  {project.team && (
                    <Link
                      href={`/teams/${project.team.id}`}
                      className="py-2 px-4 bg-electric-blue/30 hover:bg-electric-blue/50 text-white rounded-md flex items-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      View Team
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}