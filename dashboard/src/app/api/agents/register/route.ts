import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { randomBytes } from 'crypto';

// Initialize Firebase Admin (idempotent)
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

/**
 * POST /api/agents/register
 *
 * Registers a new agent with scoped permissions.
 * Called by the SDK's AgentIdentity.register() method.
 *
 * Body: { name, apiKey (Master Key), scopes, scopeLimits? }
 * Returns: { id, name, apiKey (Agent Key), uri, scopes, scopeLimits }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, apiKey: masterKey, scopes, scopeLimits } = body;

        // --- 1. Master API Key Authentication ---
        if (!masterKey) {
            return NextResponse.json(
                { error: 'Master API Key (apiKey) is required to register new agents.' },
                { status: 401 }
            );
        }

        // Look up the user/org by masterApiKey
        const userQuery = await db.collection('users')
            .where('masterApiKey', '==', masterKey)
            .limit(1)
            .get();

        if (userQuery.empty) {
            return NextResponse.json(
                { error: 'Invalid Master API Key.' },
                { status: 401 }
            );
        }

        const userDoc = userQuery.docs[0];
        const userId = userDoc.id; 
        const userData = userDoc.data();

        console.log(`[SupraWall API] Registering agent "${name}" for user ${userId} (${userData.email || 'no-email'})`);

        // --- 2. Validation ---
        if (!name || typeof name !== 'string' || name.trim().length < 1) {
            return NextResponse.json(
                { error: 'Agent name is required.' },
                { status: 400 }
            );
        }

        if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
            return NextResponse.json(
                { error: 'At least one scope is required. Example: ["crm:read", "email:send"]' },
                { status: 400 }
            );
        }

        // Validate scope format (namespace:action)
        const scopePattern = /^[a-z_]+:[a-z_*]+$/;
        for (const scope of scopes) {
            if (!scopePattern.test(scope)) {
                return NextResponse.json(
                    { error: `Invalid scope format: "${scope}". Expected format: "namespace:action" (e.g., "crm:read").` },
                    { status: 400 }
                );
            }
        }

        // Check for duplicate agent names within the same organization
        const existing = await db
            .collection('agents')
            .where('userId', '==', userId)
            .where('name', '==', name.trim())
            .limit(1)
            .get();

        if (!existing.empty) {
            return NextResponse.json(
                { error: `Agent "${name}" already exists for this organization.` },
                { status: 409 }
            );
        }

        // --- 3. Generate Agent Credentials ---
        const agentApiKey = 'ag_' + randomBytes(24).toString('hex');
        const agentUri = `agent://${name.trim().toLowerCase().replace(/\s+/g, '-')}-${randomBytes(4).toString('hex')}@suprawall.com`;

        const agentData = {
            userId,
            name: name.trim(),
            apiKey: agentApiKey,
            uri: agentUri,
            scopes,
            scopeLimits: scopeLimits || {},
            status: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            lastActiveAt: null,
            totalCalls: 0,
            totalSpendUsd: 0,
            // Include helpful metadata from the org/user
            orgName: userDoc.data()?.companyName || userDoc.data()?.email || 'Default Org',
        };

        const docRef = await db.collection('agents').add(agentData);

        return NextResponse.json({
            id: docRef.id,
            name: name.trim(),
            apiKey: agentApiKey,
            uri: agentUri,
            scopes,
            scopeLimits: scopeLimits || {},
            status: 'active',
        }, { status: 201 });

    } catch (error: any) {
        console.error('[SupraWall] Agent registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error during agent registration.' },
            { status: 500 }
        );
    }
}
