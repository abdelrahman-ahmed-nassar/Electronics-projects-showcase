"use client";

import React, { useState, useMemo } from "react";

export interface FilterOption {
  displayName: string;
  count: number;
}

interface StudentsFilterPanelProps {
  levels: FilterOption[];
  specializations: FilterOption[];
  skills: FilterOption[];
  selectedLevels: string[];
  selectedSpecializations: string[];
  selectedSkills: string[];
  onToggleLevel: (level: string) => void;
  onToggleSpecialty: (specialty: string) => void;
  onToggleSkill: (skill: string) => void;
  onClearAll: () => void;
  totalStudentsCount: number;
  filteredStudentsCount: number;
  isMobileDrawer?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function StudentsFilterPanel({
  levels,
  specializations,
  skills,
  selectedLevels,
  selectedSpecializations,
  selectedSkills,
  onToggleLevel,
  onToggleSpecialty,
  onToggleSkill,
  onClearAll,
  totalStudentsCount,
  filteredStudentsCount,
  isMobileDrawer = false,
  isOpenMobile = false,
  onCloseMobile,
}: StudentsFilterPanelProps) {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [isSpecialtiesExpanded, setIsSpecialtiesExpanded] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);

  // Filter specializations based on in-panel search
  const filteredSpecialties = useMemo(() => {
    if (!specialtySearch.trim()) return specializations;
    const q = specialtySearch.toLowerCase().trim();
    return specializations.filter((s) =>
      s.displayName.toLowerCase().includes(q)
    );
  }, [specializations, specialtySearch]);

  // Filter skills based on in-panel search
  const filteredSkills = useMemo(() => {
    if (!skillSearch.trim()) return skills;
    const q = skillSearch.toLowerCase().trim();
    return skills.filter((s) =>
      s.displayName.toLowerCase().includes(q)
    );
  }, [skills, skillSearch]);

  const totalActiveFilters =
    selectedLevels.length +
    selectedSpecializations.length +
    selectedSkills.length;

  const displayedSpecialties =
    specialtySearch.trim().length > 0 || isSpecialtiesExpanded
      ? filteredSpecialties
      : filteredSpecialties.slice(0, 6);

  const displayedSkills =
    skillSearch.trim().length > 0 || isSkillsExpanded
      ? filteredSkills
      : filteredSkills.slice(0, 8);

  const filterContent = (
    <div className="flex flex-col h-full gap-5">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-electric-blue/20">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-mint-green"
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
          <h3 className="text-lg font-bold text-white tracking-wide">
            Filters
          </h3>
          <span className="text-xs text-white/40">
            ({totalStudentsCount})
          </span>
          {totalActiveFilters > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
              {totalActiveFilters}
            </span>
          )}
        </div>

