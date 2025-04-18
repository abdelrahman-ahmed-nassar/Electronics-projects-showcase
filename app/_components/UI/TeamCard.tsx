import Link from "next/link";


// Team Card Component
interface Team {
  name: string;
  specialty: string;
  members: {
    name: string;
    role: string;
  }[];
  projectCount: number;
}

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <div className="w-[280px] bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:-translate-y-1 hover:shadow-xl hover:border-electric-blue">
      <div className="p-5 text-center border-b border-electric-blue/20">
        <h3 className="text-xl m-0 mb-1 text-white">{team.name}</h3>
        <div className="text-sm text-mint-green">{team.specialty}</div>
      </div>
      <div className="p-5">
        {team.members.map((member, index) => (
          <div
            key={index}
            className={`flex items-center gap-2.5 ${
              index < team.members.length - 1 ? "mb-4" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#172a45]"></div>
            <div className="flex-grow">
              <div className="text-base m-0 mb-1 text-white">{member.name}</div>
              <div className="text-xs text-white/70">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm text-electric-blue text-center px-5 pb-5">
        <Link href="projects">View {team.projectCount} Projects</Link>
      </div>
    </div>
  );
};

export default TeamCard;