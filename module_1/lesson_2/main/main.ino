/*
  Module 1 - Lesson 2: AP Mode Observation (password-protected test AP)
  Board: WeMos D1 (ESP8266)

  Puts the device into Access Point mode with WPA2 protection.
  No web server, no services exposed — this lesson is purely about
  observing AP behavior (SSID broadcast, DHCP, client association),
  not about building anything to connect real devices to long-term.
*/

#include <ESP8266WiFi.h>

const char* AP_SSID     = "D1-LAB-TEST";      // clearly labelled as a test network
const char* AP_PASSWORD = "labtest1234";      // min 8 chars for WPA2, change for your lab

void setup() {
  Serial.begin(115200);
  delay(100);

  WiFi.mode(WIFI_AP);
  bool ok = WiFi.softAP(AP_SSID, AP_PASSWORD);

  Serial.println();
  Serial.print("AP started: ");
  Serial.println(ok ? "YES" : "FAILED");
  Serial.print("SSID: ");
  Serial.println(AP_SSID);
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
  Serial.print("AP MAC address: ");
  Serial.println(WiFi.softAPmacAddress());
}

void loop() {
  static int lastClientCount = -1;
  int clients = WiFi.softAPgetStationNum();
  if (clients != lastClientCount) {
    Serial.print("Connected stations: ");
    Serial.println(clients);
    lastClientCount = clients;
  }
  delay(1000);
}