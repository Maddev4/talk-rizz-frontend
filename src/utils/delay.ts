/**
 * Creates a delay for the specified number of milliseconds.
 * @param ms The number of milliseconds to delay.
 * @returns A Promise that resolves after the specified delay.
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
