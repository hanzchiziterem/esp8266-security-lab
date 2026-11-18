# WeMos D1 (ESP8266) Practical Security Course — Table of Contents

Status key: ✅ Done · 🔜 Next up · ⬜ Not started yet

Each lesson follows the structure: Conceptual Explanation → Attack Perspective → Technical Breakdown → Lab Exercise → Source Code → Demonstration → Detection → Remediation → Knowledge Assessment.

Two modules (2 and 3) are **concept-and-defense only** — no working attack firmware is produced for those, per the course's safety scope. That's called out explicitly below so it's never a surprise mid-lesson.

---

## Module 1 — Understanding the ESP8266 Attack Surface
Full hands-on module. Working code throughout.

- ✅ **Lesson 1** — Wi-Fi architecture, STA vs AP mode, MAC/IP/port/protocol fundamentals. Lab: flash a plain STA-mode status-page sketch, do a full recon pass on it from your laptop (ARP, port check, Wireshark, nmap).
- ✅ **Lesson 2** — Why the ESP8266 becomes a vulnerability by default; what "rogue device" means as a threat category (rogue client vs rogue AP vs bridging/pivot device). Lab: run the D1 in AP mode, observe SoftAP behavior and client association.
- ⬜ **Lesson 3** *(optional, if you want more depth before moving on)* — AP+STA dual mode hands-on: configure the D1 to hold both a station connection and its own AP simultaneously, and observe the two interfaces/subnets coexisting. Direct setup for Module 5.

## Module 2 — Wi-Fi Deauthentication Attacks
**Concept + detection only.** No deauth-frame-sending firmware will be produced.

- ⬜ **Lesson 1** — IEEE 802.11 management frame structure; what a deauth frame actually contains; why management frames are unauthenticated by default; how 802.11w/PMF closes this gap. Exercise: inspect real (non-attack) management frames (beacons, probe requests) for your own network in Wireshark, and learn the exact filter to spot deauth frames if they ever appear (`wlan.fc.type_subtype == 0x0c`).
- ⬜ **Lesson 2** — Recognizing suspicious disconnection patterns on your own network; defensive configuration (enabling 802.11w on your router if supported, monitoring tools).

## Module 3 — Evil Twin and Rogue Access Points
**Concept + safe demo only.** The AP built here is clearly labelled as a test network; no credential-harvesting page will be produced, dummy or otherwise.

- ⬜ **Lesson 1** — How legitimate APs work; what makes Evil Twin attacks work on users (SSID-based trust, auto-reconnect behavior); captive portal mechanics in the abstract.
- ⬜ **Lesson 2** — Lab: broadcast a clearly-labelled isolated `*-TEST` AP from the D1 (building on Module 1 Lesson 2) and serve a plain, honest "this is a test access point" status page — no login form. Detection techniques: BSSID/vendor mismatch checks, duplicate-SSID detection, signal-strength anomalies.

## Module 4 — Packet Sniffing and Wireless Traffic Analysis
Full hands-on module.

- ⬜ **Lesson 1** — Promiscuous/monitor mode concepts and ESP8266's real limitations here; encrypted vs unencrypted traffic; what HTTP/TCP/IP expose. Lab: dummy sensor-data sketch over plain HTTP, inspected in Wireshark.
- ⬜ **Lesson 2** — MQTT fundamentals and traffic inspection; HTTPS comparison (what Wireshark can and can't see once TLS is added); what an attacker actually learns from each.

## Module 5 — Network Pivoting and Rogue IoT Devices
Conceptual/simulation module (no real unauthorized tunnels or persistent implants, per course scope).

- ⬜ **Lesson 1** — What pivoting and lateral movement mean; how an unsecured IoT device becomes an entry point; direct callback to Module 1's AP+STA bridging risk.
- ⬜ **Lesson 2** — Simulated isolated topology (vulnerable IoT device + internal test server + external test client) to visualize segmentation and firewall rules, and why they matter.

## Module 6 — Hardcoded Credentials and Firmware Security
Full hands-on module.

- ⬜ **Lesson 1** — How Wi-Fi credentials live in compiled ESP8266 firmware; flash memory basics; what firmware extraction/reverse engineering involves. Lab: deliberately vulnerable version with dummy hardcoded credentials, and how to spot them.
- ⬜ **Lesson 2** — Safer credential-management approaches (e.g. `WiFiManager`, keeping secrets out of source control) and the honest limits of protecting secrets on a physically accessible microcontroller.

## Module 7 — Insecure OTA Firmware Updates
Full hands-on module.

- ⬜ **Lesson 1** — How ESP8266 OTA works; why unauthenticated OTA is dangerous; what an attacker could do with it.
- ⬜ **Lesson 2** — Lab: build an authenticated OTA setup, compare side-by-side against an intentionally-unsecured local-only test config, and lock down the authenticated version properly.

## Module 8 — Exposed Web Interfaces and IoT Authentication
Full hands-on module.

- ⬜ **Lesson 1** — ESP8266 web server internals, HTTP GET/POST, why unauthenticated control panels are dangerous. Lab: build the full status/sensor/LED-control web interface, unauthenticated first, and access it from another device on the lab network.
- ⬜ **Lesson 2** — Add real authentication and basic request validation to the same interface; compare both versions side-by-side; session management basics.

---

### Where you are right now
Finished Module 1, Lessons 1–2. Next decision point: Module 1 Lesson 3 (optional AP+STA hands-on) vs moving straight into Module 2.