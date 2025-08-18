export function toBase62(number: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (number === 0) return '0';

    let result = '';
    while (number > 0) {
        const remainder = number % 62;
        result = chars[remainder] + result;
        number = Math.floor(number / 62);
    }
    return result;
}