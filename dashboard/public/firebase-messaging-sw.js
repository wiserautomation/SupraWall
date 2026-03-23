/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "FIREBASE_API_KEY_REDACTED",
  authDomain: "agentguard-1b9e9.firebaseapp.com",
  projectId: "agentguard-1b9e9",
  storageBucket: "agentguard-1b9e9.appspot.com",
  messagingSenderId: "331683417507",
  appId: "1:331683417507:web:982a6b7a9ea12771e9de16"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || "🛡️ SupraWall Action Required";
  const notificationOptions = {
    body: payload.notification?.body || `${payload.data?.agentName} wants to use ${payload.data?.toolName}.`,
    icon: '/shield-icon.png',
    badge: '/shield-icon.png',
    data: payload.data, 
    actions: [
      { action: 'approve', title: 'Approve ✅' },
      { action: 'deny', title: 'Deny ❌' }
    ],
    tag: payload.data?.requestId || 'approval-notification' // Group by requestId
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const requestId = event.notification.data?.requestId;
  if (!requestId) return;

  if (event.action === 'approve' || event.action === 'deny') {
    // We open the dashboard to the approval page but with action parameters
    // This allows the dashboard to take immediate action on load if the user is authenticated.
    const url = `/dashboard/approvals?id=${requestId}&action=${event.action}`;
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes('/dashboard/approvals') && 'focus' in client) {
            return client.navigate(url).then(c => c.focus());
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else {
    // Normal click - just open approvals detail
    const url = `/dashboard/approvals?id=${requestId}`;
    event.waitUntil(clients.openWindow(url));
  }
});
