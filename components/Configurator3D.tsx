"use client";

import { useEffect, useRef } from "react";
import type { Silhouette } from "@/data/silhouettes";
import { decorations, type Decoration } from "@/data/decorations";

interface Props {
  silhouette: Silhouette;
  woodColor: string;
  tenonColor: string;
  decorationId?: string;
}

export default function Configurator3D({ silhouette, woodColor, tenonColor, decorationId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let mounted = true;

    async function setup() {
      const THREE = await import("three");

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f0ea);

      const w = container.clientWidth;
      const h = container.clientHeight;
      const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 500);
      camera.position.set(55, 15, 65);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dl = new THREE.DirectionalLight(0xfff8e8, 1.2);
      dl.position.set(30, 60, 40);
      dl.castShadow = true;
      scene.add(dl);
      const fl = new THREE.DirectionalLight(0xe8e0ff, 0.3);
      fl.position.set(-30, 20, -30);
      scene.add(fl);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 120),
        new THREE.ShadowMaterial({ opacity: 0.1 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -32;
      ground.receiveShadow = true;
      scene.add(ground);

      const target = new THREE.Vector3(0, -2, 0);
      camera.lookAt(target);
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));

      let orbiting = false, px = 0, py = 0;
      renderer.domElement.addEventListener("pointerdown", (e: PointerEvent) => {
        if (e.button === 0 || e.button === 2) { orbiting = true; px = e.clientX; py = e.clientY; }
      });
      renderer.domElement.addEventListener("pointermove", (e: PointerEvent) => {
        if (!orbiting) return;
        spherical.theta -= (e.clientX - px) * 0.01;
        spherical.phi -= (e.clientY - py) * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(target));
        camera.lookAt(target);
        px = e.clientX; py = e.clientY;
      });
      renderer.domElement.addEventListener("pointerup", () => { orbiting = false; });
      renderer.domElement.addEventListener("wheel", (e: WheelEvent) => {
        spherical.radius = Math.max(20, Math.min(150, spherical.radius + e.deltaY * 0.1));
        camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(target));
        camera.lookAt(target);
      });
      renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

      ctxRef.current = { scene, THREE };
      const animate = () => { if (!mounted) return; requestAnimationFrame(animate); renderer.render(scene, camera); };
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }

    setup();
    return () => { mounted = false; };
  }, []);

  // Rebuild parts
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { scene, THREE } = ctx;

    const old: any[] = [];
    scene.traverse((c: any) => { if (c.userData?.configPart) old.push(c); });
    old.forEach((c) => c.parent?.remove(c));

    const woodN = parseInt(woodColor.replace("#", ""), 16);
    const redN = parseInt(tenonColor.replace("#", ""), 16);
    const woodM = new THREE.MeshStandardMaterial({ color: woodN, roughness: 0.6, metalness: 0.05 });
    const redM = new THREE.MeshStandardMaterial({ color: redN, roughness: 0.4, metalness: 0.05 });

    const add = (m: THREE.Mesh | THREE.Group) => {
      m.userData.configPart = true;
      m.traverse?.((c: any) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      scene.add(m);
    };

    // ── Side panels: load Blender-generated GLB ──
    (async () => {
    const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
    const loader = new GLTFLoader();

    const loadPanel = (url: string): Promise<THREE.Group> =>
      new Promise((resolve, reject) => loader.load(url, resolve, undefined, reject));

    try {
      const gltf = await loadPanel("/models/ai_rabbit_panel.glb");
      const panelTemplate = gltf.scene;
      // Blender model is in meters (0.45m), scale to scene units (×100 = 45 units)
      panelTemplate.scale.set(100, 100, 100);
      panelTemplate.traverse((c: any) => {
        if (c.isMesh) { c.material = woodM.clone(); c.castShadow = true; c.receiveShadow = true; }
      });

      // Left panel
      const leftP = panelTemplate.clone();
      leftP.rotation.y = -Math.PI / 2;
      leftP.position.set(-15, 0, 0);
      add(leftP);

      // Right panel (mirrored)
      const rightP = panelTemplate.clone();
      rightP.rotation.y = Math.PI / 2;
      rightP.position.set(15, 0, 0);
      rightP.scale.x *= -1;
      add(rightP);
    } catch (e) {
      console.error("Failed to load panel GLB:", e);
      // Fallback: procedural extrusion
      const pts = silhouette.points;
      const maxX = Math.max(...pts.map((p: number[]) => p[0]));
      const maxY = Math.max(...pts.map((p: number[]) => p[1]));
      const n = (x: number, y: number): [number, number] => [
        (x / maxX) * 45 - 22.5,
        (y / maxY) * 50 - 25,
      ];
      const shape = new THREE.Shape();
      const [fx, fy] = n(pts[0][0], pts[0][1]);
      shape.moveTo(fx, fy);
      for (let i = 1; i < pts.length; i++) {
        const [nx, ny] = n(pts[i][0], pts[i][1]);
        shape.lineTo(nx, ny);
      }
      shape.closePath();
      const panelGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 3, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 2,
      });
      const leftP = new THREE.Mesh(panelGeo, woodM);
      leftP.rotation.y = -Math.PI / 2;
      leftP.position.set(-15, 0, 0);
      add(leftP);
      const rightP = new THREE.Mesh(panelGeo, woodM);
      rightP.rotation.y = Math.PI / 2;
      rightP.position.set(15, 0, 0);
      rightP.scale.x = -1;
      add(rightP);
    }
    })(); // end async IIFE

    // ── Seat: horizontal board 300×300mm (30×30), 3mm thick ──
    const seat = new THREE.Mesh(new THREE.BoxGeometry(26, 3, 30, 2, 2, 2), woodM);
    seat.position.set(0, -8, 0);
    add(seat);

    // ── Backrest: 300w × 250h, slightly tilted ──
    const back = new THREE.Mesh(new THREE.BoxGeometry(26, 25, 3, 2, 2, 2), woodM);
    back.position.set(0, 10, -12);
    back.rotation.x = -0.12;
    add(back);

    // ── Bottom cross bar (red, below seat) ──
    const rodGeo = new THREE.CylinderGeometry(1.2, 1.2, 30, 16);
    const rodBottom = new THREE.Mesh(rodGeo, redM);
    rodBottom.rotation.z = Math.PI / 2;
    rodBottom.position.set(0, -18, 8);
    add(rodBottom);

    // ── Top cross bar (red, at top between side panels) ──
    const rodTop = new THREE.Mesh(rodGeo, redM);
    rodTop.rotation.z = Math.PI / 2;
    rodTop.position.set(0, 18, -8);
    add(rodTop);

    // ── Trapezoidal tenon ends visible on side panel exteriors ──
    const tenonGeo = new THREE.BoxGeometry(2, 5, 2, 1, 1, 1);
    [
      [-16, -8, -12], [16, -8, -12],
      [-16, -8, 12], [16, -8, 12],
      [-16, 8, -14], [16, 8, -14],
    ].forEach(([x, y, z]) => {
      const t = new THREE.Mesh(tenonGeo, redM);
      t.position.set(x, y, z);
      add(t);
    });

    // ── Decoration (side panel exterior, both sides) ──
    const currentDeco = decorationId
      ? Object.values(decorations).flat().find((d) => d.id === decorationId)
      : null;

    if (currentDeco) {
      const decoColor = parseInt(currentDeco.color.replace("#", ""), 16);
      const decoMat = new THREE.MeshStandardMaterial({ color: decoColor, roughness: 0.5 });

      const makeDeco = (): THREE.Group => {
        const g = new THREE.Group();

        if (currentDeco.id === "honey_pot") {
          const body = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 5, 12), decoMat);
          body.position.x = 2;
          body.rotation.z = Math.PI / 2;
          g.add(body);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(2, 0.3, 8, 12), decoMat);
          rim.position.set(4.5, 0, 0);
          g.add(rim);
        } else if (currentDeco.id === "fish") {
          const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 3, 2, 1, 2), decoMat);
          body.position.x = 2;
          g.add(body);
          const tail = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 6), decoMat);
          tail.position.set(-1, 0, 0);
          tail.rotation.z = Math.PI / 2;
          g.add(tail);
        } else if (currentDeco.id === "fish_blue") {
          const body = new THREE.Mesh(new THREE.BoxGeometry(3, 1.5, 3, 2, 1, 2), decoMat);
          body.position.x = 2;
          g.add(body);
          const tail = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 6), decoMat);
          tail.position.set(-1, 0, 0);
          tail.rotation.z = Math.PI / 2;
          g.add(tail);
        } else if (currentDeco.id === "bone") {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(3, 1, 1.5, 2, 1, 1), decoMat);
          bar.position.x = 2.5;
          g.add(bar);
          for (const dx of [-1, 1]) {
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), decoMat);
            knob.position.set(2.5 + dx * 1.8, 0, 0);
            g.add(knob);
          }
        } else if (currentDeco.id === "leaf_green" || currentDeco.id === "leaf_dino") {
          const leaf = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 4, 2, 1, 2), decoMat);
          leaf.position.x = 2.5;
          leaf.rotation.z = 0.2;
          g.add(leaf);
        } else if (currentDeco.id === "cloud") {
          const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 10), decoMat);
          c1.position.set(2, 0.5, 0);
          g.add(c1);
          const c2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10), decoMat);
          c2.position.set(3.2, 0.3, 0);
          g.add(c2);
          const c3 = new THREE.Mesh(new THREE.SphereGeometry(1.0, 10, 10), decoMat);
          c3.position.set(1.5, -0.3, 0);
          g.add(c3);
        } else if (currentDeco.id === "acorn") {
          const body = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 10), decoMat);
          body.position.set(2.5, -0.5, 0);
          body.scale.set(1, 1.2, 1);
          g.add(body);
          const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.8, 10), decoMat);
          cap.position.set(2.5, 0.8, 0);
          cap.rotation.z = Math.PI / 2;
          g.add(cap);
        } else if (currentDeco.id === "moon") {
          const moon = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.5, 8, 16, Math.PI * 1.3), decoMat);
          moon.position.x = 2.5;
          moon.rotation.z = -0.3;
          g.add(moon);
        } else if (currentDeco.id === "paw") {
          const pad = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10), decoMat);
          pad.position.set(2.5, -0.5, 0);
          pad.scale.set(1, 0.8, 1);
          g.add(pad);
          for (const [dx, dy] of [[-1, 1.2], [0, 1.8], [1, 1.2]]) {
            const toe = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), decoMat);
            toe.position.set(2.5 + dx * 0.8, dy, 0);
            g.add(toe);
          }
        } else if (currentDeco.id === "water_drops") {
          for (const [dx, dy, s] of [[0, 0, 1], [-1.5, -1, 0.7], [1.5, -0.5, 0.8]]) {
            const drop = new THREE.Mesh(new THREE.SphereGeometry(1.0 * s, 10, 10), decoMat);
            drop.position.set(2.5 + dx, dy, 0);
            drop.scale.set(0.8, 1.2, 0.8);
            g.add(drop);
          }
        } else {
          // fallback
          const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), decoMat);
          mesh.position.x = 2.5;
          g.add(mesh);
        }
        return g;
      };

      const decoR = makeDeco();
      decoR.position.set(19, -7, 0);
      decoR.rotation.z = 0.3;
      add(decoR);

      const decoL = makeDeco();
      decoL.position.set(-19, -7, 0);
      decoL.scale.x = -1;
      decoL.rotation.z = -0.3;
      add(decoL);
    }
  }, [silhouette, woodColor, tenonColor, decorationId]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-border/30" />
  );
}
