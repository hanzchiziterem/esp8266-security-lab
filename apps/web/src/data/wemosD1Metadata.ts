export interface ComponentMetadata {
  id: string;
  name: string;
  shortName: string;
  category: 'core' | 'power' | 'connectivity' | 'interface' | 'storage';
  role: string;
  description: string;
  specs: Record<string, string>;
  securityRelevance: string;
}

export interface PinMetadata {
  id: string;
  label: string;
  header: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  headerIndex: number;
  gpio?: number;
  type: 'digital' | 'analog' | 'power' | 'ground' | 'reset' | 'system';
  primaryFunction: string;
  altFunctions: string[];
  voltage: '3.3V' | '5.0V' | 'VIN' | 'GND' | '0-1.0V/3.3V';
  maxCurrent?: string;
  bootstrapping?: {
    requiredState: 'HIGH' | 'LOW' | 'FLOATING';
    description: string;
  };
  securityNote?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  hint: string;
  targetId: string; // matches component id or pin id
  targetType: 'component' | 'pin';
  explanation: string;
}

export const WEMOS_D1_COMPONENTS: Record<string, ComponentMetadata> = {
  esp8266_module: {
    id: 'esp8266_module',
    name: 'ESP-12F RF Microcontroller Module',
    shortName: 'ESP-12F Module',
    category: 'core',
    role: 'Central Processing & Wireless Subsystem',
    description:
      'Houses the Espressif ESP8266EX SoC with a 32-bit Tensilica Xtensa L106 RISC core (80/160 MHz) alongside 4 MB (32 Mbit) SPI Flash memory inside a shielded aluminum RF enclosure.',
    specs: {
      'CPU Core': 'Tensilica Xtensa L106 32-bit RISC @ 80 MHz (overclockable to 160 MHz)',
      'SRAM': '80 KB Data RAM + 32 KB Instruction RAM + 16 KB Cache',
      'Flash Memory': '4 MB (32 Mbit) SPI Flash (Winbond W25Q32 or equivalent)',
      'Wi-Fi': '802.11 b/g/n (up to 72.2 Mbps, 2.4 GHz)',
      'Operating Voltage': '3.0V – 3.6V (Nominal 3.3V)',
      'RF Power': '+19.5 dBm output @ 802.11b mode',
    },
    securityRelevance:
      'The core execution target for firmware auditing. Firmware vulnerabilities (e.g. buffer overflows in the LwIP TCP/IP stack) and exposed Wi-Fi credentials stored in plaintext in SPI flash are primary security risks.',
  },
  pcb_antenna: {
    id: 'pcb_antenna',
    name: '2.4 GHz Inverted-F PCB Trace Antenna',
    shortName: 'PCB Trace Antenna',
    category: 'connectivity',
    role: 'RF Transmission & Reception',
    description:
      'A copper-etched meandering Inverted-F Antenna (MIFA) tuned for 2.4 GHz ISM band operation (2412–2484 MHz). Designed to provide omnidirectional radiation with ~2 dBi peak gain without external antenna hardware.',
    specs: {
      'Frequency Range': '2412 MHz – 2484 MHz (Wi-Fi Channels 1–14)',
      'Antenna Type': 'Meandered Inverted-F (MIFA)',
      'Peak Gain': '~2.0 dBi',
      'Impedance': '50 Ω matched trace',
      'Standards': 'IEEE 802.11 b/g/n',
    },
    securityRelevance:
      'Radiates over-the-air signals vulnerable to passive wireless sniffing, 802.11 deauthentication frame injection, evil twin attacks, and RF signal fingerprinting.',
  },
  ch340g: {
    id: 'ch340g',
    name: 'CH340G USB-to-UART Bridge Controller',
    shortName: 'CH340G Serial IC',
    category: 'interface',
    role: 'Host Computer USB-Serial Communication',
    description:
      'WCH CH340G USB bus adapter chip in a 16-pin SOIC package. Converts USB data packets from the host into full-duplex asynchronous serial UART communication (TX/RX) with auto-reset circuit for programmatic bootloader flashing.',
    specs: {
      'Package': 'SOIC-16',
      'Baud Rates': '50 bps to 2 Mbps',
      'Clock Source': 'External 12.000 MHz crystal oscillator',
      'Flow Control': 'DTR / RTS signals wired to auto-reset transistor pair',
      'Interface': 'Full-speed USB 2.0 compatible',
    },
    securityRelevance:
      'Provides direct access to the UART bootloader and debug serial console. Attackers with physical access can dump flash firmware via esptool.py, extract Wi-Fi keys, or hijack debug serial shells.',
  },
  micro_usb: {
    id: 'micro_usb',
    name: 'Micro-USB Type-B Port',
    shortName: 'Micro-USB Port',
    category: 'interface',
    role: 'Power Delivery & Serial Data Interface',
    description:
      'Surface-mount Micro-USB receptacle supplying 5V DC power from a host computer or USB adapter while connecting the USB D+/D- data lines to the CH340G controller.',
    specs: {
      'Connector': 'USB 2.0 Micro-B Female',
      'Input Voltage': '5.0V DC (VBUS)',
      'Current Rating': 'Up to 1.5A',
      'Mounting': 'Through-hole anchor tabs + SMD data pins',
    },
    securityRelevance:
      'Physical entry vector for BadUSB keystroke injection attacks, unauthorized flashing, or power analysis attacks against the microcontroller.',
  },
  dc_barrel_jack: {
    id: 'dc_barrel_jack',
    name: 'External DC Barrel Power Jack',
    shortName: 'DC Power Jack',
    category: 'power',
    role: 'Wide-Input DC Power Supply',
    description:
      'Standard 5.5mm x 2.1mm center-positive DC power receptacle allowing the WeMos D1 board to operate autonomously from external 9V–24V DC power adapters or battery packs.',
    specs: {
      'Dimensions': '5.5 mm outer diameter, 2.1 mm center pin',
      'Polarity': 'Center positive (+), outer shell ground (-)',
      'Input Range': '9V to 24V DC (Recommended: 9V–12V)',
      'Reverse Protection': 'Integrated onboard protection diode',
    },
    securityRelevance:
      'Allows untethered long-term rogue AP deployment or rogue packet sniffing devices in physical penetration testing scenarios.',
  },
  reset_button: {
    id: 'reset_button',
    name: 'Tactile Reset Switch',
    shortName: 'RST Button',
    category: 'interface',
    role: 'Microcontroller Hardware Reset',
    description:
      'Momentary tactile push button wired directly to the ESP8266 active-low RST pin. Pressing it grounds the RST line, resetting the Tensilica CPU and restarting the firmware bootloader.',
    specs: {
      'Type': 'SPST Normally Open Tactile Switch',
      'Logic': 'Active LOW (pulled HIGH to 3.3V via 10k resistor)',
      'Debounce': 'Hardware RC filter on reset line',
    },
    securityRelevance:
      'Used to force a reboot into flash download mode (when paired with GPIO0 held LOW) or to disrupt running security monitoring firmware via physical glitching.',
  },
  voltage_regulator: {
    id: 'voltage_regulator',
    name: 'Dual-Stage Power Regulators & Buck Converter',
    shortName: 'Power Regulation System',
    category: 'power',
    role: 'DC Voltage Step-Down & Stabilization',
    description:
      'High-efficiency switching buck regulator (MP2307DN) converts 9V–24V DC input down to 5V, while an AMS1117-3.3 linear regulator drops 5V to the clean 3.3V rail required by the ESP8266 and Wi-Fi power amplifier.',
    specs: {
      'Buck Converter': 'Monolithic step-down converter (up to 3A output)',
      'LDO Regulator': 'AMS1117-3.3 (800mA max output current)',
      '3.3V Rail Ripple': '< 30 mV peak-to-peak under heavy RF load',
      'Protection': 'Thermal shutdown and current limiting',
    },
    securityRelevance:
      'Power supply glitching (briefly dropping the 3.3V rail) can cause instruction skips in the Tensilica processor, allowing bypass of cryptographic signature checks or password verification routines.',
  },
  inductor_4r7: {
    id: 'inductor_4r7',
    name: '4R7 Power Filtering Inductor',
    shortName: '4R7 Inductor',
    category: 'power',
    role: 'Buck Converter Energy Storage & EMI Suppression',
    description:
      'A 4.7 µH shielded surface-mount power inductor paired with the onboard switching regulator to store energy, smooth high-frequency ripple, and filter electromagnetic noise generated during Wi-Fi transmission bursts.',
    specs: {
      'Inductance': '4.7 µH (labeled 4R7)',
      'Type': 'Shielded wire-wound SMD inductor',
      'DC Resistance': '~ 40 mΩ',
      'Saturation Current': '> 2.5A',
    },
    securityRelevance:
      'Prevents power brownouts during 20 dBm RF transmission bursts, ensuring stability against denial-of-service through continuous RF packet transmission.',
  },
  capacitors: {
    id: 'capacitors',
    name: 'SMD Electrolytic & Ceramic Decoupling Capacitors',
    shortName: 'Filter Capacitors',
    category: 'power',
    role: 'Power Rail Decoupling & Bulk Energy Reservoir',
    description:
      'Two silver SMD aluminum electrolytic capacitors (100 µF) provide bulk charge buffering for sudden current spikes during Wi-Fi packet transmission (up to 300 mA pulses), preventing brownout resets.',
    specs: {
      'Bulk Capacitors': '2x 100 µF surface-mount aluminum electrolytic',
      'Decoupling': 'Multiple 100 nF ceramic capacitors near IC power pins',
      'Voltage Rating': '16V / 25V',
    },
    securityRelevance:
      'Inadequate capacitance leads to spontaneous resets during high-traffic security audits or continuous beacon flooding experiments.',
  },
  status_led: {
    id: 'status_led',
    name: 'Onboard Status & Activity LED',
    shortName: 'Status LED',
    category: 'interface',
    role: 'Visual Telemetry & Execution Indicator',
    description:
      'High-brightness surface-mount blue LED positioned beside the "D1 WiFi" silkscreen logo, connected to GPIO2 (active low) or TX/RX activity lines for visual debugging and packet transmission indicators.',
    specs: {
      'Color': 'Ice Blue (470 nm)',
      'Connection': 'GPIO2 (internal pullup) / TX Activity',
      'Polarity': 'Active LOW (LED lights when pin is driven LOW)',
    },
    securityRelevance:
      'Can be covertly hijacked in malicious firmware to act as an optical exfiltration beacon (morse code or optical data transmission) to bypass air-gapped networks.',
  },
  pin_headers: {
    id: 'pin_headers',
    name: 'Arduino Uno R3 Compatible Female Pin Headers',
    shortName: 'GPIO Headers',
    category: 'interface',
    role: 'Peripheral Expansion & Shield Connection',
    description:
      'Standard 2.54 mm (0.1 inch) pitch single/dual row female headers arranged in the classic Arduino Uno R3 footprint, exposing 11 digital I/O pins, 1 analog input (A0), 5V, 3.3V, VIN, and GND rails.',
    specs: {
      'Pitch': '2.54 mm (0.1 in)',
      'Layout': 'Arduino Uno R3 footprint',
      'Logic Level': '3.3V (NOT 5V tolerant on raw ESP8266 GPIOs)',
      'Max Current Per Pin': '12 mA recommended (15 mA absolute maximum)',
    },
    securityRelevance:
      'Physical attachment points for logic analyzers, hardware debuggers, sensor tapping, SPI bus sniffing, and rogue peripheral injection.',
  },
};

