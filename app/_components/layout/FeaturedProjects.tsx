"use client"
import { useState } from "react";
import ProjectCard from "../UI/ProjectCard";
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

export default FeaturedProjects;