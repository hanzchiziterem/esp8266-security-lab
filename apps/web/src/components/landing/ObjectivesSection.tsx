import React from 'react';
import { Search, Eye, Wifi, ShieldAlert, Lock, Network } from 'lucide-react';

export const ObjectivesSection: React.FC = () => {
  const objectives = [
    {
      icon: <Search className="w-6 h-6 text-[#35D5F2]" />,
      title: 'Hardware & Subnet Reconnaissance',
      desc: 'Discover active microcontrollers using ARP tables, identify Espressif silicon via OUI lookups, and fingerprint open TCP sockets without specialized hardware.',
    },
    {
      icon: <Eye className="w-6 h-6 text-[#528BFF]" />,
      title: 'Packet Sniffing & Traffic Dissection',
      desc: 'Capture real microcontroller traffic using Wireshark. Inspect cleartext HTTP telemetry, analyze TCP handshakes, and observe the lack of transport encryption.',
    },
    {
      icon: <Wifi className="w-6 h-6 text-[#35D5F2]" />,
      title: 'Wireless Operating Modes & Trust Gaps',
      desc: 'Understand the protocol distinction between Station (STA) mode and Access Point (AP) mode, and examine how client auto-connect creates trust vulnerabilities.',
    },
    {
      icon: <Network className="w-6 h-6 text-[#528BFF]" />,
      title: 'Network Pivoting & Dual-Homed Risks',
      desc: 'Investigate how an innocent peripheral straddling two subnets (AP+STA) breaks perimeter security models and exposes trusted networks to lateral movement.',
    },
    {
      icon: <Lock className="w-6 h-6 text-[#35D5F2]" />,
      title: 'Firmware Extraction & Secret Security',
      desc: 'Analyze where hardcoded Wi-Fi passwords and API keys live inside compiled SPI flash binaries, and implement defensive credential isolation outside Git.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-[#528BFF]" />,
      title: 'Defensive Hardening & Isolation',
      desc: 'Learn practical remediation strategies: VLAN segmentation, Protected Management Frames (802.11w), mutual authentication, and cryptographic OTA verification.',
    },
  ];

  return (
    <section id="objectives" className="py-20 bg-[#080F1C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#35D5F2] bg-[#101B2D] border border-[#1F314D] px-3 py-1 rounded-full">
            Technical Competencies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7FC] mt-4 tracking-tight">
            What You Will Master in This Lab
          </h2>
          <p className="text-base text-[#9AAAC0] mt-3">
            Real cybersecurity is built on understanding protocol mechanics and hardware realities—not clicking through automated scanner wizards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((obj) => (
            <div
              key={obj.title}
              className="bg-[#101B2D]/80 border border-[#1F314D] rounded-2xl p-6 hover:border-[#35D5F2]/50 hover:bg-[#142238]/60 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#142238] border border-[#1F314D] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#35D5F2]/40 transition-all">
                {obj.icon}
              </div>
              <h3 className="text-lg font-bold text-[#F3F7FC] group-hover:text-[#35D5F2] transition-colors">
                {obj.title}
              </h3>
              <p className="text-sm text-[#9AAAC0] mt-2.5 leading-relaxed">
                {obj.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
