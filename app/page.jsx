"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Main App Component
const App = () => {
  return (
    <>
      <CircuitBackground />
      <HeroSection />
      <ProjectOfTheMonth />
      <FeaturedProjects />
      <StatsSection />
      <TeamsSection />
    </>
  );
};

// Circuit Board Background Pattern Component
const CircuitBackground = () => {
  return (
    <div
      className="absolute inset-0 opacity-10 z-10"
      style={{
        backgroundImage:
          "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
        backgroundSize: "20px 20px, 40px 40px, 40px 40px",
        backgroundPosition: "0 0, 0 0, 0 0",
        backgroundBlendMode: "soft-light",
        pointerEvents: "none", // Ensures the background doesn't interfere with clicks
      }}
    ></div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 h-[80vh]">
      {/* Using a separate component for the background pattern in the Hero */}
      <div
        className="absolute inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(#4d94ff 1px, transparent 1px), linear-gradient(to right, #4d94ff 1px, transparent 1px), linear-gradient(to bottom, #4d94ff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 0 0, 0 0",
          backgroundBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      ></div>
      <h1 className="text-4xl md:text-5xl mb-5 text-white z-10">
        Electronics Engineering Student Showcase
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10">
        Discover innovative projects and technical excellence from the next
        generation of electronics engineers.
      </p>
      <Link
        href="#projects"
        className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg z-10"
      >
        Explore Projects
      </Link>
    </section>
  );
};

// Project of the Month Component
const ProjectOfTheMonth = () => {
  return (
    <section className="py-16 px-5 bg-white/[0.02]">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Project of the Month
      </h2>
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto gap-10 items-center">
        <div className="flex-1 min-w-[300px] h-[300px] md:h-[400px] bg-[#172a45] rounded-lg overflow-hidden relative">
          <img
            src="https://www.allaboutcircuits.com/uploads/articles/Don_9_15_2024_Figure_7.jpg"
            alt="Featured project image"
            className="w-full h-full object-cover"
            width={"auto"}
          />
        </div>
        <div className="flex-1">
          <div className="inline-block py-1.5 px-3 bg-magenta text-white rounded text-sm font-bold mb-4">
            Industry Award Winner
          </div>
          <h3 className="text-3xl mt-0 mb-4 text-white">
            Neural-Enhanced Prosthetic Hand
          </h3>
          <p className="text-lg text-white/80 mb-5 leading-relaxed">
            An advanced prosthetic hand system with integrated neural feedback
            mechanisms that provide tactile sensation to users. The system
            incorporates machine learning algorithms to adapt to individual user
            patterns and improve control accuracy over time.
          </p>
          <div className="flex gap-4 mb-5 text-electric-blue text-sm">
            <span>Biomedical Engineering</span>
            <span>•</span>
            <span>12 weeks development</span>
          </div>
          <div className="flex gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <img
                  className="w-full h-full rounded-full"
                  src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                  alt="person image"
                  width={"auto"}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <img
                  className="w-full h-full rounded-full"
                  src="https://t3.ftcdn.net/jpg/02/99/04/20/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"
                  alt="person image"
                  width={"auto"}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#172a45] border-2 border-mint-green">
              <div className="w-full h-full rounded-full">
                <img
                  className="w-full h-full rounded-full"
                  src="https://media.istockphoto.com/id/1372641618/photo/portrait-of-a-businessman-on-gray-background.jpg?s=612x612&w=0&k=20&c=dr9mAhOR4Nu826FRDcMojzObpbswEEMMGrWoLA2iz4w="
                  alt="person image"
                  width={"auto"}
                />
              </div>
            </div>
          </div>
          <Link
            href="projects"
            className="py-3 px-6 bg-mint-green text-navy border-none rounded font-bold cursor-pointer no-underline transition-all hover:bg-electric-blue hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
          >
            View Full Project
          </Link>
        </div>
      </div>
    </section>
  );
};

// Featured Projects Component
const FeaturedProjects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "Embedded Systems",
    "Robotics",
    "IoT",
    "Signal Processing",
    "Renewable Energy",
    "Medical Devices",
  ];

  const allProjects = [
    {
      title: "Smart Home Energy Monitor",
      description:
        "A real-time power consumption analyzer with machine learning for device recognition and efficiency recommendations.",
      tags: ["IoT", "Machine Learning", "PCB Design"],
      category: "IoT",
    },
    {
      title: "Biomedical Signal Processor",
      description:
        "A wearable ECG monitor with advanced filtering algorithms and wireless data transmission to medical professionals.",
      tags: ["Medical Devices", "Signal Processing", "Embedded Systems"],
      category: "Medical Devices",
    },
    {
      title: "Autonomous Drone Navigation",
      description:
        "A vision-based navigation system for drones with obstacle avoidance and path planning algorithms.",
      tags: ["Computer Vision", "Robotics", "Control Systems"],
      category: "Robotics",
    },
    {
      title: "Solar Power Optimizer",
      description:
        "A smart solar panel controller that maximizes energy output based on environmental conditions.",
      tags: ["Renewable Energy", "Power Electronics", "IoT"],
      category: "Renewable Energy",
    },
    {
      title: "Audio Spectrum Analyzer",
      description:
        "A high-precision audio processing system with real-time visualization and frequency analysis.",
      tags: ["Signal Processing", "Digital Filters", "Audio Systems"],
      category: "Signal Processing",
    },
    {
      title: "Smart Irrigation Controller",
      description:
        "An automated irrigation system that uses soil sensors and weather data to optimize water usage.",
      tags: ["Embedded Systems", "IoT", "Sensor Networks"],
      category: "Embedded Systems",
    },
  ];

  // Filter projects based on the active filter
  const filteredProjects =
    activeFilter === "All"
      ? allProjects
      : allProjects.filter(
          (project) =>
            project.category === activeFilter ||
            project.tags.includes(activeFilter)
        );

  return (
    <section className="py-16 px-5" id="projects">
      <h2 className="text-3xl text-center mb-10 text-mint-green">
        Featured Projects
      </h2>

      {/* Project Filters */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-8 max-w-6xl mx-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`py-2 px-4 bg-transparent border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 ${
              activeFilter === filter
                ? "bg-electric-blue text-white"
                : "text-electric-blue"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:-translate-y-1 hover:shadow-xl hover:border-electric-blue h-full flex flex-col">
      <div
        className="h-[200px] bg-[#172a45] bg-cover bg-center"
        style={{ backgroundImage: "url('/api/placeholder/300/200')" }}
      ></div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl mt-0 mb-2.5 text-white">{project.title}</h3>
        <p className="text-base text-white/80 mb-4 flex-grow">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={index}
              className="py-1 px-2.5 bg-mint-green/10 rounded text-xs text-mint-green"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          href="projects"
          className="self-start py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 no-underline"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

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

// Team Card Component
const TeamCard = ({ team }) => {
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

// Footer Component

export default App;
