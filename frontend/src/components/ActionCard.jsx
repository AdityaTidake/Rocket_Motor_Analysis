function ActionCard({ title, desc, onClick }) {
  return (
    <div className="action-card">
      <h3>{title}</h3>
      <p>{desc}</p>
      <button onClick={onClick}>Open</button>
    </div>
  );
}

export default ActionCard;
