import { useEffect, useLayoutEffect, useRef } from "react";
import Icon from "./Icons.jsx";

const navigationItems = [
  { id: "dashboard", label: "Overview", icon: "grid" },
  { id: "tasks", label: "My tasks", icon: "checkCircle" },
  { id: "upcoming", label: "Upcoming", icon: "calendar" },
  { id: "completed", label: "Completed", icon: "check" },
];

export default function Sidebar({
  activeView,
  onNavigate,
  mobileOpen,
  onClose,
  taskCount,
}) {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  useLayoutEffect(() => {
    if (!mobileOpen) return undefined;

    closeButtonRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const focusIsInSidebar = sidebarRef.current?.contains(document.activeElement);

      if (!focusIsInSidebar || (event.shiftKey && document.activeElement === firstElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  return (
    <>
      <div
        className={`sidebar-backdrop${mobileOpen ? " is-visible" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        ref={sidebarRef}
        id="primary-sidebar"
        className={`sidebar${mobileOpen ? " is-open" : ""}`}
        aria-label="Workspace sidebar"
      >
        <div className="sidebar-header">
          <a
            className="brand"
            href="#overview"
            onClick={() => {
              onNavigate("dashboard");
              onClose();
            }}
            aria-label="Taskflow home"
          >
            <span className="brand-mark" aria-hidden="true">
              <Icon name="check" size={20} />
            </span>
            <span className="brand-name">taskflow</span>
          </a>
          <button
            className="icon-button sidebar-close-button"
            type="button"
            ref={closeButtonRef}
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-avatar" aria-hidden="true">S</span>
          <span className="workspace-details">
            <span className="workspace-label">Workspace</span>
            <span className="workspace-name">Studio North</span>
          </span>
          <Icon name="chevronDown" size={16} className="workspace-chevron" />
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <p className="sidebar-section-label">MENU</p>
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <a
                  className={`nav-link${activeView === item.id ? " is-active" : ""}`}
                  href={item.id === "dashboard" ? "#overview" : "#tasks"}
                  aria-label={item.label}
                  aria-current={activeView === item.id ? "page" : undefined}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                >
                  <Icon name={item.icon} size={19} />
                  <span className="nav-label">{item.label}</span>
                  {item.id === "tasks" && (
                    <span className="nav-badge" aria-label={`${taskCount} tasks`}>
                      {taskCount}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon" aria-hidden="true">
              <Icon name="activity" size={18} />
            </span>
            <p className="upgrade-title">Make room for more</p>
            <p className="upgrade-copy">Your team is doing great work. Keep it all organized.</p>
          </div>
          <div className="sidebar-profile">
            <span className="avatar avatar-indigo" aria-hidden="true">AM</span>
            <span className="profile-details">
              <span className="profile-name">Alex Morgan</span>
              <span className="profile-role">Free plan</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
