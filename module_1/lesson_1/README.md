# Module 1 - Lesson 1: The ESP8266 Attack Surface

## Overview & Conceptual Explanation

Every networked device has an **attack surface**—the sum of all reachable points where an unauthorized user or outsider can probe, interact with, or inject data into the system.

On a general-purpose computer or server, that surface is extensive: dozens of running background services, full operating system daemons, multi-user privileges, and active browsers. In contrast, the ESP8266 appears deceptively simple: it is a **single-core 32-bit microcontroller with ~80 KB of user RAM**. 

Despite these resource constraints, the ESP8266 presents a significant attack surface in IoT environments due to three key factors:

1. **Full TCP/IP Network Stack**: Despite being a low-power microcontroller, the Espressif SDK implements a real, functional network stack (LwIP). When a socket is opened, the ESP8266 behaves like any other host on the network: it responds to ARP requests, replies to ICMP pings, and accepts incoming TCP/UDP connections on open ports.
2. **Lack of Lifecycle Security & Patching**: While consumer laptops receive automated operating system and security updates, embedded IoT hardware rarely does. Firmware flashed during initial development typically remains unchanged throughout the device's operational lifespan.
3. **Trust-Zone Bridging**: The microcontroller connects to a local Wi-Fi network (trusted internal zone), yet often hosts unauthenticated HTTP endpoints or debug services accessible to any device on the LAN, while simultaneously communicating with cloud servers over the internet. This dual exposure makes IoT nodes prime targets for network pivoting (explored in depth in Module 5).

---

## Abbreviations & Glossary

To keep the technical guides concise, standard industry acronyms are defined below for quick reference:

| Abbreviation | Full Name | Definition / Context |
| :--- | :--- | :--- |
| **AP** | Access Point | Mode where the ESP8266 broadcasts its own Wi-Fi network for clients to join. |
| **ARP** | Address Resolution Protocol | Maps IP network addresses to physical MAC hardware addresses on a local subnet. |
| **BSSID** | Basic Service Set Identifier | The physical MAC address of a wireless router or access point radio. |
| **CVE** | Common Vulnerabilities and Exposures | A publicly cataloged database of disclosed software and firmware security flaws. |
| **DHCP** | Dynamic Host Configuration Protocol | Automatically assigns IP addresses and network configuration to client devices. |
| **HTTP** | Hypertext Transfer Protocol | Plaintext application-level protocol used for serving web pages and APIs. |
| **ICMP** | Internet Control Message Protocol | Network protocol used for network diagnostics (e.g., `ping`). |
| **IDE** | Integrated Development Environment | Development application used to write, compile, and upload code (Arduino IDE). |
| **IoT** | Internet of Things | Physical hardware devices embedded with sensors, processing, and network connectivity. |
| **LAN** | Local Area Network | A private network interconnecting computers and devices within a limited area. |
| **MAC** | Media Access Control | A 48-bit unique hardware address burned into a network interface chip. |
| **MQTT** | Message Queuing Telemetry Transport | Lightweight publish-subscribe messaging protocol designed for constrained IoT devices. |
| **NIC** | Network Interface Card | Hardware network adapter used to connect a machine to a network. |
| **OTA** | Over-The-Air | Wireless mechanism for flashing and updating device firmware remotely. |
| **OUI** | Organizationally Unique Identifier | The first 3 octets (24 bits) of a MAC address that identifies the hardware manufacturer. |
| **RAM** | Random Access Memory | Volatile working memory available to the processor (~80 KB on ESP8266). |
| **RSSI** | Received Signal Strength Indicator | Measurement of wireless signal strength received by the antenna, expressed in negative dBm. |
| **SDK** | Software Development Kit | Set of libraries and toolchains used to build software for the microcontroller. |
| **SSID** | Service Set Identifier | The human-readable name of a Wi-Fi network. |
| **STA** | Station | Client mode where the ESP8266 connects to an existing external Wi-Fi network. |
| **TCP/IP** | Transmission Control Protocol / Internet Protocol | The foundational communication protocol suite of the internet and local networks. |
| **UDP** | User Datagram Protocol | Lightweight, connectionless transport protocol without delivery guarantees. |
| **USB** | Universal Serial Bus | Physical cable interface used for serial flashing, power, and console debugging. |
| **WSL** | Windows Subsystem for Linux | Compatibility environment allowing native Linux binary execution on Windows. |

