// Mock environment variables
process.env.ORIGINAL_DOMAIN = 'mukhtasar.pro';
process.env.NODE_ENV = 'test';
process.env.AUTH_SESSION_NAME = 'auth_session';

// Suppress console.log in tests unless explicitly needed
const originalConsoleLog = console.log;
console.log = (...args) => {
    if (process.env.DEBUG_TESTS === 'true') {
        originalConsoleLog(...args);
    }
};