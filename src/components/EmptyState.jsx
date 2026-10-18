export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="empty-box">
      <h3>{title}</h3>
      <p>{message}</p>
      {onAction ? <button type="button" className="btn btn-primary" onClick={onAction}>{actionLabel}</button> : null}
    </div>
  )
}
