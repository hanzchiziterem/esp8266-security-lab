import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050A14] border-t border-[#1F314D] text-[#9AAAC0] text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#35D5F2]/20 border border-[#35D5F2]/40 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#35D5F2]" />
              </div>
              <span className="font-bold text-sm text-[#F3F7FC]">ESP8266 Security Lab</span>
            </div>
            <p className="text-xs text-[#9AAAC0] max-w-sm leading-relaxed">
              Open-source IoT cybersecurity learning platform centered around embedded microcontrollers, network protocol analysis, and hardware defense.
            </p>
            <p className="text-[11px] font-mono text-[#9AAAC0]/70">
              Developed by Chiziterem (@hanzchiziterem).
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#F3F7FC] font-semibold">Course Modules</h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#curriculum" className="hover:text-[#35D5F2] transition-colors">Module 1: Attack Surface</a></li>
              <li><a href="#curriculum" className="hover:text-[#35D5F2] transition-colors">Module 2: Wi-Fi Deauth Defense</a></li>
              <li><a href="#curriculum" className="hover:text-[#35D5F2] transition-colors">Module 3: Rogue AP & Evil Twin</a></li>
              <li><a href="#curriculum" className="hover:text-[#35D5F2] transition-colors">Module 4: Packet Sniffing & TLS</a></li>
              <li><a href="#curriculum" className="hover:text-[#35D5F2] transition-colors">Module 5: Pivoting & Isolation</a></li>
            </ul>
          </div>

          {/* Open Source Links */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#F3F7FC] font-semibold">Open Source & Community</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://github.com/hanzchiziterem/esp8266-security-lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#35D5F2] flex items-center space-x-1"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li><a href="#community" className="hover:text-[#35D5F2] transition-colors">Contributor Applications</a></li>
              <li><a href="#community" className="hover:text-[#35D5F2] transition-colors">Report Errata / Bugs</a></li>
              <li><a href="#sponsors" className="hover:text-[#35D5F2] transition-colors">Sponsorship Tiers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & License */}
        <div className="pt-8 border-t border-[#1F314D]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9AAAC0]/80">
          <div>
            © {new Date().getFullYear()} ESP8266 Security Lab. Released under the MIT License for educational research.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with discipline for the global cybersecurity community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
