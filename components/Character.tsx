type Props = { src: string; name: string; line: string };

// Pure CSS hover/focus. tabIndex lets keyboard users trigger it too.
export default function Character({ src, name, line }: Props) {
  return (
    <div className="char" tabIndex={0} aria-label={`${name}: ${line}`}>
      <div className="bubble px-box px-2" role="tooltip">
        {line}
        <span className="tail" aria-hidden="true" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="sprite" src={src} alt={name} draggable={false} />
    </div>
  );
}
