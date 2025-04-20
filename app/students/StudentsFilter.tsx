"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define an interface for student data structure
export interface StudentDisplay {
  id: string;
  name: string;
  level: string;
  specialization: string;
  team: string;
  role: string;
  bio: string;
  skills: string[];
  projects: {
    title: string;
    role: string;
    description: string;
  }[];
  image: string;
}

interface StudentsFilterProps {
  initialStudents: StudentDisplay[];
}

// Filter categories
type FilterCategory = "All" | "Level" | "Specialization" | "Skill";

// Client-side Filter/Search Component
const StudentsFilter = ({ initialStudents }: StudentsFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [availableFilters, setAvailableFilters] = useState<{
    levels: string[];
    specializations: string[];
    skills: string[];
  }>({
    levels: [],
    specializations: [],
    skills: [],
  });

  // Extract unique categories from student data
  useEffect(() => {
    if (!initialStudents || initialStudents.length === 0) return;

    // Extract unique levels
    const levels = Array.from(
      new Set(initialStudents.map((student) => student.level))
    );

    // Extract unique specializations (considering comma-separated values)
    const allSpecializations = initialStudents.flatMap((student) => {
      // Split specialization by commas and trim each value
      return student.specialization
        ? student.specialization.split(",").map((s) => s.trim())
        : [];
    });
    const specializations = Array.from(new Set(allSpecializations)).filter(
      Boolean
    );

    // Extract unique skills (already as array)
    const allSkills = initialStudents.flatMap(
      (student) => student.skills || []
    );
    const skills = Array.from(new Set(allSkills)).filter(Boolean);

    setAvailableFilters({
      levels,
      specializations,
      skills,
    });
  }, [initialStudents]);

  // Get current filter options based on active category
  const getCurrentFilterOptions = (): string[] => {
    switch (activeCategory) {
      case "Level":
        return availableFilters.levels;
      case "Specialization":
        return availableFilters.specializations;
      case "Skill":
        return availableFilters.skills;
      default:
        return ["All", "Undergraduate", "Graduate"];
    }
  };

  // Filter students based on search term and active filter
  const filteredStudents = initialStudents.filter((student) => {
    // Search term matching
    const studentSpecializations = student.specialization
      ? student.specialization.split(",").map((s) => s.trim().toLowerCase())
      : [];

    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(searchTermLower) ||
      studentSpecializations.some((spec) => spec.includes(searchTermLower)) ||
      student.team.toLowerCase().includes(searchTermLower) ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(searchTermLower)
      );

    // Filter matching
    let matchesFilter = activeFilter === "All";

    if (!matchesFilter) {
      switch (activeCategory) {
        case "Level":
          matchesFilter = student.level === activeFilter;
          break;
        case "Specialization":
          matchesFilter = studentSpecializations.some(
            (spec) => spec === activeFilter.toLowerCase()
          );
          break;
        case "Skill":
          matchesFilter = student.skills.some(
            (skill) => skill.toLowerCase() === activeFilter.toLowerCase()
          );
          break;
        default:
          matchesFilter = true;
      }
    }

    return matchesSearch && matchesFilter;
  });

  const toggleStudentDetails = (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  // Change category and reset active filter
  const handleCategoryChange = (category: FilterCategory) => {
    setActiveCategory(category);
    setActiveFilter("All");
  };

  return (
    <section className="py-16 px-5" id="students">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filter Bar */}
        <div className="mb-10 flex flex-col gap-5">
          <div className="w-full">
            <input
              type="text"
              placeholder="Search students by name, specialization, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-transparent border border-electric-blue rounded text-white focus:outline-none focus:border-mint-green"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 justify-start">
            {(
              ["All", "Level", "Specialization", "Skill"] as FilterCategory[]
            ).map((category) => (
              <button
                key={category}
                className={`py-2 px-4 bg-transparent border border-mint-green rounded text-sm cursor-pointer transition-all hover:bg-mint-green/10 ${
                  activeCategory === category
                    ? "bg-mint-green text-white"
                    : "text-mint-green"
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-2 justify-start">
            <button
              key="All"
              className={`py-2 px-4 bg-transparent border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10 ${
                activeFilter === "All"
                  ? "bg-electric-blue text-white"
                  : "text-electric-blue"
              }`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>

            {getCurrentFilterOptions().map(
              (filter) =>
                filter !== "All" && (
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
                )
            )}
          </div>
        </div>

        {/* Student List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white/5 rounded-lg overflow-hidden transition-all border border-electric-blue/20 hover:border-electric-blue"
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  {/* Student Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={student.image}
                      alt={`${student.name}`}
                      className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] rounded-full border-2 border-mint-green object-cover"
                      width={150}
                      height={150}
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
                          className="py-1 px-2 bg-electric-blue/10 rounded text-xs text-electric-blue cursor-pointer hover:bg-electric-blue/20"
                          onClick={() => {
                            setActiveCategory("Skill");
                            setActiveFilter(skill);
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleStudentDetails(student.id)}
                        className="py-2 px-4 bg-transparent text-electric-blue border border-electric-blue rounded text-sm cursor-pointer transition-all hover:bg-electric-blue/10"
                      >
                        {expandedStudent === student.id
                          ? "Hide Details"
                          : "View Projects"}
                      </button>

                      <Link
                        href={`/students/${student.id}`}
                        className="py-2 px-4 bg-mint-green text-black border border-mint-green rounded text-sm cursor-pointer transition-all hover:bg-mint-green/90"
                      >
                        View Full Profile
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded Student Details */}
                {expandedStudent === student.id && (
                  <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-4">
                    <h4 className="text-lg text-mint-green mb-4">Projects</h4>
                    <div className="space-y-4">
                      {student.projects.length > 0 ? (
                        student.projects.map((project, index) => (
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
                        ))
                      ) : (
                        <div className="text-center py-4 text-white/60">
                          No projects associated with this student.
                        </div>
                      )}
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

export default StudentsFilter;
