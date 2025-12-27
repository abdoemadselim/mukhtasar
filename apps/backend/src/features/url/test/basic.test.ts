// Jest globals are available without import

describe('URL Feature Test Suite', () => {
    it('should demonstrate that Jest is working correctly', () => {
        // Arrange
        const testValue = 'Hello World';

        // Act
        const result = testValue.toUpperCase();

        // Assert
        expect(result).toBe('HELLO WORLD');
    });

    it('should handle async operations', async () => {
        // Arrange
        const promise = Promise.resolve('async result');

        // Act
        const result = await promise;

        // Assert
        expect(result).toBe('async result');
    });

    it('should handle mock functions', () => {
        // Arrange
        const mockFn = jest.fn();

        // Act
        mockFn('test argument');

        // Assert
        expect(mockFn).toHaveBeenCalledWith('test argument');
        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});
