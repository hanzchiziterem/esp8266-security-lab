import React from 'react';
import { ArrowRight, BookOpen, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { Esp8266Visual } from '../hardware/Esp8266Visual';

interface HeroSectionProps {
  onStartLearning: () => void;
  onExploreCurriculum: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onExploreCurriculum,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Matrix/Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F314D08_1px,transparent_1px),linear-gradient(to_bottom,#1F314D08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#35D5F2]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#528BFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Mission Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#101B2D] border border-[#1F314D] text-xs font-mono text-[#35D5F2]">
              <span className="flex h-2 w-2 rounded-full bg-[#35D5F2] animate-ping" />
              <span>OPEN-SOURCE HARDWARE CYBERSECURITY LAB</span>
            </div>

            {/* Main Headline (Exact requirement from prompt) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F3F7FC] leading-[1.12]">
              Keeping the Integrity of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#35D5F2] via-[#528BFF] to-[#35D5F2]">
                IoT Security
              </span>{' '}
              Over Networks.
            </h1>

            {/* Description (Exact requirement from prompt) */}
            <p className="text-base sm:text-lg text-[#9AAAC0] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore how connected devices communicate, understand their vulnerabilities, and learn practical techniques for securing IoT environments through hands-on experiments and structured lessons.
            </p>

            {/* Value Highlights Pill Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-[#9AAAC0] pt-2">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#35D5F2]" />
                <span>Defensive-First Curriculum</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-[#528BFF]" />
                <span>Wireshark & Nmap Recon</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-[#35D5F2]" />
                <span>WeMos D1 Microcontroller</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStartLearning}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] font-bold text-base hover:brightness-110 shadow-[0_0_25px_rgba(53,213,242,0.35)] transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
              >
                <span>Start Learning — Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreCurriculum}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#101B2D] border border-[#1F314D] hover:border-[#35D5F2]/60 text-[#F3F7FC] font-semibold text-base hover:bg-[#142238] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#35D5F2]" />
                <span>Explore Curriculum</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hardware Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Esp8266Visual />
          </div>
        </div>
      </div>
    </section>
  );
};
