type PiiPattern = 'email' | 'phone' | 'ssn' | 'credit_card' | 'ip';

const PII_PATTERNS: Record<PiiPattern, RegExp> = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    phone: /\b(\+\d{1,3}[\s.-])?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    credit_card: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
    ip: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

export function scrubPii(
    args: Record<string, any>,
    config: {
        patterns: string[];
        action: 'redact' | 'block';
        customPatterns?: { name: string; regex: string; action: 'redact' | 'block' }[];
    }
): { modifiedArgs: Record<string, any>; shouldBlock: boolean } {
    let argsStr = JSON.stringify(args);
    let shouldBlock = false;

    for (const pattern of config.patterns) {
        const regex = PII_PATTERNS[pattern as PiiPattern];
        if (!regex) continue;
        regex.lastIndex = 0;
        if (config.action === 'block' && regex.test(argsStr)) {
            shouldBlock = true;
            break;
        }
        regex.lastIndex = 0;
        argsStr = argsStr.replace(regex, `[REDACTED:${pattern.toUpperCase()}]`);
    }

    if (!shouldBlock) {
        for (const custom of config.customPatterns || []) {
            const regex = new RegExp(custom.regex, 'g');
            if (custom.action === 'block' && regex.test(argsStr)) {
                shouldBlock = true;
                break;
            }
            argsStr = argsStr.replace(new RegExp(custom.regex, 'g'), `[REDACTED:${custom.name.toUpperCase()}]`);
        }
    }

    return { modifiedArgs: shouldBlock ? args : JSON.parse(argsStr), shouldBlock };
}
