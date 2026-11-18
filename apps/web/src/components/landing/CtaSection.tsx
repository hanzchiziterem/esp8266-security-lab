import React from 'react';
import { BookOpen, Shield } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';

interface CtaSectionProps {
  onStartLearning: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onStartLearning }) => {
  return (
    <section className="py-20 bg-[#080F1C] relative overflow-hidden border-t border-[#1F314D]/80">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-r from-[#35D5F2]/10 to-[#528BFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#101B2D] border border-[#1F314D] text-xs font-mono text-[#35D5F2]">
          <Shield className="w-4 h-4 text-[#35D5F2]" />
          <span>START YOUR IOT SECURITY JOURNEY</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F3F7FC] tracking-tight max-w-2xl mx-auto leading-tight">
          Ready to Understand What IoT Devices Really Do Over the Air?
        </h2>

        <p className="text-base text-[#9AAAC0] max-w-xl mx-auto leading-relaxed">
          Plug in your WeMos D1, launch Wireshark, and take control of your local wireless environment with practical, defensive engineering labs.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartLearning}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] font-bold text-base hover:brightness-110 shadow-[0_0_25px_rgba(53,213,242,0.35)] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <BookOpen className="w-5 h-5" />
            <span>Start Learning Module 1 — Free</span>
          </button>

          <a
            href="https://github.com/hanzchiziterem/esp8266-security-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#101B2D] border border-[#1F314D] text-[#F3F7FC] font-semibold text-base hover:bg-[#142238] hover:border-[#35D5F2]/50 transition-all flex items-center justify-center space-x-2"
          >
            <GithubIcon className="w-5 h-5 text-[#9AAAC0]" />
            <span>Fork on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};
