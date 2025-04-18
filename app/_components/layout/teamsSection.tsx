import TeamCard from "../UI/TeamCard";

// Teams Section Component
const TeamsSection = () => {
  const teams = [
    {
      name: "Circuit Innovators",
      specialty: "Analog Electronics",
      members: [
        { name: "Sarah Johnson", role: "Team Lead" },
        { name: "Michael Chen", role: "Circuit Designer" },
        { name: "Alex Rodriguez", role: "PCB Specialist" },
      ],
      projectCount: 4,
    },
    {
      name: "BioTech Solutions",
      specialty: "Medical Electronics",
      members: [
        { name: "Emma Patel", role: "Team Lead" },
        { name: "David Kim", role: "Sensor Specialist" },
        { name: "Olivia Wilson", role: "Software Engineer" },
      ],
      projectCount: 3,
    },
    {
      name: "RoboCore",
      specialty: "Robotics & Automation",
      members: [
        { name: "James Taylor", role: "Team Lead" },
        { name: "Aisha Hassan", role: "Control Systems" },
        { name: "Lucas Garcia", role: "Mechanical Design" },
      ],
      projectCount: 5,
    },
    {
      name: "PowerGrid",
      specialty: "Renewable Energy",
      members: [
        { name: "Tara Williams", role: "Team Lead" },
        { name: "Ryan Park", role: "Power Systems" },
        { name: "Mia Sánchez", role: "Hardware Engineer" },
      ],
      projectCount: 2,
    },
  ];

  return (
    <section className="py-16 px-5">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Meet Our Teams
      </h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        {teams.map((team, index) => (
          <TeamCard key={index} team={team} />
        ))}
      </div>
    </section>
  );
};

export default TeamsSection;