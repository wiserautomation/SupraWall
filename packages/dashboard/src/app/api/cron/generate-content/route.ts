// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { admin } from '@/lib/firebase-admin';
import { GoogleGenAI } from '@google/genai';

// ── Content Queue Definition ──────────────────────────────────────────
// Each item represents a page to be generated. The cron picks the next
// "queued" item, generates the content via Gemini, and saves it as a
// pending_review task for the admin to approve.
// ──────────────────────────────────────────────────────────────────────

interface QueueItem {
    id?: string;
    status: 'queued' | 'generating' | 'generated' | 'published' | 'failed';
    type: 'comparison' | 'blog' | 'use-case' | 'integration' | 'pillar';
    urlPath: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    targetSearchVolume?: number;
    priority: number; // 1 = highest
    prompt: string;  // The generation prompt for Gemini
    createdAt?: FirebaseFirestore.Timestamp;
    generatedAt?: FirebaseFirestore.Timestamp;
}

// The initial content queue — seeded once, then the cron works through it
const CONTENT_QUEUE: Omit<QueueItem, 'id' | 'createdAt' | 'generatedAt'>[] = [
    {
        status: 'queued',
        type: 'comparison',
        urlPath: '/vs/datafeedwatch',
        primaryKeyword: 'datafeedwatch alternative',
        secondaryKeywords: ['datafeedwatch vs', 'feed management security', 'ai agent feed protection'],
        targetSearchVolume: 1300,
        priority: 1,
        prompt: `Write a comprehensive comparison landing page for SupraWall vs DataFeedWatch.

SupraWall is an AI agent security platform (runtime firewall) that protects AI agents from rogue behavior, infinite loops, and unauthorized tool calls.
DataFeedWatch is a product feed management tool.

The page should:
- Have a compelling H1 targeting "DataFeedWatch Alternative"
- Include a comparison table (features, pricing, use case fit)
- Highlight SupraWall's unique security capabilities
- Include sections: Overview, Feature Comparison, Pricing, Who Should Choose What, FAQ
- Use persuasive but honest copy
- Be optimized for the keyword "datafeedwatch alternative"
- Format as markdown with proper heading hierarchy (H1, H2, H3)
- Be approximately 1500-2000 words
- Include a clear CTA to try SupraWall`
    },
    {
        status: 'queued',
        type: 'comparison',
        urlPath: '/vs/prompt-guard',
        primaryKeyword: 'prompt guard alternative',
        secondaryKeywords: ['llm guardrails', 'prompt injection prevention', 'ai security'],
        targetSearchVolume: 880,
        priority: 2,
        prompt: `Write a comprehensive comparison landing page for SupraWall vs Prompt Guard.

SupraWall is an AI agent security platform (runtime firewall) that protects AI agents from rogue behavior, infinite loops, cost overruns, and unauthorized tool calls. It operates at the tool execution layer, not just the prompt layer.
Prompt Guard focuses on prompt-level guardrails.

The page should:
- Have a compelling H1 targeting "Prompt Guard Alternative"
- Include a comparison table (features, pricing, defense layers)
- Highlight that SupraWall protects at runtime (tool execution) while Prompt Guard only protects at the prompt layer
- Include sections: Overview, Feature Comparison, Defense Layers, Pricing, FAQ
- Format as markdown with proper heading hierarchy
- Be approximately 1500-2000 words
- Include a clear CTA`
    },
    {
        status: 'queued',
        type: 'blog',
        urlPath: '/blog/ai-agent-cost-control-guide',
        primaryKeyword: 'ai agent cost control',
        secondaryKeywords: ['llm cost management', 'ai spending limits', 'agent budget caps'],
        targetSearchVolume: 720,
        priority: 3,
        prompt: `Write an in-depth blog post about AI Agent Cost Control.

Context: SupraWall is a runtime security platform for AI agents. One of its key features is cost control — preventing infinite loops, setting budget caps per agent, and tracking API credit usage in real-time.

The blog post should:
- Have a compelling H1 targeting "AI Agent Cost Control: The Complete Guide"
- Cover: Why AI agents are expensive to run, common cost explosion scenarios (infinite loops, LLM API abuse), how to set budget caps, monitoring & alerting, circuit breakers
- Include practical code examples showing SupraWall's budget cap configuration
- Include real-world cost scenarios and savings calculations
- Format as markdown with proper heading hierarchy
- Be approximately 2000-2500 words
- Include a CTA to try SupraWall's free tier`
    },
    {
        status: 'queued',
        type: 'use-case',
        urlPath: '/use-cases/financial-agents',
        primaryKeyword: 'ai agent financial compliance',
        secondaryKeywords: ['ai trading bot security', 'financial ai guardrails', 'autonomous agent compliance'],
        targetSearchVolume: 590,
        priority: 4,
        prompt: `Write a use case page about securing AI agents in financial services.

Context: SupraWall is a runtime security platform. Financial institutions need strict controls on what their AI agents can do — preventing unauthorized transactions, enforcing compliance limits, audit trails for regulators.

The page should:
- Have a compelling H1 targeting "AI Agent Security for Financial Services"
- Cover: Compliance requirements (SOC2, GDPR, PCI), transaction limits, approval workflows for high-value actions, audit trails
- Include a scenario showing a financial AI agent attempting an unauthorized trade and SupraWall blocking it
- Format as markdown with proper heading hierarchy
- Be approximately 1500 words
- Include a CTA`
    },
    {
        status: 'queued',
        type: 'blog',
        urlPath: '/blog/langchain-security-best-practices',
        primaryKeyword: 'langchain security',
        secondaryKeywords: ['langchain guardrails', 'langchain safety', 'secure langchain agent'],
        targetSearchVolume: 1100,
        priority: 5,
        prompt: `Write an expert blog post about LangChain Security Best Practices.

Context: SupraWall provides a drop-in security shim for LangChain agents. This post should educate LangChain developers on security risks and position SupraWall as the solution.

The post should:
- Have a compelling H1 targeting "LangChain Security Best Practices (2026 Guide)"
- Cover: Top 5 security risks in LangChain agents, prompt injection, tool abuse, data exfiltration, infinite loops, unauthorized API calls
- Include code examples showing vulnerable LangChain code and the fix with SupraWall
- Show before/after code snippets
- Format as markdown
- Be approximately 2000-2500 words
- Include a CTA to install SupraWall's LangChain plugin`
    },
    {
        status: 'queued',
        type: 'comparison',
        urlPath: '/vs/guardrails-ai',
        primaryKeyword: 'guardrails ai alternative',
        secondaryKeywords: ['guardrails ai vs', 'ai output validation', 'runtime ai security'],
        targetSearchVolume: 950,
        priority: 6,
        prompt: `Write a comprehensive comparison page for SupraWall vs Guardrails AI.

SupraWall is an AI agent runtime security platform — it intercepts and controls tool calls, prevents infinite loops, enforces budget caps, and provides forensic audit logs.
Guardrails AI focuses on validating LLM outputs (schema validation, semantic checks).

The page should:
- Have a compelling H1 targeting "Guardrails AI Alternative"
- Include a comparison table highlighting different defense layers
- Show that SupraWall operates at the tool/action layer while Guardrails AI operates at the output/validation layer
- Both have value — position SupraWall as complementary but more comprehensive
- Format as markdown
- Be approximately 1500-2000 words`
    },
    {
        status: 'queued',
        type: 'blog',
        urlPath: '/blog/prevent-ai-agent-data-exfiltration',
        primaryKeyword: 'ai agent data exfiltration prevention',
        secondaryKeywords: ['llm data leak', 'ai agent data security', 'prevent ai data theft'],
        targetSearchVolume: 480,
        priority: 7,
        prompt: `Write a detailed blog post about preventing data exfiltration by AI agents.

Context: AI agents with tool access can inadvertently or maliciously exfiltrate sensitive data. SupraWall prevents this with URL allowlists, data flow policies, and real-time monitoring.

The post should:
- Cover real-world data exfiltration scenarios with AI agents
- Explain how agents can leak data through tool calls (HTTP requests, email, file writes)
- Show how SupraWall's policy engine blocks unauthorized data flows
- Include code examples and policy configurations
- Format as markdown
- Be approximately 1800-2200 words`
    },
];

