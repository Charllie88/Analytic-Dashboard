import Icon from "./Icons.jsx";

export default function Header({
  onMenuClick,
  menuButtonRef,
  menuOpen,
  searchValue,
  onSearchChange,
}) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="topbar">
      <button
        className="mobile-menu-button icon-button"
        type="button"
        ref={menuButtonRef}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        aria-controls="primary-sidebar"
        onClick={onMenuClick}
      >
        <Icon name="menu" size={21} />
      </button>

      <label className="search-field">
        <Icon name="search" size={18} />
        <span className="sr-only">Search tasks and projects</span>
        <input
          type="search"
          placeholder="Search anything..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="topbar-actions">
        <p className="today-date">{formattedDate}</p>
        <span className="topbar-divider" aria-hidden="true" />
        <span className="icon-button notification-button" role="img" aria-label="Notifications, one new">
          <Icon name="activity" size={20} />
          <span className="notification-dot" aria-hidden="true" />
        </span>
        <div className="header-user" role="img" aria-label="Alex Morgan">
          <span className="avatar avatar-indigo" aria-hidden="true">AM</span>
          <Icon name="chevronDown" size={15} />
        </div>
      </div>
    </header>
  );
}
