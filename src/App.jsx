import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import TaskList from "./components/TaskList.jsx";
import {
  getDateFromTodayOffset,
  getLocalDateString,
} from "./utils/dates.js";

const initialTasks = [
  {
    id: 1,
    title: "Finalize the homepage wireframes",
    project: "Website redesign",
    assignees: ["Alex Morgan", "Jamie Chen"],
    dueInDays: -2,
    status: "in-progress",
  },
  {
    id: 2,
    title: "Build the responsive navigation",
    project: "Product launch",
    assignees: ["Jamie Chen", "Morgan Lee"],
    dueInDays: 1,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Review the onboarding flow",
    project: "Mobile app",
    assignees: ["Alex Morgan"],
    dueInDays: 2,
    status: "todo",
  },
  {
    id: 4,
    title: "Prepare the launch checklist",
    project: "Product launch",
    assignees: ["Jamie Chen"],
    dueInDays: 4,
    status: "todo",
  },
  {
    id: 5,
    title: "Create design system color tokens",
    project: "Design system",
    assignees: ["Morgan Lee", "Alex Morgan"],
    dueInDays: -1,
    status: "completed",
  },
  {
    id: 6,
    title: "Share the sprint retrospective",
    project: "Team operations",
    assignees: ["Alex Morgan"],
    dueInDays: 0,
    status: "completed",
  },
].map(({ dueInDays, ...task }) => ({
  ...task,
  dueDate: getDateFromTodayOffset(dueInDays),
}));

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [today, setToday] = useState(getLocalDateString);
  const [activeView, setActiveView] = useState("dashboard");
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const nextTaskId = useRef(initialTasks.length + 1);

  useEffect(() => {
    let midnightTimeout;

    function scheduleMidnightRefresh() {
      window.clearTimeout(midnightTimeout);
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );

      midnightTimeout = window.setTimeout(() => {
        setToday(getLocalDateString());
        scheduleMidnightRefresh();
      }, Math.max(0, nextMidnight.getTime() - now.getTime()));
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setToday(getLocalDateString());
        scheduleMidnightRefresh();
      }
    }

    scheduleMidnightRefresh();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(midnightTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    if (menuButtonRef.current?.getClientRects().length) {
      menuButtonRef.current.focus();
    } else {
      document.querySelector(".nav-link[aria-current='page']")?.focus();
    }
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const desktopViewport = window.matchMedia("(min-width: 761px)");
    function closeDrawerOnDesktop(event) {
      if (event.matches) closeMobileNav();
    }

    desktopViewport.addEventListener("change", closeDrawerOnDesktop);
    return () => desktopViewport.removeEventListener("change", closeDrawerOnDesktop);
  }, [closeMobileNav, mobileNavOpen]);

  function navigateToView(view) {
    setActiveView(view);
    setTaskFilter("all");
  }

  function changeTaskFilter(filter) {
    setActiveView("tasks");
    setTaskFilter(filter);
  }

  const summary = useMemo(() => {
    const inProgress = tasks.filter((task) => task.status === "in-progress").length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    const overdue = tasks.filter(
      (task) => task.status !== "completed" && task.dueDate < today,
    ).length;

    return { total: tasks.length, inProgress, completed, overdue };
  }, [tasks, today]);

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
            }
          : task,
      ),
    );
  }

  function addTask({ title, dueDate }) {
    const newTask = {
      id: nextTaskId.current,
      title,
      dueDate,
      project: "My tasks",
      assignees: ["Alex Morgan"],
      status: "todo",
    };

    nextTaskId.current += 1;
    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setActiveView("tasks");
    setTaskFilter("all");
    setSearchValue("");
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeView={activeView}
        onNavigate={navigateToView}
        mobileOpen={mobileNavOpen}
        onClose={closeMobileNav}
        taskCount={tasks.length}
      />

      <main className="main-panel" id="overview">
        <Header
          onMenuClick={() => setMobileNavOpen(true)}
          menuButtonRef={menuButtonRef}
          menuOpen={mobileNavOpen}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <div className="dashboard-content">
          <section className="welcome-section" aria-labelledby="welcome-heading">
            <div className="welcome-copy">
              <p className="eyebrow">YOUR WORKSPACE <span aria-hidden="true">/</span> OVERVIEW</p>
              <h1 id="welcome-heading">Good morning, Alex <span aria-hidden="true">✦</span></h1>
              <p className="welcome-subtitle">Here’s what’s happening with your projects today.</p>
            </div>
            <div className="week-indicator">
              <span className="week-indicator-dot" aria-hidden="true" />
              Week at a glance
            </div>
          </section>

          <section className="summary-grid" aria-label="Task summary">
            <SummaryCard
              title="Total tasks"
              value={summary.total}
              detail="Across all your projects"
              icon="grid"
              tone="blue"
            />
            <SummaryCard
              title="In progress"
              value={summary.inProgress}
              detail="Work currently underway"
              icon="activity"
              tone="violet"
            />
            <SummaryCard
              title="Completed"
              value={summary.completed}
              detail="Tasks marked complete"
              icon="checkCircle"
              tone="green"
            />
            <SummaryCard
              title="Overdue"
              value={summary.overdue}
              detail="Needs your attention"
              icon="clock"
              tone="orange"
            />
          </section>

          <section className="workspace-heading" aria-labelledby="workspace-heading-title">
            <div>
              <h2 id="workspace-heading-title">Project workspace</h2>
              <p>Keep your team and priorities in sync.</p>
            </div>
            <span className="team-presence">
              <span className="team-avatar-stack" aria-hidden="true">
                <span className="avatar avatar-indigo">AM</span>
                <span className="avatar avatar-peach">JC</span>
                <span className="avatar avatar-mint">ML</span>
              </span>
              <span>3 teammates</span>
            </span>
          </section>

          <TaskList
            tasks={tasks}
            searchValue={searchValue}
            view={activeView}
            filter={taskFilter}
            onFilterChange={changeTaskFilter}
            onToggleTask={toggleTask}
            onAddTask={addTask}
          />

          <footer className="dashboard-footer">
            <span>Made for focused work.</span>
            <span className="footer-status">Updates reflect instantly</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
