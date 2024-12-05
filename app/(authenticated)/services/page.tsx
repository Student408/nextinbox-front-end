'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { MailIcon, Edit2, Trash2, PlusCircle, Server, Copy, CheckCircle } from 'lucide-react';

interface Service {
  service_id: string;
  user_id: string;
  host_address: string;
  port: number;
  email_id: string;
  password: string;
  cors_origin: string | null;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    service_id: '',
    host_address: '',
    port: 587,
    email_id: '',
    password: '',
    cors_origin: null,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedServiceId, setCopiedServiceId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to view services',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch services: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      setServices(data || []);
    }
    setIsLoading(false);
  }

  async function saveService() {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add/edit a service',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (!currentService.host_address || !currentService.email_id || !currentService.password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      if (dialogMode === 'add') {
        const { error } = await supabase.from('services').insert([{
          host_address: currentService.host_address,
          port: currentService.port,
          email_id: currentService.email_id,
          password: currentService.password,
          cors_origin: currentService.cors_origin,
          user_id: user.id,
        }]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Service added successfully',
        });
      } else if (dialogMode === 'edit') {
        const { error } = await supabase
          .from('services')
          .update({
            host_address: currentService.host_address,
            port: currentService.port,
            email_id: currentService.email_id,
            password: currentService.password,
            cors_origin: currentService.cors_origin,
          })
          .eq('service_id', currentService.service_id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      }

      setCurrentService({
        service_id: '',
        host_address: '',
        port: 587,
        email_id: '',
        password: '',
        cors_origin: null,
      });
      setIsDialogOpen(false);
      await fetchServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${dialogMode} service: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteService(id: string) {
    setIsLoading(true);
    const { error } = await supabase.from('services').delete().eq('service_id', id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to delete service: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      await fetchServices();
    }
    setIsLoading(false);
  }

  function prepareEditService(service: Service) {
    setCurrentService(service);
    setDialogMode('edit');
    setIsDialogOpen(true);
  }

  function prepareAddService() {
    setCurrentService({
      service_id: '',
      host_address: '',
      port: 587,
      email_id: '',
      password: '',
      cors_origin: null,
    });
    setDialogMode('add');
    setIsDialogOpen(true);
  }

  function copyServiceId(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedServiceId(id);
    setTimeout(() => setCopiedServiceId(null), 2000);
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37]">
          <MailIcon className="mr-2" /> Email Services
        </h2>
        <Button 
          className="bg-[#FF6C37] text-white hover:bg-[#FF6C37]/90" 
          disabled={isLoading} 
          onClick={prepareAddService}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card 
            key={service.service_id} 
            className="border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-[#FF6C37]" />
                <CardTitle className="text-sm font-semibold truncate max-w-[200px]">
                  {service.host_address}
                </CardTitle>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyServiceId(service.service_id)}
                  className="h-7 w-7 text-gray-500 hover:text-[#FF6C37]"
                >
                  {copiedServiceId === service.service_id ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => prepareEditService(service)}
                  disabled={isLoading}
                  className="h-7 w-7 text-gray-500 hover:text-[#FF6C37]"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteService(service.service_id)}
                  disabled={isLoading}
                  className="h-7 w-7 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Port</span>
                  <span className="font-medium">{service.port}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium truncate max-w-[200px]">{service.email_id}</span>
                </div>
                {service.cors_origin && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">CORS Origin</span>
                    <span className="font-medium truncate max-w-[200px]">{service.cors_origin}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#FF6C37]">
              {dialogMode === 'add' ? 'Add New Email Service' : 'Edit Email Service'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="e.g., smtp.example.com"
                value={currentService.host_address}
                onChange={(e) => setCurrentService({ ...currentService, host_address: e.target.value })}
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
                value={currentService.port}
                onChange={(e) => setCurrentService({ ...currentService, port: parseInt(e.target.value) })}
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
                value={currentService.email_id}
                onChange={(e) => setCurrentService({ ...currentService, email_id: e.target.value })}
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
                value={currentService.password}
                onChange={(e) => setCurrentService({ ...currentService, password: e.target.value })}
                disabled={isLoading}
                className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cors_origin">CORS Origin</Label>
              <Input
                id="cors_origin"
                placeholder="e.g., https://example.com, https://api.example.com"
                value={currentService.cors_origin || ''}
                onChange={(e) => setCurrentService({ ...currentService, cors_origin: e.target.value })}
                disabled={isLoading}
                className="focus:border-[#FF6C37] focus:ring-[#FF6C37]/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="bg-[#FF6C37] text-white hover:bg-[#FF6C37]/90" 
              disabled={isLoading} 
              onClick={saveService}
            >
              {isLoading ? 'Saving...' : dialogMode === 'add' ? 'Add Service' : 'Update Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}