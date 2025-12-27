// Jest globals are available without import
import { Request, Response } from 'express';

// Import the controllers
import * as uiControllers from '../controllers/ui.controllers.js';
import { IRequest } from '../types.js';

// Import test utilities
import {
    mockUrlService,
    mockUrlRepository,
    mockRedisClient,
    resetAllMocks,
    setupSuccessfulMocks,
    createTestUrl,
    createMockRequestWithUser,
    createMockResponse,
} from './test-utils.js';

// Mock the URL service module
jest.mock('../domain/url.service.js', () => mockUrlService);

// Mock the URL repository module
jest.mock('../data-access/url.repository.js', () => ({
    default: mockUrlRepository,
}));

// Mock Redis client
jest.mock('#lib/db/redis-connection.js', () => ({
    client: mockRedisClient,
}));

// Import error types for testing
import { URLNotFoundException } from '../domain/error-types.js';
import { ValidationException } from '#lib/error-handling/error-types.js';

describe('URL UI Controllers', () => {
    let mockRequest: Partial<IRequest>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        setupSuccessfulMocks();
        mockRequest = createMockRequestWithUser(1);
        mockResponse = createMockResponse();
    });

    afterEach(() => {
        resetAllMocks();
    });

    describe('createUrl', () => {
        it('When valid URL data is provided with authenticated user session, should create URL successfully', async () => {
            // Arrange
            const urlInput = {
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
            };
            const sessionId = 'session123';
            const userSession = { id: 1, email: 'test@example.com' };
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                short_url: 'https://mukhtasar.pro/test-alias',
                description: 'Test URL',
                is_temporary: false,
            };

            mockRequest.body = urlInput;
            mockRequest.cookies = { [process.env.AUTH_SESSION_NAME as string]: sessionId };
            mockRedisClient.get.mockResolvedValue(JSON.stringify(userSession));
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await uiControllers.createUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockRedisClient.get).toHaveBeenCalledWith(`sessions:${sessionId}`);
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
                user_id: 1,
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: expectedResponse,
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When no session cookie is provided, should create URL as guest user', async () => {
            // Arrange
            const urlInput = {
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
            };
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                short_url: 'https://mukhtasar.pro/test-alias',
                description: 'Test URL',
                is_temporary: true,
            };

            mockRequest.body = urlInput;
            mockRequest.cookies = {};
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await uiControllers.createUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
                user_id: null,
            });
        });

        it('When session exists but is invalid, should create URL as guest user', async () => {
            // Arrange
            const urlInput = {
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
            };
            const sessionId = 'invalid-session';
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                short_url: 'https://mukhtasar.pro/test-alias',
                description: 'Test URL',
                is_temporary: true,
            };

            mockRequest.body = urlInput;
            mockRequest.cookies = { [process.env.AUTH_SESSION_NAME as string]: sessionId };
            mockRedisClient.get.mockResolvedValue(null);
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await uiControllers.createUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
                user_id: null,
            });
        });

        it('When URL creation fails due to validation error, should propagate the error', async () => {
            // Arrange
            const urlInput = {
                original_url: 'invalid-url',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: 'Test URL',
            };
            mockRequest.body = urlInput;
            mockRequest.cookies = {};
            const validationError = new ValidationException({ original_url: { message: 'Invalid URL format' } });
            mockUrlService.createUrl.mockRejectedValue(validationError);

            // Act & Assert
            await expect(
                uiControllers.createUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(ValidationException);
        });

        it('When description is not provided, should use empty string as default', async () => {
            // Arrange
            const urlInput = {
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
            };
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                short_url: 'https://mukhtasar.pro/test-alias',
                description: '',
                is_temporary: false,
            };

            mockRequest.body = urlInput;
            mockRequest.cookies = {};
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await uiControllers.createUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                original_url: 'https://example.com',
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                description: '',
                user_id: null,
            });
        });
    });

    describe('getAllUrls', () => {
        it('When authenticated user requests all URLs, should return user URLs successfully', async () => {
            // Arrange
            const userId = 1;
            const userUrls = [createTestUrl(), createTestUrl({ id: 2, alias: 'another-alias' })];
            mockRequest.user = { id: userId };
            mockUrlRepository.getUrlsByUserId.mockResolvedValue(userUrls);

            // Act
            await uiControllers.getAllUrls(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlRepository.getUrlsByUserId).toHaveBeenCalledWith(userId);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    urls: userUrls,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When user is not authenticated, should pass undefined userId to repository', async () => {
            // Arrange
            mockRequest.user = undefined;
            mockUrlRepository.getUrlsByUserId.mockResolvedValue([]);

            // Act
            await uiControllers.getAllUrls(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlRepository.getUrlsByUserId).toHaveBeenCalledWith(undefined);
        });

        it('When user has no URLs, should return empty array', async () => {
            // Arrange
            const userId = 1;
            mockRequest.user = { id: userId };
            mockUrlRepository.getUrlsByUserId.mockResolvedValue([]);

            // Act
            await uiControllers.getAllUrls(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    urls: [],
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });
    });

    describe('getUrlsPage', () => {
        it('When valid pagination parameters are provided, should return paginated URLs', async () => {
            // Arrange
            const userId = 1;
            const page = 1;
            const pageSize = 5;
            const paginatedData = {
                urls: [createTestUrl(), createTestUrl({ id: 2 })],
                total: 2,
            };

            mockRequest.user = { id: userId };
            mockRequest.query = { page: page.toString(), pageSize: pageSize.toString() };
            mockUrlService.getUrlsPage.mockResolvedValue(paginatedData);

            // Act
            await uiControllers.getUrlsPage(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlsPage).toHaveBeenCalledWith({
                user_id: userId,
                page: page,
                page_size: pageSize,
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: paginatedData,
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When pagination parameters are not provided, should use default values', async () => {
            // Arrange
            const userId = 1;
            const paginatedData = {
                urls: [],
                total: 0,
            };

            mockRequest.user = { id: userId };
            mockRequest.query = {};
            mockUrlService.getUrlsPage.mockResolvedValue(paginatedData);

            // Act
            await uiControllers.getUrlsPage(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlsPage).toHaveBeenCalledWith({
                user_id: userId,
                page: 0,
                page_size: 10,
            });
        });

        it('When user is not authenticated, should pass undefined userId to service', async () => {
            // Arrange
            const paginatedData = {
                urls: [],
                total: 0,
            };

            mockRequest.user = undefined;
            mockRequest.query = { page: '0', pageSize: '10' };
            mockUrlService.getUrlsPage.mockResolvedValue(paginatedData);

            // Act
            await uiControllers.getUrlsPage(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlsPage).toHaveBeenCalledWith({
                user_id: undefined,
                page: 0,
                page_size: 10,
            });
        });
    });

    describe('deleteUrl', () => {
        it('When valid alias and domain are provided, should delete URL successfully', async () => {
            // Arrange
            const deletedUrl = createTestUrl();
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.deleteUrl.mockResolvedValue(deletedUrl);

            // Act
            await uiControllers.deleteUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.deleteUrl).toHaveBeenCalledWith({
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: deletedUrl,
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When URL to delete is not found, should throw URLNotFoundException', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'non-existent' };
            mockUrlService.deleteUrl.mockRejectedValue(new URLNotFoundException());

            // Act & Assert
            await expect(
                uiControllers.deleteUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });
    });

    describe('updateUrl', () => {
        it('When valid alias, domain and new URL are provided, should update URL successfully', async () => {
            // Arrange
            const newUrl = 'https://updated-example.com';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockRequest.body = { original_url: newUrl };
            mockUrlService.updateUrl.mockResolvedValue(newUrl);

            // Act
            await uiControllers.updateUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.updateUrl).toHaveBeenCalledWith(
                { alias: 'test-alias', domain: 'mukhtasar.pro' },
                newUrl
            );
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: newUrl,
                    alias: 'test-alias',
                    domain: 'mukhtasar.pro',
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When URL to update is not found, should throw URLNotFoundException', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'non-existent' };
            mockRequest.body = { original_url: 'https://updated-example.com' };
            mockUrlService.updateUrl.mockRejectedValue(new URLNotFoundException());

            // Act & Assert
            await expect(
                uiControllers.updateUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });
    });
});
