import * as admin from "firebase-admin";

// Initialize Firebase Admin once at the top level
if (!admin.apps.length) {
    admin.initializeApp();
}

// Core evaluation endpoint (existing)
export { evaluateAction, generatePolicyRegex } from "./evaluateAction";

// SupraWall Connect — multi-tenant management
export {
    createPlatform,
    getPlatform,
    updateBasePolicies,
    issueConnectKey,
    revokeConnectKey,
    listConnectKeys,
    updateConnectKey,
    getConnectAnalytics,
    getConnectEvents,
    notifyPlatformWebhook,
} from "./connect";
