/**
 * Exports all model JSON files in the data directory that start with 'models.'
 * Excludes models.all.json as specified
 */

// Import all model JSON files
import infinityproModels from './models.infinitypro.json';
import metzModels from './models.metz.json';
import smart6000sv3Models from './models.smart6000sv3.json';
import smartmxv5Models from './models.smartmxv5.json';
import xboardv7Models from './models.xboardv7.json';

// Export all models
export {
    infinityproModels,
    metzModels,
    smart6000sv3Models,
    smartmxv5Models,
    xboardv7Models
};

// Export combined array of all models
export const allModels = [
    ...infinityproModels,
    ...metzModels,
    ...smart6000sv3Models,
    ...smartmxv5Models,
    ...xboardv7Models
];

export default allModels;
