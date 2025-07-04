/**
 * Exports all model JSON files in the data directory that start with 'models.'
 * Excludes models.all.json as specified
 */

// Import all model JSON files
import infinityproModels from './models.infinitypro.json' with { type: 'json' };
import metzModels from './models.metz.json' with { type: 'json' };
import smartModels from './models.smart.json' with { type: 'json' };
import maxhubModels from './models.maxhub.json' with { type: 'json' };
import qeoyoModels from './models.qeoyo.json' with { type: 'json' };
import elonModels from './models.elon.json' with { type: 'json' };
import benqModels from './models.benq.json' with { type: 'json' };
import clevertouchModels from './models.clevertouch.json' with { type: 'json' };
import dellModels from './models.dell.json' with { type: 'json' };
import lgModels from './models.lg.json' with { type: 'json' };
import prometheanModels from './models.promethean.json' with { type: 'json' };
import samsungModels from './models.samsung.json' with { type: 'json' };
import viewsonicModels from './models.viewsonic.json' with { type: 'json' };

// Export all models
export {
    infinityproModels,
    metzModels,
    smartModels,
    maxhubModels,
    qeoyoModels,
    elonModels,
    benqModels,
    clevertouchModels,
    dellModels,
    lgModels,
    prometheanModels,
    samsungModels,
    viewsonicModels,
};

// Export combined array of all models
export const allModels = [
    ...infinityproModels,
    ...metzModels,
    ...smartModels,
    ...maxhubModels,
    ...qeoyoModels,
    ...elonModels,
    ...benqModels,
    ...clevertouchModels,
    ...dellModels,
    ...lgModels,
    ...prometheanModels,
    ...samsungModels,
    ...viewsonicModels,
];

export default allModels;
