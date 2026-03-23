import { messaging, db } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const VAPID_KEY = "BGLIWBgF9IphG4zaqUskzOnhM5zNHu6T6DX_lIirg1Pyn28f5G9E1VKpNmzrmzw5VtU13611117uhF7GFosC844";

export async function requestNotificationPermission(userId: string) {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        await saveTokenToDatabase(userId);
    }
}

async function saveTokenToDatabase(userId: string) {
    try {
        const token = await getToken(messaging, {
            serviceWorkerRegistration: await navigator.serviceWorker.ready,
            vapidKey: VAPID_KEY
        });

        if (token) {
            console.log("FCM Token:", token);
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                fcmTokens: arrayUnion(token)
            });
            return token;
        }
    } catch (error) {
        console.error("Error getting FCM token:", error);
    }
}

export function listenToMessages() {
    onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);
        // You can show a custom toast here if you want
        if (typeof window !== "undefined") {
            new Notification(payload.notification?.title || "SupraWall Alert", {
                body: payload.notification?.body,
                icon: "/shield-icon.png",
            });
        }
    });
}
