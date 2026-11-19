import * as THREE from 'three';
import { WEMOS_D1_PINS } from '../../data/wemosD1Metadata';

export interface InteractiveTarget {
  mesh: THREE.Object3D;
  type: 'component' | 'pin';
  id: string;
}

export interface WemosD1ModelResult {
  group: THREE.Group;
  interactiveMeshes: THREE.Mesh[];
  pinTargetMap: Map<string, THREE.Vector3>;
  dispose: () => void;
  updateLedPulse: (time: number) => void;
  highlightMarker: THREE.Mesh;
}

// Generates high-resolution front PCB texture with authentic WeMos D1 R1 silkscreen
function createFrontTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // PCB Dark Blue Solder Mask
  ctx.fillStyle = '#0B335A';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle copper pour / ground plane areas
  ctx.fillStyle = '#082542';
  ctx.fillRect(80, 80, 1888, 1888);

  // Copper routing traces (cyan/blue-green tinted PCB traces)
  ctx.strokeStyle = '#154A7E';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Power and bus traces
  const traces = [
    [[300, 400], [300, 900], [500, 1100]],
    [[350, 450], [350, 850], [600, 1100]],
    [[1750, 300], [1750, 800], [1500, 1050]],
    [[1700, 350], [1700, 750], [1450, 1050]],
    [[1650, 400], [1650, 700], [1400, 1050]],
    [[1024, 250], [1024, 600]],
    [[980, 250], [980, 580]],
    [[1060, 250], [1060, 580]],
    [[700, 600], [700, 800], [900, 900]],
    [[600, 500], [600, 750], [800, 850]],
  ];

  traces.forEach((points) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
  });

  // Vias (tiny plated copper holes)
  ctx.fillStyle = '#C8963E';
  const viaPositions = [
    [400, 500], [420, 540], [460, 600], [650, 450], [750, 480],
    [1600, 480], [1620, 530], [1580, 600], [1400, 700], [1350, 750],
    [900, 400], [1150, 400], [850, 950], [1200, 950], [700, 1200],
  ];
  viaPositions.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#061320';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C8963E';
  });

  // Silkscreen: Mounting Holes rings
  ctx.strokeStyle = '#DDE8F5';
  ctx.lineWidth = 8;
  const mountingHoles = [[180, 220], [1860, 180], [180, 1860], [1860, 1860]];
  mountingHoles.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 65, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Silkscreen Text Configuration
  ctx.fillStyle = '#F3F7FC';
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.textAlign = 'left';

  // Left header labels (Power & Analog)
  const leftLabels = [
    { text: '5V', y: 480 },
    { text: 'RESET', y: 550 },
    { text: '3.3V', y: 620 },
    { text: '5V', y: 690 },
    { text: 'GND', y: 760 },
    { text: 'GND', y: 830 },
    { text: 'VIN', y: 900 },
    { text: 'A0', y: 1250 },
    { text: 'A1', y: 1320 },
    { text: 'A2', y: 1390 },
    { text: 'A3', y: 1460 },
    { text: 'A4', y: 1530 },
    { text: 'A5', y: 1600 },
  ];
  leftLabels.forEach(({ text, y }) => {
    ctx.fillText(text, 260, y);
  });

  // Right header labels (Digital High & Low)
  ctx.textAlign = 'right';
  const rightLabels = [
    { text: 'D15 / SCL', y: 380 },
    { text: 'D14 / SDA', y: 450 },
    { text: 'AREF', y: 520 },
    { text: 'GND', y: 590 },
    { text: 'D13 / SCK', y: 660 },
    { text: 'D12 / MISO', y: 730 },
    { text: 'D11 / MOSI', y: 800 },
    { text: 'D10 / SS', y: 870 },
    { text: 'TX1 / D9', y: 940 },
    { text: 'D8', y: 1010 },
    { text: 'D11/MOSI/D7', y: 1140 },
    { text: 'D12/MISO/D6', y: 1210 },
    { text: 'D13/SCK/D5', y: 1280 },
    { text: 'D14/SDA/D4', y: 1350 },
    { text: 'D15/SCL/D3', y: 1420 },
    { text: 'D2', y: 1490 },
    { text: 'TX -> D1', y: 1560 },
    { text: 'RX <- D0', y: 1630 },
  ];
  rightLabels.forEach(({ text, y }) => {
    ctx.fillText(text, 1780, y);
  });

  // Center Silkscreen: D1 WiFi Logo (Verbatim from photo!)
  ctx.textAlign = 'center';
  ctx.font = '900 110px "Arial Black", sans-serif';
  ctx.fillText('D1', 1400, 1140);
  ctx.font = 'italic bold 52px "Trebuchet MS", sans-serif';
  ctx.fillText('WiFi', 1400, 1200);

  // Reset button label
  ctx.textAlign = 'center';
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.fillText('RESET', 1650, 260);

  // Bottom left branding
  ctx.textAlign = 'left';
  ctx.font = '28px "Courier New", monospace';
  ctx.fillStyle = '#9AAAC0';
  ctx.fillText('powered by', 320, 1780);
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.fillStyle = '#F3F7FC';
  ctx.fillText('wemos.cc', 320, 1820);

  // Component outline frames
  ctx.strokeStyle = '#DDE8F5';
  ctx.lineWidth = 4;
  // ESP module outline
  ctx.strokeRect(680, 1050, 688, 720);
  // CH340 outline
  ctx.strokeRect(1150, 480, 240, 360);
  // 4R7 inductor outline
  ctx.strokeRect(920, 520, 180, 180);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

