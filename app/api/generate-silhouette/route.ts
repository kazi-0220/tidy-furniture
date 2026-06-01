import { NextResponse } from "next/server";

const EMOJI_MAP: Record<string, string> = {
  "熊猫": "🐼", "狗": "🐕", "马": "🐴", "牛": "🐂", "羊": "🐑",
  "猪": "🐷", "鸡": "🐔", "鸭": "🦆", "鹅": "🦢", "鼠": "🐭",
  "猴": "🐵", "虎": "🐯", "狮": "🦁", "狼": "🐺", "鹰": "🦅",
  "蝴蝶": "🦋", "鱼": "🐟", "海豚": "🐬", "乌龟": "🐢", "蛇": "🐍",
  "龙": "🐲", "青蛙": "🐸", "蜘蛛": "🕷️", "蚂蚁": "🐜", "蜗牛": "🐌",
  "猫": "🐱", "鹿": "🦌", "熊": "🐻", "狐狸": "🦊", "企鹅": "🐧",
  "大象": "🐘", "猫头鹰": "🦉", "恐龙": "🦖", "鲸鱼": "🐳", "兔子": "🐰",
};

function emojiFor(name: string): string {
  // exact match first
  if (EMOJI_MAP[name]) return EMOJI_MAP[name];
  // then partial: prefer longer key matches (e.g. "熊猫" over "猫")
  let best = "";
  for (const k of Object.keys(EMOJI_MAP)) {
    if (name.includes(k) && k.length > best.length) best = k;
  }
  if (best) return EMOJI_MAP[best];
  return "🐾";
}

export async function POST(req: Request) {
  try {
    const { animal } = await req.json();
    if (!animal || typeof animal !== "string" || animal.trim().length === 0) {
      return NextResponse.json({ error: "请输入动物名称" }, { status: 400 });
    }

    const prompt = `你是一个 SVG 路径生成器。为"${animal.trim()}"生成一个简易的侧面剪影轮廓数据。
要求：
1. 轮廓应该是该动物侧面的简化剪影，有辨识度的特征（比如兔子的长耳朵、大象的长鼻子）
2. 使用一个整数坐标点数组表示轮廓，每个点是 [x, y]
3. 坐标范围：x 在 0-80 之间，y 在 0-100 之间
4. 底部应该是平的（y=0 附近），表示动物站在地面上
5. 点数在 20-35 个之间
6. 点按顺时针或逆时针顺序排列，形成闭合轮廓
7. 只返回 JSON，格式：{ "points": [[x1,y1], [x2,y2], ...] }
8. 不要任何其他文字，只返回纯 JSON`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "DeepSeek API Key 未配置" }, { status: 500 });
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error?.message || `DeepSeek API 错误: ${response.status}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text: string = data.choices?.[0]?.message?.content?.trim() || "";

    // Extract JSON from response (handle possible markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 返回格式异常，请重试" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const points: [number, number][] = parsed.points;

    if (!Array.isArray(points) || points.length < 10) {
      return NextResponse.json({ error: "AI 生成的点数不足，请重试" }, { status: 500 });
    }

    const id = `ai-${Date.now()}`;
    const name = animal.trim();
    const emoji = emojiFor(name);

    return NextResponse.json({ id, name, emoji, points });
  } catch (err: any) {
    console.error("Silhouette generation error:", err);
    return NextResponse.json(
      { error: err?.message || "生成失败，请重试" },
      { status: 500 }
    );
  }
}
