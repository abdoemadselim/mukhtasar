// Jest globals are available without import

// Mock URL service functions
export const mockUrlService = {
    getUrlInfo: jest.fn(),
    createUrl: jest.fn(),
    deleteUrl: jest.fn(),
    updateUrl: jest.fn(),
    getUrlClickCount: jest.fn(),
    getOriginalUrl: jest.fn(),
    getUrlsPage: jest.fn(),
};

// Mock Redis client
export const mockRedisClient = {
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
};

// Mock domain repository
export const mockDomainRepository = {
    checkUserOwnsDomain: jest.fn(),
};

// Mock URL repository
export const mockUrlRepository = {
    getUrlByAliasAndDomain: jest.fn(),
    createUrl: jest.fn(),
    deleteUrl: jest.fn(),
    updateUrl: jest.fn(),
    getUrlClickCounts: jest.fn(),
    getUrlsPage: jest.fn(),
    getUrlsByUserId: jest.fn(),
};

// Mock ID generator
export const mockIdGenerator = jest.fn();

// Mock base converter
export const mockBaseConverter = {
    toBase62: jest.fn(),
};

// Test data factories following best practices
export const createTestUrl = (overrides = {}) => ({
    id: 1,
    alias: 'test-alias',
    domain: 'mukhtasar.pro',
    original_url: 'https://example.com',
    user_id: 1,
    analytics_enabled: true,
    created_at: '2024-01-01T00:00:00Z',
    short_url: 'https://mukhtasar.pro/test-alias',
    description: 'Test URL',
    ...overrides,
});

export const createUrlInput = (overrides = {}) => ({
    alias: 'test-alias',
    domain: 'mukhtasar.pro',
    original_url: 'https://example.com',
    user_id: 1,
    description: 'Test URL',
    analytics_enabled: true,
    ...overrides,
});

export const createMockRequest = (overrides = {}) => ({
    params: {},
    body: {},
    user: undefined,
    ...overrides,
});

export const createMockRequestWithUser = (userId: number, overrides = {}) => ({
    params: {},
    body: {},
    user: { id: userId },
    ...overrides,
});

export const createMockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    };
    return res;
};

// Reset all mocks
export const resetAllMocks = () => {
    Object.values(mockUrlService).forEach(mock => mock.mockReset());
    Object.values(mockRedisClient).forEach(mock => mock.mockReset());
    Object.values(mockDomainRepository).forEach(mock => mock.mockReset());
    Object.values(mockUrlRepository).forEach(mock => mock.mockReset());
    mockIdGenerator.mockReset();
    Object.values(mockBaseConverter).forEach(mock => mock.mockReset());
};

// Setup default successful mock implementations
export const setupSuccessfulMocks = () => {
    // Default successful responses
    mockUrlService.getUrlInfo.mockResolvedValue(createTestUrl());
    mockUrlService.createUrl.mockResolvedValue({
        alias: 'test-alias',
        domain: 'mukhtasar.pro',
        original_url: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        short_url: 'https://mukhtasar.pro/test-alias',
        description: 'Test URL',
    });
    mockUrlService.deleteUrl.mockResolvedValue(createTestUrl());
    mockUrlService.updateUrl.mockResolvedValue('https://updated-example.com');
    mockUrlService.getUrlClickCount.mockResolvedValue(42);
    mockUrlService.getOriginalUrl.mockResolvedValue('https://example.com');
    mockUrlService.getUrlsPage.mockResolvedValue({ urls: [createTestUrl()], total: 1 });

    // Default Redis responses
    mockRedisClient.get.mockResolvedValue(null);
    mockRedisClient.setEx.mockResolvedValue('OK');
    mockRedisClient.del.mockResolvedValue(1);

    // Default domain repository responses
    mockDomainRepository.checkUserOwnsDomain.mockResolvedValue(true);

    // Default URL repository responses
    mockUrlRepository.getUrlByAliasAndDomain.mockResolvedValue(createTestUrl());
    mockUrlRepository.createUrl.mockResolvedValue(createTestUrl());
    mockUrlRepository.deleteUrl.mockResolvedValue(undefined);
    mockUrlRepository.updateUrl.mockResolvedValue('https://updated-example.com');
    mockUrlRepository.getUrlClickCounts.mockResolvedValue(42);
    mockUrlRepository.getUrlsByUserId.mockResolvedValue([createTestUrl()]);

    // Default ID generator
    mockIdGenerator.mockResolvedValue(12345);
    mockBaseConverter.toBase62.mockReturnValue('abc123');
};
