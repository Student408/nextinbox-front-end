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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
      <div className="w-full sm:flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onSortChange}
          className={`${sortOrder === "asc" ? "border-[#FF6C37] text-[#FF6C37]" : ""} text-xs sm:text-sm px-2.5 sm:px-3`}
        >
          <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Date
          {sortOrder === "asc" ? 
            <ArrowUpAZ className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" /> : 
            <ArrowDownAZ className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
          }
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`${selectedDate ? "border-[#FF6C37] text-[#FF6C37]" : ""} text-xs sm:text-sm px-2.5 sm:px-3`}
            >
              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
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
          className="bg-[#FF6C37] text-white hover:bg-[#FF6C37]/90 border-[#FF6C37] text-xs sm:text-sm px-2.5 sm:px-3"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}