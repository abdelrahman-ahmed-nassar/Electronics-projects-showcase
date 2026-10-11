"use client";

import React, { useState, useMemo } from "react";

export interface TagOption {
  displayName: string;
  count: number;
}

interface ProjectsFilterPanelProps {
  tags: TagOption[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  startDate: string | null;
  endDate: string | null;
  onStartDateChange: (date: string | null) => void;
  onEndDateChange: (date: string | null) => void;
  onApplyDateFilter: () => void;
  onClearDateFilter: () => void;
  dateError: string | null;
  isLoadingDate: boolean;
  onClearAll: () => void;
  totalProjectsCount: number;
  filteredProjectsCount: number;
  isMobileDrawer?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ProjectsFilterPanel({
  tags,
  selectedTags,
  onToggleTag,
  onClearTags,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyDateFilter,
  onClearDateFilter,
  dateError,
  isLoadingDate,
  onClearAll,
  totalProjectsCount,
  filteredProjectsCount,
  isMobileDrawer = false,
  isOpenMobile = false,
  onCloseMobile,
}: ProjectsFilterPanelProps) {
  const [tagSearch, setTagSearch] = useState("");
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isDateExpanded, setIsDateExpanded] = useState(true);

  // Filter tags based on in-panel search
  const filteredTags = useMemo(() => {
    if (!tagSearch.trim()) return tags;
    const q = tagSearch.toLowerCase().trim();
    return tags.filter((t) => t.displayName.toLowerCase().includes(q));
  }, [tags, tagSearch]);

  const isSearchingTags = tagSearch.trim().length > 0;
  const displayedTags = isSearchingTags || isTagsExpanded
    ? filteredTags
    : filteredTags.slice(0, 8);

  const hasHiddenTags = !isSearchingTags && filteredTags.length > 8;

  const hasDateFilter = Boolean(startDate || endDate);
  const totalActiveCount = selectedTags.length + (hasDateFilter ? 1 : 0);

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
            ({totalProjectsCount})
          </span>
          {totalActiveCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
              {totalActiveCount}
            </span>
          )}
        </div>

        {totalActiveCount > 0 && (
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
        {/* SECTION 1: Date Range Filter */}
        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsDateExpanded(!isDateExpanded)}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-electric-blue"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Created Date
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasDateFilter && (
                <span className="text-[10px] text-mint-green font-medium">
                  Applied
                </span>
              )}
              <svg
                className={`w-3.5 h-3.5 text-white/40 transform transition-transform ${
                  isDateExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {isDateExpanded && (
            <div className="mt-3 flex flex-col gap-2 pt-2 border-t border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(e) => onStartDateChange(e.target.value || null)}
                    className="w-full py-1.5 px-2 bg-navy/60 border border-electric-blue/30 rounded text-xs text-white focus:border-mint-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/50 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(e) => onEndDateChange(e.target.value || null)}
                    className="w-full py-1.5 px-2 bg-navy/60 border border-electric-blue/30 rounded text-xs text-white focus:border-mint-green outline-none"
                  />
                </div>
              </div>

              {dateError && (
                <div className="text-[11px] text-red-400 mt-1">{dateError}</div>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={onApplyDateFilter}
                  disabled={isLoadingDate || (!startDate && !endDate)}
                  className="flex-1 py-1.5 px-2 bg-electric-blue text-navy font-semibold rounded text-xs hover:bg-mint-green transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isLoadingDate ? "Loading..." : "Filter Range"}
                </button>
                {hasDateFilter && (
                  <button
                    type="button"
                    onClick={onClearDateFilter}
                    disabled={isLoadingDate}
                    className="py-1.5 px-2 bg-white/5 text-white/70 hover:text-white rounded text-xs transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Project Tags */}
        {tags.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Technology & Tags
              </span>
              <div className="flex items-center gap-2">
                {selectedTags.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearTags}
                    className="text-[11px] text-electric-blue hover:text-mint-green cursor-pointer"
                  >
                    Clear tags
                  </button>
                )}
                <span className="text-xs text-white/40">
                  {tags.length}
                </span>
              </div>
            </div>

            {/* In-panel search for tags */}
            <div className="relative mb-2">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40"
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
                placeholder="Search tags (e.g. Arduino, IoT)..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full py-1.5 pl-8 pr-6 text-xs bg-white/5 border border-white/10 rounded-md text-white placeholder-white/40 focus:border-electric-blue/60 outline-none transition-all"
              />
              {tagSearch && (
                <button
                  type="button"
                  onClick={() => setTagSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label="Clear tag search"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {displayedTags.length > 0 ? (
                displayedTags.map((t) => {
                  const isChecked = selectedTags.some(
                    (st) => st.toLowerCase() === t.displayName.toLowerCase()
                  );
                  return (
                    <label
                      key={t.displayName}
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
                          onChange={() => onToggleTag(t.displayName)}
                          className="w-3.5 h-3.5 rounded border-electric-blue/40 bg-navy/60 text-mint-green focus:ring-mint-green/30 cursor-pointer accent-[#64ffda]"
                        />
                        <span className="truncate">{t.displayName}</span>
                      </div>
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full flex-shrink-0 ${
                          isChecked
                            ? "bg-mint-green/20 text-mint-green"
                            : "bg-white/5 text-white/40"
                        }`}
                      >
                        {t.count}
                      </span>
                    </label>
                  );
                })
              ) : (
                <div className="py-3 text-center text-xs text-white/40">
                  No tags matching &quot;{tagSearch}&quot;
                </div>
              )}
            </div>

            {/* Expand / Collapse */}
            {hasHiddenTags && (
              <button
                type="button"
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="mt-2.5 w-full py-1.5 px-3 rounded-md text-xs font-medium text-electric-blue hover:text-mint-green bg-white/[0.03] hover:bg-white/[0.07] border border-electric-blue/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>
                  {isTagsExpanded
                    ? "Show fewer"
                    : `Show all (${filteredTags.length})`}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform ${
                    isTagsExpanded ? "rotate-180" : ""
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
          {totalActiveCount > 0 && (
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
            Show {filteredProjectsCount} {filteredProjectsCount === 1 ? "Project" : "Projects"}
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
              Filter Projects
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
