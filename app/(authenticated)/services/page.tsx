'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Service {
  service_id: string
  host_address: string
  port: number
  email_id: string
  password: string
  cors_origin: string | null
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState<Omit<Service, 'service_id'>>({
    host_address: '',
    port: 587,
    email_id: '',
    password: '',
    cors_origin: null
  })

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    const { data, error } = await supabase.from('services').select('*')
    if (error) console.error('Error fetching services:', error)
    else setServices(data || [])
  }

  async function addService() {
    const { error } = await supabase.from('services').insert([newService])
    if (error) console.error('Error adding service:', error)
    else {
      fetchServices()
      setNewService({ host_address: '', port: 587, email_id: '', password: '', cors_origin: null })
    }
  }

  async function deleteService(id: string) {
    const { error } = await supabase.from('services').delete().eq('service_id', id)
    if (error) console.error('Error deleting service:', error)
    else fetchServices()
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Email Services</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.service_id}>
            <CardHeader>
              <CardTitle>{service.host_address}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Port: {service.port}</p>
              <p>Email: {service.email_id}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => deleteService(service.service_id)} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Service</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Email Service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={newService.host_address}
                onChange={(e) => setNewService({...newService, host_address: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={newService.port}
                onChange={(e) => setNewService({...newService, port: parseInt(e.target.value)})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newService.email_id}
                onChange={(e) => setNewService({...newService, email_id: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newService.password}
                onChange={(e) => setNewService({...newService, password: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addService} className="w-full sm:w-auto">Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

