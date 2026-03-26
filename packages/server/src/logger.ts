// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

class Logger {
    private isProduction = process.env.NODE_ENV === 'production';

    private formatMessage(level: LogLevel, message: string, meta?: any) {
        const timestamp = new Date().toISOString();
        const payload = {
            timestamp,
            level,
            message,
            ...meta
        };

        if (this.isProduction) {
            return JSON.stringify(payload);
        }

        // Pretty print for development
        const color = level === 'ERROR' ? '\x1b[31m' : level === 'WARN' ? '\x1b[33m' : '\x1b[32m';
        return `[${timestamp}] ${color}${level}\x1b[0m: ${message} ${meta ? JSON.stringify(meta) : ''}`;
    }

    debug(message: string, meta?: any) {
        if (!this.isProduction) {
            console.debug(this.formatMessage('DEBUG', message, meta));
        }
    }

    info(message: string, meta?: any) {
        console.info(this.formatMessage('INFO', message, meta));
    }

    warn(message: string, meta?: any) {
        console.warn(this.formatMessage('WARN', message, meta));
    }

    error(message: string, meta?: any) {
        console.error(this.formatMessage('ERROR', message, meta));
    }
}

export const logger = new Logger();
