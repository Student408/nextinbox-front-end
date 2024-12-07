import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Edit2, Trash2, Copy, CheckCircle, Server } from "lucide-react";
import { Service } from "@/types/services";

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const [copiedServiceId, setCopiedServiceId] = useState<string | null>(null);

  function copyServiceId(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedServiceId(id);
    setTimeout(() => setCopiedServiceId(null), 2000);
    toast({
      title: "Copied",
      description: "Service ID copied to clipboard",
    });
  }

  function getPartialServiceId(serviceId: string): string {
    const length = Math.floor(serviceId.length * 0.3);
    return serviceId.substring(0, length) + "...";
  }

  return (
    <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server className="text-[#FF6C37] w-6 h-6" />
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] dark:text-gray-100">
                {service.host_address}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                ID: {getPartialServiceId(service.service_id)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => copyServiceId(service.service_id)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
            >
              {copiedServiceId === service.service_id ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
            >
              <Edit2 size={16} />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/10 dark:text-gray-400 dark:hover:text-red-500"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Port</span>
            <span className="font-medium">{service.port}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="font-medium truncate max-w-[200px]">
              {service.email_id}
            </span>
          </div>
          {service.cors_origin && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">CORS Origin</span>
              <span className="font-medium truncate max-w-[200px]">
                {service.cors_origin}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}