// ── Cron Handler ──────────────────────────────────────────────────────
// Vercel calls this endpoint daily. It picks the next queued item,
// generates content via Gemini, and creates a task for admin review.
// ──────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Triggered generate-content');
    const db = getAdminDb();
    console.log('[CRON] Firebase Admin DB initialized');

    try {
        // Step 1: Ensure the content queue is seeded
        await seedQueueIfEmpty(db);

        // Step 2: Pick the next queued item (highest priority first)
        const queueSnapshot = await db.collection('content_queue')
            .where('status', '==', 'queued')
            .orderBy('priority', 'asc')
            .limit(1)
            .get();

        if (queueSnapshot.empty) {
            return NextResponse.json({
                status: 'idle',
                message: 'No queued content items. All content has been generated.'
            });
        }

        const queueDoc = queueSnapshot.docs[0];
        const queueItem = queueDoc.data() as QueueItem;
        console.log(`[CRON] Selected item for generation: ${queueItem.urlPath} (Priority ${queueItem.priority})`);

        // Step 3: Mark as "generating" to prevent double processing
        await queueDoc.ref.update({ status: 'generating' });

        // Step 4: Generate content via Gemini
        console.log('[CRON] Initializing Gemini AI...');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[CRON] Missing GEMINI_API_KEY');
            await queueDoc.ref.update({ status: 'failed' });
            return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const systemPrompt = `You are an expert SEO content writer and cybersecurity engineer. 
You write for SupraWall (supra-wall.com), an AI agent runtime security platform.
SupraWall is a firewall for AI agents — it intercepts tool calls, prevents infinite loops, 
enforces budget caps, blocks unauthorized actions, and provides forensic audit logs.
It supports LangChain, CrewAI, AutoGen, Vercel AI SDK, and OpenClaw.

Write content that is:
- SEO optimized for the target keyword
- Technically accurate
- Persuasive but honest
- Well-structured with proper markdown formatting
- Ready for publication

Target keyword: "${queueItem.primaryKeyword}"
Secondary keywords to include naturally: ${queueItem.secondaryKeywords.join(', ')}`;

        console.log('[CRON] Calling Gemini generateContent...');
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: queueItem.prompt,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
                maxOutputTokens: 2048, // Reduced for faster generation during testing
            }
        });

        console.log('[CRON] Gemini response received');

        const contentDraft = aiResponse.text || '';

        if (!contentDraft || contentDraft.length < 200) {
            await queueDoc.ref.update({ status: 'failed' });
            return NextResponse.json({
                error: 'Generated content too short or empty',
                length: contentDraft.length
            }, { status: 500 });
        }

        // Step 5: Create a task for admin review
        const taskNumber = `AUTO-${Date.now().toString(36).toUpperCase()}`;
        const taskData = {
            taskNumber,
            type: queueItem.type,
            status: 'pending_review',
            url: queueItem.urlPath,
            primaryKeyword: queueItem.primaryKeyword,
            secondaryKeywords: queueItem.secondaryKeywords,
            sourceFile: `auto-generated (cron)`,
            previewUrl: `https://www.supra-wall.com${queueItem.urlPath}`,
            contentDraft,
            checklist: [
                '✅ AI-generated content via Gemini',
                `✅ Target keyword: ${queueItem.primaryKeyword}`,
                `✅ Secondary keywords: ${queueItem.secondaryKeywords.join(', ')}`,
                `✅ Page type: ${queueItem.type}`,
                '⏳ Awaiting human review',
                '⏳ SEO meta tags pending',
                '⏳ Internal linking pending',
            ],
            batch: 'auto-daily',
            humanAction: null,
            humanNote: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            reviewedAt: null,
            publishedAt: null,
        };

        await db.collection('tasks').add(taskData);

        // Step 6: Mark queue item as generated
        await queueDoc.ref.update({
            status: 'generated',
            generatedAt: admin.firestore.FieldValue.serverTimestamp(),
            taskNumber,
        });

        console.log(`[CRON] Successfully generated task: ${taskNumber}`);
        return NextResponse.json({
            status: 'success',
            taskNumber,
            page: queueItem.urlPath,
            keyword: queueItem.primaryKeyword,
            contentLength: contentDraft.length,
        });

    } catch (error: any) {
        console.error('[CRON] Error during content generation:', error);
        console.error('[CRON] Stack:', error.stack);

        // Attempt to mark as failed if we have a doc ref
        try {
            const queueSnapshot = await db.collection('content_queue')
                .where('status', '==', 'generating')
                .limit(1)
                .get();
            if (!queueSnapshot.empty) {
                await queueSnapshot.docs[0].ref.update({ status: 'failed' });
            }
        } catch (e) {
            console.error('[CRON] Failed to update status to failed:', e);
        }

        return NextResponse.json({
            error: error.message || 'Unknown error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

// ── Seed the Queue ────────────────────────────────────────────────────
// On first run, populate Firebase with the content items to generate.
// Subsequent runs skip this step.
// ──────────────────────────────────────────────────────────────────────

async function seedQueueIfEmpty(db: FirebaseFirestore.Firestore) {
    const snapshot = await db.collection('content_queue').limit(1).get();
    if (!snapshot.empty) return; // Already seeded

    const batch = db.batch();
    for (const item of CONTENT_QUEUE) {
        const ref = db.collection('content_queue').doc();
        batch.set(ref, {
            ...item,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    await batch.commit();
    console.log(`[CRON] Seeded content queue with ${CONTENT_QUEUE.length} items`);
}
