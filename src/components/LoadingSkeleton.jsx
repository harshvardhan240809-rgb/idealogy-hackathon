export default function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="skeleton-stack" aria-live="polite" aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      ))}
    </div>
  )
}
