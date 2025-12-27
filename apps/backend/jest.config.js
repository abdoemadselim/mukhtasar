export default {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
        }],
    },
    moduleNameMapper: {
        '^#root/(.*)$': '<rootDir>/dist/$1',
        '^#features/(.*)$': '<rootDir>/dist/features/$1',
        '^#lib/(.*)$': '<rootDir>/dist/lib/$1',
        '^#routes/(.*)$': '<rootDir>/dist/routes/$1',
        '^#middlewares/(.*)$': '<rootDir>/dist/middlewares/$1',
        '^\\.\\./domain/(.*)$': '<rootDir>/dist/features/url/domain/$1',
        '^\\.\\./data-access/(.*)$': '<rootDir>/dist/features/url/data-access/$1',
        '^\\.\\./controllers/(.*)$': '<rootDir>/dist/features/url/controllers/$1',
        '^\\.\\./types\\.js$': '<rootDir>/dist/features/url/types.js',
    },
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.spec.ts',
    ],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.test.ts',
        '!src/**/*.spec.ts',
        '!src/main.ts',
        '!src/server.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
    testTimeout: 10000,
};
