// Logger Utility - Infrastructure Layer
import { features } from '../config/api.config';

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

interface LogEntry {
    timestamp: string;
    level: string;
    context: string;
    message: string;
    data?: any;
}

export class Logger {
    private context: string;
    private logLevel: LogLevel;

    constructor(context: string = 'App', logLevel: LogLevel = LogLevel.INFO) {
        this.context = context;
        this.logLevel = features.enableDebugLogs ? LogLevel.DEBUG : logLevel;
    }

    /**
     * Error seviyesinde log yazar
     */
    error(message: string, data?: any): void {
        if (this.logLevel >= LogLevel.ERROR) {
            this.writeLog(LogLevel.ERROR, message, data);
        }
    }

    /**
     * Warning seviyesinde log yazar
     */
    warn(message: string, data?: any): void {
        if (this.logLevel >= LogLevel.WARN) {
            this.writeLog(LogLevel.WARN, message, data);
        }
    }

    /**
     * Info seviyesinde log yazar
     */
    info(message: string, data?: any): void {
        if (this.logLevel >= LogLevel.INFO) {
            this.writeLog(LogLevel.INFO, message, data);
        }
    }

    /**
     * Debug seviyesinde log yazar
     */
    debug(message: string, data?: any): void {
        if (this.logLevel >= LogLevel.DEBUG) {
            this.writeLog(LogLevel.DEBUG, message, data);
        }
    }

    /**
     * Log entry'yi konsola yazar
     */
    private writeLog(level: LogLevel, message: string, data?: any): void {
        const logEntry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel[level],
            context: this.context,
            message,
            data,
        };

        const formattedMessage = this.formatMessage(logEntry);

        switch (level) {
            case LogLevel.ERROR:
                console.error(formattedMessage, data || '');
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage, data || '');
                break;
            case LogLevel.INFO:
                console.info(formattedMessage, data || '');
                break;
            case LogLevel.DEBUG:
                console.debug(formattedMessage, data || '');
                break;
        }

        // Production'da kritik hataları external service'e gönder
        if (level === LogLevel.ERROR && !features.enableDebugLogs) {
            this.sendToExternalService(logEntry);
        }
    }

    /**
     * Log mesajını formatlar
     */
    private formatMessage(entry: LogEntry): string {
        return `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`;
    }

    /**
     * Production ortamında kritik hataları external service'e gönderir
     */
    private sendToExternalService(logEntry: LogEntry): void {
        // Burada Sentry, LogRocket vb. external logging service'lere gönderilebilir
        // Örnek implementation:
        /*
        try {
          // External service API call
          fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logEntry),
          });
        } catch (error) {
          console.error('Failed to send log to external service:', error);
        }
        */
    }

    /**
     * Performance tracking için timer başlatır
     */
    startTimer(label: string): () => void {
        const startTime = performance.now();

        return () => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            this.debug(`Timer [${label}]: ${duration.toFixed(2)}ms`);
        };
    }

    /**
     * Network request'leri loglar
     */
    logRequest(method: string, url: string, data?: any): void {
        this.debug(`🌐 ${method.toUpperCase()} ${url}`, data);
    }

    /**
     * Network response'ları loglar
     */
    logResponse(status: number, url: string, data?: any): void {
        const emoji = status >= 200 && status < 300 ? '✅' : '❌';
        this.debug(`${emoji} ${status} ${url}`, data);
    }

    /**
     * User action'ları loglar
     */
    logUserAction(action: string, details?: any): void {
        this.info(`👤 User Action: ${action}`, details);
    }

    /**
     * Component lifecycle'ı loglar
     */
    logComponentLifecycle(component: string, phase: string, props?: any): void {
        this.debug(`🔄 ${component} [${phase}]`, props);
    }

    /**
     * Cache operations'ları loglar
     */
    logCacheOperation(operation: string, key: string, value?: any): void {
        this.debug(`💾 Cache ${operation}: ${key}`, value);
    }
}

// Global logger instance
export const logger = new Logger('Global');

// Context-specific logger factory
export const createLogger = (context: string): Logger => {
    return new Logger(context);
}; 