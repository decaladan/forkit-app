import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ForkIt — What the fuck do I eat?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffc737",
          position: "relative",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "5px solid #000",
              borderRadius: 16,
              padding: "10px 28px",
              fontSize: 64,
              fontWeight: 900,
              color: "#000",
              letterSpacing: "-0.03em",
              boxShadow: "4px 4px 0 #000",
            }}
          >
            FORK IT
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "rgba(0,0,0,0.7)",
            marginBottom: 40,
            display: "flex",
          }}
        >
          What the f*ck do I eat?
        </div>

        {/* Chef emojis row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {["🔥", "🧀", "🧪", "💰", "⚡", "🏋️"].map((emoji, i) => (
            <div
              key={i}
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                background: "#fff",
                border: "3px solid #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(0,0,0,0.55)",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          5 AI chefs fight over your dinner. One wins. You eat.
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#000",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
