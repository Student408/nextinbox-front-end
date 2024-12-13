import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils/date';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Notification {
  log_id: string;
  status: string;
  message: string;
  created_at: string;
  template_name: string;
}

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    fetchNotifications();
    const subscription = supabase
      .channel('failed-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'logs',
        filter: 'status=eq.failed'
      }, payload => {
        const newNotification = payload.new as Notification;
        const notificationTime = new Date(newNotification.created_at);
        const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
        
        if (notificationTime >= cutoffTime) {
          setNotifications(prev => [newNotification, ...prev]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchNotifications() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Calculate timestamp for 48 hours ago
      const cutoffTime = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('logs')
        .select(`
          log_id,
          status,
          message,
          created_at,
          template_id
        `)
        .eq('user_id', user.id)
        .eq('status', 'failed')
        .gte('created_at', cutoffTime)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data.map(notification => ({
        ...notification,
        template_name: notification.template_id ? notification.template_id.name : 'Unknown Template'
      })));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  const unreadCount = notifications.length;

  const NotificationContent = () => (
    <>
      <div className="p-4 border-b">
        <h3 className="font-semibold text-base md:text-lg">Failed Emails (Last 48 Hours)</h3>
      </div>
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No failed emails in the last 48 hours
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.log_id}
                className="p-3 md:p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-xs md:text-sm line-clamp-1 flex-1 mr-2">
                    {notification.template_name}
                  </span>
                  <span className="text-[11px] md:text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-destructive mt-1 break-words">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </>
  );

  return (
    <>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[90vh] p-0 flex flex-col"
          >
            <SheetHeader className="px-4 py-2 border-b">
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col overflow-hidden">
              <NotificationContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[380px] p-0" align="end">
            <div className="flex flex-col h-[500px]">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-base md:text-lg">Failed Emails (Last 48 Hours)</h3>
              </div>
              <ScrollArea className="flex-1">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No failed emails in the last 48 hours
                  </div>
                ) : (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div
                        key={notification.log_id}
                        className="p-3 md:p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-xs md:text-sm line-clamp-1 flex-1 mr-2">
                            {notification.template_name}
                          </span>
                          <span className="text-[11px] md:text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-destructive mt-1 break-words">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}