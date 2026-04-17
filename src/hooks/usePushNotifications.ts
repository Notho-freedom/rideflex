import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    register();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const register = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // Fetch VAPID public key from edge function
        const { data, error } = await supabase.functions.invoke('send-push-notification', { method: 'GET' });
        if (error || !data?.publicKey) return;
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
      }

      const json = subscription.toJSON();
      await supabase.from('push_subscriptions').upsert({
        user_id: user!.id,
        endpoint: json.endpoint!,
        keys: json.keys as any,
      } as any, { onConflict: 'user_id,endpoint' });
    } catch (err) {
      console.warn('Push subscription failed:', err);
    }
  };

  return { register };
}
