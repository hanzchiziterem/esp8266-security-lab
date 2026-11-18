export interface PlatformStat {
  label: string;
  value: string;
  subtext: string;
  isRealMetric: true;
}

export const PLATFORM_STATS: PlatformStat[] = [
  {
    label: 'Course Modules',
    value: '8',
    subtext: 'Structured curriculum covering Layer 2 to Layer 7 IoT security',
    isRealMetric: true,
  },
  {
    label: 'Practical Lessons',
    value: '17',
    subtext: 'Hands-on hardware labs, Wireshark traces, and defensive walk-throughs',
    isRealMetric: true,
  },
  {
    label: 'Target Hardware',
    value: 'ESP8266 / WeMos D1',
    subtext: '80MHz 32-bit Tensilica L106 microcontroller with 80KB user RAM',
    isRealMetric: true,
  },
  {
    label: 'Licensing & Cost',
    value: '100% Free & Open Source',
    subtext: 'Openly documented and accessible on GitHub for every learner',
    isRealMetric: true,
  },
];
