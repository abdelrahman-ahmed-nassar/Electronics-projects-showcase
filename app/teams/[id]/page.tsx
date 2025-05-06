import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCompleteTeamData } from "@/utils/supabase/data-services";
import { UserInterface, ProjectInterface } from "@/app/Types";
import CircuitBackground from "@/app/_components/UI/CircuitBackground";

// Team Profile Page
export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teamId = parseInt((await params).id);

  if (isNaN(teamId)) {
    notFound();
  }

  try {
    // Fetch team data with members and projects
    const { team, members, projects } = await getCompleteTeamData(teamId);

    if (!team) {
      notFound();
    }

    return (
      <div className="bg-navy text-white min-h-screen font-sans relative">
        <CircuitBackground />

        {/* Hero Section with Team Info */}
        <section className="relative py-20">
          <div className="w-full relative bg-gradient-to-b from-black/50 to-navy">
            <div className="container mx-auto px-5">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Team Logo/Image */}
                <div className="w-32 h-32 md:w-48 md:h-48 bg-navy-light rounded-xl overflow-hidden border-4 border-electric-blue flex-shrink-0">
                  <Image
                    src={
                      team.image ||
                      "https://wefmacormdggmnrgoqqv.supabase.co/storage/v1/object/public/teams-images//default-team-image.png"
                    }
                    alt={team.name || "Team profile"}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center md:text-left">
                  {/* Team Name */}
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                    {team.name}
                  </h1>

                  {/* Team Specialty */}
                  <div className="mb-5 text-xl text-electric-blue">
                    {team.specialty || "Research Team"}
                  </div>

                  {/* Team meta info */}
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-white/70">
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {members.length} Members
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      {projects.length} Projects
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Established {new Date(team.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-5 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content - Left Column */}
            <div className="lg:w-2/3">
              {/* Team Description */}
              <div className="mb-10">
                <h2 className="text-2xl text-electric-blue mb-4">
                  About the Team
                </h2>
                <div className="prose prose-invert max-w-none bg-white/5 border border-electric-blue/20 rounded-lg p-6">
                  <p className="text-lg text-white/90">
                    {team.description || "No team description available."}
                  </p>
                </div>
              </div>

              {/* Team Achievements */}
              <div className="mb-10">
                <h2 className="text-2xl text-electric-blue mb-4">
                  Achievements
                </h2>
                <div className="bg-white/5 border border-electric-blue/20 rounded-lg p-6">
                  {team?.achievements ? (
                    <ul className="space-y-3">
                      {team.achievements
                        ?.split(",")
                        .map((achievement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-mint-green mt-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                            <span className="text-white/90">{achievement}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-white/70 text-center py-4">
                      No achievements listed yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Team Projects */}
              <div className="mb-10">
                <h2 className="text-2xl text-electric-blue mb-4">Projects</h2>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project: ProjectInterface) => (
                      <Link
                        href={`/projects/${project.id}`}
                        key={project.id}
                        className="bg-white/5 hover:bg-white/10 border border-electric-blue/20 rounded-lg overflow-hidden transition-all hover:border-electric-blue/50 group"
                      >
                        <div className="h-48 relative">
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt={project.title || "Project"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-navy-light to-electric-blue/20 flex items-center justify-center">
                              <svg
                                className="w-16 h-16 text-white/20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                              </svg>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <div className="p-4 w-full">
                              <span className="text-white text-sm font-medium flex items-center gap-1">
                                View Project
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-medium text-white mb-2 group-hover:text-electric-blue transition-colors">
                            {project.title || "Untitled Project"}
                          </h3>
                          <p className="text-white/70 line-clamp-2 mb-3">
                            {project.description || "No description available"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags?.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="py-1 px-2 bg-electric-blue/10 text-electric-blue text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-electric-blue/20 rounded-lg p-8 text-center">
                    <p className="text-white/70">No projects yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:w-1/3">
              {/* Team Members */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl text-electric-blue mb-4">
                    Team Members
                  </h3>

                  {members.length > 0 ? (
                    <div className="divide-y divide-white/10">
                      {members.map((member: UserInterface) => (
                        <div
                          key={member.id}
                          className="py-4 first:pt-0 last:pb-0"
                        >
                          <Link
                            href={`/students/${member.id}`}
                            className="flex items-center gap-3 hover:text-electric-blue transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-electric-blue/30 group-hover:border-electric-blue transition-colors">
                              <Image
                                src={
                                  member.avatarImage ||
                                  "https://ajplnleilpczkgumlwyl.supabase.co/storage/v1/object/public/profiles-images//default-user-profile.svg"
                                }
                                alt={member.name || "Team member"}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-electric-blue transition-colors flex items-center gap-1">
                                {member.name || "Unknown Member"}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                  />
                                </svg>
                              </div>
                              <div className="text-white/70 text-sm">
                                {member.role ||
                                  member.specialization ||
                                  "Team Member"}
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70 text-center py-4">
                      No team members yet
                    </p>
                  )}
                </div>
              </div>

              {/* Team Details */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl text-electric-blue mb-4">
                    Team Details
                  </h3>
                  <div className="divide-y divide-white/10">
                    {team.specialty && (
                      <div className="py-3 flex justify-between">
                        <span className="text-white/70">Specialty</span>
                        <span className="text-white">{team.specialty}</span>
                      </div>
                    )}
                    <div className="py-3 flex justify-between">
                      <span className="text-white/70">Established</span>
                      <span className="text-white">
                        {new Date(team.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-white/70">Members</span>
                      <span className="text-white">{members.length}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-white/70">Active Projects</span>
                      <span className="text-white">{projects.length}</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-white/70">Achievements</span>
                      <span className="text-white">
                        {team?.achievements?.split(",").length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl text-electric-blue mb-4">
                    Navigation
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/teams"
                      className="py-2 px-4 bg-navy-light hover:bg-navy-lighter text-white rounded-md flex items-center gap-2 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 17l-5-5m0 0l5-5m-5 5h12"
                        />
                      </svg>
                      All Teams
                    </Link>
                    {projects.length > 0 && (
                      <Link
                        href={`/projects/${projects[0].id}`}
                        className="py-2 px-4 bg-navy-light hover:bg-navy-lighter text-white rounded-md flex items-center gap-2 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        Latest Project
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
  } catch (error) {
    console.error("Error fetching team data:", error);
    notFound();
  }
}
