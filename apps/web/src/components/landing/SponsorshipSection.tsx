import React from 'react';
import { Heart, Building, Coffee, Shield } from 'lucide-react';

export const SponsorshipSection: React.FC = () => {
  const tiers = [
    {
      name: 'Community Supporter',
      price: '$5 / mo',
      icon: <Coffee className="w-5 h-5 text-[#35D5F2]" />,
      desc: 'Helps cover domain hosting, lab firmware development boards, and CI test runner minutes.',
      perks: ['Supporter badge on GitHub', 'Listed in docs/CONTRIBUTORS.md'],
    },
    {
      name: 'Hardware Sponsor',
      price: '$25 / mo',
      icon: <Shield className="w-5 h-5 text-[#528BFF]" />,
      desc: 'Funds physical testing components (sensors, external antennas, Wi-Fi test routers) for new modules.',
      perks: [
        'Supporter badge & priority issue review',
        'Early access to draft module outlines',
        'Listed on platform sponsor wall',
      ],
      featured: true,
    },
    {
      name: 'Enterprise / Organization',
      price: 'Custom / Grant',
      icon: <Building className="w-5 h-5 text-[#35D5F2]" />,
      desc: 'Sponsor an entire course module, hardware kit distribution, or classroom workshop.',
      perks: [
        'Organization logo & link on landing page',
        'Mentioned in video walkthroughs',
        'Direct consultation on IoT security curriculum',
      ],
    },
  ];

  return (
    <section id="sponsors" className="py-20 bg-[#0A1424] border-t border-[#1F314D] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#35D5F2] bg-[#101B2D] border border-[#1F314D] px-3 py-1 rounded-full">
            Open-Source Sustainability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F3F7FC] mt-4 tracking-tight">
            Support Open-Source IoT Education
          </h2>
          <p className="text-base text-[#9AAAC0] mt-3">
            This laboratory is completely free to read and practice. Sponsorships help keep hardware research, documentation maintenance, and platform infrastructure sustainable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.featured
                  ? 'bg-[#101B2D] border-2 border-[#35D5F2] shadow-[0_0_25px_rgba(53,213,242,0.15)]'
                  : 'bg-[#080F1C] border border-[#1F314D] hover:border-[#35D5F2]/40'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] text-[10px] font-bold font-mono px-3 py-0.5 rounded-full uppercase tracking-wider">
                  Recommended Tier
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#142238] border border-[#1F314D] flex items-center justify-center">
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F3F7FC]">{tier.name}</h3>
                    <div className="text-lg font-mono font-extrabold text-[#35D5F2]">{tier.price}</div>
                  </div>
                </div>

                <p className="text-xs text-[#9AAAC0] leading-relaxed mb-6">
                  {tier.desc}
                </p>

                <ul className="space-y-2.5 text-xs text-[#F3F7FC]/90 border-t border-[#1F314D]/60 pt-5">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35D5F2]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <a
                  href="https://github.com/sponsors/hanzchiziterem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    tier.featured
                      ? 'bg-gradient-to-r from-[#35D5F2] to-[#528BFF] text-[#080F1C] hover:brightness-110'
                      : 'bg-[#142238] border border-[#1F314D] text-[#F3F7FC] hover:border-[#35D5F2]/50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>Sponsor on GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
