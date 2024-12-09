import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDownAZ, ArrowUpAZ, CalendarDays, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SortOptionsProps {
  sortBy: "date" | "status";
  sortOrder: "asc" | "desc";
  selectedDate?: Date;
  showAllLogs: boolean;
  onSortChange: (by: "date" | "status") => void;
  onDateSelect: (date?: Date) => void;
  onShowAllChange: (show: boolean) => void;
}

export function SortOptions({ 
  sortBy, 
  sortOrder, 
  selectedDate,
  showAllLogs,
  onSortChange,
  onDateSelect,
  onShowAllChange
}: SortOptionsProps) {
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
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={selectedDate ? "border-[#FF6C37] text-[#FF6C37]" : ""}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            {selectedDate ? format(selectedDate, 'PP') : 'Pick date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onShowAllChange(!showAllLogs)}
        className={showAllLogs ? "border-[#FF6C37] text-[#FF6C37]" : ""}
      >
        {showAllLogs ? "Show Recent" : "Show All"}
      </Button>
    </div>
  );
}