// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import chalk from 'chalk';

export function printBanner(): void {
    console.log('');
    console.log(
        chalk.hex('#6366f1')(
            '  ███████╗██╗   ██╗██████╗ ██████╗  █████╗ ██╗    ██╗ █████╗ ██╗     ██╗\n' +
            '  ██╔════╝██║   ██║██╔══██╗██╔══██╗██╔══██╗██║    ██║██╔══██╗██║     ██║\n' +
            '  ███████╗██║   ██║██████╔╝██████╔╝███████║██║ █╗ ██║███████║██║     ██║\n' +
            '  ╚════██║██║   ██║██╔═══╝ ██╔══██╗██╔══██║██║███╗██║██╔══██║██║     ██║\n' +
            '  ███████║╚██████╔╝██║     ██║  ██║██║  ██║╚███╔███╔╝██║  ██║███████╗███████╗\n' +
            '  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝'
        )
    );
    console.log(chalk.gray('  The Compliance OS for AI Agents'));
    console.log('');
}

export interface SuccessItem {
    label: string;
}

export function printSuccessScreen(
    items: SuccessItem[],
    mode: 'cloud' | 'self-hosted',
    detectedFramework: string | null,
    agentFile: string | null
): void {
    console.log('');
    items.forEach(({ label }) => {
        console.log(chalk.green('  ✔ ') + chalk.white(label));
    });
    console.log('');

    if (mode === 'cloud') {
        console.log(
            chalk.hex('#6366f1')('  🛡️  Your agent is protected. ') +
            chalk.bold.white('EU AI Act Article 12 audit trail: ') +
            chalk.green('ON')
        );
        console.log('');
        console.log(
            chalk.gray('  Next: ') +
            chalk.cyan('supra-wall.com/dashboard') +
            chalk.gray(' → view your first intercepted call')
        );
    } else {
        console.log(
            chalk.hex('#6366f1')('  🛡️  Protected locally. ') +
            chalk.bold.white('No account needed.')
        );
        console.log('');
        console.log(
            chalk.gray('  Want cloud audit logs & EU AI Act reports? ') +
            chalk.cyan('supra-wall.com/upgrade')
        );
    }
    console.log('');
}

export function printStep(message: string): void {
    process.stdout.write(chalk.gray(`  › ${message}...`));
}

export function printStepDone(): void {
    process.stdout.write(' ' + chalk.green('✔') + '\n');
}

export function printStepSkipped(reason: string): void {
    process.stdout.write(' ' + chalk.yellow(`skipped (${reason})`) + '\n');
}

export function printError(message: string): void {
    console.error(chalk.red(`\n  ✖ ${message}\n`));
}

export function printInfo(message: string): void {
    console.log(chalk.gray(`  ℹ ${message}`));
}
