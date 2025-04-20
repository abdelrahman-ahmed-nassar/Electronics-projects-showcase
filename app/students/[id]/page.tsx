import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProfileById } from "@/utils/supabase/data-services";
import { TeamInterface } from "@/app/Types";



// Define a team type with members for the UI
interface TeamWithMembers extends TeamInterface {
  members?: Array<{ name: string; id: string }>;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const studentId = (await params).id;

  // Fetch student data from server
  try {
    const student = await getProfileById(studentId);

    if (!student) {
      notFound();
    }

    // Parse skills from string to array if it exists
    const studentSkills = student.skills
      ? (JSON.parse(student.skills as string) as string[])
      : [];

    // For demo purposes, creating a mock teams array (since UserInterface only has a single team reference)
    // In a real implementation, you would fetch the student's teams from the database
    const studentTeams: TeamWithMembers[] = student.team
      ? [
          {
            id: student.team,
            name: "Student Team",
            createdAt: new Date().toISOString(),
            description: null,
            achievements: null,
            specialty: null,
            image: null,
            members: [{ name: student.name || "Unknown", id: student.id }],
          },
        ]
      : [];

    return (
      <div className="bg-navy text-white min-h-screen font-sans">
        {/* Header */}
        <section className="relative">
          {/* Hero Banner */}
          <div className="w-full h-[40vh] relative bg-gradient-to-b from-black/50 to-navy">
            <div className="absolute inset-0 bg-circuit-pattern opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/30 to-magenta/30"></div>

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-5">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Student Image */}
                  <div className="w-32 h-32 md:w-48 md:h-48 bg-navy-light rounded-full overflow-hidden border-4 border-mint-green flex-shrink-0">
                    <Image
                      src={
                        student.avatarImage ||
                        "/images/default-user-profile-image.svg"
                      }
                      alt={student.name || "Student profile"}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center md:text-left">
                    {/* Student Name */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                      {student.name}
                    </h1>

                    {/* Student specialization */}
                    <div className="mb-5 text-xl text-mint-green">
                      {student.specialization || "Electronics Student"}
                    </div>

                    {/* Student meta info */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm text-white/70">
                      {student.email && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {student.email}
                        </span>
                      )}
                      {student.yearId && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            ></path>
                          </svg>
                          Class of {student.yearId}
                        </span>
                      )}
                    </div>
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
              {/* Student Bio */}
              <div className="mb-10">
                <h2 className="text-2xl text-mint-green mb-4">About</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-white/90">
                    {student.about || "No bio available"}
                  </p>
                </div>
              </div>

              {/* Projects Section */}
              <div className="mb-10">
                <h2 className="text-2xl text-mint-green mb-4">Projects</h2>

                {student.projects && student.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.projects.map((project, index) => (
                      <Link
                        href={`/projects/${project.id}`}
                        key={index}
                        className="bg-white/5 hover:bg-white/10 border border-electric-blue/20 rounded-lg overflow-hidden transition-all hover:border-electric-blue/50"
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
                                ></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-medium text-white mb-2">
                            {project.title}
                          </h3>
                          <p className="text-white/70 line-clamp-2 mb-3">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags?.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="py-1 px-2 bg-mint-green/10 text-mint-green text-xs rounded-full"
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

              {/* Skills Section */}
              {studentSkills.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl text-mint-green mb-4">Skills</h2>
                  <div className="bg-white/5 border border-electric-blue/20 rounded-lg p-6">
                    <div className="flex flex-wrap gap-2">
                      {studentSkills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="py-2 px-4 bg-navy-light text-white rounded-md flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4 text-electric-blue"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Teams Section */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl text-mint-green mb-4">Teams</h3>

                  {studentTeams.length > 0 ? (
                    <div className="divide-y divide-white/10">
                      {studentTeams.map(
                        (team: TeamWithMembers, index: number) => (
                          <div
                            key={index}
                            className="py-4 first:pt-0 last:pb-0"
                          >
                            <Link
                              href={`/teams/${team.id}`}
                              className="flex items-center gap-3 hover:text-electric-blue transition-colors"
                            >
                              <div className="w-10 h-10 bg-navy-light rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {team.image ? (
                                  <Image
                                    src={team.image}
                                    alt={team.name || "Team"}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                ) : (
                                  <svg
                                    className="w-6 h-6 text-white/30"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                  </svg>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-white/70 text-sm">
                                  {team.members?.length || 0} members
                                </div>
                              </div>
                            </Link>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="text-white/70 text-center py-4">
                      Not a member of any teams
                    </p>
                  )}
                </div>
              </div>

              {/* Student Details */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                  <h3 className="text-xl text-mint-green mb-4">
                    Student Details
                  </h3>
                  <div className="divide-y divide-white/10">
                    {student.specialization && (
                      <div className="py-3 flex justify-between">
                        <span className="text-white/70">Specialization</span>
                        <span className="text-white">
                          {student.specialization}
                        </span>
                      </div>
                    )}
                    {student.yearId && (
                      <div className="py-3 flex justify-between">
                        <span className="text-white/70">Year</span>
                        <span className="text-white">{student.yearId}</span>
                      </div>
                    )}
                    {student.isGraduated !== null && (
                      <div className="py-3 flex justify-between">
                        <span className="text-white/70">Status</span>
                        <span className="text-white">
                          {student.isGraduated ? "Graduated" : "Student"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="bg-white/5 border border-electric-blue/20 rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl text-mint-green mb-4">Navigation</h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/students"
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
                        ></path>
                      </svg>
                      All Students
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching student data:", error);
    notFound();
  }
}
