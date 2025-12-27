// Jest globals are available without import
import { Request, Response } from 'express';

// Import the controllers
import * as publicControllers from '../controllers/public.controllers.js';

// Import test utilities
import {
    mockUrlService,
    resetAllMocks,
    setupSuccessfulMocks,
    createMockRequest,
    createMockResponse,
} from './test-utils.js';

// Mock the URL service module
jest.mock('../domain/url.service.js', () => mockUrlService);

// Import error types for testing
import { URLNotFoundException } from '../domain/error-types.js';

describe('URL Public Controllers', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        setupSuccessfulMocks();
        mockRequest = createMockRequest();
        mockResponse = createMockResponse();
    });

    afterEach(() => {
        resetAllMocks();
    });

    describe('getOriginalUrl', () => {
        it('When valid alias and domain are provided, should return original URL successfully', async () => {
            // Arrange
            const originalUrl = 'https://example.com';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(originalUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith({
                domain: 'mukhtasar.pro',
                alias: 'test-alias',
            });
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: originalUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When domain parameter is missing, should use default domain from environment', async () => {
            // Arrange
            const originalUrl = 'https://example.com';
            mockRequest.params = { alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(originalUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith({
                domain: 'mukhtasar.pro', // Default domain from process.env.ORIGINAL_DOMAIN
                alias: 'test-alias',
            });
        });

        it('When URL is not found, should throw URLNotFoundException', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'non-existent' };
            mockUrlService.getOriginalUrl.mockRejectedValue(new URLNotFoundException());

            // Act & Assert
            await expect(
                publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow(URLNotFoundException);
        });

        it('When alias parameter is missing, should pass undefined alias to service', async () => {
            // Arrange
            const originalUrl = 'https://example.com';
            mockRequest.params = { domain: 'mukhtasar.pro' };
            mockUrlService.getOriginalUrl.mockResolvedValue(originalUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith({
                domain: 'mukhtasar.pro',
                alias: undefined,
            });
        });

        it('When both domain and alias are missing, should use default domain and undefined alias', async () => {
            // Arrange
            const originalUrl = 'https://example.com';
            mockRequest.params = {};
            mockUrlService.getOriginalUrl.mockResolvedValue(originalUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockUrlService.getOriginalUrl).toHaveBeenCalledWith({
                domain: 'mukhtasar.pro',
                alias: undefined,
            });
        });

        it('When service returns a very long URL, should handle it correctly', async () => {
            // Arrange
            const longUrl = 'https://example.com/' + 'a'.repeat(1000);
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(longUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: longUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When service returns a URL with special characters, should handle it correctly', async () => {
            // Arrange
            const specialUrl = 'https://example.com/path?param=value&other=test#section';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(specialUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: specialUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When service returns a URL with Arabic characters, should handle it correctly', async () => {
            // Arrange
            const arabicUrl = 'https://example.com/صفحة-عربية?param=قيمة';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(arabicUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: arabicUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When service returns a URL with encoded characters, should handle it correctly', async () => {
            // Arrange
            const encodedUrl = 'https://example.com/path%20with%20spaces?param=value%20encoded';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(encodedUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: encodedUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When service returns an empty string, should handle it correctly', async () => {
            // Arrange
            const emptyUrl = '';
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            mockUrlService.getOriginalUrl.mockResolvedValue(emptyUrl);

            // Act
            await publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: {
                    url: emptyUrl,
                },
                errors: [],
                code: 0,
                errorCode: 'NO_ERROR',
            });
        });

        it('When service throws a generic error, should propagate the error', async () => {
            // Arrange
            mockRequest.params = { domain: 'mukhtasar.pro', alias: 'test-alias' };
            const genericError = new Error('Generic service error');
            mockUrlService.getOriginalUrl.mockRejectedValue(genericError);

            // Act & Assert
            await expect(
                publicControllers.getOriginalUrl(mockRequest as Request, mockResponse as Response)
            ).rejects.toThrow('Generic service error');
        });
    });
});
