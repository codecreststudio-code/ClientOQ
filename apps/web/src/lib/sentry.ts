import * as Sentry from '@sentry/nextjs';

// Initialize additional Sentry error handling
export function initializeSentryErrorHandling() {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.onunhandledrejection = (event) => {
      Sentry.captureException(event.reason);
      console.error('Unhandled promise rejection:', event.reason);
    };

    // Handle uncaught exceptions
    window.onerror = (message, source, lineno, colno, error) => {
      const msgString = typeof message === 'string' ? message : (message && (message as any).message) || String(message);
      Sentry.captureException(error || new Error(msgString));
      console.error('Uncaught exception:', { message, source, lineno, colno, error });
      return false; // Let browser handle it normally
    };
  }
}

// Set user context in Sentry
export function setSentryUserContext(user: any) {
  if (user && user.id) {
    Sentry.setUser({
      id: user.id,
      email: user.email || '',
      username: `${user.firstName} ${user.lastName || ''}`.trim(),
      role: user.role || '',
      organizationId: user.organizationId || '',
    });
  } else {
    Sentry.setUser(null);
  }
}

// Add tags for environment and version
export function setSentryTags() {
  if (typeof window !== 'undefined') {
    Sentry.setTag('environment', process.env.NODE_ENV || 'development');
    Sentry.setTag('platform', 'web');

    // Add version tag if available
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
    if (version) {
      Sentry.setTag('version', version);
    }
  }
}