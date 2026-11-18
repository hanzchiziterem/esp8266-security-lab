export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: 'done' | 'next' | 'planned';
  path?: string;
  isOptional?: boolean;
}

export interface Module {
  id: number;
  title: string;
  tagline: string;
  safetyScope: 'Full Hands-on' | 'Concept & Detection Only' | 'Safe Demo Only' | 'Simulation Only';
  status: 'in-progress' | 'planned';
  description: string;
  lessons: Lesson[];
}

export const CURRICULUM: Module[] = [
  {
    id: 1,
    title: 'Understanding the ESP8266 Attack Surface',
    tagline: 'Network Architecture, Operating Modes & Reconnaissance',
    safetyScope: 'Full Hands-on',
    status: 'in-progress',
    description: 'Learn how low-power microcontrollers communicate on modern IP networks, analyze their Layer 2/3 footprint, and observe baseline unauthenticated exposure.',
    lessons: [
      {
        id: '1.1',
        title: 'Lesson 1: The ESP8266 Attack Surface',
        description: 'Wi-Fi architecture, STA vs AP mode, MAC/OUI fingerprinting, ARP discovery, port checks, Wireshark traffic inspection, and Nmap OS ambiguity.',
        status: 'done',
        path: '/module_1/lesson_1',
      },
      {
        id: '1.2',
        title: 'Lesson 2: Why the ESP8266 Becomes a Vulnerability by Default',
        description: 'Insecure defaults in IoT SDKs, rogue device categories (client, evil twin, bridge), SoftAP mode observation, and DHCP lease tracking.',
        status: 'done',
        path: '/module_1/lesson_2',
      },
      {
        id: '1.3',
        title: 'Lesson 3: AP+STA Dual Mode (Bridging Preparation)',
        description: 'Dual-interface operation: running both a Station client connection and an Access Point concurrently, bridging two subnets.',
        status: 'next',
        path: '/module_1/lesson_3',
        isOptional: true,
      },
    ],
  },
  {
    id: 2,
    title: 'Wi-Fi Deauthentication Attacks',
    tagline: '802.11 Management Frames, PMF & Attack Detection',
    safetyScope: 'Concept & Detection Only',
    status: 'planned',
    description: 'Strictly concept and detection. Learn why 802.11 management frames are unauthenticated by default, how 802.11w Protected Management Frames (PMF) mitigate attacks, and how to spot deauth frames in Wireshark.',
    lessons: [
      {
        id: '2.1',
        title: 'Lesson 1: 802.11 Management Frames & The Deauth Mechanism',
        description: 'Frame dissecting, Wireshark filter (wlan.fc.type_subtype == 0x0c), and 802.11w cryptographic closure.',
        status: 'planned',
      },
      {
        id: '2.2',
        title: 'Lesson 2: Detecting Disconnection Patterns & Router Hardening',
        description: 'Recognizing flood patterns, router PMF configuration, and defense strategies.',
        status: 'planned',
      },
    ],
  },
  {
    id: 3,
    title: 'Evil Twin and Rogue Access Points',
    tagline: 'Wireless Trust Gaps, SSID Spoofing & Vendor Verification',
    safetyScope: 'Safe Demo Only',
    status: 'planned',
    description: 'Understand the psychological and protocol mechanisms behind evil twins. Broadcast a clearly labeled test network without credential harvesting, and evaluate detection metrics.',
    lessons: [
      {
        id: '3.1',
        title: 'Lesson 1: Wireless Trust Mechanics & Captive Portals in Abstract',
        description: 'SSID-based client trust, auto-association vulnerabilities, and theoretical captive portal flows.',
        status: 'planned',
      },
      {
        id: '3.2',
        title: 'Lesson 2: Lab: Isolated Test AP & Multi-Factor Detection',
        description: 'Broadcasting *-TEST AP, status verification, BSSID/vendor mismatch detection, and signal anomalies.',
        status: 'planned',
      },
    ],
  },
  {
    id: 4,
    title: 'Packet Sniffing and Wireless Traffic Analysis',
    tagline: 'Promiscuous Modes, MQTT Streams & TLS Comparison',
    safetyScope: 'Full Hands-on',
    status: 'planned',
    description: 'Examine packet transmission mechanics on microcontrollers. Compare plaintext HTTP and unencrypted MQTT against TLS-encrypted streams in Wireshark.',
    lessons: [
      {
        id: '4.1',
        title: 'Lesson 1: Cleartext HTTP & Network Sniffing Fundamentals',
        description: 'Promiscuous mode limits on microcontrollers, packet capture analysis, and data leak visualization.',
        status: 'planned',
      },
      {
        id: '4.2',
        title: 'Lesson 2: MQTT Telemetry Inspection vs HTTPS / TLS',
        description: 'Broker communication, cleartext topic subscriptions, and cryptographic packet payload protection.',
        status: 'planned',
      },
    ],
  },
  {
    id: 5,
    title: 'Network Pivoting and Rogue IoT Devices',
    tagline: 'Lateral Movement, Perimeter Bypass & Segmentation',
    safetyScope: 'Simulation Only',
    status: 'planned',
    description: 'Explore how a compromised peripheral device becomes a foothold for pivoting into internal subnets. Simulate isolated network topologies with strict firewall segmentation.',
    lessons: [
      {
        id: '5.1',
        title: 'Lesson 1: Lateral Movement & IoT Perimeter Footholds',
        description: 'Bridging internal/external trust zones, IP forwarding concepts, and enterprise risk models.',
        status: 'planned',
      },
      {
        id: '5.2',
        title: 'Lesson 2: Simulated Topology & Defensive VLAN Segmentation',
        description: 'Isolating vulnerable IoT nodes in dedicated VLANs to prevent lateral compromise.',
        status: 'planned',
      },
    ],
  },
  {
    id: 6,
    title: 'Hardcoded Credentials and Firmware Security',
    tagline: 'Flash Memory Layout, Reverse Engineering & Secret Management',
    safetyScope: 'Full Hands-on',
    status: 'planned',
    description: 'Inspect compiled binaries to understand where sensitive strings reside. Learn firmware extraction concepts and implement secure secret management outside of version control.',
    lessons: [
      {
        id: '6.1',
        title: 'Lesson 1: Binary Inspection & Flash String Extraction',
        description: 'Where credentials reside in compiled binaries, strings analysis, and firmware reverse engineering.',
        status: 'planned',
      },
      {
        id: '6.2',
        title: 'Lesson 2: Secure Secret Management & Hardening Limits',
        description: 'Using WiFiManager, external secrets headers, and hardware security limitations on low-cost silicon.',
        status: 'planned',
      },
    ],
  },
  {
    id: 7,
    title: 'Insecure OTA Firmware Updates',
    tagline: 'Remote Flashing, Protocol Verification & Mutual Authentication',
    safetyScope: 'Full Hands-on',
    status: 'planned',
    description: 'Analyze how Over-The-Air (OTA) updates operate on ESP8266. Contrast unauthenticated remote flash ports with cryptographically verified, password-protected updates.',
    lessons: [
      {
        id: '7.1',
        title: 'Lesson 1: Over-The-Air Update Mechanics & Port 8266 Risks',
        description: 'Network flashing mechanics, unauthenticated socket listening, and malicious binary injection risks.',
        status: 'planned',
      },
      {
        id: '7.2',
        title: 'Lesson 2: Implementing Authenticated & Hardened OTA',
        description: 'Side-by-side comparison of insecure vs authenticated OTA with cryptographic validation.',
        status: 'planned',
      },
    ],
  },
  {
    id: 8,
    title: 'Exposed Web Interfaces and IoT Authentication',
    tagline: 'HTTP Server Internals, Session Handling & Access Control',
    safetyScope: 'Full Hands-on',
    status: 'planned',
    description: 'Build a comprehensive embedded web server for hardware control. Compare unauthenticated control panels against robust token-based and password-authenticated endpoints.',
    lessons: [
      {
        id: '8.1',
        title: 'Lesson 1: Embedded HTTP Server Internals & Unauthenticated Controls',
        description: 'Handling GET/POST requests, query parameters, actuator control, and unauthenticated hazards.',
        status: 'planned',
      },
      {
        id: '8.2',
        title: 'Lesson 2: Adding Session Security, Input Validation & Access Control',
        description: 'Digest/token authentication, request sanitization, and defensive HTTP headers on microcontrollers.',
        status: 'planned',
      },
    ],
  },
];
