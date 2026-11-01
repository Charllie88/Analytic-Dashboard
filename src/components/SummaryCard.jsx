import Icon from "./Icons.jsx";

export default function SummaryCard({ title, value, detail, icon, tone }) {
  return (
    <article className="summary-card">
      <div className="summary-card-top">
        <h3 className="summary-title">{title}</h3>
        <span className={`summary-icon summary-icon-${tone}`}>
          <Icon name={icon} size={19} />
        </span>
      </div>
      <p className="summary-value">{String(value).padStart(2, "0")}</p>
      <p className="summary-detail">{detail}</p>
    </article>
  );
}
