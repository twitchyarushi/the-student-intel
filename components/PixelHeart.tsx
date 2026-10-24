// 7x6 pixel heart drawn with squares so it stays crisp at any size.
const ROWS = ["0110110", "1111111", "1111111", "0111110", "0011100", "0001000"];

export default function PixelHeart() {
  return (
    <svg className="heart" viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true">
      {ROWS.flatMap((row, y) =>
        [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null))
      )}
    </svg>
  );
}
