import React, { useState } from 'react';
import { CURRICULUM, Module } from '../../data/curriculum';
import { CheckCircle, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CurriculumSectionProps {
  onSelectLesson?: (lessonId: string) => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onSelectLesson }) => {
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({ 1: true });

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSafetyBadge = (scope: Module['safetyScope']) => {
    switch (scope) {
      case 'Full Hands-on':
        return <span className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono px-2.5 py-0.5 rounded-full">Full Hands-on Lab</span>;
      case 'Concept & Detection Only':
        return <span className="bg-amber-950/60 text-amber-400 border border-amber-800/60 text-[11px] font-mono px-2.5 py-0.5 rounded-full">Concept & Detection Only</span>;
      case 'Safe Demo Only':
        return <span className="bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 text-[11px] font-mono px-2.5 py-0.5 rounded-full">Safe Demo (*-TEST AP)</span>;
      case 'Simulation Only':
        return <span className="bg-purple-950/60 text-purple-400 border border-purple-800/60 text-[11px] font-mono px-2.5 py-0.5 rounded-full">Simulation & Topology Only</span>;
    }
  };

  const getLessonBadge = (status: 'done' | 'next' | 'planned') => {
    switch (status) {
      case 'done':
        return <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold"><CheckCircle className="w-3.5 h-3.5" /><span>Verified Complete</span></span>;
      case 'next':
        return <span className="flex items-center space-x-1 text-[#35D5F2] text-xs font-semibold"><Clock className="w-3.5 h-3.5" /><span>Next In Queue</span></span>;
      case 'planned':
        return <span className="text-[#9AAAC0] text-xs">Curriculum Outline</span>;
    }
  };

  return (
    <section id="curriculum" className="py-20 bg-[#0A1424] border-t border-[#1F314D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#35D5F2] bg-[#101B2D] border border-[#1F314D] px-3 py-1 rounded-full">
            Official Course Syllabus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7FC] mt-4 tracking-tight">
            Comprehensive 8-Module Curriculum
          </h2>
          <p className="text-base text-[#9AAAC0] mt-3">
            Every module adheres to strict safety and defensive boundaries. No real-world attack firmware or credential harvesting is ever produced.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          {CURRICULUM.map((mod) => {
            const isExpanded = !!expandedModules[mod.id];

            return (
              <div
                key={mod.id}
                className="bg-[#080F1C] border border-[#1F314D] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#35D5F2]/40"
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleModule(mod.id)}
                  className="p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-[#101B2D]/50 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-[#35D5F2] tracking-wider uppercase">
                        Module {mod.id}
                      </span>
                      {getSafetyBadge(mod.safetyScope)}
                      {mod.status === 'in-progress' && (
                        <span className="bg-[#142238] text-[#528BFF] text-[10px] font-mono px-2 py-0.5 rounded border border-[#1F314D]">
                          Active Development
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#F3F7FC]">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-[#9AAAC0]">
                      {mod.tagline}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    <span className="text-xs font-mono text-[#9AAAC0]">
                      {mod.lessons.length} {mod.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#142238] border border-[#1F314D] text-[#9AAAC0]">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Module Description & Lessons Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#1F314D]/60 bg-[#0A1628]/60 space-y-4">
                    <p className="text-sm text-[#9AAAC0] leading-relaxed">
                      {mod.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-[#080F1C] border border-[#1F314D]/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#35D5F2]/40 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono text-[#35D5F2] font-semibold">
                                {lesson.id}
                              </span>
                              <h4 className="text-sm font-semibold text-[#F3F7FC]">
                                {lesson.title}
                              </h4>
                              {lesson.isOptional && (
                                <span className="text-[10px] bg-[#142238] text-[#9AAAC0] px-1.5 py-0.5 rounded font-mono">
                                  Optional Deep Dive
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#9AAAC0] leading-relaxed">
                              {lesson.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3 sm:self-center shrink-0">
                            {getLessonBadge(lesson.status)}
                            {lesson.status === 'done' && (
                              <button
                                onClick={() => onSelectLesson?.(lesson.id)}
                                className="px-3 py-1 rounded-lg bg-[#142238] border border-[#1F314D] hover:border-[#35D5F2] text-xs font-medium text-[#35D5F2] flex items-center space-x-1.5 transition-colors cursor-pointer"
                              >
                                <span>Read Lab</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
