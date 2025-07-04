import standsData from './accessories.stands.json';
import stylusData from './accessories.stylus.json';
import connectivityData from './accessories.connectivity.json';

// Add required size field for ProductModel compatibility
const allAccessories = [
  ...standsData.map(item => ({ ...item, size: 0 })),
  ...stylusData.map(item => ({ ...item, size: 0 })),
  ...connectivityData.map(item => ({ ...item, size: 0 }))
];

export default allAccessories;