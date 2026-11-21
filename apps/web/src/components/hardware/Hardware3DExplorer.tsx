import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Compass,
  Layers,
  HelpCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  buildWemosD1Model,
  WemosD1ModelResult,
} from './WemosD1Model';
import {
  WEMOS_D1_COMPONENTS,
  WEMOS_D1_PINS,
  WEMOS_D1_QUIZ_QUESTIONS,
  ComponentMetadata,
  PinMetadata,
} from '../../data/wemosD1Metadata';

export type ExplorerMode = 'explore' | 'pins' | 'quiz';

interface Hardware3DExplorerProps {
  onSelectComponent: (component: ComponentMetadata | null) => void;
  onSelectPin: (pin: PinMetadata | null) => void;
  activeMode: ExplorerMode;
  onModeChange: (mode: ExplorerMode) => void;
  onQuizScoreChange?: (score: number, total: number) => void;
}

export const Hardware3DExplorer: React.FC<Hardware3DExplorerProps> = ({
  onSelectComponent,
  onSelectPin,
  activeMode,
  onModeChange,
  onQuizScoreChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // References to Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelResultRef = useRef<WemosD1ModelResult | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Camera animation target
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetControlsLookAtRef = useRef<THREE.Vector3 | null>(null);

  // Animate camera smoothly to preset
  const animateCameraTo = useCallback((pos: THREE.Vector3, lookAt = new THREE.Vector3(0, 0, 0)) => {
    targetCamPosRef.current = pos.clone();
    targetControlsLookAtRef.current = lookAt.clone();
  }, []);

  // Camera presets
  const setPreset = useCallback((preset: 'isometric' | 'front' | 'back' | 'side' | 'power' | 'flip') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setIsAutoRotating(false);

    switch (preset) {
      case 'isometric':
        animateCameraTo(new THREE.Vector3(6.5, 7.2, 7.2), new THREE.Vector3(0, 0, 0));
        break;
      case 'front':
        animateCameraTo(new THREE.Vector3(0.01, 11.0, 0.01), new THREE.Vector3(0, 0, 0));
        break;
      case 'back':
        animateCameraTo(new THREE.Vector3(0.01, -11.0, 0.01), new THREE.Vector3(0, 0, 0));
        break;
      case 'side':
        animateCameraTo(new THREE.Vector3(9.5, 1.2, 0.01), new THREE.Vector3(0, 0, 0));
        break;
      case 'power':
        animateCameraTo(new THREE.Vector3(-2.5, 5.0, -3.0), new THREE.Vector3(-1.2, 0, -2.0));
        break;
      case 'flip': {
        const cur = cameraRef.current.position;
        animateCameraTo(new THREE.Vector3(cur.x, -cur.y, cur.z), controlsRef.current.target);
        break;
      }
    }
  }, [animateCameraTo]);

  // Handle Quiz selection
  const handleItemClick = useCallback((type: 'component' | 'pin', id: string) => {
    if (activeMode === 'quiz') {
      const currentQuestion = WEMOS_D1_QUIZ_QUESTIONS[quizIndex];
      const isMatch = currentQuestion.targetId === id;

      if (isMatch) {
        const newScore = quizScore + 1;
        setQuizScore(newScore);
        setQuizFeedback({
          isCorrect: true,
          text: `🎉 Correct! ${currentQuestion.explanation}`,
        });
        if (onQuizScoreChange) {
          onQuizScoreChange(newScore, WEMOS_D1_QUIZ_QUESTIONS.length);
        }
        setTimeout(() => {
          if (quizIndex < WEMOS_D1_QUIZ_QUESTIONS.length - 1) {
            setQuizIndex((prev) => prev + 1);
            setQuizFeedback(null);
            setShowHint(false);
          } else {
            setQuizFeedback({
              isCorrect: true,
              text: `🏆 Quiz Complete! You scored ${newScore}/${WEMOS_D1_QUIZ_QUESTIONS.length}. Outstanding hardware knowledge!`,
            });
          }
        }, 2200);
      } else {
        setQuizFeedback({
          isCorrect: false,
          text: `Not quite. That was ${type === 'component' ? WEMOS_D1_COMPONENTS[id]?.shortName : id}. Click "Show Hint" for guidance.`,
        });
      }
      return;
    }

    if (type === 'component') {
      const comp = WEMOS_D1_COMPONENTS[id] || null;
      onSelectComponent(comp);
      onSelectPin(null);
    } else {
      const pin = WEMOS_D1_PINS.find((p) => p.id === id) || null;
      onSelectPin(pin);
      onSelectComponent(null);
    }
  }, [activeMode, quizIndex, quizScore, onQuizScoreChange, onSelectComponent, onSelectPin]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(6.5, 7.2, 7.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight('#122640', 1.4);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight('#FFFFFF', 2.2);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cyan Fill Light
    const fillLight = new THREE.DirectionalLight('#35D5F2', 1.0);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // Warm Rim Light
    const rimLight = new THREE.DirectionalLight('#528BFF', 0.8);
    rimLight.position.set(0, -10, 0);
    scene.add(rimLight);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.0;
    controls.maxDistance = 18.0;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.minPolarAngle = 0.05;
    controlsRef.current = controls;

    // 6. Build & Add WeMos D1 Procedural Model
    const model = buildWemosD1Model();
    modelResultRef.current = model;
    scene.add(model.group);

    // 7. Raycaster for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(model.interactiveMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        container.style.cursor = 'pointer';

        if (data.type === 'component') {
          const comp = WEMOS_D1_COMPONENTS[data.id];
          setHoveredName(comp?.shortName || data.id);
          model.highlightMarker.position.set(0, -10, 0);
        } else if (data.type === 'pin') {
          const pin = WEMOS_D1_PINS.find((p) => p.id === data.id);
          setHoveredName(`Pin: ${pin?.label || data.id}`);
          const pinPos = model.pinTargetMap.get(data.id);
          if (pinPos) {
            model.highlightMarker.position.set(pinPos.x, pinPos.y + 0.02, pinPos.z);
          }
        }
      } else {
        container.style.cursor = 'default';
        setHoveredName(null);
        model.highlightMarker.position.set(0, -10, 0);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(model.interactiveMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const data = hit.userData;
        handleItemClick(data.type, data.id);
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handlePointerDown);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height || 440;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    const renderLoop = () => {
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera preset smooth lerp transition
      if (targetCamPosRef.current && targetControlsLookAtRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.08);
        controls.target.lerp(targetControlsLookAtRef.current, 0.08);
        if (camera.position.distanceTo(targetCamPosRef.current) < 0.05) {
          targetCamPosRef.current = null;
          targetControlsLookAtRef.current = null;
        }
      }

      // Auto-rotation
      if (isAutoRotating) {
        model.group.rotation.y += 0.4 * delta;
      }

      // Blue Status LED Pulsing
      model.updateLedPulse(elapsedTime);

      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handlePointerDown);
      controls.dispose();
      model.dispose();
      renderer.dispose();
    };
  }, [handleItemClick, isAutoRotating]);

  const currentQuiz = WEMOS_D1_QUIZ_QUESTIONS[quizIndex];

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Top Floating Control Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1 gap-2">
        {/* Mode Selector Tabs */}
        <div className="flex items-center space-x-1 p-1 bg-[#0A1628]/90 border border-[#1F314D] rounded-xl text-xs font-mono">
          <button
            onClick={() => onModeChange('explore')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeMode === 'explore'
                ? 'bg-[#193252] text-[#35D5F2] font-semibold shadow-inner'
                : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => onModeChange('pins')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeMode === 'pins'
                ? 'bg-[#193252] text-[#35D5F2] font-semibold shadow-inner'
                : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pinout</span>
          </button>

          <button
            onClick={() => onModeChange('quiz')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeMode === 'quiz'
                ? 'bg-gradient-to-r from-[#35D5F2]/20 to-[#528BFF]/20 text-[#35D5F2] border border-[#35D5F2]/40 font-semibold'
                : 'text-[#9AAAC0] hover:text-[#F3F7FC]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#35D5F2]" />
            <span>Quiz</span>
          </button>
        </div>

        {/* Quick View Presets Toolbar */}
        <div className="flex items-center space-x-1 bg-[#0A1628]/90 border border-[#1F314D] p-1 rounded-xl text-xs">
          <button
            onClick={() => setPreset('isometric')}
            title="3/4 Isometric View"
            className="p-1.5 hover:bg-[#193252] rounded text-[#9AAAC0] hover:text-[#35D5F2] transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPreset('front')}
            title="Top / Front View"
            className="px-2 py-1 hover:bg-[#193252] rounded text-[#9AAAC0] hover:text-[#35D5F2] text-[11px] font-mono transition-colors cursor-pointer"
          >
            Top
          </button>
          <button
            onClick={() => setPreset('back')}
            title="Bottom / Silkscreen View"
            className="px-2 py-1 hover:bg-[#193252] rounded text-[#9AAAC0] hover:text-[#35D5F2] text-[11px] font-mono transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={() => setPreset('flip')}
            title="180° Flip Front/Back"
            className="p-1.5 hover:bg-[#193252] rounded text-[#9AAAC0] hover:text-[#35D5F2] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'Stop Auto-Rotation' : 'Start Auto-Rotation'}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isAutoRotating ? 'bg-[#193252] text-[#35D5F2]' : 'hover:bg-[#193252] text-[#9AAAC0]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden bg-[#071220]/80 border border-[#18283E] shadow-inner flex items-center justify-center"
      >
        <canvas ref={canvasRef} className="w-full h-full block touch-none" />

        {/* Hover Target Badge */}
        {hoveredName && (
          <div className="absolute top-3 left-3 bg-[#0B1B30]/90 border border-[#35D5F2]/50 px-3 py-1.5 rounded-lg text-xs font-mono text-[#35D5F2] shadow-lg backdrop-blur-md flex items-center space-x-1.5 animate-fadeIn pointer-events-none">
            <Zap className="w-3.5 h-3.5 text-[#35D5F2] animate-pulse" />
            <span className="font-semibold">{hoveredName}</span>
          </div>
        )}

        {/* Instructions Overlay pill at bottom */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#0A1628]/85 border border-[#1F314D] px-2.5 py-1 rounded-md text-[10px] font-mono text-[#9AAAC0] pointer-events-none">
          Left Drag: Rotate • Right Drag: Pan • Scroll: Zoom
        </div>

        {/* Challenge Mode Overlay Card */}
        {activeMode === 'quiz' && currentQuiz && (
          <div className="absolute top-3 inset-x-3 bg-[#0B1A2E]/95 border border-[#35D5F2]/40 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-[#35D5F2] font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHALLENGE {quizIndex + 1} OF {WEMOS_D1_QUIZ_QUESTIONS.length}</span>
              </span>
              <span className="bg-[#142640] border border-[#1F3654] px-2 py-0.5 rounded text-emerald-400 font-bold">
                Score: {quizScore}
              </span>
            </div>

            <p className="text-xs text-[#F3F7FC] font-medium leading-relaxed">
              {currentQuiz.question}
            </p>

            {/* Hint and Feedback */}
            <div className="mt-2 flex items-center justify-between">
              {quizFeedback ? (
                <p className={`text-xs font-mono ${quizFeedback.isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {quizFeedback.text}
                </p>
              ) : (
                <div>
                  {showHint ? (
                    <p className="text-[11px] text-[#35D5F2] font-mono bg-[#112338] p-1.5 rounded border border-[#1F3858]">
                      💡 Hint: {currentQuiz.hint}
                    </p>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-[11px] text-[#9AAAC0] hover:text-[#35D5F2] flex items-center space-x-1 font-mono cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Need a hint?</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
