import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 40,
          background: "linear-gradient(135deg, #38BDF8 0%, #A855F7 42%, #FF3EA5 78%, #FF8A00 100%)",
        }}
      >
        <div
          style={{
            fontSize: 132,
            fontWeight: 700,
            color: "#FFC93C",
            lineHeight: 1,
          }}
        >
          8
        </div>
      </div>
    ),
    { ...size },
  );
}
