import React from 'react';
import { Lightbulb, Crosshair, Cpu, Wrench, Code2, PlayCircle, Eye, ShieldCheck, HelpCircle } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Lightbulb className="w-5 h-5 text-[#35D5F2]" />,
      title: 'Conceptual Explanation',
      desc: 'Ground the lesson in networking theory, physical hardware constraints, and protocol design principles.',
    },
    {
      num: '02',
      icon: <Crosshair className="w-5 h-5 text-[#528BFF]" />,
      title: 'Attack Perspective',
      desc: 'Understand how an adversary approaches the system: passive recon checklists, reconnaissance gold, and unauthenticated levers.',
    },
    {
      num: '03',
      icon: <Cpu className="w-5 h-5 text-[#35D5F2]" />,
      title: 'Technical Breakdown',
      desc: 'Dissect the protocol framing, state transitions, hardware registers, and operating modes (STA vs SoftAP).',
    },
    {
      num: '04',
      icon: <Wrench className="w-5 h-5 text-[#528BFF]" />,
      title: 'Lab Exercise & Setup',
      desc: 'Step-by-step installation: USB CH340 drivers, Arduino IDE board package, and secret management outside version control.',
    },
    {
      num: '05',
      icon: <Code2 className="w-5 h-5 text-[#35D5F2]" />,
      title: 'Source Code Inspection',
      desc: 'Analyze clean, minimal Arduino C++ firmware sketches running on the WeMos D1 hardware.',
    },
    {
      num: '06',
      icon: <PlayCircle className="w-5 h-5 text-[#528BFF]" />,
      title: 'Demonstration & Recon',
      desc: 'Live execution from your host laptop: ARP cache scanning, OUI lookup, socket testing, and cleartext Wireshark inspection.',
    },
    {
      num: '07',
      icon: <Eye className="w-5 h-5 text-[#35D5F2]" />,
      title: 'Blue Team Detection',
      desc: 'How network defenders spot anomalous IoT nodes: DHCP hostname footprints, non-standard LwIP TCP fingerprints, and beacon sniffing.',
    },
    {
      num: '08',
      icon: <ShieldCheck className="w-5 h-5 text-[#528BFF]" />,
      title: 'Remediation Roadmap',
      desc: 'Lock down the exposure: VLAN isolation, access controls, encrypted transport, and authenticated OTA upgrades.',
    },
    {
      num: '09',
      icon: <HelpCircle className="w-5 h-5 text-[#35D5F2]" />,
      title: 'Knowledge Assessment',
      desc: 'Predefined technical challenges evaluated by our AI grading engine with instant, rubric-backed conceptual feedback.',
    },
  ];

  return (
    <section id="methodology" className="py-20 bg-[#080F1C] relative border-t border-[#1F314D]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#35D5F2] bg-[#101B2D] border border-[#1F314D] px-3 py-1 rounded-full">
            Pedagogical Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7FC] mt-4 tracking-tight">
            The 9-Step Engineering Methodology
          </h2>
          <p className="text-base text-[#9AAAC0] mt-3">
            Every lesson follows a repeatable, disciplined structure that bridges low-level silicon behavior with high-level defensive security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-[#101B2D] border border-[#1F314D] rounded-2xl p-6 hover:border-[#35D5F2]/40 transition-all duration-300 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#142238] border border-[#1F314D] flex items-center justify-center group-hover:border-[#35D5F2]/40 transition-colors">
                  {s.icon}
                </div>
                <span className="text-xl font-mono font-bold text-[#1F314D] group-hover:text-[#35D5F2]/40 transition-colors">
                  {s.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#F3F7FC] group-hover:text-[#35D5F2] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-[#9AAAC0] mt-2 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
