import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpAZ, CalendarDays, CheckCircle } from "lucide-react";

interface SortOptionsProps {
  sortBy: "date" | "status";
  sortOrder: "asc" | "desc";
  onSortChange: (by: "date" | "status") => void;
}

export function SortOptions({ sortBy, sortOrder, onSortChange }: SortOptionsProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange("date")}
        className={sortBy === "date" ? "border-[#FF6C37] text-[#FF6C37]" : ""}
      >
        <CalendarDays className="w-4 h-4 mr-2" />
        Date
        {sortBy === "date" && (
          sortOrder === "asc" ? 
            <ArrowUpAZ className="w-4 h-4 ml-2" /> : 
            <ArrowDownAZ className="w-4 h-4 ml-2" />
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onSortChange("status")}
        className={sortBy === "status" ? "border-[#FF6C37] text-[#FF6C37]" : ""}
      >
        <CheckCircle className="w-4 h-4 mr-2" />
        Status
        {sortBy === "status" && (
          sortOrder === "asc" ? 
            <ArrowUpAZ className="w-4 h-4 ml-2" /> : 
            <ArrowDownAZ className="w-4 h-4 ml-2" />
        )}
      </Button>
    </div>
  );
}