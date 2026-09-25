export default function MotionText({ children, className = '', delay = 0, words = false }) {
  const parts = words ? children.split(/(\s+)/) : Array.from(children);

  return <span className={`motion-line ${className}`}>
    <i className="sr-only">{children}</i>
    <b className="motion-letters" aria-hidden="true">{parts.map((part, index) => <i
      className="motion-letter"
      key={`${index}-${part}`}
      style={{ '--letter-delay': `${delay + index * (words ? 65 : 25)}ms` }}
    >{part}</i>)}</b>
  </span>;
}
