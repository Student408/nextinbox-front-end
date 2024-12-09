import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ArrowDownAZ, ArrowUpAZ, CalendarDays, Download, Search } from "lucide-react";
import { format } from "date-fns";

interface SortOptionsProps {
  sortOrder: "asc" | "desc";
  selectedDate?: Date;
  searchQuery: string;
  onSortChange: () => void;
  onDateSelect: (date?: Date) => void;
  onSearchChange: (query: string) => void;
  onExport: () => void;
}

export function SortOptions({ 
  sortOrder,
  selectedDate,
  searchQuery,
  onSortChange,
  onDateSelect,
  onSearchChange,
  onExport,
}: SortOptionsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onSortChange}
        className={sortOrder === "asc" ? "border-[#FF6C37] text-[#FF6C37]" : ""}
      >
        <CalendarDays className="w-4 h-4 mr-2" />
        Date
        {sortOrder === "asc" ? 
          <ArrowUpAZ className="w-4 h-4 ml-2" /> : 
          <ArrowDownAZ className="w-4 h-4 ml-2" />
        }
      </Button>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={selectedDate ? "border-[#FF6C37] text-[#FF6C37]" : ""}>
            <CalendarDays className="w-4 h-4 mr-2" />
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
        onClick={onExport}
        className="bg-[#FF6C37] text-white hover:bg-[#FF6C37]/90 border-[#FF6C37]"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
    </div>
  );
}