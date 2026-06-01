"use client";

import type * as THREE from "three";
import { useEffect, useRef } from "react";

export default function ChairViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const container = containerRef.current;
    if (!container) return;

    async function init() {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf5f0ea);

      const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 500);
      camera.position.set(40, 30, 50);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 20;
      controls.maxDistance = 150;
      controls.target.set(0, -30, 0);
      controls.update();

      // Lights
      const ambient = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);

      const dir = new THREE.DirectionalLight(0xfff8e8, 1.0);
      dir.position.set(30, 60, 40);
      dir.castShadow = true;
      scene.add(dir);

      const fill = new THREE.DirectionalLight(0xe8e0ff, 0.3);
      fill.position.set(-30, 20, -20);
      scene.add(fill);

      // Ground shadow plane
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.ShadowMaterial({ opacity: 0.15 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -58;
      ground.receiveShadow = true;
      scene.add(ground);

      // Load chair
      const loader = new GLTFLoader();
      loader.load("/models/chair.glb", (gltf) => {
        gltf.scene.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(gltf.scene);

        // Auto-rotate
        const animate = () => {
          if (!mounted) return;
          requestAnimationFrame(animate);
          gltf.scene.rotation.y += 0.003;
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      });

      // Resize
      const onResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // Cleanup
      return () => {
        mounted = false;
        window.removeEventListener("resize", onResize);
        container.removeChild(renderer.domElement);
        renderer.dispose();
      };
    }

    init();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full min-h-[50vh] rounded-sm overflow-hidden border border-border/30"
    />
  );
}
