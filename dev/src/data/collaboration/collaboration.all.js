import maxhubData from './collaboration.maxhub.json';

// Add required size field for ProductModel compatibility
const allCollaboration = [
  ...maxhubData.map(item => ({ ...item, size: 0 }))
];

export default allCollaboration;