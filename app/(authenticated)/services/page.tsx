"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PlugZap, Plus } from "lucide-react";
import { ServiceDialog } from "@/components/services/service-dialog";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/services/empty-state";
import { Service } from "@/types/services";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to view services",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to fetch services: ${error.message}`,
        variant: "destructive",
      });
    } else {
      setServices(data || []);
    }
    setIsLoading(false);
  }

  async function deleteService(id: string) {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("service_id", id);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to delete service: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
      await fetchServices();
    }
  }

  function handleEdit(service: Service) {
    setCurrentService(service);
    setIsDialogOpen(true);
  }

  function handleAdd() {
    setCurrentService(null);
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 dark:bg-background dark:text-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37]">
            <PlugZap className="mr-2" /> Email Services
          </h2>
          <Skeleton className="h-9 sm:h-10 w-full sm:w-[140px]" />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[180px] sm:h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 dark:bg-background dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37]">
          <PlugZap className="mr-2" /> Email Services
        </h2>
        <Button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
        >
          <Plus size={16} className="mr-2" /> Add New Service
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.service_id}
            service={service}
            onEdit={() => handleEdit(service)}
            onDelete={() => deleteService(service.service_id)}
          />
        ))}
      </div>

      {!isLoading && services.length === 0 && <EmptyState onAdd={handleAdd} />}

      <ServiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={currentService}
        onSuccess={fetchServices}
      />
    </div>
  );
}