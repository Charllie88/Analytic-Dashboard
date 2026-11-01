export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateFromTodayOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

export function isValidDateString(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  const date = new Date(`${dateString}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === dateString
  );
}

export function getDaysFromToday(dateString) {
  const dueDate = Date.parse(`${dateString}T00:00:00Z`);
  const today = Date.parse(`${getLocalDateString()}T00:00:00Z`);

  return Math.round((dueDate - today) / 86_400_000);
}

export function formatDueDate(dateString, isOverdue = false) {
  const daysUntilDue = getDaysFromToday(dateString);

  if (isOverdue) {
    const daysOverdue = Math.abs(daysUntilDue);
    return `Overdue ${daysOverdue} ${daysOverdue === 1 ? "day" : "days"}`;
  }
  if (daysUntilDue === 0) return "Today";
  if (daysUntilDue === 1) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T00:00:00Z`));
}
