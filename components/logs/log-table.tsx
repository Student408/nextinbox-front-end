import { LogWithDetails } from "@/types/logs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

interface LogTableProps {
  logs: LogWithDetails[];
}

export function LogTable({ logs }: LogTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Template Name</TableHead>
            <TableHead>Host Address</TableHead>
            <TableHead>Mail ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.log_id}>
              <TableCell>{formatDate(log.created_at)}</TableCell>
              <TableCell>
                <Badge
                  variant={log.status === "success" ? "success" : "destructive"}
                >
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell>{log.template_name}</TableCell>
              <TableCell>{log.host_address}</TableCell>
              <TableCell>{log.email_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}