import { LogWithDetails } from "@/types/logs";

export function sortLogs(
  logs: LogWithDetails[],
  sortBy: "date" | "status",
  sortOrder: "asc" | "desc"
): LogWithDetails[] {
  return [...logs].sort((a, b) => {
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