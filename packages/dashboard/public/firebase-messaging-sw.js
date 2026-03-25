// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-undef */
// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// Firebase Cloud Messaging Service Worker
// Configuration is injected via environment variables at build time.
// If you are self-hosting, set the NEXT_PUBLIC_FIREBASE_* env vars in your .env file.

const firebaseConfig = {
  apiKey: self.__FIREBASE_CONFIG__?.apiKey || "",
  authDomain: self.__FIREBASE_CONFIG__?.authDomain || "",
  projectId: self.__FIREBASE_CONFIG__?.projectId || "",
  storageBucket: self.__FIREBASE_CONFIG__?.storageBucket || "",
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId || "",
  appId: self.__FIREBASE_CONFIG__?.appId || "",
};

// Only initialize if Firebase config is provided
if (firebaseConfig.apiKey) {
  importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

  firebase.initializeApp(firebaseConfig);
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
      tag: payload.data?.requestId || 'approval-notification'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const requestId = event.notification.data?.requestId;
  if (!requestId) return;

  if (event.action === 'approve' || event.action === 'deny') {
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
    const url = `/dashboard/approvals?id=${requestId}`;
    event.waitUntil(clients.openWindow(url));
  }
});
