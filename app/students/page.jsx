"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";


// Student Showcase Page Component
const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // Sample filters for students
  const filters = [
    "All",
    "Undergraduate",
    "Graduate",
    "Biomedical",
    "Robotics",
    "Renewable Energy",
    "Embedded Systems",
  ];

  // Sample student data
  const students = [
    {
      id: 1,
      name: "Sarah Johnson",
      level: "Graduate",
      specialization: "Analog Electronics",
      team: "Circuit Innovators",
      role: "Team Lead",
      bio: "Specializing in high-frequency analog circuit design with a focus on medical applications. Sarah has received multiple awards for her innovative approaches to signal integrity problems.",
      skills: [
        "Analog Design",
        "PCB Layout",
        "Signal Integrity",
        "RF Circuits",
      ],
      projects: [
        {
          title: "Neural-Enhanced Prosthetic Hand",
          role: "Lead Designer",
          description:
            "Developed the neural feedback system that provides tactile sensation to users.",
        },
        {
          title: "Audio Spectrum Analyzer",
          role: "Analog Circuit Designer",
          description:
            "Designed low-noise front-end amplifier stages for high-precision audio analysis.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
    {
      id: 2,
      name: "Michael Chen",
      level: "Graduate",
      specialization: "PCB Design",
      team: "Circuit Innovators",
      role: "Circuit Designer",
      bio: "Focused on advanced PCB design techniques for high-density electronics. Michael has expertise in complex multi-layer boards and signal integrity optimization.",
      skills: ["PCB Design", "Signal Integrity", "DFM", "EMI/EMC"],
      projects: [
        {
          title: "Smart Home Energy Monitor",
          role: "PCB Designer",
          description:
            "Created a compact multi-layer PCB design with integrated wireless capabilities.",
        },
        {
          title: "Biomedical Signal Processor",
          role: "Layout Engineer",
          description:
            "Designed the high-density PCB layout with careful consideration for analog-digital isolation.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
    {
      id: 3,
      name: "Emma Patel",
      level: "Graduate",
      specialization: "Medical Electronics",
      team: "BioTech Solutions",
      role: "Team Lead",
      bio: "Researching innovative solutions for non-invasive medical monitoring devices. Emma's work focuses on the intersection of electronics and healthcare accessibility.",
      skills: [
        "Biomedical Sensors",
        "Low-Power Design",
        "Data Analysis",
        "Medical Device Standards",
      ],
      projects: [
        {
          title: "Biomedical Signal Processor",
          role: "Project Lead",
          description:
            "Led the development of a wearable ECG monitor with advanced filtering algorithms.",
        },
        {
          title: "Neural-Enhanced Prosthetic Hand",
          role: "Sensor Integration Specialist",
          description:
            "Integrated pressure and temperature sensors into the prosthetic fingertips.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
    {
      id: 4,
      name: "James Taylor",
      level: "Undergraduate",
      specialization: "Robotics & Automation",
      team: "RoboCore",
      role: "Team Lead",
      bio: "Passionate about autonomous systems and control theory. James has participated in multiple robotics competitions and leads the university's autonomous vehicle research group.",
      skills: [
        "Control Systems",
        "Embedded Programming",
        "Sensor Fusion",
        "Computer Vision",
      ],
      projects: [
        {
          title: "Autonomous Drone Navigation",
          role: "System Architect",
          description:
            "Developed the core navigation algorithm and sensor fusion system.",
        },
        {
          title: "Smart Irrigation Controller",
          role: "Control Systems Designer",
          description:
            "Created adaptive control algorithms that optimize water usage based on environmental conditions.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
    {
      id: 5,
      name: "Tara Williams",
      level: "Graduate",
      specialization: "Renewable Energy",
      team: "PowerGrid",
      role: "Team Lead",
      bio: "Working on innovative power management systems for renewable energy applications. Tara's research focuses on maximizing efficiency in solar and wind energy conversion.",
      skills: [
        "Power Electronics",
        "Energy Harvesting",
        "Solar Systems",
        "Battery Management",
      ],
      projects: [
        {
          title: "Solar Power Optimizer",
          role: "Project Lead",
          description:
            "Designed the MPPT controller and power conversion stages for optimal energy harvesting.",
        },
        {
          title: "Smart Home Energy Monitor",
          role: "Power Analysis Consultant",
          description:
            "Developed algorithms for identifying energy usage patterns and suggesting optimizations.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
    {
      id: 6,
      name: "Alex Rodriguez",
      level: "Undergraduate",
      specialization: "PCB Design",
      team: "Circuit Innovators",
      role: "PCB Specialist",
      bio: "Focused on high-speed digital PCB design with expertise in DDR memory routing and high-speed serializer/deserializer interfaces.",
      skills: [
        "High-Speed PCB Design",
        "Impedance Control",
        "Hardware Validation",
        "Design for Test",
      ],
      projects: [
        {
          title: "Audio Spectrum Analyzer",
          role: "PCB Designer",
          description:
            "Created the multi-layer PCB design with careful consideration for analog-digital separation.",
        },
        {
          title: "Smart Irrigation Controller",
          role: "Hardware Engineer",
          description:
            "Designed the sensor interface board and power management system.",
        },
      ],
      image: "/api/placeholder/150/150",
    },
  ];

  // Filter students based on search term and active filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.team.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      student.level === activeFilter ||
      student.specialization.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <CircuitBackground />
      <StudentHeroSection />
      <StudentDirectory
        students={filteredStudents}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filters={filters}
      />
    </>
  );
};

// Circuit Board Background Pattern Component (reused from main App)
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

// Student Hero Section Component
const StudentHeroSection = () => {
  return (
    <section className="flex flex-col justify-center items-center text-center relative overflow-hidden p-5 h-[40vh]">
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
        Student Engineers
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mb-8 z-10">
        Meet the talented individuals behind our innovative electronics projects
        and learn about their specialized skills and accomplishments.
      </p>
    </section>
  );
};

// Student Directory Section
const StudentDirectory = ({
  students,
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  filters,
}) => {
  const [expandedStudent, setExpandedStudent] = useState(null);

  const toggleStudentDetails = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  return (
    <section className="py-16 px-5" id="students">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-10 flex flex-col md:flex-row gap-5 items-center">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-transparent border border-electric-blue rounded text-white focus:outline-none focus:border-mint-green"
            />
          </div>

          <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-end">
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
        </div>

        {/* Student List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.id}
                className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:border-electric-blue"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  {/* Student Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={student.image}
                      alt={`${student.name}`}
                      className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full border-2 border-mint-green object-cover"
                    />
                  </div>

                  {/* Student Basic Info */}
                  <div className="flex-1">
                    <div className="inline-block py-1 px-2 mb-2 bg-mint-green/10 text-mint-green text-sm rounded">
                      {student.level}
                    </div>
                    <h3 className="text-2xl mt-0 mb-1 text-white">
                      {student.name}
                    </h3>
                    <p className="text-electric-blue mb-2">
                      {student.specialization}
                    </p>
                    <div className="flex gap-1 items-center text-white/70 mb-3">
                      <span>Team:</span>
                      <span className="text-mint-green">{student.team}</span>
                      <span className="mx-1">•</span>
                      <span>{student.role}</span>
                    </div>
                    <p className="text-sm text-white/80 mb-4">{student.bio}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {student.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="py-1 px-2 bg-electric-blue/10 rounded text-xs text-electric-blue"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => toggleStudentDetails(student.id)}
                      className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10"
                    >
                      {expandedStudent === student.id
                        ? "Hide Details"
                        : "View Projects"}
                    </button>
                  </div>
                </div>

                {/* Expanded Student Details */}
                {expandedStudent === student.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-4">
                    <h4 className="text-lg text-mint-green mb-4">Projects</h4>
                    <div className="space-y-4">
                      {student.projects.map((project, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white/5 rounded border border-electric-blue/10"
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="text-white text-lg m-0">
                              {project.title}
                            </h5>
                            <span className="text-xs bg-mint-green/10 text-mint-green px-2 py-1 rounded">
                              {project.role}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mt-2">
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-white/70">
              No students found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StudentsPage;
