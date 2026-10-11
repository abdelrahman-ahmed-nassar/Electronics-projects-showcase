"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { StudentDisplayInterface } from "../Types";
import StudentsFilterPanel, { FilterOption } from "./StudentsFilterPanel";

interface StudentsFilterProps {
  initialStudents: StudentDisplayInterface[];
}

const ITEMS_PER_PAGE = 12;

const normalizeTag = (s: string) => s.toLowerCase().trim().replace(/[.,;]+$/, "");

const StudentsFilter: React.FC<StudentsFilterProps> = ({ initialStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("a-z");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const students = useMemo(() => initialStudents || [], [initialStudents]);

  // Extract unique Academic Levels with counts
  const levelOptions: FilterOption[] = useMemo(() => {
    const countsMap = new Map<string, { displayName: string; count: number }>();

    students.forEach((s) => {
      if (!s.level) return;
      const key = normalizeTag(s.level);
      const existing = countsMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        countsMap.set(key, { displayName: s.level.trim(), count: 1 });
      }
    });

    return Array.from(countsMap.values()).sort((a, b) => b.count - a.count);
  }, [students]);

  // Extract unique Specializations with counts
  const specializationOptions: FilterOption[] = useMemo(() => {
    const countsMap = new Map<string, { displayName: string; count: number }>();

    students.forEach((s) => {
      if (!s.specialization) return;
      const parts = s.specialization
        .split(",")
        .map((p) => p.trim().replace(/[.,;]+$/, ""))
        .filter(Boolean);

      const seenForStudent = new Set<string>();
      parts.forEach((raw) => {
        const key = raw.toLowerCase();
        if (seenForStudent.has(key)) return;
        seenForStudent.add(key);

        const existing = countsMap.get(key);
        if (existing) {
          existing.count += 1;
          if (raw !== raw.toLowerCase() && existing.displayName === existing.displayName.toLowerCase()) {
            existing.displayName = raw;
          }
        } else {
          countsMap.set(key, { displayName: raw, count: 1 });
        }
      });
    });

    return Array.from(countsMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [students]);

  // Extract unique Skills with counts
  const skillOptions: FilterOption[] = useMemo(() => {
    const countsMap = new Map<string, { displayName: string; count: number }>();

    students.forEach((s) => {
      if (!s.skills) return;
      const parts = s.skills
        .split(",")
        .map((p) => p.trim().replace(/[.,;]+$/, ""))
        .filter(Boolean);

      const seenForStudent = new Set<string>();
      parts.forEach((raw) => {
        const key = raw.toLowerCase();
        if (seenForStudent.has(key)) return;
        seenForStudent.add(key);

        const existing = countsMap.get(key);
        if (existing) {
          existing.count += 1;
          if (raw !== raw.toLowerCase() && existing.displayName === existing.displayName.toLowerCase()) {
            existing.displayName = raw;
          }
        } else {
          countsMap.set(key, { displayName: raw, count: 1 });
        }
      });
    });

    return Array.from(countsMap.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [students]);

  // Multi-faceted filtering
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Search query matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter((student) => {
        const nameMatch = student.name?.toLowerCase().includes(q);
        const teamMatch = student.team?.toLowerCase().includes(q);
        const roleMatch = student.role?.toLowerCase().includes(q);
        const specMatch = student.specialization?.toLowerCase().includes(q);
        const skillsMatch = student.skills?.toLowerCase().includes(q);
        const bioMatch = student.bio?.toLowerCase().includes(q);
        return (
          nameMatch ||
          teamMatch ||
          roleMatch ||
          specMatch ||
          skillsMatch ||
          bioMatch
        );
      });
    }

    // Level filter
    if (selectedLevels.length > 0) {
      const activeLevelKeys = selectedLevels.map(normalizeTag);
      result = result.filter((student) =>
        activeLevelKeys.includes(normalizeTag(student.level || ""))
      );
    }

    // Specialization filter
    if (selectedSpecializations.length > 0) {
      const activeSpecKeys = selectedSpecializations.map(normalizeTag);
      result = result.filter((student) => {
        if (!student.specialization) return false;
        const studentSpecs = student.specialization
          .split(",")
          .map(normalizeTag)
          .filter(Boolean);
        return activeSpecKeys.some((k) => studentSpecs.includes(k));
      });
    }

    // Skill filter
    if (selectedSkills.length > 0) {
      const activeSkillKeys = selectedSkills.map(normalizeTag);
      result = result.filter((student) => {
        if (!student.skills) return false;
        const studentSkills = student.skills
          .split(",")
          .map(normalizeTag)
          .filter(Boolean);
        return activeSkillKeys.some((k) => studentSkills.includes(k));
      });
    }

    // Sorting
    switch (sortOption) {
      case "a-z":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "z-a":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "most-projects":
        result.sort((a, b) => (b.projects?.length || 0) - (a.projects?.length || 0));
        break;
      case "level":
        result.sort((a, b) => {
          const aVal = normalizeTag(a.level) === "graduate" ? 0 : 1;
          const bVal = normalizeTag(b.level) === "graduate" ? 0 : 1;
          return aVal - bVal;
        });
        break;
      default:
        break;
    }

    return result;
  }, [
    students,
    searchTerm,
    selectedLevels,
    selectedSpecializations,
    selectedSkills,
    sortOption,
  ]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchTerm, selectedLevels, selectedSpecializations, selectedSkills, sortOption]);

  const toggleLevel = (level: string) => {
    const key = normalizeTag(level);
    setSelectedLevels((prev) =>
      prev.some((l) => normalizeTag(l) === key)
        ? prev.filter((l) => normalizeTag(l) !== key)
        : [...prev, level]
    );
  };

  const toggleSpecialty = (specialty: string) => {
    const key = normalizeTag(specialty);
    setSelectedSpecializations((prev) =>
      prev.some((s) => normalizeTag(s) === key)
        ? prev.filter((s) => normalizeTag(s) !== key)
        : [...prev, specialty]
    );
  };

  const toggleSkill = (skill: string) => {
    const key = normalizeTag(skill);
    setSelectedSkills((prev) =>
      prev.some((s) => normalizeTag(s) === key)
        ? prev.filter((s) => normalizeTag(s) !== key)
        : [...prev, skill]
    );
  };

  const clearAllFilters = () => {
    setSelectedLevels([]);
    setSelectedSpecializations([]);
    setSelectedSkills([]);
    setSearchTerm("");
  };

  const toggleStudentDetails = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const totalActiveFiltersCount =
    selectedLevels.length +
    selectedSpecializations.length +
    selectedSkills.length +
    (searchTerm ? 1 : 0);

  const displayedStudents = filteredStudents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStudents.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredStudents.length));
  };

  const showAll = () => {
    setVisibleCount(filteredStudents.length);
  };

  return (
    <div className="font-sans text-white min-h-screen" id="students">
      {/* Sticky Search and Filter Controls Toolbar */}
      <section className="py-4 px-5 bg-navy/90 sticky top-0 z-30 backdrop-blur-md border-b border-electric-blue/20 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto flex-grow max-w-lg">
            <input
              type="text"
              placeholder="Search by name, specialization, team, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 px-4 pl-10 pr-9 bg-white/5 border border-electric-blue/30 rounded-lg outline-none focus:border-electric-blue focus:bg-white/[0.08] transition-all text-white text-sm placeholder-white/40"
            />
            <svg
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-electric-blue/30 rounded-lg text-sm text-white transition-all cursor-pointer flex-1 md:flex-initial justify-center"
            >
              <svg
                className="w-4 h-4 text-mint-green"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
              {totalActiveFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-mint-green text-navy font-bold text-xs flex items-center justify-center">
                  {totalActiveFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-initial">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="py-2.5 pl-4 pr-9 bg-gray-900/80 border border-electric-blue/30 rounded-lg outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue/50 transition-all text-white text-sm appearance-none cursor-pointer w-full hover:bg-gray-800/80 shadow-sm shadow-black/30"
              >
                <option value="a-z">Name (A-Z)</option>
                <option value="z-a">Name (Z-A)</option>
                <option value="most-projects">Most Projects First</option>
                <option value="level">Graduates First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-electric-blue">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <StudentsFilterPanel
              levels={levelOptions}
              specializations={specializationOptions}
              skills={skillOptions}
              selectedLevels={selectedLevels}
              selectedSpecializations={selectedSpecializations}
              selectedSkills={selectedSkills}
              onToggleLevel={toggleLevel}
              onToggleSpecialty={toggleSpecialty}
              onToggleSkill={toggleSkill}
              onClearAll={clearAllFilters}
              totalStudentsCount={students.length}
              filteredStudentsCount={filteredStudents.length}
            />
          </div>

          {/* Mobile Drawer Filter Component */}
          <StudentsFilterPanel
            levels={levelOptions}
            specializations={specializationOptions}
            skills={skillOptions}
            selectedLevels={selectedLevels}
            selectedSpecializations={selectedSpecializations}
            selectedSkills={selectedSkills}
            onToggleLevel={toggleLevel}
            onToggleSpecialty={toggleSpecialty}
            onToggleSkill={toggleSkill}
            onClearAll={clearAllFilters}
            totalStudentsCount={students.length}
            filteredStudentsCount={filteredStudents.length}
            isMobileDrawer={true}
            isOpenMobile={isMobileDrawerOpen}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />

          {/* Students Grid Area */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* Active Filters Bar */}
            {totalActiveFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white/[0.03] border border-electric-blue/15 rounded-lg">
                <span className="text-xs text-white/50 font-medium mr-1">
                  Active:
                </span>

                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-electric-blue/15 border border-electric-blue/30 text-white">
                    <span className="text-white/60">Search:</span> &ldquo;{searchTerm}&rdquo;
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-mint-green text-white/60 font-bold ml-0.5 cursor-pointer"
                      aria-label="Remove search"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedLevels.map((lvl) => (
                  <span
                    key={`lvl-${lvl}`}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-mint-green/15 border border-mint-green/30 text-mint-green"
                  >
                    <span>{lvl}</span>
                    <button
                      onClick={() => toggleLevel(lvl)}
                      className="hover:text-white text-mint-green font-bold ml-0.5 cursor-pointer"
                      aria-label={`Remove ${lvl} level filter`}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {selectedSpecializations.map((spec) => (
                  <span
                    key={`spec-${spec}`}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-electric-blue/15 border border-electric-blue/30 text-electric-blue"
                  >
                    <span>{spec}</span>
                    <button
                      onClick={() => toggleSpecialty(spec)}
                      className="hover:text-white text-electric-blue font-bold ml-0.5 cursor-pointer"
                      aria-label={`Remove ${spec} specialization filter`}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                {selectedSkills.map((sk) => (
                  <span
                    key={`sk-${sk}`}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs bg-white/10 border border-white/20 text-white"
                  >
                    <span>{sk}</span>
                    <button
                      onClick={() => toggleSkill(sk)}
                      className="hover:text-mint-green text-white/70 font-bold ml-0.5 cursor-pointer"
                      aria-label={`Remove ${sk} skill filter`}
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-electric-blue hover:text-mint-green ml-auto transition-colors font-medium cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Header Count */}
            <div className="flex items-center justify-between mb-5 text-sm text-white/70">
              <div>
                Showing{" "}
                <span className="text-mint-green font-semibold">
                  {filteredStudents.length}
                </span>{" "}
                of {students.length} students
              </div>
              {filteredStudents.length > 0 && (
                <div className="text-xs text-white/40">
                  Displaying {displayedStudents.length} on page
                </div>
              )}
            </div>

            {filteredStudents.length > 0 ? (
              <>
                {/* Students Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white/5 rounded-xl overflow-hidden transition-all duration-200 border border-electric-blue/20 hover:border-electric-blue/60 hover:shadow-xl hover:shadow-electric-blue/5 flex flex-col justify-between"
                    >
                      <div className="p-5 flex flex-col sm:flex-row gap-5 relative">
                        {/* Student Image */}
                        <Link
                          href={`/students/${student.id}`}
                          className="flex-shrink-0 relative group h-fit mx-auto sm:mx-0"
                        >
                          <Image
                            src={student.image}
                            alt={student.name}
                            className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] rounded-full border-2 border-mint-green/80 object-cover transition-all group-hover:border-mint-green group-hover:scale-105"
                            width={130}
                            height={130}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-semibold px-2 py-1 bg-navy/80 rounded-full border border-mint-green/40">
                              Profile
                            </span>
                          </div>
                        </Link>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          {/* Level Badge (Clickable) */}
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              type="button"
                              onClick={() => toggleLevel(student.level)}
                              className={`py-0.5 px-2 text-xs font-semibold rounded transition-all cursor-pointer ${
                                selectedLevels.some(
                                  (l) => normalizeTag(l) === normalizeTag(student.level)
                                )
                                  ? "bg-mint-green text-navy font-bold"
                                  : "bg-mint-green/10 text-mint-green hover:bg-mint-green/20"
                              }`}
                              title={`Filter by ${student.level}`}
                            >
                              {student.level}
                            </button>
                            {student.role && (
                              <span className="text-xs text-white/50 truncate">
                                • {student.role}
                              </span>
                            )}
                          </div>

                          {/* Student Name */}
                          <Link href={`/students/${student.id}`} className="group block">
                            <h3 className="text-xl font-bold mt-0 mb-1 text-white group-hover:text-mint-green transition-colors flex items-center gap-1.5 truncate">
                              <span className="truncate">{student.name}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </h3>
                          </Link>

                          {/* Specialization (Clickable) */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {student.specialization &&
                              student.specialization
                                .split(",")
                                .map((sp, idx) => {
                                  const trimmed = sp.trim().replace(/[.,;]+$/, "");
                                  if (!trimmed) return null;
                                  const isSelected = selectedSpecializations.some(
                                    (s) => normalizeTag(s) === normalizeTag(trimmed)
                                  );
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => toggleSpecialty(trimmed)}
                                      className={`text-xs py-0.5 px-1.5 rounded transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-electric-blue text-navy font-bold"
                                          : "text-electric-blue hover:underline bg-electric-blue/10"
                                      }`}
                                      title={`Filter by specialization: ${trimmed}`}
                                    >
                                      {trimmed}
                                    </button>
                                  );
                                })}
                          </div>

                          {/* Team */}
                          <div className="flex gap-1.5 items-center text-xs text-white/70 mb-3">
                            <span>Team:</span>
                            <span className="text-mint-green font-medium truncate">
                              {student.team}
                            </span>
                          </div>

                          {/* Bio */}
                          <p className="text-xs text-white/75 mb-3 line-clamp-2 leading-relaxed">
                            {student.bio}
                          </p>

                          {/* Skills Pills */}
                          {student.skills && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {student.skills
                                .split(",")
                                .slice(0, 5)
                                .map((skill, index) => {
                                  const trimmedSkill = skill.trim().replace(/[.,;]+$/, "");
                                  if (!trimmedSkill) return null;
                                  const isSelected = selectedSkills.some(
                                    (s) => normalizeTag(s) === normalizeTag(trimmedSkill)
                                  );
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => toggleSkill(trimmedSkill)}
                                      className={`py-0.5 px-2 rounded-full text-[11px] transition-all cursor-pointer ${
                                        isSelected
                                          ? "bg-mint-green text-navy font-bold shadow-sm"
                                          : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10"
                                      }`}
                                      title={`Filter by skill: ${trimmedSkill}`}
                                    >
                                      {trimmedSkill}
                                    </button>
                                  );
                                })}
                              {student.skills.split(",").length > 5 && (
                                <span className="text-[11px] text-white/40 self-center">
                                  +{student.skills.split(",").length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="px-5 pb-4 pt-2 border-t border-white/5 flex gap-2">
                        <button
                          onClick={() => toggleStudentDetails(student.id)}
                          className="py-2 px-3.5 bg-transparent text-electric-blue border border-electric-blue/40 rounded-lg text-xs font-medium cursor-pointer transition-all hover:bg-electric-blue/10 flex-1 text-center"
                        >
                          {expandedStudent === student.id
                            ? "Hide Projects"
                            : `Projects (${student.projects?.length || 0})`}
                        </button>

                        <Link
                          href={`/students/${student.id}`}
                          className="py-2 px-3.5 bg-electric-blue text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-mint-green hover:text-navy flex-1 text-center shadow-md shadow-electric-blue/10 flex items-center justify-center gap-1"
                        >
                          <span>Full Profile</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>

                      {/* Expanded Student Projects */}
                      {expandedStudent === student.id && (
                        <div className="px-5 pb-5 pt-0 border-t border-electric-blue/20 mt-2 bg-black/20">
                          <h4 className="text-xs font-bold text-mint-green my-3 uppercase tracking-wider">
                            Associated Projects
                          </h4>
                          <div className="space-y-2">
                            {student.projects && student.projects.length > 0 ? (
                              student.projects.map((project, pIdx) => (
                                <Link
                                  href={`/projects/${project.id}`}
                                  key={pIdx}
                                  className="block p-3 bg-white/5 rounded-lg border border-electric-blue/10 transition-all hover:bg-electric-blue/10 hover:border-electric-blue"
                                >
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="text-white text-sm font-semibold m-0 flex items-center gap-1.5 truncate">
                                      <span className="truncate">{project.title}</span>
                                    </h5>
                                    {project.role && (
                                      <span className="text-[10px] bg-mint-green/15 text-mint-green px-2 py-0.5 rounded-full flex-shrink-0">
                                        {project.role}
                                      </span>
                                    )}
                                  </div>
                                  {project.description && (
                                    <p className="text-xs text-white/70 line-clamp-2 m-0">
                                      {project.description}
                                    </p>
                                  )}
                                </Link>
                              ))
                            ) : (
                              <div className="text-center py-3 text-xs text-white/50 italic">
                                No projects associated with this student.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination / Load More Footer */}
                {hasMore && (
                  <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
                    {/* Progress Bar */}
                    <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-electric-blue to-mint-green h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (displayedStudents.length / filteredStudents.length) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/50">
                      Showing {displayedStudents.length} of {filteredStudents.length} students
                    </span>

                    <div className="flex gap-3 mt-1">
                      <button
                        type="button"
                        onClick={loadMore}
                        className="py-2.5 px-6 rounded-lg bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue hover:text-white border border-electric-blue/40 text-sm font-semibold transition-all cursor-pointer shadow-md"
                      >
                        Load More Students (+{Math.min(ITEMS_PER_PAGE, filteredStudents.length - displayedStudents.length)})
                      </button>
                      <button
                        type="button"
                        onClick={showAll}
                        className="py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all cursor-pointer"
                      >
                        Show All ({filteredStudents.length})
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10 max-w-lg mx-auto">
                <div className="text-4xl mb-4 text-white/30">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  No matching students found
                </h3>
                <p className="text-white/60 mb-6 text-sm">
                  {searchTerm && totalActiveFiltersCount > 1
                    ? `No students found matching "${searchTerm}" with the selected filter criteria.`
                    : searchTerm
                    ? `No students found matching "${searchTerm}".`
                    : "Try adjusting or clearing your filters to see more results."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="py-2.5 px-6 bg-electric-blue text-white rounded-lg cursor-pointer transition-all hover:bg-mint-green hover:text-navy font-semibold text-sm shadow-lg shadow-electric-blue/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentsFilter;