export const WEMOS_D1_PINS: PinMetadata[] = [
  // Left Side - Power & Analog (Top to Bottom: Power 8 pins, Analog 6 pins)
  {
    id: 'pin_vin',
    label: 'VIN',
    header: 'left-top',
    headerIndex: 0,
    type: 'power',
    primaryFunction: 'Raw External DC Input',
    altFunctions: ['Power Input (9V–24V)'],
    voltage: 'VIN',
    maxCurrent: 'Up to 2A (dependent on DC source)',
    securityNote: 'Connected directly to the DC barrel jack behind the polarity diode. Overvoltage can destroy regulators.',
  },
  {
    id: 'pin_gnd1',
    label: 'GND',
    header: 'left-top',
    headerIndex: 1,
    type: 'ground',
    primaryFunction: 'Common System Ground',
    altFunctions: ['Digital Ground', 'RF Ground Return'],
    voltage: 'GND',
    securityNote: 'Essential reference plane for logic analyzers and hardware sniffer probes.',
  },
  {
    id: 'pin_gnd2',
    label: 'GND',
    header: 'left-top',
    headerIndex: 2,
    type: 'ground',
    primaryFunction: 'Common System Ground',
    altFunctions: ['Digital Ground', 'Power Ground'],
    voltage: 'GND',
  },
  {
    id: 'pin_5v',
    label: '5V',
    header: 'left-top',
    headerIndex: 3,
    type: 'power',
    primaryFunction: 'Regulated 5.0V Power Output / Input',
    altFunctions: ['USB 5V Rail', 'Buck Converter Output Rail'],
    voltage: '5.0V',
    maxCurrent: '1A (USB) / 2A (External DC)',
    securityNote: 'Supplied directly from USB or buck regulator. Do NOT connect 5V logic directly to GPIO pins.',
  },
  {
    id: 'pin_3v3',
    label: '3.3V',
    header: 'left-top',
    headerIndex: 4,
    type: 'power',
    primaryFunction: 'Regulated 3.3V Microcontroller Rail',
    altFunctions: ['ESP8266 Core VDD', 'Sensor VCC'],
    voltage: '3.3V',
    maxCurrent: '800 mA max (AMS1117)',
    securityNote: 'Core rail for ESP8266. Can be monitored with an oscilloscope for power analysis and fault injection.',
  },
  {
    id: 'pin_rst',
    label: 'RST',
    header: 'left-top',
    headerIndex: 5,
    type: 'reset',
    primaryFunction: 'Hardware Reset (Active LOW)',
    altFunctions: ['Deep Sleep Wake (connect to D0/GPIO16)'],
    voltage: '3.3V',
    securityNote: 'Driving this pin LOW resets the processor. Attacking the reset line can cause denial of service or force bootloader entry.',
  },
  {
    id: 'pin_ioref',
    label: 'IOREF',
    header: 'left-top',
    headerIndex: 6,
    type: 'system',
    primaryFunction: 'I/O Reference Voltage (3.3V)',
    altFunctions: ['Shield Reference'],
    voltage: '3.3V',
  },
  {
    id: 'pin_nc',
    label: 'NC',
    header: 'left-top',
    headerIndex: 7,
    type: 'system',
    primaryFunction: 'Not Connected',
    altFunctions: [],
    voltage: '3.3V',
  },

  // Left Side - Analog Header (A0 - A5)
  {
    id: 'pin_a0',
    label: 'A0',
    header: 'left-bottom',
    headerIndex: 0,
    gpio: 17,
    type: 'analog',
    primaryFunction: 'Analog-to-Digital Converter (ADC0 / TOUT)',
    altFunctions: ['10-bit Successive Approximation ADC'],
    voltage: '0-1.0V/3.3V',
    securityNote: 'The only ADC input on ESP8266. Board includes a resistor divider (100k/220k) allowing 0–3.3V analog sensing range.',
  },
  {
    id: 'pin_a1',
    label: 'A1',
    header: 'left-bottom',
    headerIndex: 1,
    type: 'system',
    primaryFunction: 'NC / Unused on WeMos D1 R1',
    altFunctions: [],
    voltage: '3.3V',
  },
  {
    id: 'pin_a2',
    label: 'A2',
    header: 'left-bottom',
    headerIndex: 2,
    type: 'system',
    primaryFunction: 'NC / Unused on WeMos D1 R1',
    altFunctions: [],
    voltage: '3.3V',
  },
  {
    id: 'pin_a3',
    label: 'A3',
    header: 'left-bottom',
    headerIndex: 3,
    type: 'system',
    primaryFunction: 'NC / Unused on WeMos D1 R1',
    altFunctions: [],
    voltage: '3.3V',
  },
  {
    id: 'pin_a4',
    label: 'A4',
    header: 'left-bottom',
    headerIndex: 4,
    gpio: 4,
    type: 'digital',
    primaryFunction: 'Duplicate SDA (I2C Data)',
    altFunctions: ['GPIO4', 'I2C SDA', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_a5',
    label: 'A5',
    header: 'left-bottom',
    headerIndex: 5,
    gpio: 5,
    type: 'digital',
    primaryFunction: 'Duplicate SCL (I2C Clock)',
    altFunctions: ['GPIO5', 'I2C SCL', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },

  // Right Side - Digital Header High (D8 - D15 / AREF / GND)
  {
    id: 'pin_d15',
    label: 'D15 (SCL)',
    header: 'right-top',
    headerIndex: 0,
    gpio: 5,
    type: 'digital',
    primaryFunction: 'I2C SCL (Clock)',
    altFunctions: ['GPIO5', 'PWM', 'Interrupt'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'I2C bus clock line. I2C traffic can be sniffed or injected without encryption on typical IoT sensor setups.',
  },
  {
    id: 'pin_d14',
    label: 'D14 (SDA)',
    header: 'right-top',
    headerIndex: 1,
    gpio: 4,
    type: 'digital',
    primaryFunction: 'I2C SDA (Data)',
    altFunctions: ['GPIO4', 'PWM', 'Interrupt'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'I2C data line. Vulnerable to sensor spoofing and man-in-the-middle attacks on the I2C peripheral bus.',
  },
  {
    id: 'pin_aref',
    label: 'AREF',
    header: 'right-top',
    headerIndex: 2,
    type: 'system',
    primaryFunction: 'Analog Reference (NC)',
    altFunctions: [],
    voltage: '3.3V',
  },
  {
    id: 'pin_gnd3',
    label: 'GND',
    header: 'right-top',
    headerIndex: 3,
    type: 'ground',
    primaryFunction: 'Digital Ground',
    altFunctions: ['Reference Ground'],
    voltage: 'GND',
  },
  {
    id: 'pin_d13',
    label: 'D13 (SCK)',
    header: 'right-top',
    headerIndex: 4,
    gpio: 14,
    type: 'digital',
    primaryFunction: 'Hardware SPI Clock (HSCLK)',
    altFunctions: ['GPIO14', 'SPI SCK', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'SPI clock line. High-speed SPI transactions to sensors or display screens can be tapped here.',
  },
  {
    id: 'pin_d12',
    label: 'D12 (MISO)',
    header: 'right-top',
    headerIndex: 5,
    gpio: 12,
    type: 'digital',
    primaryFunction: 'Hardware SPI MISO (HSMISO)',
    altFunctions: ['GPIO12', 'SPI MISO', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'SPI Master-In-Slave-Out line. Attackers can tap this pin to read unencrypted data returned from peripherals.',
  },
  {
    id: 'pin_d11',
    label: 'D11 (MOSI)',
    header: 'right-top',
    headerIndex: 6,
    gpio: 13,
    type: 'digital',
    primaryFunction: 'Hardware SPI MOSI (HSMOSI)',
    altFunctions: ['GPIO13', 'SPI MOSI', 'UART0 CTS'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d10',
    label: 'D10 (SS)',
    header: 'right-top',
    headerIndex: 7,
    gpio: 15,
    type: 'digital',
    primaryFunction: 'Hardware SPI Chip Select (HCS)',
    altFunctions: ['GPIO15', 'Boot Strapping Pin', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    bootstrapping: {
      requiredState: 'LOW',
      description: 'CRITICAL BOOT PIN: GPIO15 must be pulled LOW during power-up. If held HIGH, chip enters SDIO boot mode and fails to boot firmware.',
    },
    securityNote: 'Pulling GPIO15 HIGH prevents the board from booting normal firmware, creating a simple physical denial-of-service attack.',
  },
  {
    id: 'pin_d9',
    label: 'D9',
    header: 'right-top',
    headerIndex: 8,
    gpio: 2,
    type: 'digital',
    primaryFunction: 'UART1 TX / Debug Telemetry / Onboard LED',
    altFunctions: ['GPIO2', 'TXD1 (Debug Output)', 'Boot Strapping Pin'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    bootstrapping: {
      requiredState: 'HIGH',
      description: 'CRITICAL BOOT PIN: GPIO2 must be pulled HIGH (or floating with internal pullup) at power-on to enable normal SPI Flash boot.',
    },
    securityNote: 'Transmits low-level ROM bootloader debug logs at 74880 baud during power-up. Can be monitored to inspect boot stages.',
  },
  {
    id: 'pin_d8',
    label: 'D8',
    header: 'right-top',
    headerIndex: 9,
    gpio: 0,
    type: 'digital',
    primaryFunction: 'Bootloader Mode Selector (FLASH)',
    altFunctions: ['GPIO0', 'UART Download Mode', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    bootstrapping: {
      requiredState: 'HIGH',
      description: 'CRITICAL BOOT PIN: Pulled HIGH for Normal Flash Execution. If grounded (LOW) at boot, ESP8266 enters UART ROM Bootloader mode for firmware flashing!',
    },
    securityNote: 'Grounded by esptool or an attacker to force the chip into ROM bootloader mode to dump or overwrite firmware via UART.',
  },

  // Right Side - Digital Header Low (D7 - D0)
  {
    id: 'pin_d7',
    label: 'D7',
    header: 'right-bottom',
    headerIndex: 0,
    gpio: 13,
    type: 'digital',
    primaryFunction: 'General Purpose I/O / SPI MOSI',
    altFunctions: ['GPIO13', 'HSPI MOSI', 'UART0 CTS'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d6',
    label: 'D6',
    header: 'right-bottom',
    headerIndex: 1,
    gpio: 12,
    type: 'digital',
    primaryFunction: 'General Purpose I/O / SPI MISO',
    altFunctions: ['GPIO12', 'HSPI MISO', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d5',
    label: 'D5',
    header: 'right-bottom',
    headerIndex: 2,
    gpio: 14,
    type: 'digital',
    primaryFunction: 'General Purpose I/O / SPI Clock',
    altFunctions: ['GPIO14', 'HSPI SCK', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d4',
    label: 'D4',
    header: 'right-bottom',
    headerIndex: 3,
    gpio: 4,
    type: 'digital',
    primaryFunction: 'I2C SDA (Data Line)',
    altFunctions: ['GPIO4', 'I2C SDA', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d3',
    label: 'D3',
    header: 'right-bottom',
    headerIndex: 4,
    gpio: 5,
    type: 'digital',
    primaryFunction: 'I2C SCL (Clock Line)',
    altFunctions: ['GPIO5', 'I2C SCL', 'PWM'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
  },
  {
    id: 'pin_d2',
    label: 'D2',
    header: 'right-bottom',
    headerIndex: 5,
    gpio: 16,
    type: 'digital',
    primaryFunction: 'Deep Sleep Wake Pin (XPD_DCDC)',
    altFunctions: ['GPIO16', 'RTC Wake Trigger'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'Connected to the RTC power domain. Bridging D2 (GPIO16) to the RST pin enables automatic wake-up cycles from ultra-low-power Deep Sleep mode.',
  },
  {
    id: 'pin_d1',
    label: 'D1 (TX)',
    header: 'right-bottom',
    headerIndex: 6,
    gpio: 1,
    type: 'digital',
    primaryFunction: 'UART0 Transmit (TXD0)',
    altFunctions: ['GPIO1', 'Serial Print Output'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'Hardware serial TX line connected to the CH340G USB converter. Transmits all application Serial.print() statements in plaintext.',
  },
  {
    id: 'pin_d0',
    label: 'D0 (RX)',
    header: 'right-bottom',
    headerIndex: 7,
    gpio: 3,
    type: 'digital',
    primaryFunction: 'UART0 Receive (RXD0)',
    altFunctions: ['GPIO3', 'Serial Command Input'],
    voltage: '3.3V',
    maxCurrent: '12 mA',
    securityNote: 'Hardware serial RX line. Can be injected with malicious commands or shell input if a serial CLI interface is enabled.',
  },
];

export const WEMOS_D1_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Find the USB-to-UART bridge chip that converts host USB packets into serial communication for flashing.',
    hint: 'Look for a 16-pin small-outline integrated circuit (SOIC) near the Micro-USB port.',
    targetId: 'ch340g',
    targetType: 'component',
    explanation: 'Correct! The CH340G IC converts USB signals to UART TX/RX lines and controls automatic reset into bootloader mode.',
  },
  {
    id: 'q2',
    question: 'Locate the Inverted-F PCB trace antenna used for 2.4 GHz 802.11 b/g/n Wi-Fi communication.',
    hint: 'Look for the golden meandering copper trace at the bottom or edge of the ESP-12F RF module.',
    targetId: 'pcb_antenna',
    targetType: 'component',
    explanation: 'Spot on! The meandering Inverted-F Antenna (MIFA) is tuned for 2.4 GHz wireless signals and provides omnidirectional coverage.',
  },
  {
    id: 'q3',
    question: 'Identify the shielded metal can that houses the 32-bit Tensilica L106 CPU and 4 MB SPI Flash.',
    hint: 'Look for the large silver rectangular RF shield located centrally on the board.',
    targetId: 'esp8266_module',
    targetType: 'component',
    explanation: 'Excellent! The ESP-12F module contains the ESP8266EX SoC and 4 MB SPI flash underneath electromagnetic shielding.',
  },
  {
    id: 'q4',
    question: 'Locate the hardware boot strapping pin D8 (GPIO0), which must be held LOW to enter UART firmware download mode.',
    hint: 'Look on the top right digital header for pin D8.',
    targetId: 'pin_d8',
    targetType: 'pin',
    explanation: 'Bullseye! GPIO0 (D8) dictates the boot mode: HIGH boots from SPI flash, while pulling it LOW forces the ESP8266 into ROM bootloader mode for flashing or dumping firmware.',
  },
  {
    id: 'q5',
    question: 'Find the external DC barrel jack that accepts 9V to 24V power for untethered deployments.',
    hint: 'Look at the top-left corner of the board for the large black cylindrical power connector.',
    targetId: 'dc_barrel_jack',
    targetType: 'component',
    explanation: 'Correct! The 5.5mm x 2.1mm DC barrel connector enables long-term autonomous power through an onboard step-down buck converter.',
  },
  {
    id: 'q6',
    question: 'Locate the hardware serial Transmit pin D1 (TX/GPIO1) used to output firmware debug logs.',
    hint: 'Check the bottom right digital header for the pin labeled D1.',
    targetId: 'pin_d1',
    targetType: 'pin',
    explanation: 'Great job! D1 is UART0 TX, which broadcasts boot logs and application serial telemetry to the USB converter.',
  },
  {
    id: 'q7',
    question: 'Locate the tactile momentary switch used to manually trigger a hardware CPU reset.',
    hint: 'Find the push button with a metal frame and round black button cap near the top edge.',
    targetId: 'reset_button',
    targetType: 'component',
    explanation: 'Accurate! The reset button pulls the RST line to ground, causing an immediate hardware reset of the microcontroller.',
  },
];
