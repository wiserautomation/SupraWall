"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyPlatformWebhook = exports.getConnectEvents = exports.getConnectAnalytics = exports.updateConnectKey = exports.listConnectKeys = exports.revokeConnectKey = exports.issueConnectKey = exports.updateBasePolicies = exports.getPlatform = exports.createPlatform = exports.generatePolicyRegex = exports.evaluateAction = void 0;
const admin = require("firebase-admin");
// Initialize Firebase Admin once at the top level
if (!admin.apps.length) {
    admin.initializeApp();
}
// Core evaluation endpoint (existing)
var evaluateAction_1 = require("./evaluateAction");
Object.defineProperty(exports, "evaluateAction", { enumerable: true, get: function () { return evaluateAction_1.evaluateAction; } });
Object.defineProperty(exports, "generatePolicyRegex", { enumerable: true, get: function () { return evaluateAction_1.generatePolicyRegex; } });
// SupraWall Connect — multi-tenant management
var connect_1 = require("./connect");
Object.defineProperty(exports, "createPlatform", { enumerable: true, get: function () { return connect_1.createPlatform; } });
Object.defineProperty(exports, "getPlatform", { enumerable: true, get: function () { return connect_1.getPlatform; } });
Object.defineProperty(exports, "updateBasePolicies", { enumerable: true, get: function () { return connect_1.updateBasePolicies; } });
Object.defineProperty(exports, "issueConnectKey", { enumerable: true, get: function () { return connect_1.issueConnectKey; } });
Object.defineProperty(exports, "revokeConnectKey", { enumerable: true, get: function () { return connect_1.revokeConnectKey; } });
Object.defineProperty(exports, "listConnectKeys", { enumerable: true, get: function () { return connect_1.listConnectKeys; } });
Object.defineProperty(exports, "updateConnectKey", { enumerable: true, get: function () { return connect_1.updateConnectKey; } });
Object.defineProperty(exports, "getConnectAnalytics", { enumerable: true, get: function () { return connect_1.getConnectAnalytics; } });
Object.defineProperty(exports, "getConnectEvents", { enumerable: true, get: function () { return connect_1.getConnectEvents; } });
Object.defineProperty(exports, "notifyPlatformWebhook", { enumerable: true, get: function () { return connect_1.notifyPlatformWebhook; } });
//# sourceMappingURL=index.js.map