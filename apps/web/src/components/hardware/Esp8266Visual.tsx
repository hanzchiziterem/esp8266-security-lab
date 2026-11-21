import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Terminal,
  ShieldAlert,
  Box,
  Layers,
} from 'lucide-react';
import { Hardware3DExplorer, ExplorerMode } from './Hardware3DExplorer';
import {
  ComponentMetadata,
  PinMetadata,
  WEMOS_D1_COMPONENTS,
} from '../../data/wemosD1Metadata';

// Detect WebGL capability safely in browser
function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const Esp8266Visual: React.FC = () => {
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [explorerMode, setExplorerMode] = useState<ExplorerMode>('explore');

  // Currently inspected component or pin
  const [activeComponent, setActiveComponent] = useState<ComponentMetadata | null>(
    WEMOS_D1_COMPONENTS['pcb_antenna'] // default to antenna to preserve original landing presentation
  );
  const [activePin, setActivePin] = useState<PinMetadata | null>(null);

  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebGLSupported(supported);
    if (!supported) {
      setViewMode('2d');
    }
  }, []);

  const handleSelectComponent = (comp: ComponentMetadata | null) => {
    setActiveComponent(comp);
    setActivePin(null);
  };

  const handleSelectPin = (pin: PinMetadata | null) => {
    setActivePin(pin);
    setActiveComponent(null);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Decorative Cybernetic Background Glow (Preserved from original design) */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#35D5F2]/20 via-[#528BFF]/15 to-transparent rounded-3xl blur-2xl opacity-60 pointer-events-none" />

      {/* Main Board Container (Preserved visual container, border and colors) */}
      <div className="relative bg-[#0E1B2E]/90 border border-[#1F314D] rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md">
        {/* Header Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1F314D]/80 mb-4 text-xs font-mono gap-2">
          {/* Status Indicator & Title */}
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[#F3F7FC] font-semibold tracking-wider">HARDWARE SPECIFICATION</span>
          </div>

          {/* Right Header Controls: 2D/3D Switcher & Board Badge */}
          <div className="flex items-center space-x-2">
            {webGLSupported && (
              <div className="flex items-center bg-[#101E33] border border-[#1F314D] p-0.5 rounded-lg text-[11px]">
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center space-x-1 ${
                    viewMode === '3d'
                      ? 'bg-[#1D3B63] text-[#35D5F2] font-semibold shadow-inner'
                      : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
                  }`}
                  title="Interactive 3D Hardware Model"
                >
                  <Box className="w-3 h-3" />
                  <span>3D</span>
                </button>
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center space-x-1 ${
                    viewMode === '2d'
                      ? 'bg-[#1D3B63] text-[#35D5F2] font-semibold shadow-inner'
                      : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
                  }`}
                  title="Schematic 2D Vector View"
                >
                  <Layers className="w-3 h-3" />
                  <span>2D</span>
                </button>
              </div>
            )}

            <span className="bg-[#142238] border border-[#1F314D] px-2.5 py-0.5 rounded text-[#35D5F2] font-medium">
              WeMos D1 (ESP8266)
            </span>
          </div>
        </div>

        {/* Central Display: Interactive 3D Model OR 2D Fallback */}
        {viewMode === '3d' && webGLSupported ? (
          <div className="py-1">
            <Hardware3DExplorer
              activeMode={explorerMode}
              onModeChange={setExplorerMode}
              onSelectComponent={handleSelectComponent}
              onSelectPin={handleSelectPin}
            />
          </div>
        ) : (
          /* High-Fidelity 2D SVG Board Graphic (Preserved as fallback) */
          <div className="relative flex justify-center py-2">
            <svg
              viewBox="0 0 340 440"
              className="w-full max-w-[320px] drop-shadow-xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* PCB Substrate */}
              <rect x="20" y="20" width="300" height="400" rx="14" fill="#0A1626" stroke="#1F3654" strokeWidth="2.5" />
              <rect x="28" y="28" width="284" height="384" rx="10" fill="#07101C" />
              <path d="M 40 40 L 40 400 M 300 40 L 300 400" stroke="#14263D" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 60 140 L 120 140 L 120 220 L 180 220" stroke="#1A3352" strokeWidth="1.5" />
              <path d="M 280 280 L 220 280 L 220 320" stroke="#1A3352" strokeWidth="1.5" />

              {/* Left Header Pins */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <g key={`pin-l-${i}`} onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['pin_headers'])}>
                  <circle cx="38" cy={110 + i * 32} r="9" fill="#101F33" stroke="#35D5F2" strokeWidth="1" />
                  <circle cx="38" cy={110 + i * 32} r="4" fill="#E2B13C" />
                </g>
              ))}

              {/* Right Header Pins */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <g key={`pin-r-${i}`} onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['pin_headers'])}>
                  <circle cx="302" cy={110 + i * 32} r="9" fill="#101F33" stroke="#35D5F2" strokeWidth="1" />
                  <circle cx="302" cy={110 + i * 32} r="4" fill="#E2B13C" />
                </g>
              ))}

              {/* Top Wi-Fi Inverted-F Meandering PCB Trace Antenna */}
              <g
                className="cursor-pointer transition-transform hover:scale-105"
                onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['pcb_antenna'])}
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
                onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['esp8266_module'])}
              >
                <rect x="85" y="100" width="170" height="150" rx="6" fill="#1A293E" stroke="#718BAA" strokeWidth="2" />
                <rect x="92" y="107" width="156" height="136" rx="4" fill="#132032" stroke="#324B6B" strokeWidth="1" />
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
                onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['ch340g'])}
              >
                <rect x="135" y="275" width="70" height="42" rx="3" fill="#0C1522" stroke="#35D5F2" strokeWidth="1.2" />
                <text x="170" y="299" fill="#9AAAC0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  CH340G
                </text>
                {[-2, -1, 0, 1, 2].map((p) => (
                  <g key={`chip-pin-${p}`}>
                    <line x1={170 + p * 12} y1="270" x2={170 + p * 12} y2="275" stroke="#9AAAC0" strokeWidth="2" />
                    <line x1={170 + p * 12} y1="317" x2={170 + p * 12} y2="322" stroke="#9AAAC0" strokeWidth="2" />
                  </g>
                ))}
              </g>

              {/* Micro-USB Port */}
              <g
                className="cursor-pointer"
                onMouseEnter={() => setActiveComponent(WEMOS_D1_COMPONENTS['micro_usb'])}
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
        )}

        {/* Dynamic Contextual Specification Card */}
        <div className="mt-4 p-4 bg-[#080F1C] border border-[#1F314D] rounded-xl transition-all duration-200">
          {activeComponent ? (
            <div>
              {/* Component Header */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#35D5F2] mb-1">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[#35D5F2]" />
                  <span className="text-sm font-bold text-[#F3F7FC]">{activeComponent.name}</span>
                </div>
                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-[#102238] border border-[#1F3858] text-[#528BFF] font-mono">
                  {activeComponent.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#9AAAC0] mt-1 leading-relaxed">
                {activeComponent.description}
              </p>

              {/* Specs Pills */}
              {activeComponent.specs && Object.keys(activeComponent.specs).length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[#1F314D]/50 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {Object.entries(activeComponent.specs).slice(0, 3).map(([key, value]) => (
                    <span key={key} className="px-2 py-0.5 rounded bg-[#101D30] text-[#9AAAC0] border border-[#1A2E47]">
                      <span className="text-[#35D5F2] font-semibold">{key}:</span> {value}
                    </span>
                  ))}
                </div>
              )}

              {/* Security Relevance Callout */}
              {activeComponent.securityRelevance && (
                <div className="mt-2 text-[11px] text-[#A5B9CF] bg-[#0E1C2E] p-2 rounded-lg border border-[#1D3654] flex items-start space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#35D5F2] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-[#35D5F2]">Security Audit Relevance:</strong> {activeComponent.securityRelevance}
                  </span>
                </div>
              )}
            </div>
          ) : activePin ? (
            <div>
              {/* Pin Header */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#35D5F2] mb-1">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#35D5F2]" />
                  <span className="text-sm font-bold text-[#F3F7FC]">{activePin.label}</span>
                  {activePin.gpio !== undefined && (
                    <span className="text-xs font-mono text-[#35D5F2] bg-[#10243C] px-2 py-0.5 rounded">
                      GPIO{activePin.gpio}
                    </span>
                  )}
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#102238] border border-[#1F3858] text-[#528BFF] font-mono">
                  {activePin.voltage}
                </span>
              </div>

              {/* Primary Function */}
              <p className="text-xs text-[#9AAAC0] mt-1 leading-relaxed">
                <span className="text-[#F3F7FC] font-medium">Primary Role:</span> {activePin.primaryFunction}
              </p>

              {/* Bus capabilities */}
              {activePin.altFunctions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                  {activePin.altFunctions.map((fn) => (
                    <span key={fn} className="px-2 py-0.5 rounded bg-[#122338] text-[#35D5F2] border border-[#1E3858]">
                      {fn}
                    </span>
                  ))}
                </div>
              )}

              {/* Bootstrapping Warning */}
              {activePin.bootstrapping && (
                <div className="mt-2 text-[11px] text-amber-200 bg-amber-950/40 p-2 rounded-lg border border-amber-600/50 flex items-start space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-amber-400">Boot Strap Requirement:</strong> {activePin.bootstrapping.description}
                  </span>
                </div>
              )}

              {/* Security Note */}
              {activePin.securityNote && !activePin.bootstrapping && (
                <div className="mt-2 text-[11px] text-[#A5B9CF] bg-[#0E1C2E] p-2 rounded-lg border border-[#1D3654] flex items-start space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#35D5F2] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="text-[#35D5F2]">Security Note:</strong> {activePin.securityNote}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-[#9AAAC0]/90">
              <Terminal className="w-4 h-4 text-[#35D5F2]" />
              <span>Rotate, zoom, or click any component or header pin to inspect technical specifications.</span>
            </div>
          )}
        </div>

        {/* Specs Badges (Preserved exactly as requested) */}
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
