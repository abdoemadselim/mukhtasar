// Jest globals are available without import
import { Request, Response } from 'express';

// Import the controllers
import * as apiControllers from '../controllers/api.controllers.js';
import { IRequest } from '../types.js';

// Import test utilities
import {
    mockUrlService,
    resetAllMocks,
    setupSuccessfulMocks,
    createTestUrl,
    createUrlInput,
    createMockRequestWithUser,
    createMockResponse,
} from './test-utils.js';

// Mock the URL service module
jest.mock('../domain/url.service.js', () => mockUrlService);

// Import error types for testing
import { URLNotFoundException } from '../domain/error-types.js';
import { ConflictException, ValidationException } from '#lib/error-handling/error-types.js';

describe('URL API Controllers', () => {
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

    describe('getShortUrlInfo', () => {
        it('When valid alias and domain are provided, should return URL information successfully', async () => {
            // Arrange
            const expectedUrl = createTestUrl();
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getUrlInfo.mockResolvedValue(expectedUrl);

            // Act
            await apiControllers.getShortUrlInfo(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlInfo).toHaveBeenCalledWith({
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: expectedUrl,
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When URL is not found, should throw URLNotFoundException', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'non-existent' };
            mockUrlService.getUrlInfo.mockRejectedValue(new URLNotFoundException());

            // Act & Assert
            await expect(
                apiControllers.getShortUrlInfo(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });

        it('When domain parameter is missing, should pass undefined domain to service', async () => {
            // Arrange
            mockRequest.params = { alias: 'test-alias' };
            const expectedUrl = createTestUrl();
            mockUrlService.getUrlInfo.mockResolvedValue(expectedUrl);

            // Act
            await apiControllers.getShortUrlInfo(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlInfo).toHaveBeenCalledWith({
                alias: 'test-alias',
                domain: undefined,
            });
        });

        it('When alias parameter is missing, should pass undefined alias to service', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro' };
            const expectedUrl = createTestUrl();
            mockUrlService.getUrlInfo.mockResolvedValue(expectedUrl);

            // Act
            await apiControllers.getShortUrlInfo(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlInfo).toHaveBeenCalledWith({
                alias: undefined,
                domain: 'mukhtasar.pro',
            });
        });
    });

    describe('createUrl', () => {
        it('When valid URL data is provided with authenticated user, should create URL successfully', async () => {
            // Arrange
            const urlInput = createUrlInput();
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                description: 'Test URL',
            };

            mockRequest.body = urlInput;
            mockRequest.user = { id: 1 };
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await apiControllers.createUrl(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                ...urlInput,
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

        it('When user is not authenticated, should pass undefined user_id to service', async () => {
            // Arrange
            const urlInput = createUrlInput();
            const expectedResponse = {
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
                original_url: 'https://example.com',
                created_at: '2024-01-01T00:00:00Z',
                description: 'Test URL',
            };

            mockRequest.body = urlInput;
            mockRequest.user = undefined;
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await apiControllers.createUrl(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                ...urlInput,
                user_id: undefined,
            });
        });

        it('When URL creation fails due to validation error, should propagate the error', async () => {
            // Arrange
            const urlInput = createUrlInput();
            mockRequest.body = urlInput;
            mockRequest.user = { id: 1 };
            const validationError = new ValidationException({ domain: { message: 'Invalid domain' } });
            mockUrlService.createUrl.mockRejectedValue(validationError);

            // Act & Assert
            await expect(
                apiControllers.createUrl(mockRequest as IRequest, mockResponse as Response)
            ).rejects.toThrow(ValidationException);
        });

        it('When URL creation fails due to conflict error, should propagate the error', async () => {
            // Arrange
            const urlInput = createUrlInput();
            mockRequest.body = urlInput;
            mockRequest.user = { id: 1 };
            const conflictError = new ConflictException('Alias already exists');
            mockUrlService.createUrl.mockRejectedValue(conflictError);

            // Act & Assert
            await expect(
                apiControllers.createUrl(mockRequest as IRequest, mockResponse as Response)
            ).rejects.toThrow(ConflictException);
        });

        it('When request body is empty, should pass empty object to service', async () => {
            // Arrange
            mockRequest.body = {};
            mockRequest.user = { id: 1 };
            const expectedResponse = {
                alias: 'generated-alias',
                domain: 'mukhtasar.pro',
                original_url: undefined,
                created_at: '2024-01-01T00:00:00Z',
                description: undefined,
            };
            mockUrlService.createUrl.mockResolvedValue(expectedResponse);

            // Act
            await apiControllers.createUrl(mockRequest as IRequest, mockResponse as Response);

            // Assert
            expect(mockUrlService.createUrl).toHaveBeenCalledWith({
                user_id: 1,
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
            await apiControllers.deleteUrl(mockRequest as Request, mockResponse as Response);

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
                apiControllers.deleteUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });

        it('When domain parameter is missing, should pass undefined domain to service', async () => {
            // Arrange
            mockRequest.params = { alias: 'test-alias' };
            const deletedUrl = createTestUrl();
            mockUrlService.deleteUrl.mockResolvedValue(deletedUrl);

            // Act
            await apiControllers.deleteUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.deleteUrl).toHaveBeenCalledWith({
                alias: 'test-alias',
                domain: undefined,
            });
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
            await apiControllers.updateUrl(mockRequest as Request, mockResponse as Response);

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
                apiControllers.updateUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });

        it('When original_url is missing from request body, should pass undefined to service', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockRequest.body = {};
            mockUrlService.updateUrl.mockResolvedValue(undefined);

            // Act
            await apiControllers.updateUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.updateUrl).toHaveBeenCalledWith(
                { alias: 'test-alias', domain: 'mukhtasar.pro' },
                undefined
            );
        });

        it('When service returns same URL as input, should still return success response', async () => {
            // Arrange
            const sameUrl = 'https://example.com';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockRequest.body = { original_url: sameUrl };
            mockUrlService.updateUrl.mockResolvedValue(sameUrl);

            // Act
            await apiControllers.updateUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: sameUrl,
                    alias: 'test-alias',
                    domain: 'mukhtasar.pro',
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });
    });

    describe('getUrlClickCounts', () => {
        it('When valid alias and domain are provided, should return click count successfully', async () => {
            // Arrange
            const clickCount = 42;
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getUrlClickCount.mockResolvedValue(clickCount);

            // Act
            await apiControllers.getUrlClickCounts(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getUrlClickCount).toHaveBeenCalledWith({
                alias: 'test-alias',
                domain: 'mukhtasar.pro',
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    alias: 'test-alias',
                    domain: 'mukhtasar.pro',
                    clickCount: 42,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When URL for click count is not found, should throw URLNotFoundException', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'non-existent' };
            mockUrlService.getUrlClickCount.mockRejectedValue(new URLNotFoundException());

            // Act & Assert
            await expect(
                apiControllers.getUrlClickCounts(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });

        it('When click count is zero, should return zero successfully', async () => {
            // Arrange
            const clickCount = 0;
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getUrlClickCount.mockResolvedValue(clickCount);

            // Act
            await apiControllers.getUrlClickCounts(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    alias: 'test-alias',
                    domain: 'mukhtasar.pro',
                    clickCount: 0,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When click count is very large, should handle it correctly', async () => {
            // Arrange
            const clickCount = 999999;
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getUrlClickCount.mockResolvedValue(clickCount);

            // Act
            await apiControllers.getUrlClickCounts(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    alias: 'test-alias',
                    domain: 'mukhtasar.pro',
                    clickCount: 999999,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });
    });
});
