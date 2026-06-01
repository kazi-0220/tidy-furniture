export interface Silhouette {
  id: string;
  name: string;
  emoji: string;
  points: [number, number][];
  structureDividingY: number;
  decorations: string[];
}

const structureDividingY = 35;

// Shared structural zone (Y ≤ 35) — same for all animals
const structuralFront: [number, number][] = [
  [0.0, 0.0],
  [0.1, 0.4],
  [1.8, 3.5],
  [7.5, 9.5],
  [1.9, 13.1],
  [0.5, 15.4],
  [0.0, 18.0],
  [1.0, 23.0],
  [4.8, 29.0],
  [3.0, 35.0],
];

const structuralBack: [number, number][] = [
  [16.0, 35.0],
  [22.6, 28.3],
  [32.9, 26.4],
  [36.9, 24.1],
  [39.9, 21.2],
  [43.4, 13.1],
  [45.0, 0.0],
];

const structuralBottom: [number, number][] = [
  [31.2, 0.0],
  [30.9, 1.7],
  [28.9, 4.4],
  [25.9, 6.0],
  [22.5, 6.6],
  [19.1, 6.0],
  [16.1, 4.4],
  [13.9, 0.0],
  [1.4, 0.0],
  [0.6, 0.6],
  [0.0, 0.0],
];

function fullPoints(styling: [number, number][]): [number, number][] {
  const mid = styling.slice(1, -1);
  return [...structuralFront, ...mid, ...structuralBack, ...structuralBottom];
}

// ── 小熊 (Bear): Round head, small round ears ──
const bear: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [1.0, 44.5],
  [2.5, 46.0],
  [4.0, 47.0],
  [4.5, 49.0],  // left ear
  [5.5, 50.0],
  [6.5, 49.0],
  [7.0, 47.0],
  [8.0, 46.0],  // between ears
  [9.0, 47.0],
  [9.5, 49.0],  // right ear
  [10.5, 50.0],
  [11.5, 49.0],
  [12.0, 47.0],
  [13.0, 45.0],
  [14.0, 42.0],
  [15.0, 39.0],
  [16.0, 35.0],
];

// ── 小猫 (Cat): Pointed triangular ears, slim ──
const cat: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [1.0, 44.0],
  [2.0, 45.5],
  [2.5, 48.0],  // left ear tip
  [3.0, 50.0],
  [4.0, 47.0],
  [5.5, 45.0],  // between ears
  [7.0, 47.0],
  [7.5, 50.0],  // right ear tip
  [8.0, 48.0],
  [9.0, 45.5],
  [11.0, 44.0],
  [13.0, 42.0],
  [14.5, 39.0],
  [16.0, 35.0],
];

// ── 小狗 (Dog): Floppy ears hanging down, longer snout ──
const dog: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 45.0],  // snout tip
  [0.5, 46.5],
  [2.0, 47.0],
  [3.5, 46.0],  // left floppy ear
  [4.0, 43.0],
  [5.0, 40.0],
  [6.0, 42.0],
  [8.0, 44.0],
  [10.0, 43.0], // right floppy ear
  [11.0, 40.0],
  [12.0, 42.0],
  [13.5, 41.0],
  [15.0, 38.0],
  [16.0, 35.0],
];

// ── 长颈鹿 (Giraffe): Long neck, ossicones on top ──
const giraffe: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 45.0],
  [0.5, 47.0],
  [1.5, 48.5],
  [2.0, 49.5],  // left ossicone
  [2.5, 50.0],
  [3.0, 49.0],
  [3.5, 47.5],
  [4.0, 46.0],  // neck dip
  [5.0, 47.5],
  [5.5, 49.0],
  [6.0, 50.0],  // right ossicone
  [6.5, 49.5],
  [7.0, 48.0],
  [8.0, 46.0],
  [10.0, 44.0],
  [12.0, 42.0],
  [14.0, 39.0],
  [16.0, 35.0],
];

// ── 大象 (Elephant): Large round head, trunk hanging down ──
const elephant: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 44.0],  // trunk tip
  [0.0, 46.0],
  [0.5, 47.5],
  [1.5, 48.5],
  [3.0, 49.0],
  [5.0, 49.5],
  [7.0, 50.0],  // head top
  [9.0, 49.5],
  [10.5, 48.0],
  [11.5, 46.0],
  [12.5, 43.0],
  [14.0, 40.0],
  [15.0, 37.0],
  [16.0, 35.0],
];

// ── 狐狸 (Fox): Pointed ears, long snout ──
const fox: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 45.0],  // snout tip
  [0.5, 47.0],
  [1.5, 48.5],
  [2.0, 50.0],  // left ear tip
  [3.0, 47.0],
  [4.5, 45.5],  // between ears
  [6.0, 47.0],
  [6.5, 50.0],  // right ear tip
  [7.5, 48.5],
  [8.5, 46.0],
  [10.0, 44.0],
  [12.0, 42.0],
  [14.0, 39.0],
  [16.0, 35.0],
];

