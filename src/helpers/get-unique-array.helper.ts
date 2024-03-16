/**
 * Removes duplicate elements from an array, returning a new array with only unique elements.
 * @param array An array of any type.
 * @returns A new array containing only unique elements from the input array.
 */
export function getArrayWithUniqueElements<T>(array: Array<T>) {
    return [...new Set(array)];
}