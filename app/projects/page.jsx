"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/_lib/context/AuthenticationContext";

const ProjectsPage = () => {
  const { isAuthenticated, user } = useAuth();
  // State for managing projects, filters, sorting and search
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeProject, setActiveProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Categories for filtering
  const categories = [
    "Embedded Systems",
    "Robotics",
    "IoT",
    "Signal Processing",
    "Renewable Energy",
    "Medical Devices",
    "AI & Machine Learning",
    "Power Electronics",
    "Communication Systems",
  ];

  // Mock project data - would be fetched from an API in production
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      const mockProjects = [
        {
          id: 1,
          title: "Neural-Enhanced Prosthetic Hand",
          description:
            "An advanced prosthetic hand system with integrated neural feedback mechanisms that provide tactile sensation to users. The system incorporates machine learning algorithms to adapt to individual user patterns and improve control accuracy over time.",
          longDescription:
            "This project addresses the limitations of traditional prosthetic devices by incorporating a sophisticated neural interface that translates electrical signals from residual muscles into precise hand movements. The system features 15 degrees of freedom, allowing for complex grasping patterns and fine motor control. What sets this prosthetic apart is its bidirectional neural interface, which not only reads muscle signals but provides tactile feedback through a series of microactuators that stimulate the user's skin. The machine learning subsystem continuously adapts to the user's movement patterns, significantly reducing the learning curve and improving accuracy over time. The project has undergone successful preliminary clinical trials with three patients, demonstrating a 65% improvement in object manipulation tasks compared to traditional prosthetics.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Medical Devices",
          tags: [
            "Biomedical Engineering",
            "Neural Interfaces",
            "Machine Learning",
            "Tactile Sensors",
          ],
          dateCreated: "2024-10-15",
          featured: true,
          award: "Industry Award Winner",
          team: {
            name: "BioTech Solutions",
            members: [
              { name: "Emma Patel", role: "Team Lead" },
              { name: "David Kim", role: "Neural Interface Specialist" },
              { name: "Olivia Wilson", role: "Machine Learning Engineer" },
            ],
          },
          technicalDetails: [
            "16-bit microcontroller with 120MHz processing capabilities",
            "Advanced EMG signal processing with 99.2% pattern recognition accuracy",
            "Battery life of 14 hours under normal usage conditions",
            "Wireless charging and data synchronization",
            "Waterproof to IP67 standards",
          ],
          developmentTime: "12 weeks",
          videoDemo: true,
        },
        {
          id: 2,
          title: "Smart Home Energy Monitor",
          description:
            "A real-time power consumption analyzer with machine learning for device recognition and efficiency recommendations.",
          longDescription:
            "This comprehensive home energy monitoring system provides real-time insights into power consumption patterns at both the whole-house and individual appliance levels. The system employs non-intrusive load monitoring (NILM) techniques to identify and track individual appliances without requiring separate sensors for each device. The core of the system is a machine learning algorithm that can identify electrical signatures of different devices based on their unique power consumption patterns. After an initial learning phase, the system can detect when specific appliances are turned on or off and track their energy usage over time. The accompanying mobile application provides users with detailed analytics, energy-saving recommendations, and alerts for abnormal power consumption patterns. The system has demonstrated the ability to reduce household energy consumption by an average of 23% through behavioral changes prompted by its insights.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "IoT",
          tags: ["IoT", "Machine Learning", "PCB Design", "Energy Efficiency"],
          dateCreated: "2024-08-22",
          featured: true,
          award: null,
          team: {
            name: "PowerGrid",
            members: [
              { name: "Tara Williams", role: "Team Lead" },
              { name: "Ryan Park", role: "Power Systems Engineer" },
              { name: "Mia Sánchez", role: "Hardware Engineer" },
            ],
          },
          technicalDetails: [
            "ARM Cortex-M4 microcontroller operating at 168MHz",
            "High-precision current and voltage sensors with 0.5% accuracy",
            "Real-time FFT analysis for electrical signature detection",
            "LoRaWAN connectivity with 5km range",
            "Local data storage with 32GB capacity",
          ],
          developmentTime: "8 weeks",
          videoDemo: true,
        },
        {
          id: 3,
          title: "Autonomous Drone Navigation",
          description:
            "A vision-based navigation system for drones with obstacle avoidance and path planning algorithms.",
          longDescription:
            "This project developed an advanced autonomous navigation system for quadcopter drones, enabling them to operate in GPS-denied environments using only onboard sensors. The system combines computer vision with simultaneous localization and mapping (SLAM) algorithms to create real-time 3D maps of the surrounding environment while determining the drone's position within it. The obstacle avoidance system uses a combination of stereo cameras and infrared proximity sensors to detect obstacles up to 15 meters away and plan alternative flight paths. What makes this system unique is its ability to identify and classify different types of obstacles and make intelligent decisions about how to navigate around them based on their characteristics. For example, the drone can distinguish between solid obstacles that must be avoided and permeable obstacles (like thin branches) that can be passed through if necessary. The system has been successfully tested in complex indoor environments and densely forested outdoor areas with a navigation success rate of 94%.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Robotics",
          tags: ["Computer Vision", "Robotics", "Control Systems", "SLAM"],
          dateCreated: "2024-09-05",
          featured: true,
          award: "Best Technical Innovation",
          team: {
            name: "RoboCore",
            members: [
              { name: "James Taylor", role: "Team Lead" },
              { name: "Aisha Hassan", role: "Control Systems Engineer" },
              { name: "Lucas Garcia", role: "Computer Vision Specialist" },
            ],
          },
          technicalDetails: [
            "NVIDIA Jetson Nano for onboard processing",
            "Dual stereo cameras with 120° field of view",
            "LiDAR sensor with 30m range and 360° coverage",
            "Custom path planning algorithms with dynamic replanning",
            "Real-time object recognition with 98.7% accuracy",
          ],
          developmentTime: "14 weeks",
          videoDemo: true,
        },
        {
          id: 4,
          title: "Solar Power Optimizer",
          description:
            "A smart solar panel controller that maximizes energy output based on environmental conditions.",
          longDescription:
            "This project addresses the efficiency limitations of fixed solar panel installations by creating an intelligent control system that dynamically optimizes energy harvesting. The system combines hardware and software solutions to maximize solar energy collection under varying environmental conditions. At the hardware level, the system includes a dual-axis tracking mechanism that adjusts the orientation of solar panels to follow the sun's position throughout the day. What distinguishes this project is its predictive control algorithm that uses weather forecast data, historical performance patterns, and real-time sensor readings to make proactive adjustments rather than simply reacting to current conditions. The system also incorporates panel-level power optimization through custom maximum power point tracking (MPPT) controllers that adjust the electrical operating points of individual panels to compensate for partial shading or panel-to-panel variations. Field tests have demonstrated a 31% increase in energy harvesting compared to fixed systems and a 12% improvement over standard tracking systems without predictive capabilities.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Renewable Energy",
          tags: [
            "Renewable Energy",
            "Power Electronics",
            "IoT",
            "Control Systems",
          ],
          dateCreated: "2024-07-18",
          featured: false,
          award: null,
          team: {
            name: "PowerGrid",
            members: [
              { name: "Tara Williams", role: "Team Lead" },
              { name: "Ryan Park", role: "Power Systems Engineer" },
              { name: "Mia Sánchez", role: "Hardware Engineer" },
            ],
          },
          technicalDetails: [
            "STM32 microcontroller with real-time operating system",
            "Precision DC-DC converters with 98.5% efficiency",
            "Environmental sensor array (irradiance, temperature, humidity)",
            "Servo motors with 0.1° positioning accuracy",
            "Weather API integration with 48-hour forecast window",
          ],
          developmentTime: "10 weeks",
          videoDemo: false,
        },
        {
          id: 5,
          title: "Audio Spectrum Analyzer",
          description:
            "A high-precision audio processing system with real-time visualization and frequency analysis.",
          longDescription:
            "This project created a professional-grade audio spectrum analyzer capable of capturing, processing, and visualizing audio signals with laboratory-level precision. The system combines sophisticated digital signal processing algorithms with high-resolution display capabilities to provide detailed insights into audio characteristics. The hardware architecture includes a multi-channel analog front end with low-noise preamplifiers and 24-bit analog-to-digital converters sampling at 192 kHz. The signal processing pipeline implements various windowing functions and a highly optimized Fast Fourier Transform (FFT) algorithm that can perform up to 16,384-point transforms with minimal latency. The system offers multiple visualization modes including standard spectrum analysis, waterfall displays, spectrogram views, and specialized displays for analyzing specific audio characteristics such as crest factor, dynamic range, and harmonic distortion. What sets this analyzer apart from commercial alternatives is its configurability and open architecture, allowing users to implement custom analysis algorithms and visualization methods. The system has found applications in audio engineering education, acoustic research, and professional audio production environments.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Signal Processing",
          tags: [
            "Signal Processing",
            "Digital Filters",
            "Audio Systems",
            "FFT Analysis",
          ],
          dateCreated: "2024-06-30",
          featured: false,
          award: null,
          team: {
            name: "Circuit Innovators",
            members: [
              { name: "Sarah Johnson", role: "Team Lead" },
              { name: "Michael Chen", role: "DSP Specialist" },
              { name: "Alex Rodriguez", role: "Interface Designer" },
            ],
          },
          technicalDetails: [
            "SHARC DSP processor operating at 450MHz",
            "24-bit ADCs with 120dB dynamic range",
            "Custom FFT implementation with 16,384 points",
            "7-inch touch display with 1024x600 resolution",
            "USB-C connectivity for data export and control",
          ],
          developmentTime: "9 weeks",
          videoDemo: true,
        },
        {
          id: 6,
          title: "Smart Irrigation Controller",
          description:
            "An automated irrigation system that uses soil sensors and weather data to optimize water usage.",
          longDescription:
            "This project developed an intelligent irrigation control system designed to minimize water consumption while maintaining optimal growing conditions for plants. The system integrates data from multiple sources to make informed decisions about when and how much to water. The hardware component consists of a network of soil moisture sensors deployed at different depths and locations within the growing area, a weather station that monitors local environmental conditions, and electronically controlled valves that regulate water flow to different irrigation zones. The control algorithm considers current soil moisture levels, recent precipitation, weather forecasts, plant types, growth stages, and historical watering patterns to create dynamic irrigation schedules. A unique feature of this system is its self-learning capability that analyzes the effectiveness of previous watering decisions and refines its model over time. The complementary mobile application allows users to monitor system status, override automatic decisions when necessary, and view comprehensive water usage analytics. Field trials in both residential gardens and small-scale agricultural settings demonstrated water savings of 35-45% compared to timer-based irrigation systems while maintaining or improving plant health.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Embedded Systems",
          tags: [
            "Embedded Systems",
            "IoT",
            "Sensor Networks",
            "Water Conservation",
          ],
          dateCreated: "2024-08-10",
          featured: false,
          award: "Sustainability Excellence",
          team: {
            name: "RoboCore",
            members: [
              { name: "James Taylor", role: "Team Lead" },
              { name: "Aisha Hassan", role: "Embedded Systems Developer" },
              { name: "Lucas Garcia", role: "Sensor Network Specialist" },
            ],
          },
          technicalDetails: [
            "ESP32 microcontroller with Wi-Fi and BLE connectivity",
            "Capacitive soil moisture sensors with corrosion-resistant probes",
            "Precision flow meters with ±2% accuracy",
            "Solenoid valves with PWM-controlled gradual opening",
            "Solar powered with LiFePO4 battery backup (3-day autonomy)",
          ],
          developmentTime: "7 weeks",
          videoDemo: false,
        },
        {
          id: 7,
          title: "Adaptive RF Signal Filter",
          description:
            "A reconfigurable RF filtering system that automatically adapts to changing signal environments.",
          longDescription:
            "This project addresses the challenges of wireless communication in noisy or congested RF environments by developing an adaptive filtering system that can dynamically respond to changing signal conditions. The system combines advanced analog circuit design with digital control algorithms to create filters whose characteristics can be modified in real-time. The hardware architecture consists of an array of voltage-controlled resonant circuits whose parameters can be adjusted electronically, coupled with high-speed ADCs and DACs for signal monitoring and feedback control. The digital control section continuously analyzes the RF spectrum using software-defined radio techniques and makes decisions about optimal filter configurations based on detected signal and interference patterns. What makes this system particularly innovative is its ability to identify and track specific signals of interest even as they hop frequencies or change modulation characteristics. The system has demonstrated significant performance improvements in signal-to-noise ratio (typically 12-18 dB improvement) in challenging environments such as urban settings with dense wireless activity, industrial facilities with high electromagnetic interference, and mobile applications where signal conditions change rapidly.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Communication Systems",
          tags: ["RF Design", "Signal Processing", "Adaptive Filtering", "SDR"],
          dateCreated: "2024-07-05",
          featured: false,
          award: null,
          team: {
            name: "Circuit Innovators",
            members: [
              { name: "Sarah Johnson", role: "Team Lead" },
              { name: "Michael Chen", role: "RF Design Engineer" },
              { name: "Alex Rodriguez", role: "Digital Systems Engineer" },
            ],
          },
          technicalDetails: [
            "Xilinx Zynq SoC combining FPGA and ARM processors",
            "Operating frequency range: 70MHz to 6GHz",
            "Filter reconfiguration time < 500 nanoseconds",
            "Dynamic range of 90dB with 14-bit resolution",
            "Power consumption: 3.2W maximum, 1.8W typical",
          ],
          developmentTime: "11 weeks",
          videoDemo: false,
        },
        {
          id: 8,
          title: "Gesture Recognition Wearable",
          description:
            "A wrist-mounted device that recognizes hand gestures to control smart home systems and digital interfaces.",
          longDescription:
            "This project developed a lightweight, unobtrusive wearable device that can recognize hand gestures with high accuracy and translate them into commands for controlling various electronic systems. The wearable takes the form of a slim wristband equipped with a variety of sensors including a 9-axis inertial measurement unit (accelerometer, gyroscope, and magnetometer), surface electromyography (sEMG) sensors that detect muscle activity, and a compact infrared time-of-flight sensor array that tracks finger movements. The combination of these different sensor types allows the system to distinguish between subtly different gestures even when performed with variations in speed or amplitude. The signal processing pipeline implements a hybrid approach combining traditional feature extraction techniques with a compact neural network that runs entirely on the device's microcontroller. The system can recognize up to 27 distinct gestures with an accuracy exceeding 96%, while requiring minimal user-specific training. The wearable can connect to smart home systems, computers, smartphones, and other devices via Bluetooth Low Energy, with a battery life of approximately 16 hours under typical usage patterns. User studies have demonstrated significant improvements in interaction efficiency compared to voice commands or touch interfaces, particularly in scenarios where hands are occupied with other tasks or where silent operation is preferred.",
          thumbnail: "/api/placeholder/300/200",
          fullImage: "/api/placeholder/800/450",
          category: "Embedded Systems",
          tags: [
            "Wearable Technology",
            "Gesture Recognition",
            "Machine Learning",
            "HCI",
          ],
          dateCreated: "2024-09-20",
          featured: false,
          award: "User Experience Innovation",
          team: {
            name: "Circuit Innovators",
            members: [
              { name: "Sarah Johnson", role: "Team Lead" },
              { name: "Michael Chen", role: "Embedded Systems Engineer" },
              { name: "Alex Rodriguez", role: "Machine Learning Specialist" },
            ],
          },
          technicalDetails: [
            "STM32 microcontroller with ARM Cortex-M4F core",
            "TinyML implementation with 250KB model size",
            "Bluetooth 5.2 with 2Mbps data rate",
            "Rechargeable LiPo battery (180mAh)",
            "IP65 water and dust resistance",
          ],
          developmentTime: "13 weeks",
          videoDemo: true,
        },
      ];
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter projects based on search query and category filters
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          project.category.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(
        (project) =>
          selectedCategories.includes(project.category) ||
          project.tags.some((tag) => selectedCategories.includes(tag))
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
        );
        break;
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, selectedCategories, sortOption]);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const openProjectModal = (project) => {
    setActiveProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="font-sans bg-navy text-white min-h-screen">
      {/* Header Component would go here */}

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

      {/* Search and Filter Section */}
      <section className="py-8 px-5 bg-white/[0.01] sticky top-0 z-30 backdrop-blur-sm border-b border-electric-blue/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 pl-10 bg-white/5 border border-electric-blue/30 rounded outline-none focus:border-electric-blue transition-all text-white"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="py-2 px-4 bg-white/5 border border-electric-blue/30 rounded outline-none focus:border-electric-blue transition-all text-white appearance-none cursor-pointer w-full md:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/5 rounded-lg p-5 sticky top-28">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl m-0 text-mint-green">Filters</h3>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-electric-blue hover:text-mint-green"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-md mb-3 text-white/80">Categories</h4>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                      />
                      <span className="text-white/90">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-md mb-3 text-white/80">Project Status</h4>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                    />
                    <span className="text-white/90">Award Winners</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                    />
                    <span className="text-white/90">Featured Projects</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-electric-blue/50 text-mint-green focus:ring-mint-green"
                    />
                    <span className="text-white/90">With Video Demo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <>
                <div className="mb-5 text-white/70">
                  Showing {filteredProjects.length} of {projects.length}{" "}
                  projects
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/5 rounded-lg overflow-hidden border border-electric-blue/20 hover:border-electric-blue transition-all hover:shadow-lg cursor-pointer"
                      onClick={() => openProjectModal(project)}
                    >
                      <div
                        className="h-[200px] bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${project.thumbnail})` }}
                      >
                        {project.award && (
                          <div className="absolute top-3 left-3 py-1 px-2 bg-magenta text-white text-xs font-bold rounded">
                            {project.award}
                          </div>
                        )}
                        {project.featured && (
                          <div className="absolute top-3 right-3 py-1 px-2 bg-mint-green text-navy text-xs font-bold rounded">
                            Featured
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="text-xs text-electric-blue mb-2">
                          {project.category} • {formatDate(project.dateCreated)}
                        </div>
                        <h3 className="text-xl mt-0 mb-2 text-white">
                          {project.title}
                        </h3>
                        <p className="text-white/80 mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="py-1 px-2 bg-white/10 rounded text-xs text-white/80">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {project.team.members
                              .slice(0, 3)
                              .map((member, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy"
                                  title={member.name}
                                ></div>
                              ))}
                          </div>
                          <span className="text-sm text-white/70">
                            Team: {project.team.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4 text-white/30">🔍</div>
                <h3 className="text-xl mb-2 text-white">No projects found</h3>
                <p className="text-white/70 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="py-2 px-4 bg-electric-blue text-white border-none rounded cursor-pointer transition-all hover:bg-mint-green hover:text-navy"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {isModalOpen && activeProject && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-navy border border-electric-blue/50 rounded-lg max-w-5xl w-full mx-auto relative">
              {/* Close button */}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right"
              />{" "}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              {/* Modal content */}
              <div className="flex flex-col md:flex-row">
                {/* Project image */}
                <div
                  className="md:w-1/2 h-64 md:h-auto bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${activeProject.fullImage})` }}
                >
                  {activeProject.award && (
                    <div className="absolute top-3 left-3 py-1 px-2 bg-magenta text-white text-xs font-bold rounded">
                      {activeProject.award}
                    </div>
                  )}
                  {activeProject.featured && (
                    <div className="absolute top-3 right-3 py-1 px-2 bg-mint-green text-navy text-xs font-bold rounded">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project details */}
                <div className="md:w-1/2 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                  <div className="text-sm text-electric-blue mb-2">
                    {activeProject.category} •{" "}
                    {formatDate(activeProject.dateCreated)}
                  </div>
                  <h2 className="text-2xl md:text-3xl mb-4 text-white">
                    {activeProject.title}
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Overview</h3>
                    <p className="text-white/90 mb-4">
                      {activeProject.longDescription}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">
                      Technical Details
                    </h3>
                    <ul className="list-disc pl-5 text-white/90">
                      {activeProject.technicalDetails.map((detail, index) => (
                        <li key={index} className="mb-1">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Team</h3>
                    <p className="text-white/90 mb-2">
                      Team:{" "}
                      <span className="text-white">
                        {activeProject.team.name}
                      </span>
                    </p>
                    <div className="flex flex-col gap-2">
                      {activeProject.team.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#172a45] border-2 border-navy"></div>
                          <div>
                            <div className="text-white">{member.name}</div>
                            <div className="text-white/70 text-sm">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg text-mint-green mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="py-1 px-2 bg-mint-green/10 rounded text-xs text-mint-green"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    {activeProject.videoDemo && (
                      <button className="py-2 px-4 bg-magenta hover:bg-magenta/80 text-white rounded-md flex items-center justify-center gap-2 transition-all">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Watch Demo
                      </button>
                    )}
                    <Link
                      href={`/projects/${activeProject.id}`}
                      className="py-2 px-4 bg-electric-blue hover:bg-electric-blue/80 text-white rounded-md flex items-center justify-center gap-2 transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Full Project Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Component would go here */}
    </div>
  );
};

export default ProjectsPage;
