"use client";

import { useState, useMemo, useEffect } from "react";
import Configurator3D from "@/components/Configurator3D";
import { silhouettes as presets, type Silhouette } from "@/data/silhouettes";
import { decorations } from "@/data/decorations";

const woods = [
  { id: "walnut", name: "北美黑胡桃", color: "#5c3d2e" },
  { id: "cherry", name: "樱桃木", color: "#c49a6c" },
  { id: "oak", name: "白橡木", color: "#d4c5a9" },
  { id: "beech", name: "榉木", color: "#e8d5b0" },
  { id: "ash", name: "白蜡木", color: "#c1a87d" },
];

const tenonColors = [
  "#c85a4a", "#f5a623", "#7eb8da", "#8bc34a", "#9b59b6", "#e74c3c",
];

export default function ConfiguratorPage() {
  const [aiList, setAiList] = useState<Silhouette[]>([]);
  const allSilhouettes = [...presets, ...aiList];
  const [selected, setSelected] = useState(allSilhouettes[0]);
  const [wood, setWood] = useState(woods[0]);
  const [tenon, setTenon] = useState(tenonColors[0]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [decorationId, setDecorationId] = useState<string | undefined>(() => {
    const g = decorations[presets[0]?.decorations?.[0] ?? ""];
    return g?.[0]?.id;
  });

  const availableDecorations = useMemo(() => {
    const keys = selected.decorations;
    return keys.flatMap((key) => decorations[key] || []);
  }, [selected]);

  useEffect(() => {
    if (availableDecorations.length > 0 && !availableDecorations.find((d) => d.id === decorationId)) {
      setDecorationId(availableDecorations[0]?.id);
    }
  }, [selected.id]);

  return (
    <div className="flex flex-col lg:flex-row pt-16 min-h-screen">
      {/* Left Panel */}
      <div className="lg:w-[380px] shrink-0 p-6 lg:p-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto space-y-8">
        <div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">Step 1</span>
          <h2 className="text-xl font-medium text-text mt-1 mb-4">选择形状</h2>
          <div className="grid grid-cols-6 gap-2">
            {allSilhouettes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                  selected.id === s.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:border-primary/30 hover:bg-bg-card/50"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[10px] text-text-light">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Decoration picker */}
          <div className="mt-6">
            <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">可选饰件</span>
            <div className="flex gap-2 mt-2">
              {availableDecorations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDecorationId(d.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-sm ${
                    decorationId === d.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/50 hover:border-primary/30 text-text-muted"
                  }`}
                >
                  <span className="text-lg">{d.emoji}</span>
                  <span>{d.name}</span>
                </button>
              ))}
            </div>
          </div>

        {/* AI input */}
        <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="或输入动物名称，AI 生成"
              value={aiInput}
              onChange={(e) => { setAiInput(e.target.value); setAiError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("ai-gen-btn")?.click(); }}
              className="flex-1 px-3 py-2 rounded-lg border border-border/60 text-sm bg-white/50 text-text-light placeholder:text-text-muted focus:outline-none focus:border-primary/40"
            />
            <button
              id="ai-gen-btn"
              disabled={!aiInput.trim() || aiLoading}
              onClick={async () => {
                const name = aiInput.trim();
                if (!name) return;
                setAiLoading(true);
                setAiError("");
                try {
                  const res = await fetch("/api/generate-silhouette", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ animal: name }),
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "生成失败");
                  const generated: Silhouette = data;
                  setAiList((prev) => [...prev, generated]);
                  setSelected(generated);
                  setAiInput("");
                } catch (err: any) {
                  setAiError(err.message || "生成失败，请重试");
                } finally {
                  setAiLoading(false);
                }
              }}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiLoading ? "生成中..." : "生成"}
            </button>
          </div>
          {aiError && <p className="text-[10px] text-red-500 mt-1">{aiError}</p>}
          {!aiError && <p className="text-[10px] text-text-muted mt-1">输入动物名称，AI 自动生成剪影轮廓</p>}
        </div>

        <div>
          <span className="text-[11px] tracking-[0.2em] uppercase text-text-muted">Step 2</span>
          <h2 className="text-xl font-medium text-text mt-1 mb-4">选择材质</h2>

          <h3 className="text-sm font-medium text-text mb-2">木板</h3>
          <div className="space-y-2">
            {woods.map((w) => (
              <button
                key={w.id}
                onClick={() => setWood(w)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${
                  wood.id === w.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/20"
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg shadow-sm shrink-0"
                  style={{ background: w.color }}
                />
                <span className="text-sm text-text">{w.name}</span>
                {wood.id === w.id && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-medium text-text mb-2 mt-6">榫卯颜色</h3>
          <div className="flex gap-3">
            {tenonColors.map((c) => (
              <button
                key={c}
                onClick={() => setTenon(c)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  tenon === c ? "border-primary scale-110 shadow-md" : "border-white shadow-sm"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right 3D Preview */}
      <div className="flex-1 p-4 lg:p-6 min-h-[500px]">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <Configurator3D
            silhouette={selected}
            woodColor={wood.color}
            tenonColor={tenon}
            decorationId={decorationId}
          />
        </div>
      </div>
    </div>
  );
}
