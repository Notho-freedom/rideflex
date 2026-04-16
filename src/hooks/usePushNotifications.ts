import { useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    registerPushSubscription();
  }, [user]);

  const registerPushSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        // For demo purposes, we skip VAPID key requirement
        // In production, you'd use a real VAPID public key
        return;
      }

      const subJson = subscription.toJSON();
      await supabase.from('push_subscriptions').upsert(
        {
          user_id: user!.id,
          endpoint: subJson.endpoint!,
          keys: subJson.keys as any,
        } as any,
        { onConflict: 'user_id,endpoint' }
      );
    } catch (err) {
      console.error('Push subscription failed:', err);
    }
  };

  return { registerPushSubscription };
}
