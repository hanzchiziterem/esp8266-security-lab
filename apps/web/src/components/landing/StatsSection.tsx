import React from 'react';
import { PLATFORM_STATS } from '../../data/stats';
import { Layers, CheckCircle2, Cpu, Globe } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const statIcons = [
    <Layers className="w-5 h-5 text-[#35D5F2]" />,
    <CheckCircle2 className="w-5 h-5 text-[#528BFF]" />,
    <Cpu className="w-5 h-5 text-[#35D5F2]" />,
    <Globe className="w-5 h-5 text-[#528BFF]" />,
  ];

  return (
    <section className="relative py-12 bg-[#0A1424] border-y border-[#1F314D]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-widest text-[#35D5F2]">Verifiable Platform Metrics</p>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F3F7FC] mt-1">Real Technical Curriculum Scope</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className="bg-[#080F1C] border border-[#1F314D] rounded-xl p-5 hover:border-[#35D5F2]/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#9AAAC0]">{stat.label}</span>
                <div className="p-2 bg-[#142238] rounded-lg border border-[#1F314D]/60 group-hover:border-[#35D5F2]/40 transition-colors">
                  {statIcons[idx % statIcons.length]}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F3F7FC] tracking-tight group-hover:text-[#35D5F2] transition-colors">
                {stat.value}
              </div>
              <p className="text-xs text-[#9AAAC0] mt-2 leading-relaxed">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
