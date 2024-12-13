import { LogWithDetails } from "@/types/logs";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

export function LogTable({ logs }: { logs: LogWithDetails[] }) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Created</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Status</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Template Name</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Host Address</th>
            <th className="p-2 sm:p-4 text-left text-[#FF6C37] font-medium">Mail ID</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr 
              key={log.log_id} 
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="p-2 sm:p-4 text-xs sm:text-sm">
                {formatDate(log.created_at)}
              </td>
              <td className="p-2 sm:p-4">
                <Badge
                  variant={log.status === "success" ? "success" : "destructive"}
                  className="font-medium text-xs sm:text-sm"
                >
                  {log.status.toUpperCase()}
                </Badge>
              </td>
              <td className="p-2 sm:p-4 text-xs sm:text-sm font-medium">{log.template_name}</td>
              <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground">{log.host_address}</td>
              <td className="p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground">{log.email_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}