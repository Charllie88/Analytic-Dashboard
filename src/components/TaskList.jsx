import { useEffect, useRef, useState } from "react";
import Icon from "./Icons.jsx";
import {
  formatDueDate,
  getDaysFromToday,
  getLocalDateString,
  isValidDateString,
} from "../utils/dates.js";

const filters = [
  { id: "all", label: "All" },
  { id: "in-progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

function AssigneeAvatars({ assignees }) {
  return (
    <div
      className="assignee-stack"
      role="group"
      aria-label={`Assigned to ${assignees.join(", ")}`}
    >
      {assignees.map((assignee, index) => (
        <span
          className={`avatar avatar-${index === 0 ? "indigo" : index === 1 ? "peach" : "mint"}`}
          key={assignee}
          aria-hidden="true"
        >
          {assignee.split(" ").map((part) => part[0]).join("")}
        </span>
      ))}
    </div>
  );
}

export default function TaskList({
  tasks,
  searchValue,
  view,
  filter,
  onFilterChange,
  onToggleTask,
  onAddTask,
}) {
  const [sortAscending, setSortAscending] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState("");
  const titleInputRef = useRef(null);
  const dueDateInputRef = useRef(null);
  const addButtonRef = useRef(null);
  const today = getLocalDateString();
  const dueDateIsInvalid = !isValidDateString(dueDate) || dueDate < today;

  useEffect(() => {
    if (isFormOpen) titleInputRef.current?.focus();
  }, [isFormOpen]);

  function closeForm() {
    setIsFormOpen(false);
    setTitle("");
    setDueDate("");
    setFormError("");
    addButtonRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError("Enter a task title before adding the task.");
      titleInputRef.current?.focus();
      return;
    }

    if (!dueDate) {
      setFormError("Choose a due date before adding the task.");
      dueDateInputRef.current?.focus();
      return;
    }

    if (dueDate < today) {
      setFormError("Choose today or a future date for this task.");
      dueDateInputRef.current?.focus();
      return;
    }

    if (!isValidDateString(dueDate)) {
      setFormError("Enter a valid due date.");
      dueDateInputRef.current?.focus();
      return;
    }

    onAddTask({ title: trimmedTitle, dueDate });
    closeForm();
  }

  let visibleTasks = tasks;
  if (view === "upcoming") {
    visibleTasks = visibleTasks.filter(
      (task) => task.status !== "completed" && getDaysFromToday(task.dueDate) >= 0,
    );
  } else if (view === "completed") {
    visibleTasks = visibleTasks.filter((task) => task.status === "completed");
  } else if (filter !== "all") {
    visibleTasks = visibleTasks.filter((task) => task.status === filter);
  }

  const normalizedSearch = searchValue.trim().toLowerCase();
  if (normalizedSearch) {
    visibleTasks = visibleTasks.filter((task) =>
      `${task.title} ${task.project} ${task.assignees.join(" ")}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }
  visibleTasks = [...visibleTasks].sort((first, second) =>
    sortAscending
      ? first.dueDate.localeCompare(second.dueDate)
      : second.dueDate.localeCompare(first.dueDate),
  );

  const heading =
    view === "upcoming"
      ? "Upcoming tasks"
      : view === "completed"
        ? "Completed tasks"
        : "My tasks";

  return (
    <section className="task-section" id="tasks" aria-labelledby="task-heading">
      <div className="task-section-header">
        <div>
          <div className="section-title-row">
            <h2 id="task-heading">{heading}</h2>
            <span className="task-count">{visibleTasks.length}</span>
          </div>
          <p className="section-description">Stay on top of what needs your attention.</p>
        </div>
        <div className="task-header-actions">
          <button
            className="view-all-button"
            type="button"
            aria-label="Show all tasks"
            onClick={() => onFilterChange("all")}
          >
            View all <Icon name="arrowUpRight" size={16} />
          </button>
          <button
            className="add-task-button"
            type="button"
            ref={addButtonRef}
            aria-expanded={isFormOpen}
            aria-controls="task-create-form"
            onClick={() => setIsFormOpen((isOpen) => !isOpen)}
          >
            <Icon name="plus" size={16} />
            Add task
          </button>
        </div>
      </div>

      <div className="task-panel">
        {isFormOpen && (
          <form
            className="task-create-form"
            id="task-create-form"
            aria-label="Add a task"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="task-form-field task-form-title">
              <label htmlFor="new-task-title">Task title</label>
              <input
                ref={titleInputRef}
                id="new-task-title"
                name="title"
                type="text"
                value={title}
                maxLength={120}
                required
                aria-invalid={Boolean(formError && !title.trim())}
                aria-describedby={formError ? "task-form-error" : undefined}
                placeholder="What needs to get done?"
                onChange={(event) => {
                  setTitle(event.target.value);
                  setFormError("");
                }}
              />
            </div>
            <div className="task-form-field task-form-date">
              <label htmlFor="new-task-due-date">Due date</label>
              <input
                ref={dueDateInputRef}
                id="new-task-due-date"
                name="dueDate"
                type="date"
                min={today}
                value={dueDate}
                required
                aria-invalid={Boolean(formError && dueDateIsInvalid)}
                aria-describedby={formError ? "task-form-error" : undefined}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setFormError("");
                }}
              />
            </div>
            <div className="task-form-actions">
              <button
                className="task-form-cancel"
                type="button"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button className="add-task-button task-form-submit" type="submit">
                <Icon name="plus" size={15} />
                Add task
              </button>
            </div>
            {formError && (
              <p className="task-form-error" id="task-form-error" role="alert">
                {formError}
              </p>
            )}
          </form>
        )}
        <div className="task-toolbar">
          {view === "upcoming" || view === "completed" ? (
            <span className="task-toolbar-context">
              {view === "upcoming" ? "Due soon" : "Recently completed"}
            </span>
          ) : (
            <div className="task-filters" role="group" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  className={`filter-button${filter === item.id ? " is-selected" : ""}`}
                  type="button"
                  key={item.id}
                  aria-pressed={filter === item.id}
                  onClick={() => {
                    onFilterChange(item.id);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          <button
            className="sort-button"
            type="button"
            aria-label={`Sort tasks by due date, ${sortAscending ? "soonest first" : "latest first"}`}
            onClick={() => setSortAscending((ascending) => !ascending)}
          >
            <Icon name="clock" size={16} />
            <span>Due date</span>
            <Icon
              name="chevronDown"
              size={15}
              className={sortAscending ? "" : "sort-descending"}
            />
          </button>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list" aria-label="Tasks">
            {visibleTasks.map((task) => (
              <li className="task-row" key={task.id}>
                <label className="task-check">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={() => onToggleTask(task.id)}
                    aria-label={`${task.status === "completed" ? "Reopen" : "Complete"} ${task.title}`}
                  />
                  <span className="custom-checkbox" aria-hidden="true">
                    <Icon name="check" size={13} />
                  </span>
                </label>
                <div className="task-main">
                  <h3 className={`task-name${task.status === "completed" ? " is-complete" : ""}`}>
                    {task.title}
                  </h3>
                  <span className="task-project mobile-project">{task.project}</span>
                </div>
                <span className="task-project desktop-project">{task.project}</span>
                <AssigneeAvatars assignees={task.assignees} />
                <TaskDueDate task={task} />
                <span className={`status-pill status-${task.status}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {task.status === "todo"
                    ? "To do"
                    : task.status === "in-progress"
                      ? "In progress"
                      : "Completed"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state" role="status">
            {normalizedSearch
              ? "No tasks match your search."
              : view === "upcoming"
                ? "No upcoming tasks. Add a task due today or later."
                : view === "completed" || filter === "completed"
                  ? "No completed tasks yet. Mark a task as complete to see it here."
                  : filter === "in-progress"
                    ? "No tasks are in progress yet."
                    : "No tasks yet. Add your first task to get started."}
          </p>
        )}
      </div>
    </section>
  );
}

function TaskDueDate({ task }) {
  const isOverdue =
    task.status !== "completed" && getDaysFromToday(task.dueDate) < 0;

  return (
    <span className={`task-due${isOverdue ? " is-overdue" : ""}`}>
      <Icon name="clock" size={15} />
      {formatDueDate(task.dueDate, isOverdue)}
    </span>
  );
}
