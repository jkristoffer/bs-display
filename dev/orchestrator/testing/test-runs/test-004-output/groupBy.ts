/**
 * Groups array items by a key selector function
 * 
 * @param items - Array to group (Can contain null/undefined values)
 * @param keySelector - Function to extract grouping key (Must return string or number)
 * @returns Object with arrays grouped by key
 * 
 * @example
 * const people = [{name: 'John', age: 25}, {name: 'Jane', age: 25}, {name: 'Bob', age: 30}];
 * const grouped = groupBy(people, person => person.age);
 * // Result: { 25: [{name: 'John', age: 25}, {name: 'Jane', age: 25}], 30: [{name: 'Bob', age: 30}] }
 * 
 * @complexity Time: O(n), Space: O(n)
 */
export const groupBy = <T, K extends string | number>(
    items: T[],
    keySelector: (item: T) => K
): Record<K, T[]> => {
    return items
        .filter((item): item is T => item !== null && item !== undefined)
        .reduce((acc, item) => {
            const key = keySelector(item);
            return {
                ...acc,
                [key]: [...(acc[key] || []), item]
            };
        }, {} as Record<K, T[]>);
};
