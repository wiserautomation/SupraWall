import { NextResponse } from 'next/server';
import { detectThreats } from '@/app/api/v1/evaluate/threat-detection';
import { evaluatePolicies } from '@/app/api/v1/evaluate/policy-engine';

/**
 * Dify API Extension Endpoint
 * This follows the Dify API Balance/Moderation protocol.
 * URL for Dify Dashboard: https://your-domain.com/api/v1/extensions/dify
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { point, params } = body;

    // Dify Extension points
    // 1. app_external_data_variable - for enriching data
    // 2. moderation - for security screening

    console.log('[Dify Extension] Received request:', { point, params });

    if (point === 'moderation') {
      const { text, user } = params;
      
      // Perform SupraWall Evaluation
      const threats = await detectThreats(text);
      const { decision, reason } = await evaluatePolicies(threats, 'default');

      // Dify expects a specific JSON response for moderation:
      // { "flagged": true, "action": "overridden", "inputs": { ... } }
      
      return NextResponse.json({
        flagged: decision !== 'ALLOW',
        action: decision === 'DENY' ? 'overridden' : 'passed',
        overridden_message: decision === 'DENY' ? `[SupraWall Security Block] ${reason}` : undefined,
      });
    }

    if (point === 'app_external_data_variable') {
      // Logic for data enrichment (e.g. scanning a variable before use)
      const { inputs } = params;
      // For now, return inputs as-is but we could append security metadata
      return NextResponse.json({
        result: inputs
      });
    }

    return NextResponse.json({ error: 'Unsupported extension point' }, { status: 400 });

  } catch (error: any) {
    console.error('[Dify Extension Error]:', error);
    return NextResponse.json({
      flagged: false,
      action: 'passed',
      error: error.message
    }, { status: 500 });
  }
}
