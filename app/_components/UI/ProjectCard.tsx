import Link from "next/link";
import { ProjectDisplayInterface } from "@/app/Types";

// Project Card Component
interface ProjectCardProps {
  project: ProjectDisplayInterface;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:-translate-y-1 hover:shadow-xl hover:border-electric-blue h-full flex flex-col">
      <div
        className="h-[200px] bg-[#172a45] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            project.image || "/images/default-project-image.png"
          })`,
        }}
      ></div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl mt-0 mb-2.5 text-white">{project.title}</h3>
        <p className="text-base text-white/80 mb-4 flex-grow line-clamp-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags &&
            project.tags.map((tag, index) => (
              <span
                key={index}
                className="py-1 px-2.5 bg-mint-green/10 rounded text-xs text-mint-green"
              >
                {tag}
              </span>
            ))}
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="self-start py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
