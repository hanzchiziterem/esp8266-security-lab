import React, { useState } from 'react';
import { Shield, Menu, X, BookOpen } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';

interface NavbarProps {
  onStartLearning?: () => void;
  onExploreCurriculum?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartLearning, onExploreCurriculum }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Curriculum', href: '#curriculum', onClick: onExploreCurriculum },
    { label: 'Objectives', href: '#objectives' },
    { label: 'Methodology', href: '#methodology' },
    { label: 'About Creator', href: '#about' },
    { label: 'Community', href: '#community' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#080F1C]/80 backdrop-blur-xl border-b border-[#1F314D]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#35D5F2]/20 to-[#528BFF]/20 border border-[#35D5F2]/40 flex items-center justify-center transition-all duration-300 group-hover:border-[#35D5F2] group-hover:shadow-[0_0_15px_rgba(53,213,242,0.35)]">
            <Shield className="w-5 h-5 text-[#35D5F2]" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-base sm:text-lg text-[#F3F7FC] block">
              ESP8266 <span className="text-[#35D5F2]">Security Lab</span>
            </span>
            <span className="text-[10px] font-mono text-[#9AAAC0] -mt-1 block tracking-wider uppercase">
              Open-Source IoT Research
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={link.onClick}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#9AAAC0] hover:text-[#F3F7FC] hover:bg-[#142238]/60 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href="https://github.com/hanzchiziterem/esp8266-security-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#101B2D] border border-[#1F314D] hover:border-[#35D5F2]/50 text-sm font-medium text-[#F3F7FC] transition-all hover:bg-[#142238]"
          >
            <GithubIcon className="w-4 h-4 text-[#9AAAC0]" />
            <span>GitHub</span>
          </a>

          <button
            onClick={onStartLearning || (() => {
              const el = document.getElementById('curriculum');
              el?.scrollIntoView({ behavior: 'smooth' });
            })}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] font-semibold text-sm hover:brightness-110 shadow-[0_0_15px_rgba(53,213,242,0.3)] transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Learning</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#9AAAC0] hover:text-[#F3F7FC] hover:bg-[#142238]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1F314D] bg-[#0A1424] px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                setMobileMenuOpen(false);
                link.onClick?.();
              }}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#9AAAC0] hover:text-[#F3F7FC] hover:bg-[#142238]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-[#1F314D] flex flex-col space-y-2">
            <a
              href="https://github.com/hanzchiziterem/esp8266-security-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-[#101B2D] border border-[#1F314D] text-sm font-medium text-[#F3F7FC]"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('curriculum');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] font-semibold text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Learning — Free</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
