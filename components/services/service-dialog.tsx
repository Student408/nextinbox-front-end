import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Service } from "@/types/services";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Partial<Service> | null;
  onSuccess: () => void;
}

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({
    host_address: "",
    port: 587,
    email_id: "",
    password: "",
    cors_origin: "",
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        host_address: "",
        port: 587,
        email_id: "",
        password: "",
        cors_origin: "",
      });
    }
  }, [service]);

  async function handleSubmit() {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add/edit a service",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.host_address || !formData.email_id || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!service) {
        const { error } = await supabase.from("services").insert([
          {
            ...formData,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service added successfully",
        });
      } else {
        const { error } = await supabase
          .from("services")
          .update({
            ...formData,
          })
          .eq("service_id", service.service_id)
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${service ? "update" : "add"} service: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#FF6C37]">
            {service ? "Edit Email Service" : "Add New Email Service"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="host">Host</Label>
            <Input
              id="host"
              placeholder="e.g., smtp.example.com"
              value={formData.host_address}
              onChange={(e) =>
                setFormData({ ...formData, host_address: e.target.value })
              }
              disabled={isLoading}
              className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              placeholder="e.g., 587"
              value={formData.port}
              onChange={(e) =>
                setFormData({ ...formData, port: parseInt(e.target.value) })
              }
              disabled={isLoading}
              className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., admin@example.com"
              value={formData.email_id}
              onChange={(e) =>
                setFormData({ ...formData, email_id: e.target.value })
              }
              disabled={isLoading}
              className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your email service password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
              className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cors_origin">CORS Origin</Label>
            <Input
              id="cors_origin"
              placeholder="e.g., https://example.com"
              value={formData.cors_origin || ""}
              onChange={(e) =>
                setFormData({ ...formData, cors_origin: e.target.value })
              }
              disabled={isLoading}
              className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="bg-[#FF6C37] text-white hover:bg-[#FF6C37]/90"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading
              ? "Saving..."
              : service
              ? "Update Service"
              : "Add Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}