        {totalActiveFilters > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-electric-blue hover:text-mint-green transition-colors font-medium flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span>Reset All</span>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto pr-1 custom-scrollbar">
        {/* SECTION 1: Academic Level */}
        {levels.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Academic Level
              </span>
              {selectedLevels.length > 0 && (
                <span className="text-[11px] text-mint-green">
                  {selectedLevels.length} active
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {levels.map((lvl) => {
                const isChecked = selectedLevels.some(
                  (l) => l.toLowerCase() === lvl.displayName.toLowerCase()
                );
                return (
                  <label
                    key={lvl.displayName}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all border ${
                      isChecked
                        ? "bg-mint-green/15 border-mint-green/40 text-mint-green font-medium"
                        : "bg-white/[0.02] border-transparent text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleLevel(lvl.displayName)}
                        className="w-3.5 h-3.5 rounded border-electric-blue/40 bg-navy/60 text-mint-green focus:ring-mint-green/30 cursor-pointer accent-[#64ffda]"
                      />
                      <span>{lvl.displayName}</span>
                    </div>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                        isChecked
                          ? "bg-mint-green/20 text-mint-green"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {lvl.count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: Specialization */}
        {specializations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Specialization
              </span>
              <span className="text-xs text-white/40">
                {specializations.length}
              </span>
            </div>

            {/* In-panel search for specializations */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search specializations..."
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:border-electric-blue/60 outline-none transition-all"
              />
              {specialtySearch && (
                <button
                  type="button"
                  onClick={() => setSpecialtySearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label="Clear specialization search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {displayedSpecialties.length > 0 ? (
                displayedSpecialties.map((spec) => {
                  const isChecked = selectedSpecializations.some(
                    (s) => s.toLowerCase() === spec.displayName.toLowerCase()
                  );
                  return (
                    <label
                      key={spec.displayName}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? "bg-electric-blue/15 border-electric-blue/40 text-mint-green font-medium"
                          : "bg-white/[0.02] border-transparent text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSpecialty(spec.displayName)}
                          className="w-3.5 h-3.5 rounded border-electric-blue/40 bg-navy/60 text-mint-green focus:ring-mint-green/30 cursor-pointer accent-[#64ffda]"
                        />
                        <span className="truncate">{spec.displayName}</span>
                      </div>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                          isChecked
                            ? "bg-mint-green/20 text-mint-green"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {spec.count}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="py-3 text-center text-xs text-white/40">
                  No specializations found
                </div>
              )}
            </div>

            {/* Expand / Collapse */}
            {!specialtySearch && filteredSpecialties.length > 6 && (
              <button
                type="button"
                onClick={() => setIsSpecialtiesExpanded(!isSpecialtiesExpanded)}
                className="mt-2 text-xs text-electric-blue hover:text-mint-green transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {isSpecialtiesExpanded
                    ? "Show fewer"
                    : `Show all (${filteredSpecialties.length})`}
                </span>
                <svg
                  className={`w-3 h-3 transform transition-transform ${
                    isSpecialtiesExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* SECTION 3: Skills */}
        {skills.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Skills
              </span>
              <span className="text-xs text-white/40">
                {skills.length}
              </span>
            </div>

            {/* In-panel search for skills */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-6 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:border-electric-blue/60 outline-none transition-all"
              />
              {skillSearch && (
                <button
                  type="button"
                  onClick={() => setSkillSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label="Clear skill search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {displayedSkills.length > 0 ? (
                displayedSkills.map((sk) => {
                  const isChecked = selectedSkills.some(
                    (s) => s.toLowerCase() === sk.displayName.toLowerCase()
                  );
                  return (
                    <label
                      key={sk.displayName}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all border ${
                        isChecked
                          ? "bg-electric-blue/15 border-electric-blue/40 text-mint-green font-medium"
                          : "bg-white/[0.02] border-transparent text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleSkill(sk.displayName)}
                          className="w-3.5 h-3.5 rounded border-electric-blue/40 bg-navy/60 text-mint-green focus:ring-mint-green/30 cursor-pointer accent-[#64ffda]"
                        />
                        <span className="truncate">{sk.displayName}</span>
                      </div>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                          isChecked
                            ? "bg-mint-green/20 text-mint-green"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {sk.count}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="py-3 text-center text-xs text-white/40">
                  No skills found
                </div>
              )}
            </div>

            {/* Expand / Collapse */}
            {!skillSearch && filteredSkills.length > 8 && (
              <button
                type="button"
                onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                className="mt-2 text-xs text-electric-blue hover:text-mint-green transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {isSkillsExpanded
                    ? "Show fewer"
                    : `Show all (${filteredSkills.length})`}
                </span>
                <svg
                  className={`w-3 h-3 transform transition-transform ${
                    isSkillsExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer Bottom Action Bar */}
      {isMobileDrawer && (
        <div className="pt-3 border-t border-electric-blue/20 flex gap-2">
          {totalActiveFilters > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="py-2.5 px-4 rounded-md text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-2.5 px-4 rounded-md text-xs font-semibold bg-electric-blue hover:bg-mint-green text-navy transition-all shadow-md shadow-electric-blue/20 text-center cursor-pointer"
          >
            Show {filteredStudentsCount} {filteredStudentsCount === 1 ? "Student" : "Students"}
          </button>
        </div>
      )}
    </div>
  );

  // If Mobile Drawer Mode
  if (isMobileDrawer) {
    if (!isOpenMobile) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-navy/80 backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />

        {/* Slide-up sheet */}
        <div className="relative z-10 w-full max-h-[85vh] bg-[#0c1f3d] border-t border-electric-blue/40 rounded-t-2xl p-5 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between pb-3 border-b border-electric-blue/20 mb-2">
            <h2 className="text-base font-bold text-mint-green m-0">
              Filter Students
            </h2>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close filters"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {filterContent}
        </div>
      </div>
    );
  }

  // Desktop Sidebar Mode
  return (
    <aside className="bg-white/[0.04] backdrop-blur-md rounded-xl p-5 border border-electric-blue/20 shadow-lg shadow-black/20 sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden flex flex-col">
      {filterContent}
    </aside>
  );
}
