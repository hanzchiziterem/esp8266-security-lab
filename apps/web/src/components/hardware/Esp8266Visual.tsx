import React, { useState } from 'react';
import { Cpu, Terminal } from 'lucide-react';

interface ComponentCallout {
  id: string;
  name: string;
  desc: string;
}

export const Esp8266Visual: React.FC = () => {
  const [activeCallout, setActiveCallout] = useState<ComponentCallout | null>(null);

  const callouts: Record<string, ComponentCallout> = {
    antenna: {
      id: 'antenna',
      name: '2.4 GHz PCB Trace Antenna',
      desc: 'Inverted-F antenna etched on PCB. Operating range 2412–2484 MHz (802.11 b/g/n).',
    },
    shield: {
      id: 'shield',
      name: 'ESP-12F Metal RF Shield',
      desc: 'Houses the Tensilica L106 32-bit RISC core @ 80/160 MHz and 4MB SPI Flash memory.',
    },
    usb: {
      id: 'usb',
      name: 'Micro-USB UART Interface',
      desc: 'Connects to host computer for serial flashing and 115200 baud monitor telemetry.',
    },
    ch340: {
      id: 'ch340',
      name: 'CH340G USB-to-UART Bridge',
      desc: 'Provides USB serial emulation and hardware auto-reset circuit for flashing.',
    },
    headers: {
      id: 'headers',
      name: 'Standard GPIO Header Pins',
      desc: 'General Purpose Input/Output pins (D0–D8, RX, TX, 3.3V, 5V, GND, RST, A0).',
    },
  };

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Decorative Cybernetic Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#35D5F2]/20 via-[#528BFF]/15 to-transparent rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Main Board Container */}
      <div className="relative bg-[#0E1B2E]/90 border border-[#1F314D] rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        {/* Header Telemetry Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F314D]/80 mb-5 text-xs font-mono text-[#9AAAC0]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[#F3F7FC] font-semibold tracking-wider">HARDWARE SPECIFICATION</span>
          </div>
          <span className="bg-[#142238] border border-[#1F314D] px-2.5 py-0.5 rounded text-[#35D5F2]">WeMos D1 (ESP8266)</span>
        </div>

        {/* High-Fidelity SVG Board Graphic */}
        <div className="relative flex justify-center py-2">
          <svg
            viewBox="0 0 340 440"
            className="w-full max-w-[320px] drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* PCB Main Substrate */}
            <rect x="20" y="20" width="300" height="400" rx="14" fill="#0A1626" stroke="#1F3654" strokeWidth="2.5" />
            
            {/* Internal Ground Planes & Copper Traces */}
            <rect x="28" y="28" width="284" height="384" rx="10" fill="#07101C" />
            <path d="M 40 40 L 40 400 M 300 40 L 300 400" stroke="#14263D" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 60 140 L 120 140 L 120 220 L 180 220" stroke="#1A3352" strokeWidth="1.5" />
            <path d="M 280 280 L 220 280 L 220 320" stroke="#1A3352" strokeWidth="1.5" />

            {/* Left Header Pins */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <g key={`pin-l-${i}`} onMouseEnter={() => setActiveCallout(callouts.headers)}>
                <circle cx="38" cy={110 + i * 32} r="9" fill="#101F33" stroke="#35D5F2" strokeWidth="1" />
                <circle cx="38" cy={110 + i * 32} r="4" fill="#E2B13C" />
              </g>
            ))}

            {/* Right Header Pins */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <g key={`pin-r-${i}`} onMouseEnter={() => setActiveCallout(callouts.headers)}>
                <circle cx="302" cy={110 + i * 32} r="9" fill="#101F33" stroke="#35D5F2" strokeWidth="1" />
                <circle cx="302" cy={110 + i * 32} r="4" fill="#E2B13C" />
              </g>
            ))}

            {/* Top Wi-Fi Inverted-F Meandering PCB Trace Antenna */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onMouseEnter={() => setActiveCallout(callouts.antenna)}
            >
              <rect x="100" y="32" width="140" height="48" rx="4" fill="#0E1E33" stroke="#E2B13C" strokeWidth="1" />
              <path
                d="M 112 70 L 112 42 L 132 42 L 132 65 L 152 65 L 152 42 L 172 42 L 172 65 L 192 65 L 192 42 L 212 42 L 212 65 L 228 65 L 228 70"
                stroke="#E2B13C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="170" y="60" fill="#E2B13C" fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.6">
                2.4GHz ANT
              </text>
            </g>

            {/* Metallic ESP-12F RF Shield Can */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveCallout(callouts.shield)}
            >
              <rect x="85" y="100" width="170" height="150" rx="6" fill="#1A293E" stroke="#718BAA" strokeWidth="2" />
              <rect x="92" y="107" width="156" height="136" rx="4" fill="#132032" stroke="#324B6B" strokeWidth="1" />
              {/* Espressif & Board Labeling */}
              <text x="170" y="140" fill="#F3F7FC" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                ESP8266MOD
              </text>
              <text x="170" y="160" fill="#9AAAC0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                ISM 2.4GHz / Wi-Fi b/g/n
              </text>
              <text x="170" y="180" fill="#35D5F2" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Tensilica L106 @ 80MHz
              </text>
              <text x="170" y="200" fill="#9AAAC0" fontSize="8" fontFamily="monospace" textAnchor="middle">
                FCC ID: 2AC7Z-ESPWROOM02
              </text>
              <circle cx="104" cy="118" r="3" fill="#E2B13C" />
            </g>

            {/* CH340 Serial Converter IC */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveCallout(callouts.ch340)}
            >
              <rect x="135" y="275" width="70" height="42" rx="3" fill="#0C1522" stroke="#35D5F2" strokeWidth="1.2" />
              <text x="170" y="299" fill="#9AAAC0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                CH340G
              </text>
              {/* IC Pins */}
              {[-2, -1, 0, 1, 2].map((p) => (
                <g key={`chip-pin-${p}`}>
                  <line x1={170 + p * 12} y1="270" x2={170 + p * 12} y2="275" stroke="#9AAAC0" strokeWidth="2" />
                  <line x1={170 + p * 12} y1="317" x2={170 + p * 12} y2="322" stroke="#9AAAC0" strokeWidth="2" />
                </g>
              ))}
            </g>

            {/* Micro-USB Port on Bottom */}
            <g
              className="cursor-pointer"
              onMouseEnter={() => setActiveCallout(callouts.usb)}
            >
              <rect x="130" y="380" width="80" height="35" rx="3" fill="#1C2F48" stroke="#718BAA" strokeWidth="1.5" />
              <rect x="145" y="390" width="50" height="25" rx="2" fill="#0A1626" />
              <text x="170" y="405" fill="#9AAAC0" fontSize="8" fontFamily="monospace" textAnchor="middle">
                USB-UART
              </text>
            </g>

            {/* Reset Button */}
            <rect x="42" y="55" width="22" height="22" rx="3" fill="#2E3C50" stroke="#718BAA" strokeWidth="1" />
            <circle cx="53" cy="66" r="6" fill="#142238" />
            <text x="53" y="48" fill="#9AAAC0" fontSize="8" fontFamily="monospace" textAnchor="middle">RST</text>

            {/* Blue Activity LED */}
            <circle cx="270" cy="65" r="4" fill="#35D5F2" className="animate-ping opacity-75" />
            <circle cx="270" cy="65" r="3" fill="#528BFF" />
            <text x="270" y="52" fill="#35D5F2" fontSize="8" fontFamily="monospace" textAnchor="middle">TX/RX</text>
          </svg>
        </div>

        {/* Interactive Inspection Card */}
        <div className="mt-4 p-3.5 bg-[#080F1C] border border-[#1F314D] rounded-xl transition-all duration-200">
          {activeCallout ? (
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#35D5F2]">
                <Cpu className="w-3.5 h-3.5" />
                <span>{activeCallout.name}</span>
              </div>
              <p className="text-xs text-[#9AAAC0] mt-1 leading-relaxed">{activeCallout.desc}</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-[#9AAAC0]/90">
              <Terminal className="w-4 h-4 text-[#35D5F2]" />
              <span>Hover over any board component (Antenna, RF Shield, Chip, USB) to inspect specs.</span>
            </div>
          )}
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#1F314D]/60 text-[11px] text-center font-mono">
          <div className="p-1.5 bg-[#142238] rounded border border-[#1F314D]/40 text-[#9AAAC0]">
            <span className="block text-[#35D5F2] font-bold">80 KB</span> User RAM
          </div>
          <div className="p-1.5 bg-[#142238] rounded border border-[#1F314D]/40 text-[#9AAAC0]">
            <span className="block text-[#35D5F2] font-bold">4 MB</span> SPI Flash
          </div>
          <div className="p-1.5 bg-[#142238] rounded border border-[#1F314D]/40 text-[#9AAAC0]">
            <span className="block text-[#35D5F2] font-bold">TCP/IP</span> LwIP Stack
          </div>
        </div>
      </div>
    </div>
  );
};
