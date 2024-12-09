import { LogWithDetails } from "@/types/logs";

export function filterAndSortLogs(
  logs: LogWithDetails[],
  sortBy: "date" | "status",
  sortOrder: "asc" | "desc",
  selectedDate?: Date,
  showAllLogs?: boolean
): LogWithDetails[] {
  let filteredLogs = [...logs];

  if (!showAllLogs) {
    const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    filteredLogs = filteredLogs.filter(log => 
      new Date(log.created_at) >= past24Hours
    );
  }

  if (selectedDate) {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.created_at);
      return logDate >= startOfDay && logDate <= endOfDay;
    });
  }

  return filteredLogs.sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by status
      const statusA = a.status.toLowerCase();
      const statusB = b.status.toLowerCase();
      return sortOrder === "asc"
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    }
  });
}