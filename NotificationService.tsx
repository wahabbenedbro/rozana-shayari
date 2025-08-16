import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface NotificationServiceProps {
  onNotificationToggle?: (enabled: boolean) => void;
}

export function NotificationService({ onNotificationToggle }: NotificationServiceProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setPermission(Notification.permission);
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        scheduleDailyNotifications();
        onNotificationToggle?.(true);
        
        // Show immediate confirmation
        new Notification('Rozana Shayari', {
          body: 'Daily poetry notifications enabled! You\'ll receive a new poem every day at 9:00 AM.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } else {
        setNotificationsEnabled(false);
        onNotificationToggle?.(false);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const scheduleDailyNotifications = () => {
    // Store notification preference
    localStorage.setItem('rozana-shayari-notifications', 'enabled');
    
    // In a production app, this would integrate with a backend service
    // For now, we'll show a demo notification and store the preference
    console.log('Daily notifications scheduled for 9:00 AM');
    
    // Show a demo notification after 5 seconds to demonstrate functionality
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification('🌅 Daily Poetry Reminder', {
          body: 'This is how your daily poetry notifications will appear at 9:00 AM',
          tag: 'demo-notification',
          requireInteraction: false
        });
      }
    }, 5000);
  };

  const toggleNotifications = async () => {
    if (notificationsEnabled) {
      // Disable notifications
      setNotificationsEnabled(false);
      onNotificationToggle?.(false);
    } else {
      await requestNotificationPermission();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleNotifications}
        className={`
          flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs
          transition-all duration-300 ease-out
          ${notificationsEnabled 
            ? 'bg-emerald-deep text-white shadow-sm' 
            : 'bg-white/60 text-text-secondary border border-gold-accent/15 hover:bg-gold-accent/5'
          }
        `}
        title={notificationsEnabled ? 'Notifications enabled' : 'Enable daily notifications'}
      >
        {notificationsEnabled ? (
          <Bell size={12} className="text-white" />
        ) : (
          <BellOff size={12} />
        )}
        <span className="font-medium">
          {notificationsEnabled ? 'On' : 'Off'}
        </span>
      </button>
    </div>
  );
}