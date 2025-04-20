import Link from "next/link";
import Image from "next/image";

// Team Card Component
interface Team {
  id: number;
  name: string;
  specialty: string;
  members: {
    name: string;
    role: string;
    image?: string;
  }[];
  projectCount: number;
  image?: string;
}

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <div className="w-[280px] bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:-translate-y-1 hover:shadow-xl hover:border-electric-blue">
      {/* Team Header */}
      <div className="p-5 text-center border-b border-electric-blue/20">
        <h3 className="text-xl m-0 mb-1 text-white">{team.name}</h3>
        <div className="text-sm text-mint-green">{team.specialty}</div>
      </div>

      {/* Team Members */}
      <div className="p-5">
        {team.members.map((member, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 ${
              index < team.members.length - 1 ? "mb-4" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#172a45] overflow-hidden">
              {member.image && (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex-grow">
              <div className="text-base m-0 mb-1 text-white">{member.name}</div>
              <div className="text-xs text-white/70">{member.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 flex flex-col gap-3">
        {/* Projects Link */}
        <div className="text-sm text-electric-blue text-center">
          <Link href={`/projects?team=${team.id}`}>
            View {team.projectCount} Projects
          </Link>
        </div>

        {/* View Team Profile Button */}
        <Link
          href={`/teams/${team.id}`}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue rounded-md transition-all text-sm font-medium"
        >
          View Team Profile
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