// Generates high-resolution back PCB texture with authentic WeMos D1 Ver. 2015-08 silkscreen
function createBackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // PCB Dark Blue
  ctx.fillStyle = '#0B335A';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle copper ground plane
  ctx.fillStyle = '#082542';
  ctx.fillRect(80, 80, 1888, 1888);

  // Silkscreen Text & Graphics
  ctx.fillStyle = '#F3F7FC';
  ctx.strokeStyle = '#F3F7FC';

  // Digital pin GPIO labels (matching photo back view)
  ctx.save();
  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.textAlign = 'left';
  const backLabels = [
    { text: 'GPIO3', y: 380 },
    { text: 'GPIO1', y: 450 },
    { text: 'GPIO16', y: 520 },
    { text: 'GPIO5', y: 590 },
    { text: 'GPIO4', y: 660 },
    { text: 'GPIO14', y: 730 },
    { text: 'GPIO12', y: 800 },
    { text: 'GPIO13', y: 870 },
    { text: 'GPIO0', y: 940 },
    { text: 'GPIO2', y: 1010 },
    { text: 'TX0/GPIO15', y: 1140 },
    { text: 'RX0/GPIO13', y: 1210 },
    { text: 'GPIO12', y: 1280 },
    { text: 'GPIO14', y: 1350 },
    { text: 'GND', y: 1420 },
    { text: 'GPIO4', y: 1490 },
    { text: 'GPIO5', y: 1560 },
  ];
  backLabels.forEach(({ text, y }) => {
    ctx.fillText(text, 280, y);
  });
  ctx.restore();

  // Central Specification Silkscreen Block
  ctx.textAlign = 'left';
  ctx.font = '900 70px "Arial Black", sans-serif';
  ctx.fillText('D1', 450, 750);
  ctx.fillRect(450, 765, 120, 8);

  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.fillText('Arduino compatile', 450, 840);
  ctx.fillText('Based ESP8266', 450, 900);
  ctx.fillText('wemos.cc/d1', 450, 960);
  ctx.fillText('Ver.2015-08', 450, 1020);

  // Large WiFi Cloud Logo (matching photograph exactly!)
  ctx.lineWidth = 14;
  ctx.beginPath();
  // Cloud boundary
  ctx.arc(1400, 850, 160, Math.PI * 0.8, Math.PI * 1.9);
  ctx.arc(1550, 800, 120, Math.PI * 1.2, Math.PI * 2.1);
  ctx.arc(1650, 920, 110, Math.PI * 1.8, Math.PI * 0.4);
  ctx.arc(1350, 960, 120, Math.PI * 0.4, Math.PI * 1.1);
  ctx.closePath();
  ctx.stroke();

  // Inner dotted circles for WiFi signal
  ctx.lineWidth = 8;
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.arc(1460, 900, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Bold "WiFi" text inside cloud
  ctx.textAlign = 'center';
  ctx.font = '900 90px "Arial Black", sans-serif';
  ctx.fillText('WiFi', 1480, 920);

  // Bottom WeMos.cc Branding Logo (Rounded script "W")
  ctx.font = 'bold 85px "Trebuchet MS", sans-serif';
  ctx.fillText('WeMos.cc', 1024, 1500);

  // Through-hole solder pads (Silver pads on back)
  ctx.fillStyle = '#D6DDE6';
  const solderPads = [
    // DC Jack pins
    [1600, 250], [1700, 280], [1650, 380],
    // USB tabs
    [950, 200], [1100, 200],
  ];
  solderPads.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#061320';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#D6DDE6';
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  return texture;
}

