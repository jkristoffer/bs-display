/**
 * Exports all lectern JSON files in the data directory that start with 'lecterns.'
 */

// Import all lectern JSON files
import maxhubLecterns from './lecterns.maxhub.json';
import smartpodiumLecterns from './lecterns.smartpodium.json';
import beloongLecterns from './lecterns.beloong.json';
import bestLecterns from './lecterns.best.json';
import hdfocusLecterns from './lecterns.hdfocus.json';
import focusdigitalLecterns from './lecterns.focusdigital.json';
import lirsenLecterns from './lecterns.lirsen.json';
import haijieLecterns from './lecterns.haijie.json';

// Export all lecterns
export {
    maxhubLecterns,
    smartpodiumLecterns,
    beloongLecterns,
    bestLecterns,
    hdfocusLecterns,
    focusdigitalLecterns,
    lirsenLecterns,
    haijieLecterns
};

// Export combined array of all lecterns
export const allLecterns = [
    ...maxhubLecterns,
    ...smartpodiumLecterns,
    ...beloongLecterns,
    ...bestLecterns,
    ...hdfocusLecterns,
    ...focusdigitalLecterns,
    ...lirsenLecterns,
    ...haijieLecterns
];

export default allLecterns;