"use client";

import React, { useState, useMemo } from "react";

export interface SpecialtyOption {
  displayName: string;
  count: number;
}

interface TeamsFilterPanelProps {
  specialties: SpecialtyOption[];
  activeSpecialties: string[];
  onToggleSpecialty: (specialty: string) => void;
  onClearSpecialties: () => void;
  totalTeamsCount: number;
  filteredTeamsCount: number;
  isMobileDrawer?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function TeamsFilterPanel({
  specialties,
  activeSpecialties,
  onToggleSpecialty,
  onClearSpecialties,
  totalTeamsCount,
  filteredTeamsCount,
  isMobileDrawer = false,
  isOpenMobile = false,
  onCloseMobile,
}: TeamsFilterPanelProps) {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter specialties based on in-panel search
  const filteredSpecialties = useMemo(() => {
    if (!specialtySearch.trim()) return specialties;
    const query = specialtySearch.toLowerCase().trim();
    return specialties.filter((s) =>
      s.displayName.toLowerCase().includes(query)
    );
  }, [specialties, specialtySearch]);

  // Determine which specialties to display (top 8 or all, unless searching)
  const isSearching = specialtySearch.trim().length > 0;
  const displayedSpecialties = isSearching || isExpanded
    ? filteredSpecialties
    : filteredSpecialties.slice(0, 8);

  const hasHiddenSpecialties =
    !isSearching && filteredSpecialties.length > 8;

  const activeCount = activeSpecialties.length;

  const filterContent = (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-electric-blue/20">
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
          {activeCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onClearSpecialties}
            className="text-xs text-electric-blue hover:text-mint-green transition-colors font-medium flex items-center gap-1 cursor-pointer"
            type="button"
          >
            <span>Reset</span>
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

      {/* Specialties Section */}
      <div className="pt-4 flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Specialty Area
          </span>
          <span className="text-xs text-white/40">
            {specialties.length} available
          </span>
        </div>

        {/* Quick Search Within Specialties */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search specialties..."
            value={specialtySearch}
            onChange={(e) => setSpecialtySearch(e.target.value)}
            className="w-full py-1.5 pl-8 pr-7 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:border-electric-blue/60 focus:bg-white/[0.07] outline-none transition-all"
          />
          {specialtySearch && (
            <button
              onClick={() => setSpecialtySearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              type="button"
              aria-label="Clear specialty search"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* "All Specialties" Quick Pill */}
        {!isSearching && (
          <button
            type="button"
            onClick={onClearSpecialties}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs mb-2 transition-all cursor-pointer ${
              activeCount === 0
                ? "bg-mint-green/15 text-mint-green border border-mint-green/30 font-medium"
                : "bg-white/[0.03] text-white/70 hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeCount === 0 ? "bg-mint-green" : "bg-white/30"
                }`}
              />
              <span>All Specialties</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-white/60">
              {totalTeamsCount}
            </span>
          </button>
        )}

        {/* Scrollable Specialties List with Controlled Max-Height */}
        <div
          className={`flex flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar ${
            isMobileDrawer ? "max-h-[55vh]" : isExpanded || isSearching ? "max-h-72" : "max-h-56"
          }`}
        >
          {displayedSpecialties.length > 0 ? (
            displayedSpecialties.map((item) => {
              const isChecked = activeSpecialties.some(
                (act) => act.toLowerCase() === item.displayName.toLowerCase()
              );

              return (
                <label
                  key={item.displayName}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all border ${
                    isChecked
                      ? "bg-electric-blue/15 border-electric-blue/40 text-mint-green font-medium"
                      : "bg-white/[0.02] border-transparent text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSpecialty(item.displayName)}
                      className="w-3.5 h-3.5 rounded border-electric-blue/40 bg-navy/60 text-mint-green focus:ring-mint-green/30 focus:ring-offset-0 cursor-pointer accent-[#64ffda]"
                    />
                    <span className="truncate">{item.displayName}</span>
                  </div>

                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full transition-colors flex-shrink-0 ${
                      isChecked
                        ? "bg-mint-green/20 text-mint-green"
                        : "bg-white/5 text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    {item.count}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-white/40">
              No specialties matching &quot;{specialtySearch}&quot;
            </div>
          )}
        </div>

        {/* Show More / Show Less Toggle Button */}
        {hasHiddenSpecialties && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2.5 w-full py-1.5 px-3 rounded-md text-xs font-medium text-electric-blue hover:text-mint-green bg-white/[0.03] hover:bg-white/[0.07] border border-electric-blue/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>
              {isExpanded
                ? "Show fewer"
                : `Show all (${filteredSpecialties.length})`}
            </span>
            <svg
              className={`w-3.5 h-3.5 transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Drawer Bottom Action Bar */}
      {isMobileDrawer && (
        <div className="pt-4 mt-4 border-t border-electric-blue/20 flex gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearSpecialties}
              className="py-2.5 px-4 rounded-md text-xs font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 py-2.5 px-4 rounded-md text-xs font-semibold bg-electric-blue hover:bg-mint-green text-navy transition-all shadow-md shadow-electric-blue/20 text-center"
          >
            Show {filteredTeamsCount} {filteredTeamsCount === 1 ? "Team" : "Teams"}
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
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between pb-3 border-b border-electric-blue/20 mb-2">
            <h2 className="text-base font-bold text-mint-green m-0">
              Filter by Specialty
            </h2>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