// Generates ESP-12F RF Shield texture
function createEspShieldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Brushed aluminum metallic base
  ctx.fillStyle = '#C2C8CF';
  ctx.fillRect(0, 0, 1024, 1024);

  // Brushed texture lines
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let i = 0; i < 1024; i += 4) {
    ctx.fillRect(0, i, 1024, 1.5);
  }

  // Dark laser-etched silkscreen
  ctx.fillStyle = '#2A3440';
  ctx.textAlign = 'center';

  // Wi-Fi logo
  ctx.beginPath();
  ctx.arc(512, 280, 70, Math.PI * 1.2, Math.PI * 1.8);
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#2A3440';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 280, 40, Math.PI * 1.2, Math.PI * 1.8);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(512, 280, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 64px "Courier New", monospace';
  ctx.fillText('ESP8266MOD', 512, 420);

  ctx.font = '500 36px "Courier New", monospace';
  ctx.fillText('ISM 2.4GHz / Wi-Fi', 512, 490);
  ctx.fillText('Tensilica L106 @ 80MHz', 512, 550);
  ctx.fillText('4MB SPI Flash Memory', 512, 610);

  ctx.font = '400 30px "Courier New", monospace';
  ctx.fillText('FCC ID: 2AC7Z-ESPWROOM02', 512, 700);
  ctx.fillText('VENDOR: ESPRESSIF SYSTEMS', 512, 750);

  // Pin 1 indicator dot
  ctx.fillStyle = '#D4A03A';
  ctx.beginPath();
  ctx.arc(120, 120, 24, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Generates gold meandering Inverted-F Antenna (MIFA) texture
function createAntennaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark PCB substrate
  ctx.fillStyle = '#0B335A';
  ctx.fillRect(0, 0, 1024, 512);

  // Gold copper antenna trace
  ctx.strokeStyle = '#E5B348';
  ctx.lineWidth = 32;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  // Authentic Meandering Inverted-F shape
  ctx.beginPath();
  ctx.moveTo(100, 420);
  ctx.lineTo(100, 100);
  ctx.lineTo(250, 100);
  ctx.lineTo(250, 360);
  ctx.lineTo(400, 360);
  ctx.lineTo(400, 100);
  ctx.lineTo(550, 100);
  ctx.lineTo(550, 360);
  ctx.lineTo(700, 360);
  ctx.lineTo(700, 100);
  ctx.lineTo(850, 100);
  ctx.lineTo(850, 360);
  ctx.lineTo(950, 360);
  ctx.lineTo(950, 420);
  ctx.stroke();

  // Feed line & ground short
  ctx.beginPath();
  ctx.moveTo(180, 420);
  ctx.lineTo(180, 100);
  ctx.stroke();

  // Subtle gold sparkle highlights
  ctx.fillStyle = '#FFE599';
  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('2.4GHz MIFA ANT', 512, 470);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function buildWemosD1Model(): WemosD1ModelResult {
  const group = new THREE.Group();
  const interactiveMeshes: THREE.Mesh[] = [];
  const pinTargetMap = new Map<string, THREE.Vector3>();
  const disposables: { dispose: () => void }[] = [];

  // Units: 1 unit = 10 mm. Board is 5.34 x 6.86 x 0.16
  const W = 5.34;
  const L = 6.86;
  const H = 0.16;

  // 1. PCB Substrate with Uno contour
  const shape = new THREE.Shape();
  const hw = W / 2;
  const hl = L / 2;
  const r = 0.15; // corner radius

  // Arduino Uno R3 contour with distinctive cutouts
  shape.moveTo(-hw + r, -hl);
  shape.lineTo(hw - r, -hl);
  shape.quadraticCurveTo(hw, -hl, hw, -hl + r);
  shape.lineTo(hw, hl - 0.9);
  shape.lineTo(hw - 0.15, hl - 0.7);
  shape.lineTo(hw, hl - 0.5);
  shape.lineTo(hw, hl - r);
  shape.quadraticCurveTo(hw, hl, hw - r, hl);
  shape.lineTo(-hw + r, hl);
  shape.quadraticCurveTo(-hw, hl, -hw, hl - r);
  shape.lineTo(-hw, -hl + r);
  shape.quadraticCurveTo(-hw, -hl, -hw + r, -hl);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: H,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  };

  const pcbGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Center geometry vertically and rotate so flat lies on X-Z plane
  pcbGeometry.center();
  pcbGeometry.rotateX(Math.PI / 2);
  disposables.push(pcbGeometry);

  const frontTexture = createFrontTexture();
  const backTexture = createBackTexture();
  disposables.push(frontTexture, backTexture);

  const pcbSideMaterial = new THREE.MeshStandardMaterial({
    color: '#082542',
    roughness: 0.5,
    metalness: 0.1,
  });
  const pcbFrontMaterial = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.35,
    metalness: 0.2,
  });
  const pcbBackMaterial = new THREE.MeshStandardMaterial({
    map: backTexture,
    roughness: 0.35,
    metalness: 0.2,
  });
  disposables.push(pcbSideMaterial, pcbFrontMaterial, pcbBackMaterial);

  const pcbMesh = new THREE.Mesh(pcbGeometry, [pcbSideMaterial, pcbFrontMaterial, pcbBackMaterial]);
  pcbMesh.receiveShadow = true;
  pcbMesh.castShadow = true;
  group.add(pcbMesh);

  // Helper to register interactive components
  const registerInteractive = (mesh: THREE.Mesh, type: 'component' | 'pin', id: string) => {
    mesh.userData = { type, id };
    interactiveMeshes.push(mesh);
  };

  // 2. DC Barrel Jack (Top-Left)
  const dcGroup = new THREE.Group();
  const dcBodyGeo = new THREE.BoxGeometry(1.35, 1.1, 1.45);
  const dcMat = new THREE.MeshStandardMaterial({
    color: '#151515',
    roughness: 0.8,
    metalness: 0.1,
  });
  disposables.push(dcBodyGeo, dcMat);
  const dcBody = new THREE.Mesh(dcBodyGeo, dcMat);
  dcBody.position.set(0, 0.55, 0);
  dcBody.castShadow = true;
  dcGroup.add(dcBody);

  // Barrel metal cylinder port
  const dcPortGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.7, 24);
  dcPortGeo.rotateX(Math.PI / 2);
  const dcMetalMat = new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.85,
    roughness: 0.25,
  });
  disposables.push(dcPortGeo, dcMetalMat);
  const dcPort = new THREE.Mesh(dcPortGeo, dcMetalMat);
  dcPort.position.set(0, 0.55, -0.6);
  dcGroup.add(dcPort);

  // Center terminal pin
  const dcPinGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16);
  dcPinGeo.rotateX(Math.PI / 2);
  const silverMat = new THREE.MeshStandardMaterial({
    color: '#C0C0C0',
    metalness: 0.95,
    roughness: 0.15,
  });
  disposables.push(dcPinGeo, silverMat);
  const dcPin = new THREE.Mesh(dcPinGeo, silverMat);
  dcPin.position.set(0, 0.55, -0.55);
  dcGroup.add(dcPin);

  dcGroup.position.set(-1.8, H / 2, -2.85);
  group.add(dcGroup);
  registerInteractive(dcBody, 'component', 'dc_barrel_jack');

  // 3. Micro-USB Connector (Top-Center)
  const usbGroup = new THREE.Group();
  const usbShellGeo = new THREE.BoxGeometry(0.75, 0.3, 0.55);
  const usbMat = new THREE.MeshStandardMaterial({
    color: '#D8D8D8',
    metalness: 0.9,
    roughness: 0.2,
  });
  disposables.push(usbShellGeo, usbMat);
  const usbShell = new THREE.Mesh(usbShellGeo, usbMat);
  usbShell.position.set(0, 0.15, 0);
  usbShell.castShadow = true;
  usbGroup.add(usbShell);

  // USB Inner opening
  const usbOpeningGeo = new THREE.BoxGeometry(0.55, 0.16, 0.2);
  const blackMat = new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.9 });
  disposables.push(usbOpeningGeo, blackMat);
  const usbOpening = new THREE.Mesh(usbOpeningGeo, blackMat);
  usbOpening.position.set(0, 0.15, -0.22);
  usbGroup.add(usbOpening);

  usbGroup.position.set(0.65, H / 2, -3.28);
  group.add(usbGroup);
  registerInteractive(usbShell, 'component', 'micro_usb');

  // 4. Tactile Reset Switch (Top-Right)
  const rstGroup = new THREE.Group();
  const rstFrameGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
  disposables.push(rstFrameGeo);
  const rstFrame = new THREE.Mesh(rstFrameGeo, silverMat);
  rstFrame.position.set(0, 0.1, 0);
  rstGroup.add(rstFrame);

  const rstPlungerGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.16, 16);
  disposables.push(rstPlungerGeo);
  const rstPlunger = new THREE.Mesh(rstPlungerGeo, blackMat);
  rstPlunger.position.set(0, 0.26, 0);
  rstGroup.add(rstPlunger);

  rstGroup.position.set(1.9, H / 2, -2.9);
  group.add(rstGroup);
  registerInteractive(rstFrame, 'component', 'reset_button');

  // 5. CH340G USB-to-UART Bridge IC
  const ch340Geo = new THREE.BoxGeometry(0.55, 0.16, 0.95);
  const icMat = new THREE.MeshStandardMaterial({
    color: '#1A1A1A',
    roughness: 0.6,
    metalness: 0.1,
  });
  disposables.push(ch340Geo, icMat);
  const ch340Mesh = new THREE.Mesh(ch340Geo, icMat);
  ch340Mesh.position.set(0.75, H / 2 + 0.08, -1.8);
  ch340Mesh.castShadow = true;
  group.add(ch340Mesh);
  registerInteractive(ch340Mesh, 'component', 'ch340g');

  // 12MHz Crystal Oscillator next to CH340G
  const crystalGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
  crystalGeo.rotateZ(Math.PI / 2);
  disposables.push(crystalGeo);
  const crystalMesh = new THREE.Mesh(crystalGeo, silverMat);
  crystalMesh.position.set(1.25, H / 2 + 0.1, -1.8);
  group.add(crystalMesh);

  // 6. Power Circuitry: 4R7 Inductor & Capacitors
  // 4R7 Inductor
  const inductorGeo = new THREE.BoxGeometry(0.6, 0.35, 0.6);
  const inductorMat = new THREE.MeshStandardMaterial({
    color: '#222222',
    roughness: 0.8,
  });
  disposables.push(inductorGeo, inductorMat);
  const inductorMesh = new THREE.Mesh(inductorGeo, inductorMat);
  inductorMesh.position.set(0.1, H / 2 + 0.175, -2.1);
  group.add(inductorMesh);
  registerInteractive(inductorMesh, 'component', 'inductor_4r7');

  // Aluminum Electrolytic Capacitors (2x)
  const capGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.55, 24);
  disposables.push(capGeo);
  const capMesh1 = new THREE.Mesh(capGeo, silverMat);
  capMesh1.position.set(-0.6, H / 2 + 0.275, -2.2);
  group.add(capMesh1);

  const capMesh2 = new THREE.Mesh(capGeo, silverMat);
  capMesh2.position.set(-0.35, H / 2 + 0.275, -0.9);
  group.add(capMesh2);
  registerInteractive(capMesh1, 'component', 'capacitors');
  registerInteractive(capMesh2, 'component', 'capacitors');

  // AMS1117 3.3V Voltage Regulator
  const regGeo = new THREE.BoxGeometry(0.65, 0.15, 0.35);
  disposables.push(regGeo);
  const regMesh = new THREE.Mesh(regGeo, icMat);
  regMesh.position.set(-0.4, H / 2 + 0.075, -1.5);
  group.add(regMesh);
  registerInteractive(regMesh, 'component', 'voltage_regulator');

  // 7. ESP-12F RF Module & Inverted-F Antenna
  const espGroup = new THREE.Group();

  // ESP Module base PCB
  const espPcbGeo = new THREE.BoxGeometry(1.6, 0.08, 2.4);
  const espPcbMat = new THREE.MeshStandardMaterial({
    color: '#0A2544',
    roughness: 0.4,
  });
  disposables.push(espPcbGeo, espPcbMat);
  const espPcb = new THREE.Mesh(espPcbGeo, espPcbMat);
  espPcb.position.set(0, 0.04, 0);
  espGroup.add(espPcb);

  // Metallic RF Shield Can
  const shieldGeo = new THREE.BoxGeometry(1.5, 0.28, 1.55);
  const shieldTexture = createEspShieldTexture();
  disposables.push(shieldGeo, shieldTexture);
  const shieldMat = new THREE.MeshStandardMaterial({
    map: shieldTexture,
    metalness: 0.85,
    roughness: 0.25,
  });
  disposables.push(shieldMat);
  const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
  shieldMesh.position.set(0, 0.18, -0.35);
  shieldMesh.castShadow = true;
  espGroup.add(shieldMesh);
  registerInteractive(shieldMesh, 'component', 'esp8266_module');

  // Gold MIFA Antenna Plate
  const antGeo = new THREE.PlaneGeometry(1.5, 0.75);
  const antTexture = createAntennaTexture();
  antGeo.rotateX(-Math.PI / 2);
  disposables.push(antGeo, antTexture);
  const antMat = new THREE.MeshStandardMaterial({
    map: antTexture,
    metalness: 0.6,
    roughness: 0.35,
  });
  disposables.push(antMat);
  const antMesh = new THREE.Mesh(antGeo, antMat);
  antMesh.position.set(0, 0.085, 0.78);
  espGroup.add(antMesh);
  registerInteractive(antMesh, 'component', 'pcb_antenna');

  espGroup.position.set(0, H / 2, 1.35);
  group.add(espGroup);

  // 8. Glowing Blue Activity LED & PointLight
  const ledGeo = new THREE.BoxGeometry(0.12, 0.08, 0.16);
  const ledMat = new THREE.MeshStandardMaterial({
    color: '#35D5F2',
    emissive: '#35D5F2',
    emissiveIntensity: 2.0,
    roughness: 0.1,
  });
  disposables.push(ledGeo, ledMat);
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.position.set(1.1, H / 2 + 0.05, 0.55);
  group.add(ledMesh);
  registerInteractive(ledMesh, 'component', 'status_led');

  const ledLight = new THREE.PointLight('#35D5F2', 1.5, 3);
  ledLight.position.set(1.1, H / 2 + 0.3, 0.55);
  group.add(ledLight);

  // 9. Female Pin Headers & Individual Interactive Pins
  const headerMat = new THREE.MeshStandardMaterial({
    color: '#151515',
    roughness: 0.75,
  });
  const goldContactMat = new THREE.MeshStandardMaterial({
    color: '#E5B348',
    metalness: 0.9,
    roughness: 0.1,
  });
  disposables.push(headerMat, goldContactMat);

  // Helper to construct female header row with individual pin sockets
  const createFemaleHeader = (
    pinCount: number,
    xPos: number,
    startZ: number,
    zPitch: number,
    pinsData: typeof WEMOS_D1_PINS
  ) => {
    const headerGroup = new THREE.Group();
    const length = pinCount * zPitch;
    const bodyGeo = new THREE.BoxGeometry(0.28, 0.85, length);
    disposables.push(bodyGeo);
    const bodyMesh = new THREE.Mesh(bodyGeo, headerMat);
    bodyMesh.position.set(0, 0.425, (length - zPitch) / 2);
    bodyMesh.castShadow = true;
    headerGroup.add(bodyMesh);

    // Individual socket holes and raycasting target meshes
    const socketGeo = new THREE.BoxGeometry(0.16, 0.2, 0.16);
    disposables.push(socketGeo);

    pinsData.forEach((pin, i) => {
      const z = i * zPitch;
      const targetGeo = new THREE.BoxGeometry(0.26, 0.3, 0.24);
      const targetMat = new THREE.MeshBasicMaterial({ visible: false });
      disposables.push(targetGeo, targetMat);
      const targetMesh = new THREE.Mesh(targetGeo, targetMat);
      targetMesh.position.set(xPos, H / 2 + 0.85, startZ + z);
      group.add(targetMesh);
      registerInteractive(targetMesh, 'pin', pin.id);

      // Save global coordinates for pin pointer/camera focus
      pinTargetMap.set(pin.id, new THREE.Vector3(xPos, H / 2 + 0.85, startZ + z));

      // Visual gold contact inside socket
      const contactMesh = new THREE.Mesh(socketGeo, goldContactMat);
      contactMesh.position.set(0, 0.8, z);
      headerGroup.add(contactMesh);
    });

    headerGroup.position.set(xPos, H / 2, startZ);
    group.add(headerGroup);
  };

  // Build Left Header: Power (8 pins) + Analog (6 pins)
  const leftPowerPins = WEMOS_D1_PINS.filter((p) => p.header === 'left-top');
  createFemaleHeader(8, -2.45, -1.6, 0.28, leftPowerPins);

  const leftAnalogPins = WEMOS_D1_PINS.filter((p) => p.header === 'left-bottom');
  createFemaleHeader(6, -2.45, 0.9, 0.28, leftAnalogPins);

  // Build Right Header: Digital High (10 pins) + Digital Low (8 pins)
  const rightHighPins = WEMOS_D1_PINS.filter((p) => p.header === 'right-top');
  createFemaleHeader(10, 2.45, -2.4, 0.28, rightHighPins);

  const rightLowPins = WEMOS_D1_PINS.filter((p) => p.header === 'right-bottom');
  createFemaleHeader(8, 2.45, 0.6, 0.28, rightLowPins);

  // 10. Dynamic Highlight Marker Ring (indicates selected/hovered pin)
  const markerGeo = new THREE.RingGeometry(0.18, 0.24, 24);
  markerGeo.rotateX(-Math.PI / 2);
  const markerMat = new THREE.MeshBasicMaterial({
    color: '#35D5F2',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  disposables.push(markerGeo, markerMat);
  const highlightMarker = new THREE.Mesh(markerGeo, markerMat);
  highlightMarker.position.set(0, -10, 0); // initially offscreen
  group.add(highlightMarker);

  const updateLedPulse = (time: number) => {
    const pulse = 1.2 + 0.8 * Math.sin(time * 6);
    ledMat.emissiveIntensity = pulse;
    ledLight.intensity = pulse;
  };

  const dispose = () => {
    disposables.forEach((d) => d.dispose());
  };

  return {
    group,
    interactiveMeshes,
    pinTargetMap,
    dispose,
    updateLedPulse,
    highlightMarker,
  };
}
