/**
 * Exports all model JSON files in the data directory that start with 'models.'
 * Excludes models.all.json as specified
 */

// Import all model JSON files
import infinityproModels from './models.infinitypro.json';
import metzModels from './models.metz.json';
import smartModels from './models.smart.json';
import maxhubModels from './models.maxhub.json';
import qeoyoModels from './models.qeoyo.json';
import elonModels from './models.elon.json';

// Export all models
export {
    infinityproModels,
    metzModels,
    smartModels,
    maxhubModels,
    qeoyoModels,
    elonModels,
};

// Export combined array of all models
export const allModels = [
    ...infinityproModels,
    ...metzModels,
    ...smartModels,
    ...maxhubModels,
    ...qeoyoModels,
    ...elonModels,
];

export default allModels;
