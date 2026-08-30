// The flat raised surface used by every panel. Depth comes from a hairline
// border and one restrained shadow, never glass/glow.
export default function Panel({ className = '', children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-hairline bg-surface shadow-panel ${className}`}
    >
      <div className="relative">{children}</div>
    </div>
  );
}