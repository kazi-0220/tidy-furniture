export interface Decoration {
  id: string;
  name: string;
  emoji: string;
  shape: "cone" | "cylinder" | "sphere" | "box" | "composite";
  color: string;
  scale?: number;
}

export const decorations: Record<string, Decoration[]> = {
  honey_pot: [
    { id: "honey_pot", name: "蜂蜜罐", emoji: "🍯", shape: "cylinder", color: "#f5c842" },
  ],
  fish: [
    { id: "fish", name: "小鱼", emoji: "🐟", shape: "box", color: "#6bafc7" },
  ],
  bone: [
    { id: "bone", name: "骨头", emoji: "🦴", shape: "box", color: "#f0ede8" },
  ],
  leaf_green: [
    { id: "leaf_green", name: "树叶", emoji: "🍃", shape: "box", color: "#8aab73" },
  ],
  cloud: [
    { id: "cloud", name: "云朵", emoji: "☁️", shape: "sphere", color: "#8fb8d6" },
  ],
  acorn: [
    { id: "acorn", name: "橡果", emoji: "🌰", shape: "composite", color: "#8b6b4a" },
  ],
  moon: [
    { id: "moon", name: "月亮", emoji: "🌙", shape: "cone", color: "#f5d742" },
  ],
  leaf_dino: [
    { id: "leaf_dino", name: "树叶", emoji: "🍃", shape: "box", color: "#8aab73" },
  ],
  fish_blue: [
    { id: "fish_blue", name: "小鱼", emoji: "🐟", shape: "box", color: "#6bafc7" },
  ],
  paw: [
    { id: "paw", name: "爪印", emoji: "🐾", shape: "composite", color: "#d4884a" },
  ],
  water_drops: [
    { id: "water_drops", name: "水滴", emoji: "💧", shape: "sphere", color: "#6bafc7" },
  ],
};
