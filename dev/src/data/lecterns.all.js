/**
 * Exports all lectern JSON files in the data directory that start with 'lecterns.'
 */

// Import all lectern JSON files
import maxhubLecterns from './lecterns.maxhub.json';
import smartpodiumLecterns from './lecterns.smartpodium.json';

// Export all lecterns
export {
    maxhubLecterns,
    smartpodiumLecterns
};

// Export combined array of all lecterns
export const allLecterns = [
    ...maxhubLecterns,
    ...smartpodiumLecterns
];

export default allLecterns;
