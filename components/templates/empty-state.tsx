import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-[#FF6C37]/30 dark:bg-background dark:border-[#FF6C37]/50">
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
        No templates found. Create your first template.
      </p>
      <Button
        onClick={onAdd}
        className="bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
      >
        <Plus size={16} className="mr-2" /> Add New Template
      </Button>
    </div>
  );
}