---

## Lab Requirements

### Hardware
- **ESP8266 Development Board**: WeMos D1 (or D1 Mini).
- **USB Cable**: Micro-USB data cable (ensure it supports data transfer, not power-only).
- **Wi-Fi Router**: 2.4 GHz personal or dedicated lab Wi-Fi network (ESP8266 does not support 5 GHz).
- **Computer**: Laptop running Windows (or Linux/macOS with equivalent terminal utilities).

### Software
- **[Arduino IDE](https://www.arduino.cc/en/software)** (v2.x recommended) with ESP8266 board support installed.
- **[Wireshark](https://www.wireshark.org/#download)** (with Npcap installed for packet capture).
- **[Nmap](https://nmap.org/download#windows)** (includes Zenmap GUI on Windows).

---

## The Attacker Perspective

When assessing a network containing an embedded ESP8266 device, an attacker works through a methodical reconnaissance checklist:

1. **Operating Mode (AP vs. STA)**: Is the device currently in Access Point (AP) mode or Station (STA) mode? If AP mode is enabled, it broadcasts an SSID over the air, allowing discovery and wireless probing without needing access to the existing internal LAN. *(In this lab exercise, we configure the device strictly in STA mode; see [main/main.ino](main/main.ino#L34)).*
2. **MAC Address & OUI Fingerprinting**: The first 3 octets of any MAC address represent the manufacturer's OUI. Espressif OUI allocations are publicly registered. An attacker scanning a network can instantly recognize an Espressif IoT device before directly interacting with it.
3. **Open Port Profiling**: A rapid port scan of the local subnet exposes open listening sockets—such as web configuration servers (port 80), MQTT services (port 1883), or raw OTA firmware upload listeners (port 8266).
4. **Information Leakage via Unauthenticated Endpoints**: Minimal HTTP servers often serve telemetry (MAC, internal IP, uptime, RSSI) or firmware banners without requiring authentication. These headers and endpoints expose software versions, helping attackers identify matching CVEs.
5. **Cleartext Transport**: If network communications occur over unencrypted HTTP or raw TCP sockets, network sniffing exposes all device data and command structures without needing to exploit the firmware directly.

> [!NOTE]
> None of these techniques require exotic exploits. They represent standard host reconnaissance. Constrained IoT microcontrollers frequently expose these details out-of-the-box due to insecure defaults.

---

## Technical Breakdown: Wi-Fi Operating Modes

The ESP8266 Wi-Fi radio operates in one of three primary configurations:

- **Station (STA) Mode**: The ESP8266 acts as a standard Wi-Fi client (similar to a phone or laptop). It associates with an existing Wi-Fi network, receives an IP address via DHCP from the router, and communicates across the local LAN and internet.
- **Access Point (AP) Mode**: The ESP8266 acts as the Wi-Fi host. It broadcasts its own SSID and runs an internal DHCP server. External devices connect directly to the ESP8266. This mode is commonly used during initial out-of-the-box device onboarding.
- **AP + STA Dual Mode**: Both interfaces run concurrently. The ESP8266 joins an upstream network while simultaneously hosting its own wireless network. This architecture can act as a bridge between two physical network segments, serving as a pivot target during penetration testing.

### Network Identifiers Reference Table

| Term | Technical Role | Security & Reconnaissance Relevance |
| :--- | :--- | :--- |
| **MAC Address** | 48-bit hardware identifier burned into the Wi-Fi radio chip. | Identifies hardware vendor via OUI; used for Layer 2 ARP routing; vulnerable to spoofing. |
| **IP Address** | Logical Layer 3 address assigned by DHCP (STA mode) or self-assigned (AP mode). | Specifies the network destination for packet transmission and scanning. |
| **Port** | 16-bit address identifying a distinct application or service on the host. | Reveals running network services (e.g., port 80 for HTTP, port 1883 for MQTT). |
| **Protocol** | Set of rules governing packet framing and transmission (TCP, UDP, HTTP, ICMP). | Determines message predictability, handshake behavior, and whether payloads are encrypted. |

---

## Practical Laboratory Exercise

> **Objective**: Flash a minimal STA-mode sketch to your WeMos D1 board, then use administrative and security tools on your laptop to analyze its network footprint (MAC, IP, open ports, and cleartext traffic) from an attacker's perspective.

### Source Code
The complete sketch for this lesson is located in [main/main.ino](main/main.ino).

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <secrets.h>

ESP8266WebServer server(80);

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP8266 Recon Target</h1>";
  html += "<p>MAC: " + WiFi.macAddress() + "</p>";
  html += "<p>IP: " + WiFi.localIP().toString() + "</p>";
  html += "<p>RSSI: " + String(WiFi.RSSI()) + " dBm</p>";
  html += "<p>Uptime (ms): " + String(millis()) + "</p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}
```

---

### Step-by-Step Installation & Setup

#### Step 1: Install CH340 USB-to-Serial Drivers
Most WeMos D1 and D1 Mini development boards utilize a CH340 USB-to-UART bridge controller. If your operating system does not automatically detect the board when plugged in, install the appropriate CH340 driver for Windows.

#### Step 2: Configure ESP8266 Board Index in Arduino IDE
1. Open the **Arduino IDE**.
2. Navigate to **File > Preferences** (or **Arduino IDE > Settings** on macOS).
3. In the **Additional boards manager URLs** field, paste:
   ```text
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
4. Click **OK**.

#### Step 3: Install the ESP8266 Core Package
1. Open **Tools > Board > Boards Manager...** (or click the Board Manager icon in the left sidebar).
2. Search for `esp8266`.
3. Locate **esp8266 by ESP8266 Community** and click **Install**.
4. Allow the installation to finish and close the dialog.

#### Step 4: Configure Board, Port, and Target Settings
1. Connect the WeMos D1 to your computer using a data-capable USB cable.
2. Under **Tools > Board > ESP8266 Boards**, choose **LOLIN(WEMOS) D1 R2 & mini** (or your matching variant).
3. Under **Tools > Port**, select the active COM port assigned to your board (e.g., `COM7`).

![Arduino IDE Board Selection](attachments/2026-11-18%20074919.png)

#### Step 5: Configure Network Credentials via `secrets.h`
To avoid accidentally committing private Wi-Fi passwords to public version control repositories (such as GitHub), store your network credentials in an external header file within your personal Arduino libraries folder.

1. Navigate to your local Arduino libraries directory:
   ```text
   C:\Users\<Your_Username>\Documents\Arduino\libraries\my_secret\
   ```
   *(Create the `my_secret` directory if it does not already exist).*
2. Inside `my_secret`, create a file named `secrets.h`.
3. Add your local 2.4 GHz network credentials:
   ```c
   #pragma once
   // Configure credentials for your local lab Wi-Fi network
   #define WIFI_SSID "YOUR_2.4GHZ_SSID"
   #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
   ```
4. Because the Arduino IDE includes the global `libraries` folder in its compilation search path, `main.ino` can resolve `#include <secrets.h>` cleanly while keeping credentials isolated outside the project git tree.

#### Step 6: Compile and Upload Firmware
1. Click the **Upload** button in the Arduino IDE toolbar.
2. Wait for the compilation and flash process to complete.

![Arduino IDE Flashing](attachments/2026-11-18%20075017.png)

3. Once flashed, open the **Serial Monitor** (**Tools > Serial Monitor**) and configure the baud rate to **115200 baud**.
4. Press the hardware **RST** button on the WeMos D1. Verify the connection banner:

```text
Connecting to Wi-Fi.......
Connected!
MAC address: 40:F5:20:33:AF:CF
IP address: 192.168.1.191
HTTP server started on port 80
```

> [!TIP]
> Note the assigned IP address and MAC address reported in your Serial Monitor. In our laboratory environment, the router assigned `192.168.1.191`. Your local DHCP pool may assign a different address.

---

### Troubleshooting Common Setup Issues

- **Serial Monitor prints continuous dots (`......`)**: The device cannot connect. Verify that your SSID and password in `secrets.h` are correct, and confirm your Wi-Fi router broadcasts a 2.4 GHz network (ESP8266 radios cannot connect to 5 GHz-only SSIDs).
- **Upload fails with `espcomm_sync failed` or access errors**: Verify that the correct COM port is selected under **Tools > Port**. Close any other serial terminal software holding the port open. Briefly tap the hardware **RST** button when upload begins.
- **Device does not respond on the expected IP**: Home routers assign IP addresses dynamically. Re-check the Serial Monitor output to verify the current lease assigned to the microcontroller.

---

## Hands-On Reconnaissance Demonstration

Execute these steps from your host computer connected to the same Wi-Fi network:

### 1. Active Discovery via ARP Table
Because the ESP8266 completed a DHCP transaction and joined the subnet, your local ARP cache records its Layer 2 hardware address:

Open Command Prompt or PowerShell and query the ARP table:
```cmd
arp -a
```

![ARP Cache Inspection](attachments/2026-11-18%20075015.jpeg)

Locate the target IP address (`192.168.1.191`) and observe its physical MAC address (`40-f5-20-33-af-cf`).

### 2. Vendor Fingerprinting via OUI Lookup
The first three bytes (24 bits) of a MAC address are designated as the Organizationally Unique Identifier (OUI). Look up the prefix in a public vendor registry:

- Target prefix: `40:F5:20`
- Query tool: [Espressif MAC OUI Lookup](https://maclookup.app/search/result?mac=40-f5-20)

![OUI Vendor Query](attachments/2026-11-18%20091557.png)

The lookup confirms that the hardware vendor is **Espressif Inc.** An attacker now knows that the host is an Espressif microcontroller (ESP8266 or ESP32) without sending a single probe packet to the device.

### 3. Service Verification & Port Probing
Verify whether port 80 (HTTP) is listening using PowerShell:

```powershell
Test-NetConnection -ComputerName 192.168.1.191 -Port 80
```

![Port 80 TCP Probe](attachments/2026-11-18%20091839.png)

`TcpTestSucceeded : True` confirms that an active web service is reachable on port 80.

### 4. Interrogating Unauthenticated Endpoints
Open a web browser and navigate to the target address:
```text
http://192.168.1.191/
```

![Unauthenticated Device Telemetry](attachments/2026-11-18%20092023.png)

Without any authentication or token exchange, the endpoint exposes internal telemetry:
- **MAC Address**: Confirms hardware identity.
- **Assigned IP Address**: Confirms local routing.
- **RSSI (`-69 dBm`)**: Reveals physical signal attenuation and relative distance from the access point.
- **Uptime in milliseconds (`5396879 ms`)**: Indicates how long the device has operated without rebooting, revealing stability and maintenance windows.

### 5. Cleartext Packet Capture with Wireshark
1. Launch **Wireshark** and select your active Wi-Fi network interface.
2. Set the display filter to isolate traffic to and from the ESP8266:
   ```text
   ip.addr == 192.168.1.191
   ```
3. In your browser, refresh `http://192.168.1.191/`.
4. Inspect the captured frames:

![Wireshark HTTP and Handshake Dissection](attachments/2026-11-18%20072223.png)

- **TCP Handshake**: Observe the initial three-way handshake (`SYN` $\rightarrow$ `SYN, ACK` $\rightarrow$ `ACK`) between your laptop (`192.168.1.130`) and the ESP8266 (`192.168.1.191`).
- **Cleartext Transmission**: Inspect the HTTP request (`GET / HTTP/1.1`) and the server's response (`HTTP/1.1 200 OK`). Because transport encryption (TLS/HTTPS) is absent, all internal HTML payloads, headers, and device metrics are transmitted across the local network segment in plain text.

![Wireshark ICMP and Network Dissection](attachments/2026-11-18%20072324.png)

Additional diagnostic frames (such as ICMP echo requests) verify that the device responds to general Layer 3 network probing.

---

## Defensive Detection & Blue Team Perspective

From a network defense perspective, unmanaged microcontrollers stand out immediately:

- **Router Client & DHCP Logs**: In your router's administrative dashboard under **Connected Devices / DHCP Clients**, default ESP8266 sketches identify themselves with hostnames matching `ESP_XXXXXX` (derived from the last 3 octets of the MAC address). This naming scheme immediately signals an unmanaged, default IoT installation.
- **Nmap OS Fingerprinting Ambiguity**: When scanning the device using Nmap with OS detection (`nmap -O <device-ip>`), lightweight embedded TCP/IP implementations (such as LwIP) generate non-standard TCP options and window sizes. 

```cmd
nmap -O 192.168.1.191
```

![Zenmap OS Detection Scan](attachments/Screenshot%202026-11-17%20094504.png)

As demonstrated in the scan above, Nmap reports:
`No exact OS matches for host`
To an experienced network defender or penetration tester, an open port 80 that fails standard Windows/Linux OS fingerprints is a telltale sign of an embedded microcontroller or custom IoT stack.

- **Passive RF Monitoring**: In Wi-Fi monitor mode, filtering frames for `wlan.addr == <device-mac>` exposes probe requests and 802.11 management frames, allowing passive device discovery without generating IP traffic.

---

## Remediation Roadmap

This introductory lesson focuses on establishing baseline reconnaissance visibility. The vulnerabilities observed here—unauthenticated access, cleartext transport, and predictable hardware identifiers—will be addressed systematically across future modules:

- **Module 5: Network Segmentation & Isolation**: Confining IoT nodes to dedicated, firewalled VLANs or guest networks to prevent lateral movement.
- **Module 6: Secure Secrets Management**: Hardening embedded credentials and preventing sensitive variable exposure.
- **Module 8: Authentication & Access Control**: Implementing robust session handling and access restrictions on embedded endpoints.

---

## Knowledge Assessment

Answer the following questions to consolidate your understanding of the ESP8266 attack surface:

1. **Network Initialization**: What is the fundamental difference between Station (STA) mode and Access Point (AP) mode regarding which party initializes and hosts the wireless network?
2. **Passive Reconnaissance**: How can an attacker infer that a network node is an embedded IoT microcontroller using only its MAC address, without transmitting any packets to the device?
3. **Transport Security**: In the Wireshark packet capture, what underlying architectural factor allowed all HTTP response content to be read in plain text? What cryptographic transport layer would eliminate passive visibility for packet sniffers?
4. **Dual-Homed Risk**: If an ESP8266 is configured in concurrent **AP + STA** mode rather than pure STA mode, what distinct architectural risk does this introduce to the surrounding internal network?
5. **Operational Telemetry Leakage**: The unauthenticated status page reveals device uptime and RSSI signal strength. Explain how an attacker could leverage these seemingly benign telemetry metrics during physical surveillance or timing-based attacks.

---

> [!NOTE]
> Review your lab exercises and submit your responses to the online evaluation portal:
> [ESP8266 Security Lab Knowledge Assessment](https://esp8266-security-lab.netlify.app/md1/ls1/knowledge-assessment)
