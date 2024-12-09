import { LogWithDetails } from "@/types/logs";

import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

interface LogTableProps {
  logs: LogWithDetails[];
}

export function LogTable({ logs }: LogTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left text-[#FF6C37] font-medium">Created</th>
            <th className="p-3 text-left text-[#FF6C37] font-medium">Status</th>
            <th className="p-3 text-left text-[#FF6C37] font-medium">Template Name</th>
            <th className="p-3 text-left text-[#FF6C37] font-medium">Host Address</th>
            <th className="p-3 text-left text-[#FF6C37] font-medium">Mail ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.log_id}>
              <td>{formatDate(log.created_at)}</td>
              <td>
                <Badge
                  variant={log.status === "success" ? "success" : "destructive"}
                >
                  {log.status}
                </Badge>
              </td>
              <td>{log.template_name}</td>
              <td>{log.host_address}</td>
              <td>{log.email_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}