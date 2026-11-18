import React from 'react';
import { User, Terminal } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#0A1424] border-t border-[#1F314D] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#080F1C] border border-[#1F314D] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#35D5F2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Avatar / Terminal Card */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#35D5F2]/20 to-[#528BFF]/20 border-2 border-[#35D5F2]/40 flex items-center justify-center shadow-xl mb-4">
                <User className="w-14 h-14 text-[#35D5F2]" />
              </div>
              <h3 className="text-xl font-bold text-[#F3F7FC]">Chiziterem</h3>
              <p className="text-xs font-mono text-[#35D5F2] mt-0.5">Creator & Project Maintainer</p>
              <div className="mt-4 flex items-center space-x-2">
                <a
                  href="https://github.com/hanzchiziterem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#142238] border border-[#1F314D] text-xs font-mono text-[#9AAAC0] hover:text-[#F3F7FC] hover:border-[#35D5F2]/60 flex items-center space-x-1.5 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>@hanzchiziterem</span>
                </a>
              </div>
            </div>

            {/* Narrative Body (Strictly first-person, authentic, honest) */}
            <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-[#9AAAC0] leading-relaxed">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#101B2D] border border-[#1F314D] text-xs font-mono text-[#528BFF]">
                <Terminal className="w-3.5 h-3.5" />
                <span>ORIGIN & MOTIVATION</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7FC] tracking-tight">
                My Hands-On Cybersecurity Journey
              </h2>

              <p>
                I started the <strong>ESP8266 Security Lab</strong> as a disciplined way to document and structure my own practical technical learning journey across embedded systems, computer networking, low-level programming, and cybersecurity.
              </p>

              <p>
                Rather than treating cybersecurity as purely theoretical or relying on high-level software simulations, I wanted to work directly with physical hardware—flashing firmware to the WeMos D1, opening raw sockets, capturing packet traces in Wireshark, and observing firsthand how unmanaged default settings expose microcontrollers on real networks.
              </p>

              <p>
                By publishing this laboratory openly on GitHub, my goal is to make this learning accessible to anyone interested in hardware security, network defense, and IoT architecture. Every lesson, code snippet, and Wireshark trace represents real experiments conducted on my workbench.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
