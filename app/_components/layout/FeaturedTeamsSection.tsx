import TeamCard from "../UI/TeamCard";
import { TeamInterface, UserInterface } from "@/app/Types";

// Teams Section Component
interface TeamsSectionProps {
  teams: TeamInterface[];
  members: Record<number, UserInterface[]>;
  projectCounts: Record<number, number>;
}

const TeamsSection = ({ teams, members, projectCounts }: TeamsSectionProps) => {
  return (
    <section className="py-16 px-5">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Meet Our Teams
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {teams.map((team) => {
          const teamMembers = members[team.id] || [];
          const formattedMembers = teamMembers.map((member) => ({
            name: member.name || "Unknown",
            role: member.role || member.specialization || "Team Member",
            image: member.avatarImage || undefined, // Convert null to undefined
          }));

          return (
            <TeamCard
              key={team.id}
              team={{
                id: team.id,
                name: team.name || "Unnamed Team",
                specialty: team.specialty || "General Electronics",
                members: formattedMembers,
                projectCount: projectCounts[team.id] || 0,
                image: team.image || undefined, // Convert null to undefined
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default TeamsSection;
