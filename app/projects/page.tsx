import { getProjectsForDisplay } from "@/utils/supabase/data-services";
import ProjectsFilter from "./ProjectsFilter";

// Server component for projects page
export default async function ProjectsPage() {
  // Fetch projects data from the server
  let projectsData: Awaited<ReturnType<typeof getProjectsForDisplay>> = [];
  try {
    projectsData = await getProjectsForDisplay();
  } catch (error) {
    console.error("Error fetching projects:", error);
  }


  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Page Banner */}
      <section className="relative py-16 px-5 bg-white/[0.03] border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl mb-3 text-mint-green">
            Projects Showcase
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mb-0 text-white/80">
            Explore the innovative electronic engineering projects created by
            our talented students.
          </p>
        </div>
      </section>

      {/* Client component for filtering and displaying projects */}
      <ProjectsFilter initialProjects={projectsData} />
    </div>
  );
}
