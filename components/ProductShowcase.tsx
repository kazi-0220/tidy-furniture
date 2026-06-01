export default function ProductShowcase() {
  return (
    <div className="aspect-square bg-gradient-to-br from-bg-card to-[#e8e0d6] rounded-xl flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[70%] h-[70%]">
        <path d="M130 310 Q140 250 160 230 Q150 190 145 150 Q145 110 155 80 Q162 60 168 70 Q175 85 180 120 Q185 160 185 200 Q180 230 175 260 Q190 280 200 310 Z"
          fill="#d5ccc2" opacity="0.6" />
        <path d="M200 310 Q210 250 230 230 Q220 190 215 150 Q215 110 225 80 Q232 60 238 70 Q245 85 250 120 Q255 160 255 200 Q250 230 245 260 Q260 280 270 310 Z"
          fill="#d5ccc2" opacity="0.6" />
        <rect x="145" y="235" width="110" height="40" rx="6" fill="#d5ccc2" opacity="0.7" />
        <rect x="155" y="168" width="90" height="35" rx="6" fill="#d5ccc2" opacity="0.5" />
        <circle cx="170" cy="245" r="3" fill="#c85a4a" opacity="0.5" />
        <circle cx="230" cy="245" r="3" fill="#c85a4a" opacity="0.5" />
        <text x="200" y="375" textAnchor="middle" fill="#aaa" fontSize="12" fontFamily="system-ui">
          [ 3D 模型预览 ]
        </text>
      </svg>
    </div>
  );
}