// ── 猫头鹰 (Owl): Round head, large eyes ──
const owl: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.5, 44.0],
  [1.0, 46.0],
  [2.0, 47.5],
  [3.5, 48.5],
  [5.5, 49.0],
  [7.5, 49.0],
  [9.5, 48.5],
  [11.0, 47.0],
  [12.0, 45.0],
  [13.0, 42.0],
  [14.0, 39.0],
  [15.0, 37.0],
  [16.0, 35.0],
];

// ── 恐龙 (Dinosaur): Bumpy back, tail ──
const dinosaur: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 44.0],  // snout
  [0.5, 46.0],
  [1.5, 47.5],
  [3.0, 48.0],  // head top
  [4.5, 47.0],
  [5.0, 45.0],  // neck dip
  [5.5, 46.0],
  [6.0, 47.0],  // bump 1
  [7.0, 46.0],
  [7.5, 47.0],  // bump 2
  [8.5, 45.5],
  [9.0, 46.5],  // bump 3
  [10.0, 44.0],
  [12.0, 41.0],
  [14.0, 38.0],
  [16.0, 35.0],
];

// ── 企鹅 (Penguin): Round body, small head ──
const penguin: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.5, 44.0],
  [1.0, 46.0],
  [2.0, 47.5],
  [4.0, 48.5],
  [6.0, 49.0],
  [8.0, 48.5],
  [10.0, 47.0],
  [11.5, 44.0],
  [12.5, 41.0],
  [14.0, 38.0],
  [15.0, 36.5],
  [16.0, 35.0],
];

// ── 老虎 (Tiger): Round head, small ears ──
const tiger: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 44.5],  // snout
  [0.5, 46.5],
  [1.5, 48.0],
  [2.5, 49.0],  // left ear
  [3.5, 49.5],
  [4.5, 48.0],
  [6.0, 46.5],  // between ears
  [7.5, 48.0],
  [8.5, 49.5],  // right ear
  [9.5, 49.0],
  [10.5, 47.0],
  [12.0, 44.0],
  [14.0, 40.0],
  [15.0, 37.0],
  [16.0, 35.0],
];

// ── 鲸鱼 (Whale): Large round body, tail flukes ──
const whale: [number, number][] = [
  [3.0, 35.0],
  [1.5, 38.0],
  [0.5, 42.0],
  [0.0, 44.0],  // mouth
  [0.0, 46.0],
  [0.5, 47.5],
  [2.0, 48.5],
  [4.0, 49.0],
  [6.0, 49.5],  // body top
  [8.0, 49.0],
  [10.0, 47.5],
  [12.0, 45.0],
  [13.5, 42.0],
  [14.5, 39.0],
  [15.5, 36.5],
  [16.0, 35.0],
];

export const silhouettes: Silhouette[] = [
  {
    id: "bear", name: "小熊", emoji: "🐻",
    points: fullPoints(bear),
    structureDividingY,
    decorations: ["honey_pot"],
  },
  {
    id: "cat", name: "小猫", emoji: "🐱",
    points: fullPoints(cat),
    structureDividingY,
    decorations: ["fish"],
  },
  {
    id: "dog", name: "小狗", emoji: "🐶",
    points: fullPoints(dog),
    structureDividingY,
    decorations: ["bone"],
  },
  {
    id: "giraffe", name: "长颈鹿", emoji: "🦒",
    points: fullPoints(giraffe),
    structureDividingY,
    decorations: ["leaf_green"],
  },
  {
    id: "elephant", name: "大象", emoji: "🐘",
    points: fullPoints(elephant),
    structureDividingY,
    decorations: ["cloud"],
  },
  {
    id: "fox", name: "狐狸", emoji: "🦊",
    points: fullPoints(fox),
    structureDividingY,
    decorations: ["acorn"],
  },
  {
    id: "owl", name: "猫头鹰", emoji: "🦉",
    points: fullPoints(owl),
    structureDividingY,
    decorations: ["moon"],
  },
  {
    id: "dinosaur", name: "恐龙", emoji: "🦖",
    points: fullPoints(dinosaur),
    structureDividingY,
    decorations: ["leaf_dino"],
  },
  {
    id: "penguin", name: "企鹅", emoji: "🐧",
    points: fullPoints(penguin),
    structureDividingY,
    decorations: ["fish_blue"],
  },
  {
    id: "tiger", name: "老虎", emoji: "🐯",
    points: fullPoints(tiger),
    structureDividingY,
    decorations: ["paw"],
  },
  {
    id: "whale", name: "鲸鱼", emoji: "🐳",
    points: fullPoints(whale),
    structureDividingY,
    decorations: ["water_drops"],
  },
];
