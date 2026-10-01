const pieces = [
  { left: "4%", delay: "0s", duration: "2.4s", color: "#FFC93C", size: 16, round: false },
  { left: "12%", delay: "0.15s", duration: "2.8s", color: "#A3E635", size: 12, round: true },
  { left: "20%", delay: "0.4s", duration: "2.2s", color: "#FF3EA5", size: 14, round: false },
  { left: "28%", delay: "0.05s", duration: "3s", color: "#38BDF8", size: 10, round: true },
  { left: "36%", delay: "0.3s", duration: "2.5s", color: "#FF8A00", size: 16, round: false },
  { left: "44%", delay: "0.5s", duration: "2.7s", color: "#A855F7", size: 12, round: true },
  { left: "52%", delay: "0.1s", duration: "2.3s", color: "#FFC93C", size: 14, round: false },
  { left: "60%", delay: "0.35s", duration: "2.9s", color: "#FF3EA5", size: 11, round: true },
  { left: "68%", delay: "0.2s", duration: "2.4s", color: "#A3E635", size: 15, round: false },
  { left: "76%", delay: "0.45s", duration: "2.6s", color: "#38BDF8", size: 13, round: true },
  { left: "84%", delay: "0.08s", duration: "2.8s", color: "#FF8A00", size: 12, round: false },
  { left: "92%", delay: "0.25s", duration: "2.2s", color: "#A855F7", size: 16, round: true },
  { left: "8%", delay: "0.55s", duration: "3.1s", color: "#FF3EA5", size: 10, round: false },
  { left: "32%", delay: "0.6s", duration: "2.5s", color: "#FFC93C", size: 13, round: true },
  { left: "56%", delay: "0.18s", duration: "2.7s", color: "#A3E635", size: 15, round: false },
  { left: "80%", delay: "0.42s", duration: "2.4s", color: "#38BDF8", size: 11, round: true },
] as const;

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={`${piece.left}-${piece.delay}`}
          className="confetti-piece"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 0.62,
            backgroundColor: piece.color,
            borderRadius: piece.round ? 999 : 4,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
          }}
        />
      ))}
    </div>
  );
}
