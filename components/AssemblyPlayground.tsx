"use client";

import type * as THREE from "three";
import { useEffect, useRef, useState, useCallback } from "react";

const PART_COLORS: Record<string, number> = {
  "侧板": 0xc4a882, "靠背": 0xc9ad85, "坐板": 0xd4b896,
  "榫卯": 0xc85a4a, "最后": 0xbfa87a, "兔子": 0xb8956a, "草": 0x8a9a5b,
};
const PART_LABELS: Record<string, string> = {
  "侧板": "左侧板", "靠背": "靠背", "坐板": "坐板",
  "榫卯": "连接件", "最后": "底板", "兔子": "右侧板", "草": "装饰件",
};

const SNAP_DIST = 8; // 磁吸距离阈值

export default function AssemblyPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("加载模型...");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [exploded, setExploded] = useState(true);

  // 零件可见性
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({});

  const stateRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const container = containerRef.current;
    if (!container) return;

    async function init() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      if (!mounted || !containerRef.current) return;

      // 如果已有 renderer 则复用，避免重复创建 canvas
      let renderer = rendererRef.current;
      if (!renderer) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;
      }
      const canvas = renderer.domElement;
      if (!canvas.parentElement) {
        container!.appendChild(canvas);
      }

      const w = container!.clientWidth;
      const h = container!.clientHeight;
      renderer.setSize(w, h);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f0ea);

      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 800);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const dl = new THREE.DirectionalLight(0xfff8e8, 1.0);
      dl.position.set(30, 60, 40); dl.castShadow = true; scene.add(dl);
      const fl = new THREE.DirectionalLight(0xe8e0ff, 0.3);
      fl.position.set(-30, 20, -30); scene.add(fl);
      const rl = new THREE.DirectionalLight(0xffe8e0, 0.25);
      rl.position.set(0, -10, 50); scene.add(rl);

      const grid = new THREE.GridHelper(200, 20, 0xcccccc, 0xe0ddd5);
      grid.position.y = -80; scene.add(grid);

      // ── 加载组装模型 ──
      setStatus("加载 3D 模型...");
      const loader = new GLTFLoader();
      let gltf: any;
      try {
        gltf = await loader.loadAsync("/models/chair.glb");
      } catch (err) {
        console.error(err);
        setStatus("模型加载失败");
        setLoading(false);
        return;
      }
      if (!mounted) return;

      const rawChildren = [...gltf.scene.children] as THREE.Object3D[];

      const parts: {
        name: string;
        rawName: string;
        obj: THREE.Object3D;
        assembledPos: THREE.Vector3;
        explodedPos: THREE.Vector3;
      }[] = [];

      const tempBox = new THREE.Box3();
      const initVisible: Record<string, boolean> = {};

      rawChildren.forEach((child: any) => {
        const rawName: string = child.name || "";
        const displayName = PART_LABELS[rawName] || rawName;
        const color = PART_COLORS[rawName] ?? 0xaaaaaa;

        child.traverse((c: any) => {
          if (c.isMesh && c.geometry) {
            const pos = c.geometry.getAttribute("position");
            if (pos) {
              let dirty = false;
              for (let j = 0; j < pos.array.length; j++) {
                if (!Number.isFinite(pos.array[j])) { pos.array[j] = 0; dirty = true; }
              }
              if (dirty) pos.needsUpdate = true;
            }
            try { c.geometry.computeVertexNormals(); } catch (_) {}
            try { c.geometry.computeBoundingSphere(); } catch (_) {}
            try { c.geometry.computeBoundingBox(); } catch (_) {}

            c.material = new THREE.MeshStandardMaterial({
              color, roughness: 0.6, metalness: 0.05,
              side: THREE.DoubleSide,
            });
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });

        child.updateMatrixWorld();
        scene.add(child);
        initVisible[displayName] = true;

        parts.push({
          name: displayName,
          rawName,
          obj: child,
          assembledPos: new THREE.Vector3(0, 0, 0),
          explodedPos: new THREE.Vector3(),
        });
      });

      if (parts.length === 0) {
        setStatus("无零件数据");
        setLoading(false);
        return;
      }

      setVisibleMap(initVisible);

      // ── 计算炸开位置 ──
      const allCenter = new THREE.Vector3();
      parts.forEach((p) => {
        tempBox.setFromObject(p.obj);
        allCenter.add(tempBox.getCenter(new THREE.Vector3()));
      });
      allCenter.divideScalar(parts.length);

      parts.forEach((p) => {
        tempBox.setFromObject(p.obj);
        const c = tempBox.getCenter(new THREE.Vector3());
        const dir = c.clone().sub(allCenter);
        const dist = dir.length();
        if (dist < 0.5) {
          p.explodedPos.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80);
        } else {
          dir.normalize();
          p.explodedPos.copy(c.clone().add(dir.multiplyScalar(Math.max(dist * 2.0, 40))));
        }
        // 初始炸开
        p.obj.position.copy(p.explodedPos);
      });

      // ── 相机 ──
      const fullBox = new THREE.Box3();
      parts.forEach((p) => fullBox.expandByPoint(p.explodedPos));
      const size = fullBox.getSize(new THREE.Vector3());
      const camTarget = fullBox.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(
        camTarget.x + maxDim * 0.4,
        camTarget.y + maxDim * 0.1,
        camTarget.z + maxDim * 1.3,
      );
      camera.lookAt(camTarget);
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position.clone().sub(camTarget));

      // ── 交互 ──
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      let selected: typeof parts[0] | null = null;
      let isDragging = false, isOrbiting = false;
      let prevX = 0, prevY = 0;
      const dragPlane = new THREE.Plane();
      const dragOffset = new THREE.Vector3();

      const getMeshes = () => {
        const ms: THREE.Object3D[] = [];
        parts.forEach((p) => {
          if (p.obj.visible) p.obj.traverse((c: any) => { if (c.isMesh) ms.push(c); });
        });
        return ms;
      };

      const getHits = (cx: number, cy: number) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects(getMeshes());
      };

      const findPart = (hitObj: THREE.Object3D) => {
        let cur: THREE.Object3D | null = hitObj;
        while (cur) {
          for (const p of parts) if (p.obj === cur) return p;
          cur = cur.parent;
        }
        return null;
      };

      const highlight = (part: typeof parts[0] | null) => {
        parts.forEach((p) => {
          p.obj.traverse((c: any) => {
            if (c.isMesh && c.material.emissive) {
              c.material.emissive.set(part === p ? 0x333333 : 0x000000);
              c.material.emissiveIntensity = part === p ? 1 : 0;
            }
          });
        });
        setSelectedName(part ? part.name : null);
      };

      // canvas 变量已在函数开头定义

      canvas.addEventListener("pointerdown", (e: PointerEvent) => {
        prevX = e.clientX; prevY = e.clientY;
        if (e.button === 2) { isOrbiting = true; return; }
        if (e.button !== 0) return;

        const hits = getHits(e.clientX, e.clientY);
        if (hits.length > 0) {
          const part = findPart(hits[0].object);
          if (part) {
            selected = part;
            isDragging = true;
            canvas.style.cursor = "grabbing";
            dragOffset.copy(hits[0].point).sub(part.obj.position);
            const cd = new THREE.Vector3();
            camera.getWorldDirection(cd);
            dragPlane.setFromNormalAndCoplanarPoint(cd, part.obj.position);
            highlight(part);
            return;
          }
        }
        highlight(null);
        isOrbiting = true;
      });

      canvas.addEventListener("pointermove", (e: PointerEvent) => {
        if (isDragging && selected) {
          getHits(e.clientX, e.clientY);
          const pt = new THREE.Vector3();
          raycaster.ray.intersectPlane(dragPlane, pt);
          selected.obj.position.copy(pt.sub(dragOffset));
          return;
        }
        if (isOrbiting) {
          const dx = e.clientX - prevX;
          const dy = e.clientY - prevY;
          spherical.theta -= dx * 0.006;
          spherical.phi -= dy * 0.006;
          spherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, spherical.phi));
          camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(camTarget));
          camera.lookAt(camTarget);
          prevX = e.clientX; prevY = e.clientY;
          return;
        }
        canvas.style.cursor = getHits(e.clientX, e.clientY).length > 0 ? "grab" : "default";
      });

      const onPointerUp = () => {
        // ── 磁吸判定 ──
        if (selected && isDragging) {
          const dist = selected.obj.position.length(); // 组装位在原点
          if (dist < SNAP_DIST && dist > 0.01) {
            // 磁吸动画：快速 lerp 到组装位
            const start = selected.obj.position.clone();
            const target = new THREE.Vector3(0, 0, 0);
            const snapStart = performance.now();
            const snapDuration = 150; // ms

            const snapAnim = (now: number) => {
              const elapsed = now - snapStart;
              const t = Math.min(elapsed / snapDuration, 1);
              // easeOutBack
              const c1 = 1.70158;
              const c3 = c1 + 1;
              const val = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
              selected!.obj.position.lerpVectors(start, target, val);
              if (t < 1) {
                requestAnimationFrame(snapAnim);
              } else {
                selected!.obj.position.copy(target);
              }
            };
            requestAnimationFrame(snapAnim);
          }
        }
        isDragging = false;
        isOrbiting = false;
        selected = null;
        canvas.style.cursor = "default";
      };
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointerleave", onPointerUp);
      canvas.addEventListener("contextmenu", (e: Event) => e.preventDefault());

      canvas.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();
        spherical.radius = Math.max(30, Math.min(400, spherical.radius + e.deltaY * 0.15));
        camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(camTarget));
        camera.lookAt(camTarget);
      });

      const onResize = () => {
        const cw = container!.clientWidth, ch = container!.clientHeight;
        camera.aspect = cw / ch; camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      };
      window.addEventListener("resize", onResize);

      // ── 动画循环（仅负责渲染）──
      const animate = () => {
        if (!mounted) return;
        animRef.current = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      stateRef.current = {
        parts, targetExploded: true, spherical, camTarget, camera, scene,
      };

      setLoading(false);
      setStatus("");
      animate();

      console.log(
        `✅ 加载完成: ${parts.length} 个零件`,
        parts.map((p) => p.name),
      );
    }

    init();

    return () => {
      mounted = false;
      cancelAnimationFrame(animRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      stateRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 按钮操作 ──
  const toggleExplode = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const next = !s.targetExploded;
    s.targetExploded = next;
    // 立即切换所有零件位置
    s.parts.forEach((p: any) => {
      p.obj.position.copy(next ? p.explodedPos : p.assembledPos);
    });
    setExploded(next);
    if (!next) setSelectedName(null);
  }, []);

  const togglePart = useCallback((name: string) => {
    const s = stateRef.current;
    if (!s || !s.parts) return;
    const part = s.parts.find((p: any) => p.name === name);
    if (!part) return;
    part.obj.visible = !part.obj.visible;
    setVisibleMap((prev) => ({ ...prev, [name]: part.obj.visible }));
  }, []);

  const snapAll = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.parts) return;
    s.targetExploded = false;
    // 立即设置所有零件位置（不用 lerp）
    s.parts.forEach((p: any) => p.obj.position.set(0, 0, 0));
    setExploded(false);
    setSelectedName(null);
  }, []);

  const scatterAll = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.parts) return;
    s.targetExploded = true;
    // 立即设置所有零件到炸开位置
    s.parts.forEach((p: any) => p.obj.position.copy(p.explodedPos));
    setExploded(true);
  }, []);

  const parts = stateRef.current?.parts || [];
  const partNames: string[] = parts.map((p: any) => p.name);

  return (
    <div className="space-y-3">
      {/* ── 主操作按钮 ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={toggleExplode}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-sm border border-primary/30 bg-white hover:bg-primary/5 transition-colors disabled:opacity-40"
        >
          {exploded ? "🔧 全部组装" : "💥 全部炸开"}
        </button>
        <button
          onClick={snapAll}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-sm border border-green-500/30 bg-white hover:bg-green-50 transition-colors disabled:opacity-40"
        >
          🧲 磁吸归位
        </button>
        <button
          onClick={scatterAll}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-sm border border-amber-500/30 bg-white hover:bg-amber-50 transition-colors disabled:opacity-40"
        >
          💨 全部散开
        </button>
        {selectedName && (
          <span className="text-sm text-text-light">
            已选中: <span className="text-primary font-medium">{selectedName}</span>
            <span className="text-xs text-text-muted ml-2">拖动靠近中心自动吸附</span>
          </span>
        )}
        {!selectedName && !loading && (
          <span className="text-xs text-text-muted">
            拖拽零件靠近中心 → 磁吸归位 · 拖空白处旋转 · 滚轮缩放
          </span>
        )}
      </div>

      {/* ── 3D 视口 ── */}
      <div ref={containerRef} className="relative w-full h-[520px] rounded-sm overflow-hidden border border-border/30 bg-[#f5f0ea]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f0ea]/80 z-10">
            <div className="text-sm text-text-light mb-2">{status}</div>
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* ── 零件切换按钮 ── */}
      <div className="flex gap-2 flex-wrap">
        {partNames.map((name: string) => {
          const visible = visibleMap[name] ?? true;
          const color = Object.entries(PART_COLORS).find(
            ([k]) => PART_LABELS[k] === name,
          )?.[1] ?? 0x888888;
          return (
            <button
              key={name}
              onClick={() => togglePart(name)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-sm border transition-all ${
                visible
                  ? "border-primary/30 bg-white text-text"
                  : "border-border bg-transparent text-text-muted line-through"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: `#${color.toString(16).padStart(6, "0")}`, opacity: visible ? 1 : 0.3 }}
              />
              {name}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-text-muted text-center">
        提示：拖动零件靠近屏幕中心即自动磁吸归位，松开即吸附
      </p>
    </div>
  );
}
