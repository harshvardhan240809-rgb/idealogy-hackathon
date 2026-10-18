export default function ErrorState({ title = 'Something went wrong', message = 'Please try again.', action }) {
  return (
    <div className="empty-box error-box">
      <h3>{title}</h3>
      <p>{message}</p>
      {action ? <button type="button" className="btn btn-primary" onClick={action}>Retry</button> : null}
    </div>
  )
}
