
// Stats Section Component
const StatsSection = () => {
  const stats = [
    { value: 237, label: "Student Projects" },
    { value: 42, label: "Industry Partners" },
    { value: 18, label: "Award Winners" },
    { value: 5, label: "Patents Filed" },
  ];

  return (
    <section className="py-16 px-5 bg-white/[0.03]">
      <div className="flex justify-around flex-wrap max-w-6xl mx-auto gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="text-center flex-1 min-w-[200px]">
            <div className="text-4xl font-bold text-electric-blue mb-2.5">
              {stat.value}
            </div>
            <div className="text-lg text-white/80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};


export default StatsSection;