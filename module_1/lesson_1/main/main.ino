/*
  Module 1 - Lesson 1: Attack Surface Recon Target
  Board: WeMos D1 (ESP8266)

  This sketch connects to your Wi-Fi in STATION mode and runs a tiny
  HTTP server with ONE deliberately plain status page. No authentication,
  no secrets — this is intentional, so you can observe exactly what an
  unauthenticated device looks like to anything else on your LAN.

  Required library: ESP8266WiFi (bundled with ESP8266 board package)
*/

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

void setup() {
  Serial.begin(115200);
  delay(100);

  WiFi.mode(WIFI_STA);
  // These variables are gotten from the secret file
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("Connected!");
  Serial.print("MAC address: ");
  Serial.println(WiFi.macAddress());
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
  Serial.println("HTTP server started on port 80");
}

void loop() {
  server.handleClient();
}